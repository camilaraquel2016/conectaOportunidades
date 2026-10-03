"""Rotas da API do app `oportunidades`."""

from django.urls import path

from . import views

app_name = 'oportunidades'

urlpatterns = [
    path('', views.OportunidadeListCreateView.as_view(), name='oportunidade-list-create'),
    path('<int:pk>/', views.OportunidadeDetailView.as_view(), name='oportunidade-detail'),
    path('<int:pk>/status/', views.OportunidadeStatusView.as_view(), name='oportunidade-status'),
]
