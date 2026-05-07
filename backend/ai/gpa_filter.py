"""
يبني جدول الحدود التنافسية من data.xlsx ويستخدمه لفلترة التخصصات
"""
import os
from functools import lru_cache
import pandas as pd

DATA_PATH = os.path.join(os.path.dirname(__file__), "data.xlsx")


@lru_cache(maxsize=1)
def _load_thresholds() -> dict:
    """يرجع dict: {اسم التخصص: أدنى حد تنافسي عبر كل الجامعات}"""
    df = pd.read_excel(DATA_PATH, sheet_name="DATASET")

    threshold_cols = [
        'الحد التنافسي لسنة 2024',
        'الحد التنافسي لسنة 2023',
        'الحد التنافسي لسنة 2022',
        'الحد التنافسي المتوقع',
    ]
    # خذ أول قيمة غير فارغة كحد للصف
    df['_threshold'] = df[threshold_cols].apply(
        lambda row: next((v for v in row if pd.notna(v) and v > 0), None), axis=1
    )

    # لكل تخصص خذ الوسيط (median) — يعكس الحد الواقعي بشكل أفضل من الـ min
    thresholds = (
        df.dropna(subset=['_threshold'])
        .groupby('التخصصات')['_threshold']
        .median()
        .to_dict()
    )
    return thresholds


def filter_by_gpa(recommendations: list, gpa: float, tolerance: float = 0.0) -> list:
    """
    يزيل التخصصات التي يقل معدل الطالب عن حدها التنافسي الأدنى.
    tolerance: هامش سماح (افتراضي 2%) عشان لا نكون صارمين جداً.
    """
    thresholds = _load_thresholds()

    def passes(rec):
        major = rec['major']
        min_threshold = thresholds.get(major)
        if min_threshold is None:
            return True  # مش موجود في الداتا → اقبله
        return gpa >= (min_threshold - tolerance)

    filtered = [r for r in recommendations if passes(r)]

    # إذا ما بقي شي خلي المدخلات الأصلية (سيُعالَج لاحقاً بـ field filter)
    if len(filtered) == 0:
        return recommendations

    # أعد ترقيم الـ rank
    for i, r in enumerate(filtered):
        r['rank'] = i + 1

    return filtered
