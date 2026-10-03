"""Acesso a tabela `visualizacoes_log` via Django ORM (sem regra de negocio)."""

from ..models import VisualizacaoLog


class VisualizacaoLogRepository:
    @staticmethod
    def registrar_log(oportunidade):
        """RF-03: grava o evento de visualizacao de uma oportunidade ativa."""
        return VisualizacaoLog.objects.create(oportunidade=oportunidade)
