"""Excecoes de dominio da camada Service."""

from django.utils.translation import gettext_lazy as _


class OportunidadeNaoEncontradaError(Exception):
    """Levantada quando o id informado nao corresponde a nenhuma oportunidade."""

    def __init__(self, id_oportunidade=None):
        self.id_oportunidade = id_oportunidade
        super().__init__(
            _('Oportunidade não encontrada.')
            if id_oportunidade is None
            else _('Oportunidade com id %(id)s não encontrada.') % {'id': id_oportunidade}
        )
