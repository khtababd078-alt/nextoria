# خريطة التخصص → الحقل (مبنية من data.xlsx)
MAJOR_TO_FIELD = {
    # ── صحي ─────────────────────────────────────────
    'الطب':                          'health',
    'طب الأسنان':                    'health',
    'الصيدلة':                       'health',
    'التمريض':                       'health',
    'علوم المختبرات الطبية':         'health',
    'العلاج الطبيعي':                'health',
    'العلاج الوظيفي':                'health',
    'دكتور الصيدلة':                 'health',
    'علوم السمع والنطق':             'health',
    'تقنيات الأشعة الطبية':          'health',

    # ── هندسي ────────────────────────────────────────
    'هندسة العمارة':                 'engineering',
    'هالهندسة المدنية':              'engineering',
    'هندسة الكهرباء':                'engineering',
    'هندسة الميكانيك':               'engineering',
    'الهندسة الكيميائية':            'engineering',
    'هندسة الحاسوب':                 'engineering',
    'هندسة الميكاترونيكس':           'engineering',
    'الهندسة الصناعية':              'engineering',
    'هندسة الطاقة المتجددة':         'engineering',
    'هندسة المساحة':                 'engineering',

    # ── العلوم والتكنلوجيا ────────────────────────────
    'الاحياء والبيلوجيا':            'science_tech',
    'الكيمياء':                      'science_tech',
    'الفيزياء':                      'science_tech',
    'الجيلوجيا':                     'science_tech',
    'الرياضيات':                     'science_tech',
    'علوم الحاسوب':                  'science_tech',
    'علم البيانات':                  'science_tech',
    'الذكاء الاصطناعي':              'science_tech',
    'الامن السيبراني':               'science_tech',
    'هندسة البرمجيات':               'science_tech',
    'نظم المعلومات الحاسوبية':       'science_tech',
    'الانتاج الحيواني':              'science_tech',
    'علم وتكنلوجيا الغذاء':          'science_tech',
    'تغذية الانسان والحميات':        'science_tech',
    'هندسة زراعية':                  'science_tech',
    'نظم المعلومات الجغرافية':       'science_tech',
    'علوم الأرض والبيئة التطبيقية': 'science_tech',
    'العلوم السياسية':               'science_tech',
    'علم البيانات والذكاء الاصطناعي': 'science_tech',
    'انظمه معلومات حاسوبيه':        'science_tech',
    'علم الحاسوب وتطبيقاته':        'science_tech',
    'برمجة تطبيقية':                 'science_tech',
    'تكنولوجيا معلومات الاعمال':     'science_tech',

    # ── الأعمال ───────────────────────────────────────
    'إدارة الأعمال':                 'business',
    'المحاسبة':                      'business',
    'التمويل':                       'business',
    'التسويق':                       'business',
    'نظم المعلومات الادارية':        'business',
    'الإدارة العامة':                'business',
    'إقتصاد الأعمال':                'business',
    'الاقتصاد':                      'business',
    'ادارة الفنادق':                 'business',

    # ── القانون والعلوم الشرعية ───────────────────────
    'القانون':                       'law',
    'أصول الدين':                    'law',
    'الفقه وأصوله':                  'law',
    'الشريعة الإسلامية':             'law',

    # ── اللغات والعلوم الاجتماعية ────────────────────
    'اللغة العربية وآدابها':         'humanities',
    'اللغة الإنجليزية وآدابها':      'humanities',
    'اللغة الانجليزية':             'humanities',
    'اللغة الفرنسية وآدابها':        'humanities',
    'اللغة الانجليزية التطبيقية':   'humanities',
    'علم النفس':                     'humanities',
    'علم الاجتماع':                  'humanities',
    'التربية الخاصة':                'humanities',
    'التربية البدنية':               'humanities',
    'الارشاد والصحة النفسية':        'humanities',
    'الفلسفة':                       'humanities',
    'الآثار':                        'humanities',
    'الادارة السياحية':              'humanities',
    'الصحافة والاعلام':              'humanities',
    'التاريخ':                       'humanities',
    'التصميم الداخلي':               'humanities',
}


def filter_by_field(recommendations: list, field: str) -> list:
    """يحتفظ فقط بالتخصصات التابعة للحقل المحدد، مرتبة حسب الثقة."""
    if not field:
        return recommendations

    filtered = [
        r for r in recommendations
        if MAJOR_TO_FIELD.get(r['major'], '') == field
    ]

    # إذا ما لقى شي كافي (أقل من 3) يرجع الكل بدون فلتر
    if len(filtered) < 3:
        return recommendations

    # أعد ترقيم الـ rank
    for i, r in enumerate(filtered):
        r['rank'] = i + 1

    return filtered
