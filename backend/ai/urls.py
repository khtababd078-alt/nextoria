from django.urls import path
from .views import ml_recommend, chat, ml_status, major_info

urlpatterns = [
    path('ml-recommend/', ml_recommend),
    path('chat/',         chat),
    path('ml-status/',    ml_status),
    path('major-info/',   major_info),
]
