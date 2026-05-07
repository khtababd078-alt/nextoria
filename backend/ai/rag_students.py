"""
RAG للبيانات الطلابية الحقيقية
يبحث عن طلاب مشابهين ويرجع تجاربهم كسياق للشاتبوت
"""
import os
from functools import lru_cache
import pandas as pd

CSV_PATH = os.path.join(os.path.dirname(__file__), "students.csv")

# خريطة أعمدة الملف الأصلي → أسماء قصيرة
COL_MAP = {
    '   ما هو معدلك التوجيهي ؟':                                                                          'gpa',
    '   ما هو تخصصك الجامعي الحالي؟  (عربي فقط)':                                                        'major',
    '   ما مدى اهتمامك بالتكنولوجيا (عندما اخترت تخصصك)  ؟\n(1= ضعيف جدا )/ (5 = عالي جدا)':           'interest_tech',
    '  ما مدى اهتمامك بالمجال الصحي والطبي (عندما اخترت تخصصك)\n(1= ضعيف جدا )/ (5 = عالي جدا)':       'interest_health',
    '  ما مدى اهتمامك بمجال الأعمال والإدارة (عندما اخترت تخصصك) ؟\n(1= ضعيف جدا ) / (5 = عالي جدا)':  'interest_business',
    '  ما مدى اهتمامك بالمجالات الفنية والإبداعية  (عندما اخترت تخصصك) ؟   \n(1= ضعيف جدا) / (5 = عالي جدا)': 'interest_arts',
    '   أي وصف يعبّر أكثر عن أسلوب تفكيرك (عندما اخترت تخصصك)\n':                                       'thinking_style',
    'كيف بتشوف شخصيتك كانت  (عندما اخترت تخصصك) ؟':                                                     'personality',
    '  أي نوع دراسة تفضّل؟ ':                                                                             'study_pref',
    '  ما أسلوب العمل الذي تفضّله؟  ':                                                                   'work_style',
    '   ما مدى رضاك عن تخصصك الجامعي الحالي؟  راضٍ جدًا / راضٍ / محايد /غير راضٍ\n(1=راض جدا) / (4 = غير راض) ': 'satisfaction',
    'هل لو كان عندك نظام ذكي يرشدك قبل الجامعة، هل كان ممكن يغيّر اختيارك للتخصص؟ ':                    'would_change',
}

SATISFACTION_LABEL = {'1': 'راضٍ جداً', '2': 'راضٍ', '3': 'محايد', '4': 'غير راضٍ'}


@lru_cache(maxsize=1)
def _load_data() -> pd.DataFrame:
    df = pd.read_csv(CSV_PATH, encoding='utf-8-sig')
    df = df.rename(columns={k: v for k, v in COL_MAP.items() if k in df.columns})
    df = df.fillna('')
    df['gpa'] = pd.to_numeric(df['gpa'], errors='coerce').fillna(0)
    return df


# ── كلمات مفتاحية للبحث في وصف الطالب ───────────────────────────

PERSONALITY_KEYWORDS = {
    'منطوي':     'منطوي',
    'انطوائي':   'منطوي',
    'اجتماعي':   'اجتماعي',
    'اجتماعية':  'اجتماعي',
    'متوازن':    'متوازن',
}

THINKING_KEYWORDS = {
    'منطقي':    'تفكير منطقي',
    'تحليلي':   'تفكير تحليلي',
    'إبداعي':   'تفكير إبداعي',
    'ابداعي':   'تفكير إبداعي',
    'عملي':     'تفكير عملي',
}

STUDY_KEYWORDS = {
    'نظري':     'دراسة نظرية',
    'عملي':     'دراسة عملية',
    'تطبيقي':   'دراسة فيها عملي',
    'مزيج':     'مزيج',
}

WORK_KEYWORDS = {
    'فردي':     'العمل الفردي',
    'بمفردي':   'العمل الفردي',
    'جماعي':    'العمل الجماعي',
    'فريق':     'العمل الجماعي',
}


def _extract_filters(query: str) -> dict:
    """يستخرج فلاتر من سؤال الطالب"""
    filters = {}
    q = query

    for kw, val in PERSONALITY_KEYWORDS.items():
        if kw in q:
            filters['personality'] = val
            break

    for kw, val in THINKING_KEYWORDS.items():
        if kw in q:
            filters['thinking_style'] = val
            break

    for kw, val in STUDY_KEYWORDS.items():
        if kw in q:
            filters['study_pref'] = val
            break

    for kw, val in WORK_KEYWORDS.items():
        if kw in q:
            filters['work_style'] = val
            break

    return filters


def search_similar_students(query: str, top_k: int = 5) -> list[dict]:
    df = _load_data().copy()
    if df.empty:
        return []

    filters = _extract_filters(query)
    if not filters:
        return []

    # تطبيق الفلاتر بالتدريج
    scored = df.copy()
    scored['_score'] = 0

    for field, value in filters.items():
        if field in scored.columns:
            scored['_score'] += scored[field].astype(str).str.contains(value, na=False).astype(int)

    scored = scored[scored['_score'] > 0].sort_values('_score', ascending=False)

    # فلتر الراضين فقط (satisfaction 1 أو 2) عشان التوصية تكون إيجابية
    satisfied = scored[scored['satisfaction'].astype(str).isin(['1', '2', '1.0', '2.0'])]
    if len(satisfied) >= 3:
        scored = satisfied

    top = scored.head(top_k)
    results = []
    for _, row in top.iterrows():
        sat_str = SATISFACTION_LABEL.get(str(row.get('satisfaction', '')).replace('.0', ''), '')
        results.append({
            'تخصص':       str(row.get('major', '')).strip(),
            'معدل':       str(int(row['gpa'])) if row['gpa'] > 0 else '',
            'شخصية':      str(row.get('personality', '')).strip(),
            'تفكير':      str(row.get('thinking_style', '')).strip(),
            'دراسة':      str(row.get('study_pref', '')).strip(),
            'عمل':        str(row.get('work_style', '')).strip(),
            'رضا':        sat_str,
        })
    return [r for r in results if r['تخصص']]


def build_student_context(query: str) -> str:
    results = search_similar_students(query, top_k=5)
    if not results:
        return ""

    lines = ["👥 **تجارب طلاب حقيقيين بنفس شخصيتك:**\n"]
    for r in results:
        line = f"• طالب اختار: **{r['تخصص']}**"
        if r['معدل']:
            line += f" | معدله: {r['معدل']}%"
        if r['رضا']:
            line += f" | رضاه: {r['رضا']}"
        details = []
        if r['شخصية']:
            details.append(r['شخصية'])
        if r['تفكير']:
            details.append(r['تفكير'])
        if r['دراسة']:
            details.append(r['دراسة'])
        if details:
            line += f"\n  ({' | '.join(details)})"
        lines.append(line)

    # احسب أكثر تخصص مكرر
    majors = [r['تخصص'] for r in results]
    top_major = max(set(majors), key=majors.count)
    lines.append(f"\n📌 أكثر تخصص اختاره طلاب مشابهون: **{top_major}**")

    return "\n".join(lines)
