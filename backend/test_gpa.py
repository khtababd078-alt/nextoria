import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
from ai.ml_predictor import predict_majors
from ai.field_map import filter_by_field
from ai.gpa_filter import filter_by_gpa

# معدل 79 + حقل هندسي
recs = predict_majors({'gpa':79,'interest_tech':5,'interest_health':1,'interest_business':1,'interest_arts':1}, top_k=52)
recs = filter_by_gpa(recs, 79)
recs = filter_by_field(recs, 'engineering')[:5]

print("معدل 79 + هندسي:")
if recs:
    for r in recs: print(f"  {r['rank']}. {r['major']}")
else:
    print("  لا توجد تخصصات مناسبة لهذا المعدل")

print()

# معدل 95 + حقل هندسي
recs2 = predict_majors({'gpa':95,'interest_tech':5,'interest_health':1,'interest_business':1,'interest_arts':1}, top_k=52)
recs2 = filter_by_gpa(recs2, 95)
recs2 = filter_by_field(recs2, 'engineering')[:5]

print("معدل 95 + هندسي:")
for r in recs2: print(f"  {r['rank']}. {r['major']}")
