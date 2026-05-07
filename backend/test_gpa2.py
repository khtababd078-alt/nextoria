import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
from ai.ml_predictor import predict_majors
from ai.field_map import filter_by_field
from ai.gpa_filter import _load_thresholds

thresholds = _load_thresholds()
recs = predict_majors({'gpa':79,'interest_tech':5,'interest_health':1,'interest_business':1,'interest_arts':1}, top_k=52)
recs_eng = filter_by_field(recs, 'engineering')

print("الهندسيون من النموذج + حدهم في الداتا:")
for r in recs_eng:
    th = thresholds.get(r['major'], 'غير موجود')
    print(f"  {r['major']} → حد: {th}")
