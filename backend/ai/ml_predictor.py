"""
nashmi — ML Predictor
يشتغل بدون داتابيس، بيحمّل الموديل مرة وحدة عند الإقلاع
"""

import os
import pickle
from functools import lru_cache

import numpy as np
import pandas as pd

MODEL_DIR = os.path.join(os.path.dirname(__file__), "ml_model")


@lru_cache(maxsize=1)
def _load_artifacts():
    paths = {
        "clf":      os.path.join(MODEL_DIR, "clf.pkl"),
        "encoder":  os.path.join(MODEL_DIR, "label_encoder.pkl"),
        "features": os.path.join(MODEL_DIR, "feature_names.pkl"),
        "maps":     os.path.join(MODEL_DIR, "encoding_maps.pkl"),
    }
    missing = [k for k, p in paths.items() if not os.path.exists(p)]
    if missing:
        raise FileNotFoundError(f"Missing ML model files: {missing}")

    with open(paths["clf"],      "rb") as f: clf      = pickle.load(f)
    with open(paths["encoder"],  "rb") as f: encoder  = pickle.load(f)
    with open(paths["features"], "rb") as f: features = pickle.load(f)
    with open(paths["maps"],     "rb") as f: enc_maps = pickle.load(f)
    return clf, encoder, features, enc_maps


def _fuzzy_encode(value, mapping, default=0):
    if not value:
        return default
    v = str(value).strip()
    if v in mapping:
        return mapping[v]
    for key, code in mapping.items():
        if key in v or v in key:
            return code
    return default


def predict_majors(student_data: dict, top_k: int = 10) -> list:
    clf, encoder, features, enc_maps = _load_artifacts()

    row = {
        "GPA":                                 float(student_data["gpa"]),
        "Interest in Technology":              int(student_data["interest_tech"]),
        "Interest in Health and Medicine":     int(student_data["interest_health"]),
        "Interest in Business and Management": int(student_data["interest_business"]),
        "Interest in Arts and Creativity":     int(student_data["interest_arts"]),
        "Thinking Style":         _fuzzy_encode(student_data.get("thinking_style", ""),   enc_maps["THINKING_MAP"]),
        "Personality Type":       _fuzzy_encode(student_data.get("personality_type", ""), enc_maps["PERSONA_MAP"]),
        "Preferred Study Method": _fuzzy_encode(student_data.get("preferred_study", ""),  enc_maps["STUDY_MAP"], default=1),
        "Preferred Work Style":   _fuzzy_encode(student_data.get("preferred_work", ""),   enc_maps["WORK_MAP"]),
    }

    df = pd.DataFrame([row], columns=features)
    proba = clf.predict_proba(df)[0]
    top_indices = np.argsort(proba)[-top_k:][::-1]

    return [
        {
            "rank":       r + 1,
            "major":      encoder.inverse_transform([i])[0],
            "confidence": round(float(proba[i]) * 100, 2),
        }
        for r, i in enumerate(top_indices)
    ]


def model_is_ready() -> bool:
    try:
        _load_artifacts()
        return True
    except Exception:
        return False


def get_model_info() -> dict:
    try:
        clf, encoder, features, _ = _load_artifacts()
        return {
            "ready":        True,
            "majors_count": len(encoder.classes_),
            "majors":       list(encoder.classes_),
            "features":     list(features),
            "estimators":   clf.n_estimators,
        }
    except Exception as e:
        return {"ready": False, "error": str(e)}
