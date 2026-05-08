"""
RAG للبيانات الطلابية (1390 طالب حقيقي)
يبحث عن طلاب مشابهين ويرجع تجاربهم كسياق للشاتبوت
"""
import os, re
from functools import lru_cache
import pandas as pd

CSV_PATH = os.path.join(os.path.dirname(__file__), "students.csv")

COL_MAP = {
    '   ما هو معدلك التوجيهي ؟': 'gpa',
    '   ما هو تخصصك الجامعي الحالي؟  (عربي فقط)': 'major',
    '   ما مدى اهتمامك بالتكنولوجيا (عندما اخترت تخصصك)  ؟\n(1= ضعيف جدا )/ (5 = عالي جدا)': 'interest_tech',
    '  ما مدى اهتمامك بالمجال الصحي والطبي (عندما اخترت تخصصك)\n(1= ضعيف جدا )/ (5 = عالي جدا)': 'interest_health',
    '  ما مدى اهتمامك بمجال الأعمال والإدارة (عندما اخترت تخصصك) ؟\n(1= ضعيف جدا ) / (5 = عالي جدا)': 'interest_business',
    '  ما مدى اهتمامك بالمجالات الفنية والإبداعية  (عندما اخترت تخصصك) ؟   \n(1= ضعيف جدا) / (5 = عالي جدا)': 'interest_arts',
    '   أي وصف يعبّر أكثر عن أسلوب تفكيرك (عندما اخترت تخصصك)\n': 'thinking_style',
    'كيف بتشوف شخصيتك كانت  (عندما اخترت تخصصك) ؟': 'personality',
    '  أي نوع دراسة تفضّل؟ ': 'study_pref',
    '  ما أسلوب العمل الذي تفضّله؟  ': 'work_style',
    '   ما مدى رضاك عن تخصصك الجامعي الحالي؟  راضٍ جدًا / راضٍ / محايد /غير راضٍ\n(1=راض جدا) / (4 = غير راض) ': 'satisfaction',
    'هل لو كان عندك نظام ذكي يرشدك قبل الجامعة، هل كان ممكن يغيّر اختيارك للتخصص؟ ': 'would_change',
}

SATISFACTION_LABEL = {'1': 'راضٍ جداً', '2': 'راضٍ', '3': 'محايد', '4': 'غير راضٍ'}


@lru_cache(maxsize=1)
def _load_data() -> pd.DataFrame:
    df = pd.read_csv(CSV_PATH, encoding='utf-8-sig')
    df = df.rename(columns={k: v for k, v in COL_MAP.items() if k in df.columns})
    df = df.fillna('')
    df['gpa'] = pd.to_numeric(df['gpa'], errors='coerce').fillna(0)
    return df


def _norm(text: str) -> str:
    text = str(text).strip()
    text = re.sub(r'[ً-ٟ]', '', text)
    text = text.replace('أ', 'ا').replace('إ', 'ا').replace('آ', 'ا')
    text = text.replace('ة', 'ه').replace('ى', 'ي')
    return text.lower()


def _extract_gpa(text: str):
    nums = re.findall(r'\b(\d{2,3}(?:\.\d{1,2})?)\b', text)
    for n in nums:
        v = float(n)
        if 50.0 <= v <= 100.0:
            return v
    return None


PERSONALITY_MAP = {
    'منطوي': 'منطوي', 'انطوائي': 'منطوي', 'خجول': 'منطوي',
    'اجتماعي': 'اجتماعي', 'اجتماعيه': 'اجتماعي',
    'متوازن': 'متوازن',
}

THINKING_MAP = {
    'منطقي': 'منطق', 'تحليلي': 'تحليل',
    'إبداعي': 'إبداع', 'ابداعي': 'إبداع', 'ابداع': 'إبداع',
    'عملي': 'عملي',
}

STUDY_MAP = {
    'نظري': 'نظري', 'عملي': 'عملي', 'تطبيقي': 'عملي', 'مزيج': 'مزيج',
}

WORK_MAP = {
    'فردي': 'فردي', 'بمفردي': 'فردي', 'لحالي': 'فردي',
    'جماعي': 'جماعي', 'فريق': 'جماعي', 'مع فريق': 'جماعي',
}


def search_similar_students(query: str, top_k: int = 5) -> list[dict]:
    df = _load_data().copy()
    if df.empty:
        return []

    q_norm = _norm(query)
    gpa = _extract_gpa(query)

    df['_score'] = 0

    # بحث بالشخصية
    for kw, val in PERSONALITY_MAP.items():
        if _norm(kw) in q_norm and 'personality' in df.columns:
            df['_score'] += df['personality'].apply(_norm).str.contains(val[:3], regex=False).astype(int) * 3

    # بحث بأسلوب التفكير
    for kw, val in THINKING_MAP.items():
        if _norm(kw) in q_norm and 'thinking_style' in df.columns:
            df['_score'] += df['thinking_style'].apply(_norm).str.contains(val[:3], regex=False).astype(int) * 2

    # بحث بتفضيل الدراسة
    for kw, val in STUDY_MAP.items():
        if _norm(kw) in q_norm and 'study_pref' in df.columns:
            df['_score'] += df['study_pref'].apply(_norm).str.contains(val[:3], regex=False).astype(int) * 2

    # بحث بأسلوب العمل
    for kw, val in WORK_MAP.items():
        if _norm(kw) in q_norm and 'work_style' in df.columns:
            df['_score'] += df['work_style'].apply(_norm).str.contains(val[:3], regex=False).astype(int) * 2

    # بحث بالتخصص المذكور في السؤال
    if 'major' in df.columns:
        major_words = [w for w in q_norm.split() if len(w) > 3]
        for w in major_words:
            df['_score'] += df['major'].apply(_norm).str.contains(w, regex=False).astype(int) * 2

    # فلتر بمعدل مشابه (±10 نقاط)
    if gpa is not None:
        gpa_match = (df['gpa'] >= gpa - 10) & (df['gpa'] <= gpa + 10)
        df.loc[gpa_match, '_score'] += 2

    # إذا ما في نتائج، ارجع الطلاب الراضيين عموماً
    if df['_score'].max() == 0:
        return []

    scored = df[df['_score'] > 0].sort_values('_score', ascending=False)

    # فضّل الراضيين
    satisfied = scored[scored['satisfaction'].astype(str).str.replace('.0', '', regex=False).isin(['1', '2'])]
    if len(satisfied) >= 3:
        scored = satisfied

    results = []
    for _, row in scored.head(top_k).iterrows():
        sat_str = SATISFACTION_LABEL.get(str(row.get('satisfaction', '')).replace('.0', ''), '')
        entry = {
            'تخصص':   str(row.get('major', '')).strip(),
            'معدل':   str(int(row['gpa'])) if row['gpa'] > 0 else '',
            'شخصية':  str(row.get('personality', '')).strip(),
            'تفكير':  str(row.get('thinking_style', '')).strip(),
            'دراسة':  str(row.get('study_pref', '')).strip(),
            'عمل':    str(row.get('work_style', '')).strip(),
            'رضا':    sat_str,
        }
        entry = {k: v for k, v in entry.items() if v}
        if entry.get('تخصص'):
            results.append(entry)

    return results


def build_student_context(query: str) -> str:
    results = search_similar_students(query, top_k=5)
    if not results:
        return ""

    lines = ["👥 تجارب طلاب حقيقيين من قاعدة بياناتنا:\n"]
    for r in results:
        line = f"• طالب اختار: {r['تخصص']}"
        if r.get('معدل'):
            line += f" | معدله: {r['معدل']}%"
        if r.get('رضا'):
            line += f" | رضاه: {r['رضا']}"
        details = [r[k] for k in ('شخصية', 'تفكير', 'دراسة') if r.get(k)]
        if details:
            line += f"\n  ({' | '.join(details)})"
        lines.append(line)

    majors = [r['تخصص'] for r in results]
    top_major = max(set(majors), key=majors.count)
    lines.append(f"\n📌 أكثر تخصص اختاره طلاب مشابهون: {top_major}")

    return "\n".join(lines)
