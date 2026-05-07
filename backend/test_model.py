import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
from ai.ml_predictor import predict_majors

tests = [
    ("معدل 92 + تكنولوجيا عالي", {
        'gpa': 92, 'interest_tech': 5, 'interest_health': 1,
        'interest_business': 1, 'interest_arts': 1,
        'thinking_style': 'تفكير تحليلي',
        'personality_type': 'منطوي (ما بتحب كثير تختلط بالناس)',
        'preferred_study': 'مزيج بين النظري والعملي',
        'preferred_work': 'العمل الفردي',
    }),
    ("معدل 95 + صحي عالي", {
        'gpa': 95, 'interest_tech': 1, 'interest_health': 5,
        'interest_business': 1, 'interest_arts': 1,
        'thinking_style': 'تفكير منطقي',
        'personality_type': 'اجتماعي (بتحب تختلط بالناس بكثرة )',
        'preferred_study': 'دراسة فيها عملي (تطبيق)',
        'preferred_work': 'العمل الجماعي (ضمن فريق)',
    }),
    ("معدل 75 + اعمال عالي", {
        'gpa': 75, 'interest_tech': 2, 'interest_health': 1,
        'interest_business': 5, 'interest_arts': 2,
        'thinking_style': 'تفكير منطقي',
        'personality_type': 'اجتماعي (بتحب تختلط بالناس بكثرة )',
        'preferred_study': 'نظري',
        'preferred_work': 'العمل الجماعي (ضمن فريق)',
    }),
    ("معدل 65 + فنون عالي", {
        'gpa': 65, 'interest_tech': 1, 'interest_health': 1,
        'interest_business': 2, 'interest_arts': 5,
        'thinking_style': '',
        'personality_type': '',
        'preferred_study': '',
        'preferred_work': '',
    }),
]

for label, data in tests:
    results = predict_majors(data, top_k=3)
    print(f"\n{label}:")
    for r in results:
        print(f"  {r['rank']}. {r['major']} — {r['confidence']}%")
