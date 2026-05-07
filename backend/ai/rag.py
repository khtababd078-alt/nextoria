"""
RAG – Retrieval Augmented Generation
يبحث في داتا الجامعات والتخصصات ويرجع السياق المناسب للشاتبوت
"""
import os
from functools import lru_cache
import pandas as pd

DATA_PATH = os.path.join(os.path.dirname(__file__), "data.xlsx")

# ── تحميل الداتا مرة وحدة عند الإقلاع ──────────────────────────

@lru_cache(maxsize=1)
def _load_data() -> pd.DataFrame:
    df = pd.read_excel(DATA_PATH, sheet_name="DATASET")
    # تنظيف
    df = df.fillna("")
    for col in df.select_dtypes(include="number").columns:
        df[col] = df[col].astype(str).replace("nan", "").replace("0.0", "")
    return df


# ── بحث بسيط بالكلمات المفتاحية ─────────────────────────────────

def _score_row(row: pd.Series, keywords: list[str]) -> int:
    """كم كلمة مفتاحية موجودة في الصف"""
    text = " ".join(str(v) for v in row.values).lower()
    return sum(1 for kw in keywords if kw in text)


def search(query: str, top_k: int = 5) -> list[dict]:
    df = _load_data()

    # كلمات مفتاحية من السؤال (كلمات أكثر من حرفين)
    keywords = [w.strip() for w in query.replace("؟", "").split() if len(w.strip()) > 2]
    if not keywords:
        return []

    df = df.copy()
    df["_score"] = df.apply(lambda row: _score_row(row, keywords), axis=1)
    top = df[df["_score"] > 0].sort_values("_score", ascending=False).head(top_k)

    results = []
    for _, row in top.iterrows():
        # حد تنافسي — آخر سنة متاحة
        competitive = (
            row.get("الحد التنافسي لسنة 2024", "") or
            row.get("الحد التنافسي لسنة 2023", "") or
            row.get("الحد التنافسي المتوقع", "")
        )
        job_map = {"1.0": "جيد", "2.0": "ممتاز", "3.0": "محدود", 1: "جيد", 2: "ممتاز", 3: "محدود"}
        job = job_map.get(str(row.get("حالة سوق العمل", "")), str(row.get("حالة سوق العمل", "")))

        entry = {
            "جامعة":          str(row.get("الجامعات", "")),
            "تخصص":          str(row.get("التخصصات", "")),
            "حقل":            str(row.get("الحقل", "")),
            "مدينة":          str(row.get("المدينة", "")),
            "حد_تنافسي_2024": str(competitive),
            "تكلفة_تنافسي":   str(row.get("التكلفة الكليه(تنافس)", "")),
            "تكلفة_موازي":    str(row.get("التكلفة الكليه(موازي)", "")),
            "سنوات_دراسة":    str(row.get("عدد سنوات الدراسة", "")),
            "سوق_العمل":      job,
            "وصف":            str(row.get("وصف للتخصص", "")),
        }
        # أزل الحقول الفارغة
        entry = {k: v for k, v in entry.items() if v and v not in ("nan", "0.0", "")}
        results.append(entry)

    return results


def build_context(query: str) -> str:
    """يبني نص السياق الجاهز للحقن في الـ prompt"""
    results = search(query, top_k=5)
    if not results:
        return ""

    lines = ["📊 **معلومات من قاعدة البيانات:**\n"]
    for r in results:
        line = f"• {r.get('تخصص', '')} — {r.get('جامعة', '')} ({r.get('مدينة', '')})"
        if r.get("حد_تنافسي_2024"):
            line += f" | حد تنافسي: {r['حد_تنافسي_2024']}%"
        if r.get("تكلفة_تنافسي"):
            line += f" | تكلفة تنافسي: {r['تكلفة_تنافسي']} د.أ"
        if r.get("تكلفة_موازي"):
            line += f" | موازي: {r['تكلفة_موازي']} د.أ"
        if r.get("سنوات_دراسة"):
            line += f" | {r['سنوات_دراسة']} سنوات"
        if r.get("سوق_العمل"):
            line += f" | سوق العمل: {r['سوق_العمل']}"
        if r.get("وصف"):
            line += f"\n  {r['وصف']}"
        lines.append(line)

    return "\n".join(lines)
