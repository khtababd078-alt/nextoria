"""
RAG – بحث ذكي في بيانات الجامعات والتخصصات الأردنية (493 صف)
"""
import os, re
from functools import lru_cache
import pandas as pd

CSV_PATH  = os.path.join(os.path.dirname(__file__), "data.csv")
XLSX_PATH = os.path.join(os.path.dirname(__file__), "data.xlsx")

# ── تحميل البيانات ────────────────────────────────────────────────

@lru_cache(maxsize=1)
def _load_data() -> pd.DataFrame:
    # نفضّل CSV لأنه يحتوي عمود "الحد الادنى"
    if os.path.exists(CSV_PATH):
        df = pd.read_csv(CSV_PATH, encoding="utf-8-sig")
    else:
        df = pd.read_excel(XLSX_PATH, sheet_name="DATASET")
    df = df.fillna("")
    # تنظيف أعمدة الأرقام
    for col in df.select_dtypes(include="number").columns:
        df[col] = df[col].astype(str).replace({"nan": "", "0.0": "", "0": ""})
    return df


# ── تطبيع النص العربي ────────────────────────────────────────────

def _norm(text: str) -> str:
    text = str(text).strip()
    text = re.sub(r'[ً-ٟ]', '', text)        # حذف التشكيل
    text = text.replace('أ', 'ا').replace('إ', 'ا').replace('آ', 'ا')
    text = text.replace('ة', 'ه').replace('ى', 'ي')
    text = text.replace('ؤ', 'و').replace('ئ', 'ي')
    text = re.sub(r'\s+', ' ', text)
    return text.lower()


# ── كلمات دلالية معروفة ────────────────────────────────────────────

FIELD_MAP = {
    'هندس': 'هندسي', 'هندسه': 'هندسي',
    'طب': 'صحي', 'صحي': 'صحي', 'صحه': 'صحي', 'طبي': 'صحي',
    'اعمال': 'الأعمال', 'تجاره': 'الأعمال', 'اداره': 'الأعمال',
    'قانون': 'القانون والعلوم الشرعية', 'شريعه': 'القانون والعلوم الشرعية',
    'علوم': 'العلوم والتكنلوجيا', 'تقنيه': 'العلوم والتكنلوجيا', 'تكنولوجيا': 'العلوم والتكنلوجيا',
    'انسانيات': 'اللغات والعلوم الأجتماعية', 'لغه': 'اللغات والعلوم الأجتماعية',
}

UNI_KEYWORDS = {
    'اردنيه': 'الجامعة الأردنية', 'الاردنيه': 'الجامعة الأردنية',
    'يرموك': 'جامعة اليرموك',
    'هاشميه': 'الجامعة الهاشمية',
    'جست': 'جامعة العلوم والتكنولوجيا الأردنية', 'تكنولوجيا الاردنيه': 'جامعة العلوم والتكنولوجيا الأردنية',
    'البلقاء': 'جامعة البلقاء التطبيقية', 'بلقاء': 'جامعة البلقاء التطبيقية',
    'مؤته': "جامعة مؤتة", 'موته': "جامعة مؤتة",
    'اليت': 'جامعة آل البيت', 'ال البيت': 'جامعة آل البيت',
    'الحسين': 'جامعة الحسين بن طلال',
    'الطفيله': 'جامعة الطفيلة التقنية',
    'الالمانيه': 'الجامعة الألمانية الأردنية', 'جيو': 'الجامعة الألمانية الأردنية',
}

COST_WORDS  = {'تكلفه', 'سعر', 'رسوم', 'كلف', 'تكاليف', 'موازي', 'تنافسي'}
JOB_WORDS   = {'عمل', 'توظيف', 'وظيفه', 'مستقبل', 'فرص', 'راتب', 'سوق'}
DIFF_WORDS  = {'صعوبه', 'صعب', 'سهل', 'سهوله', 'مستوى', 'صعوبة'}
YEARS_WORDS = {'سنوات', 'سنه', 'مده', 'كم سنه', 'طول', 'كم سنة'}


def _extract_gpa(text: str):
    """يستخرج معدل من النص مثل 85، 90.5"""
    nums = re.findall(r'\b(\d{2,3}(?:\.\d{1,2})?)\b', text)
    for n in nums:
        v = float(n)
        if 50.0 <= v <= 100.0:
            return v
    return None


# ── البحث الرئيسي ─────────────────────────────────────────────────

def search(query: str, top_k: int = 6) -> list[dict]:
    df = _load_data().copy()
    q_norm = _norm(query)
    q_words = set(q_norm.split())

    # استخرج معدل إذا موجود
    gpa = _extract_gpa(query)

    # كلمات للبحث (أكثر من حرفين)
    keywords = [w for w in q_norm.split() if len(w) > 2]
    if not keywords and gpa is None:
        return []

    # بناء عمود نصي مطبّع لكل صف
    text_cols = ['الجامعات', 'المدينة', 'التخصصات', 'الحقل', 'وصف للتخصص']
    df['_text'] = df[text_cols].apply(
        lambda r: _norm(' '.join(str(v) for v in r)), axis=1
    )

    # تسجيل
    df['_score'] = 0

    # مطابقة الكلمات
    for kw in keywords:
        df['_score'] += df['_text'].str.contains(kw, regex=False).astype(int)

    # مكافأة إذا تطابق حقل الدراسة
    for kw, field in FIELD_MAP.items():
        if kw in q_norm:
            df.loc[df['الحقل'].apply(_norm).str.contains(_norm(field)[:4], regex=False), '_score'] += 3

    # مكافأة إذا ذكر جامعة معينة
    for kw, uni in UNI_KEYWORDS.items():
        if kw in q_norm:
            df.loc[df['الجامعات'].apply(_norm).str.contains(_norm(uni)[:5], regex=False), '_score'] += 4

    # فلتر بالمعدل إذا موجود — أظهر فقط التخصصات اللي الطالب مؤهل لها
    if gpa is not None and 'الحد الادنى ' in df.columns:
        min_col = pd.to_numeric(df['الحد الادنى '], errors='coerce').fillna(0)
        eligible = min_col <= gpa
        df.loc[eligible, '_score'] += 2

    top = df[df['_score'] > 0].sort_values('_score', ascending=False).head(top_k)
    if top.empty:
        return []

    results = []
    for _, row in top.iterrows():
        competitive = (
            str(row.get("الحد التنافسي لسنة 2024", "")) or
            str(row.get("الحد التنافسي لسنة 2023", "")) or
            str(row.get("الحد التنافسي المتوقع", ""))
        )
        job_map = {"1": "جيد", "2": "ممتاز", "3": "محدود",
                   "1.0": "جيد", "2.0": "ممتاز", "3.0": "محدود"}
        job = job_map.get(str(row.get("حالة سوق العمل", "")).strip(), "")

        entry = {
            "جامعة":          str(row.get("الجامعات", "")),
            "تخصص":          str(row.get("التخصصات", "")),
            "حقل":            str(row.get("الحقل", "")),
            "مدينة":          str(row.get("المدينة", "")),
            "حد_ادنى":        str(row.get("الحد الادنى ", "")).strip(),
            "حد_تنافسي":     competitive.strip(),
            "تكلفة_تنافسي":   str(row.get("التكلفة الكليه(تنافس)", "")),
            "تكلفة_موازي":    str(row.get("التكلفة الكليه(موازي)", "")),
            "سنوات":          str(row.get("عدد سنوات الدراسة", "")),
            "سوق_العمل":      job,
            "صعوبة":          str(row.get("تقييم صعوبة التخصص", "")),
            "وصف":            str(row.get("وصف للتخصص", "")),
        }
        entry = {k: v for k, v in entry.items() if v and v not in ("nan", "0.0", "0", "")}
        results.append(entry)

    return results


def build_context(query: str) -> str:
    results = search(query, top_k=6)
    if not results:
        return ""

    q_norm = _norm(query)
    show_cost  = any(w in q_norm for w in COST_WORDS)
    show_job   = any(w in q_norm for w in JOB_WORDS)
    show_years = any(w in q_norm for w in YEARS_WORDS)
    show_diff  = any(w in q_norm for w in DIFF_WORDS)

    lines = ["📊 معلومات من قاعدة البيانات الأردنية:\n"]
    for r in results:
        line = f"• {r.get('تخصص', '')} — {r.get('جامعة', '')} ({r.get('مدينة', '')})"
        if r.get("حد_ادنى"):
            line += f" | الحد الأدنى: {r['حد_ادنى']}%"
        if r.get("حد_تنافسي"):
            line += f" | تنافسي 2024: {r['حد_تنافسي']}%"
        if show_cost:
            if r.get("تكلفة_تنافسي"):
                line += f" | تكلفة تنافسي: {r['تكلفة_تنافسي']} د.أ"
            if r.get("تكلفة_موازي"):
                line += f" | تكلفة موازي: {r['تكلفة_موازي']} د.أ"
        if show_years and r.get("سنوات"):
            line += f" | مدة الدراسة: {r['سنوات']} سنوات"
        if show_job and r.get("سوق_العمل"):
            line += f" | سوق العمل: {r['سوق_العمل']}"
        if show_diff and r.get("صعوبة"):
            diff_map = {"1": "سهل", "2": "متوسط", "3": "صعب", "4": "صعب جداً"}
            line += f" | صعوبة: {diff_map.get(r['صعوبة'], r['صعوبة'])}"
        if r.get("وصف"):
            line += f"\n  ↳ {r['وصف']}"
        lines.append(line)

    return "\n".join(lines)
