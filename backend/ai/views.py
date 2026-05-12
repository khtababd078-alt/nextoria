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

NASHMI_SYSTEM = """أنت نشمي، مستشار أكاديمي أردني ذكي ومتخصص في التوجيه الجامعي.

قواعد اللغة — مهمة جداً ولا استثناء:
- اكتب بالعربية فقط. ممنوع أي حرف من لغة أخرى (لا صينية، لا فارسية، لا إنجليزية مختلطة).
- كلمات محظورة تماماً — لا تقلها أبداً: "عاشر", "الصف العاشر", "علمي", "أدبي", "الفرع العلمي", "الفرع الأدبي", "المهني", "الشرعي كفرع".
- المصطلحات الصحيحة الوحيدة: "أول ثانوي" = الصف 10، "ثاني ثانوي" = الصف 11، "توجيهي" = الصف 12.
- الطلاب لديهم حقول دراسية وليس فروعاً: هندسي، صحي، أعمال، علوم وتكنولوجيا، قانون، لغات.

شخصيتك:
- ودي ومحفّز — مثل صديق أكبر يفهم المنظومة الجامعية الأردنية
- تتكلم عربي بسيط مفهوم، مناسب للطالب وأهله
- مختصر عند الإجابات البسيطة، مفصّل عند الأسئلة المعقدة
- تستخدم أمثلة وأرقاماً حقيقية من البيانات المقدمة لك

تخصصاتك:
- التخصصات الجامعية المناسبة لكل معدل واهتمام
- الجامعات الأردنية: شروط القبول، التكاليف، الحد الأدنى، الحد التنافسي
- الفروع الدراسية في الثانوية (علمي، أدبي، مهني، شريعة)
- سوق العمل الأردني والخليجي وتوقعات التوظيف
- مقارنة التخصصات من حيث الصعوبة والتكلفة والمستقبل

قواعد المحادثة:
- دائماً اقرأ المحادثة كاملة قبل ما تجاوب — الردود القصيرة مثل "اه", "لا", "أكيد", "طيب", "معليش" كلها ردود على سؤالك السابق
- إذا قال "اه" أو "نعم" → وافق وكمّل الحوار
- إذا قال "لا" → اقترح بديل مناسب
- لا تقل "ما فهمت" أبداً لرد قصير — بدلاً من ذلك افهمه من السياق
- إذا عطيتك معلومات من قاعدة البيانات، استخدمها مباشرة في ردك بشكل طبيعي

إذا سألك عن شيء خارج التوجيه الأكاديمي: "متخصص بالتوجيه الجامعي بس — شو بقدر أساعدك في تخصصك؟"

ردودك: عربي بسيط، 2-5 جمل عادةً. استخدم ✅ و📌 أحياناً لتنظيم المعلومات."""


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
            recommendations = gpa_filtered[:5]
        else:
            recommendations = field_filtered[:5]

    except Exception as e:
        return JsonResponse({"error": f"خطأ في التنبؤ: {str(e)}"}, status=500)

    ai_explanation = ""
    try:
        top3   = recommendations[:3]
        field_label = data.get('field', '')
        prompt = (
            f"الطالب حصل على معدل توجيهي: {data['gpa']}%، واهتمامه في حقل: {field_label}\n"
            "النظام أوصى بهذه التخصصات الجامعية:\n"
            + "\n".join(f"  {r['rank']}. {r['major']}" for r in top3)
            + "\n\nاكتب تعليقاً تشجيعياً مبسطاً (3 جمل فقط) يشرح لماذا هذه التخصصات مناسبة لهذا الطالب بناءً على اهتماماته وحقله، مع نصيحة عملية واحدة."
            + "\n\nتعليمات مهمة: اكتب بالعربية فقط. لا تذكر كلمة 'علمي' أو 'أدبي' أو 'مهني' أبداً. ركّز على التخصصات وسوق العمل فقط."
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
        # استخرج آخر رسالة للمستخدم
        last_user_msg = next(
            (m["content"] for m in reversed(messages) if m["role"] == "user"), ""
        )

        # إذا الرسالة قصيرة جداً (رد على سؤال سابق) — ابنِ سياق مجمّع من المحادثة كلها
        combined_query = last_user_msg
        if len(last_user_msg.strip()) <= 6:
            # اجمع آخر سؤال من البوت مع رد المستخدم لبناء سياق أفضل
            last_bot_msg = next(
                (m["content"] for m in reversed(messages[:-1]) if m["role"] == "assistant"), ""
            )
            combined_query = f"{last_bot_msg} {last_user_msg}"

        # ابحث في قاعدة البيانات
        uni_context     = build_context(combined_query)
        student_context = build_student_context(combined_query)
        context = "\n\n".join(filter(None, [uni_context, student_context]))

        # أرسل آخر 12 رسالة للحفاظ على السياق
        enriched = list(messages[-12:])

        if context:
            # أضف السياق كرسالة نظام مؤقتة قبل رد المستخدم، لا تغيّر الرسالة نفسها
            enriched = list(messages[-12:])
            enriched.insert(-1, {
                "role": "user",
                "content": f"[معلومات من قاعدة البيانات — استخدمها في ردك]\n{context}",
            })
            enriched.insert(-1, {
                "role": "assistant",
                "content": "فهمت، سأستخدم هذه المعلومات في ردي.",
            })

        reply = _groq_chat(enriched)
        return JsonResponse({"reply": reply})
    except Exception:
        return JsonResponse({"error": "حدث خطأ غير متوقع."}, status=500)


@csrf_exempt
@require_POST
def major_info(request):
    """يرجع وصفاً مختصراً لأي تخصص من الـ AI"""
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({"error": "بيانات غير صالحة"}, status=400)

    major_name = data.get("major", "").strip()
    if not major_name:
        return JsonResponse({"error": "اسم التخصص مطلوب"}, status=400)

    # ابحث في قاعدة البيانات أولاً
    from .rag import build_context
    db_context = build_context(major_name)

    prompt = (
        f"أعطني معلومات مفيدة عن تخصص '{major_name}' في الجامعات الأردنية.\n"
        + (f"معلومات من قاعدة البيانات:\n{db_context}\n\n" if db_context else "")
        + "اكتب وصفاً مختصراً يشمل: ماذا يدرس الطالب، فرص العمل، والمهارات المطلوبة. "
        + "3 جمل فقط. بالعربية فقط."
    )
    try:
        desc = _groq_chat([{"role": "user", "content": prompt}], max_tokens=200)
        return JsonResponse({"desc": desc})
    except Exception:
        return JsonResponse({"error": "تعذّر الحصول على المعلومات."}, status=500)


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
