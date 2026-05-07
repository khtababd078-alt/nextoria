import json
import os

from groq import Groq
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from dotenv import load_dotenv

from .ml_predictor import predict_majors, model_is_ready, get_model_info
from .field_map import filter_by_field
from .gpa_filter import filter_by_gpa
from .rag import build_context
from .rag_students import build_student_context

load_dotenv()

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_MODEL   = "llama-3.3-70b-versatile"

NASHMI_SYSTEM = """أنت نشمي، مساعد تعليمي أردني متخصص حصراً في التوجيه الأكاديمي والجامعي.

مهامك المسموحة فقط:
- اختيار التخصصات الجامعية المناسبة للطلاب الأردنيين
- اختيار الفروع الدراسية (علمي، أدبي، مهني، شريعة)
- توجيه طلاب التوجيهي وطلاب الصف العاشر
- معلومات عن الجامعات الأردنية وشروط القبول ومعدلات القبول
- نصائح عن سوق العمل الأردني والخليجي وفرص التوظيف

قواعد صارمة:
- إذا سألك أحد عن أي موضوع خارج التعليم والتخصصات والجامعات، رفض بأدب وأعده للموضوع.
- لا تجاوب على أسئلة الطبخ، الرياضة، الترفيه، السياسة، التكنولوجيا العامة، أو أي موضوع آخر.
- رد الأسئلة الخارجة بجملة واحدة مثل: "أنا متخصص فقط في التوجيه الأكاديمي، كيف بقدر أساعدك في اختيار تخصصك؟"

أسلوبك: عربي فصيح بسيط، ودي، مهني، موجز — لا تتجاوز 4 جمل عادةً."""


def _groq_chat(messages: list, max_tokens: int = 400) -> str:
    client = Groq(api_key=GROQ_API_KEY)
    resp = client.chat.completions.create(
        model=GROQ_MODEL,
        max_tokens=max_tokens,
        messages=[{"role": "system", "content": NASHMI_SYSTEM}] + messages,
    )
    return resp.choices[0].message.content


@csrf_exempt
@require_POST
def ml_recommend(request):
    if not model_is_ready():
        return JsonResponse({"error": "نموذج التوصية غير متاح حالياً."}, status=503)

    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({"error": "بيانات JSON غير صالحة"}, status=400)

    required = ["gpa", "interest_tech", "interest_health", "interest_business", "interest_arts"]
    for field in required:
        if field not in data:
            return JsonResponse({"error": f"الحقل '{field}' مطلوب."}, status=400)

    try:
        gpa            = float(data.get('gpa', 0))
        selected_field = data.get('field', '')

        all_recs         = predict_majors(data, top_k=52)
        gpa_filtered     = filter_by_gpa(all_recs, gpa)
        field_filtered   = filter_by_field(gpa_filtered, selected_field)

        gpa_warning = None
        if selected_field and len(field_filtered) < 3:
            # الطالب اختار حقلاً لكن معدله لا يؤهله — نعطيه بدائل من الحقول الأخرى
            gpa_warning = (
                "معدلك الحالي لا يؤهلك لتخصصات هذا الحقل في معظم الجامعات الأردنية. "
                "إليك أفضل التخصصات المتاحة بناءً على معدلك واهتماماتك."
            )
            recommendations = gpa_filtered[:10]
        else:
            recommendations = field_filtered[:10]

    except Exception as e:
        return JsonResponse({"error": f"خطأ في التنبؤ: {str(e)}"}, status=500)

    ai_explanation = ""
    try:
        top3   = recommendations[:3]
        prompt = (
            f"الطالب حصل على معدل توجيهي: {data['gpa']}%\n"
            "نظام الذكاء الاصطناعي أوصى بهذه التخصصات:\n"
            + "\n".join(f"  {r['rank']}. {r['major']} - ثقة {r['confidence']}%" for r in top3)
            + "\n\nاكتب تعليقاً تشجيعياً مبسطاً (3 جمل فقط) يشرح لماذا هذه التخصصات مناسبة، مع نصيحة عملية واحدة."
        )
        ai_explanation = _groq_chat([{"role": "user", "content": prompt}], max_tokens=300)
    except Exception:
        top = recommendations[0]["major"] if recommendations else "التخصص المناسب"
        ai_explanation = f"معدلك يؤهلك لتخصصات متميزة. التخصص الأنسب لك هو {top}."

    return JsonResponse({
        "recommendations": recommendations,
        "top_major":       recommendations[0]["major"] if recommendations else None,
        "ai_explanation":  ai_explanation,
        "gpa_warning":     gpa_warning,
    })


@csrf_exempt
@require_POST
def chat(request):
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({"error": "بيانات JSON غير صالحة"}, status=400)

    messages = data.get("messages", [])
    if not messages:
        return JsonResponse({"error": "يرجى إرسال رسالة واحدة على الأقل."}, status=400)

    for m in messages:
        if m.get("role") not in ("user", "assistant") or not m.get("content"):
            return JsonResponse({"error": "تنسيق الرسائل غير صحيح."}, status=400)

    try:
        # ابحث في الداتا وأضف السياق لآخر سؤال
        last_user_msg = next(
            (m["content"] for m in reversed(messages) if m["role"] == "user"), ""
        )
        uni_context     = build_context(last_user_msg)
        student_context = build_student_context(last_user_msg)
        context = "\n\n".join(filter(None, [uni_context, student_context]))

        enriched = list(messages[-10:])
        if context:
            enriched[-1] = {
                "role":    "user",
                "content": f"{context}\n\nسؤال الطالب: {last_user_msg}",
            }

        reply = _groq_chat(enriched)
        return JsonResponse({"reply": reply})
    except Exception as e:
        return JsonResponse({"error": "حدث خطأ غير متوقع."}, status=500)


@require_GET
def ml_status(request):
    info = get_model_info()
    if info["ready"]:
        return JsonResponse({
            "model_ready":   True,
            "message":       f"نموذج التوصية جاهز - {info['majors_count']} تخصص",
            "majors_count":  info["majors_count"],
            "majors":        info["majors"],
            "accuracy_note": "Top-5 accuracy ~88% على داتا طلاب أردنيين",
        })
    return JsonResponse({"model_ready": False, "error": info.get("error")}, status=503)
