"""Roteamento raiz do projeto (camada Controller)."""

from django.urls import include, path

urlpatterns = [
    path('api/oportunidades/', include('oportunidades.urls')),
]
