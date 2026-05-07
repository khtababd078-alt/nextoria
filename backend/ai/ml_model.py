# ─────────────────────────────────────────────────────────────────
# نموذج التوصية – يمكن استبداله بنموذج ML حقيقي لاحقاً
# ─────────────────────────────────────────────────────────────────

# كل تخصص: الاسم، الحد الأدنى للمعدل، أوزان الاهتمامات، حقله
MAJORS = [
    # ── الهندسي ──────────────────────────────────────────────────
    {
        'major':    'هندسة الحاسوب',
        'field':    'engineering',
        'min_gpa':  80,
        'interests': {'tech': 0.55, 'health': 0.00, 'business': 0.10, 'arts': 0.05},
        'thinking': ['تحليلي ومنطقي'],
        'work':     ['عمل فردي', 'مختبر وبحث'],
    },
    {
        'major':    'هندسة الكهرباء والإلكترونيات',
        'field':    'engineering',
        'min_gpa':  78,
        'interests': {'tech': 0.50, 'health': 0.05, 'business': 0.05, 'arts': 0.05},
        'thinking': ['تحليلي ومنطقي'],
        'work':     ['عمل فردي', 'مختبر وبحث'],
    },
    {
        'major':    'هندسة مدني',
        'field':    'engineering',
        'min_gpa':  75,
        'interests': {'tech': 0.30, 'health': 0.05, 'business': 0.15, 'arts': 0.10},
        'thinking': ['تحليلي ومنطقي', 'عملي وبراغماتي'],
        'work':     ['عمل ميداني', 'عمل فردي'],
    },
    {
        'major':    'هندسة ميكانيكية',
        'field':    'engineering',
        'min_gpa':  75,
        'interests': {'tech': 0.40, 'health': 0.05, 'business': 0.10, 'arts': 0.05},
        'thinking': ['تحليلي ومنطقي', 'عملي وبراغماتي'],
        'work':     ['عمل ميداني', 'مختبر وبحث'],
    },
    {
        'major':    'هندسة صناعية',
        'field':    'engineering',
        'min_gpa':  72,
        'interests': {'tech': 0.30, 'health': 0.05, 'business': 0.25, 'arts': 0.05},
        'thinking': ['عملي وبراغماتي', 'تحليلي ومنطقي'],
        'work':     ['عمل جماعي', 'عمل ميداني'],
    },

    # ── الصحي ────────────────────────────────────────────────────
    {
        'major':    'طب بشري',
        'field':    'health',
        'min_gpa':  90,
        'interests': {'tech': 0.10, 'health': 0.70, 'business': 0.05, 'arts': 0.05},
        'thinking': ['تحليلي ومنطقي', 'عملي وبراغماتي'],
        'work':     ['عمل مع الناس', 'عمل ميداني'],
    },
    {
        'major':    'صيدلة',
        'field':    'health',
        'min_gpa':  85,
        'interests': {'tech': 0.15, 'health': 0.60, 'business': 0.10, 'arts': 0.05},
        'thinking': ['تحليلي ومنطقي'],
        'work':     ['مختبر وبحث', 'عمل مع الناس'],
    },
    {
        'major':    'طب أسنان',
        'field':    'health',
        'min_gpa':  85,
        'interests': {'tech': 0.10, 'health': 0.60, 'business': 0.05, 'arts': 0.15},
        'thinking': ['عملي وبراغماتي'],
        'work':     ['عمل مع الناس', 'عمل ميداني'],
    },
    {
        'major':    'تمريض',
        'field':    'health',
        'min_gpa':  65,
        'interests': {'tech': 0.05, 'health': 0.65, 'business': 0.05, 'arts': 0.05},
        'thinking': ['عملي وبراغماتي'],
        'work':     ['عمل مع الناس', 'عمل ميداني'],
    },
    {
        'major':    'علاج طبيعي',
        'field':    'health',
        'min_gpa':  72,
        'interests': {'tech': 0.10, 'health': 0.60, 'business': 0.05, 'arts': 0.10},
        'thinking': ['عملي وبراغماتي'],
        'work':     ['عمل مع الناس', 'عمل ميداني'],
    },

    # ── العلوم والتكنولوجيا ───────────────────────────────────────
    {
        'major':    'الذكاء الاصطناعي وعلم البيانات',
        'field':    'science_tech',
        'min_gpa':  80,
        'interests': {'tech': 0.60, 'health': 0.05, 'business': 0.10, 'arts': 0.05},
        'thinking': ['تحليلي ومنطقي'],
        'work':     ['عمل فردي', 'مختبر وبحث'],
    },
    {
        'major':    'علم الحاسوب',
        'field':    'science_tech',
        'min_gpa':  75,
        'interests': {'tech': 0.55, 'health': 0.05, 'business': 0.10, 'arts': 0.05},
        'thinking': ['تحليلي ومنطقي'],
        'work':     ['عمل فردي', 'مختبر وبحث'],
    },
    {
        'major':    'تكنولوجيا المعلومات',
        'field':    'science_tech',
        'min_gpa':  70,
        'interests': {'tech': 0.50, 'health': 0.05, 'business': 0.15, 'arts': 0.05},
        'thinking': ['تحليلي ومنطقي', 'عملي وبراغماتي'],
        'work':     ['عمل فردي', 'عمل جماعي'],
    },
    {
        'major':    'الأمن السيبراني',
        'field':    'science_tech',
        'min_gpa':  75,
        'interests': {'tech': 0.60, 'health': 0.00, 'business': 0.05, 'arts': 0.05},
        'thinking': ['تحليلي ومنطقي'],
        'work':     ['عمل فردي', 'مختبر وبحث'],
    },
    {
        'major':    'رياضيات وإحصاء',
        'field':    'science_tech',
        'min_gpa':  70,
        'interests': {'tech': 0.35, 'health': 0.05, 'business': 0.15, 'arts': 0.05},
        'thinking': ['تحليلي ومنطقي'],
        'work':     ['عمل فردي', 'مختبر وبحث'],
    },

    # ── الأعمال ───────────────────────────────────────────────────
    {
        'major':    'محاسبة',
        'field':    'business',
        'min_gpa':  65,
        'interests': {'tech': 0.15, 'health': 0.00, 'business': 0.55, 'arts': 0.05},
        'thinking': ['تحليلي ومنطقي', 'عملي وبراغماتي'],
        'work':     ['عمل فردي', 'عمل مكتبي'],
    },
    {
        'major':    'إدارة الأعمال',
        'field':    'business',
        'min_gpa':  60,
        'interests': {'tech': 0.10, 'health': 0.05, 'business': 0.60, 'arts': 0.10},
        'thinking': ['عملي وبراغماتي', 'إبداعي وخيالي'],
        'work':     ['عمل جماعي', 'عمل مع الناس'],
    },
    {
        'major':    'تسويق ومبيعات',
        'field':    'business',
        'min_gpa':  60,
        'interests': {'tech': 0.10, 'health': 0.00, 'business': 0.50, 'arts': 0.20},
        'thinking': ['إبداعي وخيالي', 'عملي وبراغماتي'],
        'work':     ['عمل مع الناس', 'عمل جماعي'],
    },
    {
        'major':    'مالية ومصارف',
        'field':    'business',
        'min_gpa':  65,
        'interests': {'tech': 0.15, 'health': 0.00, 'business': 0.60, 'arts': 0.05},
        'thinking': ['تحليلي ومنطقي'],
        'work':     ['عمل فردي', 'عمل مكتبي'],
    },
    {
        'major':    'اقتصاد',
        'field':    'business',
        'min_gpa':  68,
        'interests': {'tech': 0.15, 'health': 0.00, 'business': 0.55, 'arts': 0.05},
        'thinking': ['تحليلي ومنطقي'],
        'work':     ['عمل فردي', 'مختبر وبحث'],
    },

    # ── القانون والشريعة ──────────────────────────────────────────
    {
        'major':    'قانون',
        'field':    'law',
        'min_gpa':  65,
        'interests': {'tech': 0.05, 'health': 0.00, 'business': 0.20, 'arts': 0.30},
        'thinking': ['تحليلي ومنطقي', 'إبداعي وخيالي'],
        'work':     ['عمل مع الناس', 'عمل جماعي'],
    },
    {
        'major':    'شريعة إسلامية',
        'field':    'law',
        'min_gpa':  60,
        'interests': {'tech': 0.00, 'health': 0.05, 'business': 0.10, 'arts': 0.35},
        'thinking': ['تحليلي ومنطقي'],
        'work':     ['عمل مع الناس', 'مختبر وبحث'],
    },
    {
        'major':    'علوم سياسية وعلاقات دولية',
        'field':    'law',
        'min_gpa':  63,
        'interests': {'tech': 0.05, 'health': 0.00, 'business': 0.15, 'arts': 0.40},
        'thinking': ['إبداعي وخيالي', 'تحليلي ومنطقي'],
        'work':     ['عمل مع الناس', 'عمل جماعي'],
    },

    # ── الإنسانيات واللغات ────────────────────────────────────────
    {
        'major':    'لغة إنجليزية وآدابها',
        'field':    'humanities',
        'min_gpa':  60,
        'interests': {'tech': 0.05, 'health': 0.00, 'business': 0.10, 'arts': 0.55},
        'thinking': ['إبداعي وخيالي'],
        'work':     ['عمل فردي', 'عمل مع الناس'],
    },
    {
        'major':    'إعلام وصحافة',
        'field':    'humanities',
        'min_gpa':  62,
        'interests': {'tech': 0.15, 'health': 0.00, 'business': 0.15, 'arts': 0.50},
        'thinking': ['إبداعي وخيالي'],
        'work':     ['عمل مع الناس', 'عمل جماعي'],
    },
    {
        'major':    'علم النفس',
        'field':    'humanities',
        'min_gpa':  65,
        'interests': {'tech': 0.05, 'health': 0.25, 'business': 0.10, 'arts': 0.35},
        'thinking': ['تحليلي ومنطقي', 'إبداعي وخيالي'],
        'work':     ['عمل مع الناس', 'مختبر وبحث'],
    },
    {
        'major':    'علم الاجتماع والخدمة الاجتماعية',
        'field':    'humanities',
        'min_gpa':  60,
        'interests': {'tech': 0.00, 'health': 0.15, 'business': 0.10, 'arts': 0.45},
        'thinking': ['إبداعي وخيالي'],
        'work':     ['عمل مع الناس', 'عمل جماعي'],
    },
]


def _score_major(major: dict, gpa: float, interests: dict, thinking_style: str,
                 preferred_work: str) -> float:
    # ─ 1. مكوّن المعدل (40%) ─────────────────────────────────────
    min_g = major['min_gpa']
    if gpa >= min_g:
        # كلما ارتفع المعدل فوق الحد كلما زادت النقطة
        gpa_score = 60 + min((gpa - min_g) / max(100 - min_g, 1), 1) * 40
    else:
        # تحت الحد: عقوبة تدريجية
        gpa_score = max(0, (gpa / min_g) * 55)

    # ─ 2. مكوّن الاهتمامات (45%) ─────────────────────────────────
    weights = major['interests']
    total_w = sum(weights.values()) or 1
    interest_score = sum(
        ((interests.get(k, 3) - 1) / 4) * w
        for k, w in weights.items()
    ) / total_w * 100

    # ─ 3. مكوّن الشخصية (15%) ────────────────────────────────────
    personality_score = 50.0
    if thinking_style in major['thinking']:
        personality_score += 30
    if preferred_work in major['work']:
        personality_score += 20

    # ─ مجموع مرجّح ───────────────────────────────────────────────
    raw = gpa_score * 0.40 + interest_score * 0.45 + personality_score * 0.15

    # تحويل لنطاق 45-99 لتبدو النتائج واقعية
    confidence = 45 + (raw / 100) * 54
    return int(round(min(99, max(45, confidence))))


def _build_explanation(top_major: str, gpa: float, thinking_style: str,
                        preferred_work: str, top_interest: str) -> str:
    interest_map = {
        'tech':     'التكنولوجيا',
        'health':   'الصحة والطب',
        'business': 'الأعمال',
        'arts':     'الفنون والإبداع',
    }
    interest_label = interest_map.get(top_interest, 'مجالاتك')
    thinking_label = thinking_style or 'أسلوبك الفكري'

    return (
        f'بناءً على معدلك {gpa:.1f}% وتفضيلك لـ{interest_label} وطريقة تفكيرك '
        f'"{thinking_label}"، يبدو أن تخصص {top_major} هو الأنسب لك. '
        f'هذا التخصص يوفر بيئة عمل تتوافق مع طموحاتك ويفتح أمامك فرصاً واسعة '
        f'في سوق العمل الأردني والإقليمي.'
    )


def recommend(data: dict) -> dict:
    """
    المدخلات:
        gpa               float  0–100
        interest_tech     int    1–5
        interest_health   int    1–5
        interest_business int    1–5
        interest_arts     int    1–5
        thinking_style    str
        personality_type  str
        preferred_study   str
        preferred_work    str

    المخرجات:
        {
            "recommendations": [{"rank": 1, "major": "...", "confidence": 92}, ...],
            "ai_explanation": "..."
        }
    """
    gpa             = float(data.get('gpa', 70))
    interests       = {
        'tech':     int(data.get('interest_tech',     3)),
        'health':   int(data.get('interest_health',   3)),
        'business': int(data.get('interest_business', 3)),
        'arts':     int(data.get('interest_arts',     3)),
    }
    thinking_style  = data.get('thinking_style', '')
    preferred_work  = data.get('preferred_work', '')

    scored = [
        {
            'major':      m['major'],
            'field':      m['field'],
            'confidence': _score_major(m, gpa, interests, thinking_style, preferred_work),
        }
        for m in MAJORS
    ]
    scored.sort(key=lambda x: x['confidence'], reverse=True)
    top5 = scored[:5]

    recommendations = [
        {'rank': i + 1, 'major': r['major'], 'confidence': r['confidence']}
        for i, r in enumerate(top5)
    ]

    top_interest = max(interests, key=interests.get)
    explanation  = _build_explanation(
        top5[0]['major'], gpa, thinking_style, preferred_work, top_interest
    )

    return {
        'recommendations': recommendations,
        'ai_explanation':  explanation,
    }
