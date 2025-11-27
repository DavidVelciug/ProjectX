from django.urls import path
from . import views

urlpatterns = [
    path('recognize', views.CanvasPredictView.as_view()),
]