"""Camada de Repositorio: isola o acesso a dados (Django ORM)."""

from .log_repository import VisualizacaoLogRepository
from .oportunidade_repository import OportunidadeRepository

__all__ = [
    'OportunidadeRepository',
    'VisualizacaoLogRepository',
]
