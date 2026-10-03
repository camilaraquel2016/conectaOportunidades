"""Configuracao do app `oportunidades` (camada de dominio)."""

from django.apps import AppConfig


class OportunidadesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'oportunidades'
    verbose_name = 'Oportunidades'
