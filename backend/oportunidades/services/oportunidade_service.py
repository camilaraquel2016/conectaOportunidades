"""Regras de negocio dos RFs, orquestrando a camada de Repository."""

from ..models import StatusOportunidade
from ..repositories import OportunidadeRepository, VisualizacaoLogRepository
from .exceptions import OportunidadeNaoEncontradaError


class OportunidadeService:
    def __init__(self, oportunidade_repository=None, log_repository=None):
        self.oportunidade_repository = oportunidade_repository or OportunidadeRepository
        self.log_repository = log_repository or VisualizacaoLogRepository

    def cadastrar_oportunidade(self, dados_validados):
        """RF-01: cadastra a oportunidade, que sempre nasce com status 'ativa'."""
        dados = dict(dados_validados)
        dados['status'] = StatusOportunidade.ATIVA.value
        return self.oportunidade_repository.criar(dados)

    def listar_oportunidades_ativas(self, categoria=None, vertente=None):
        """RF-02: lista as oportunidades ativas da vitrine publica."""
        return self.oportunidade_repository.listar_ativas(categoria=categoria, vertente=vertente)

    def obter_detalhes_e_registrar_log(self, id_oportunidade):
        """RF-03: retorna os detalhes e registra log de visualizacao somente se ativa."""
        oportunidade = self._obter_ou_falhar(id_oportunidade)
        if oportunidade.esta_ativa:
            self.log_repository.registrar_log(oportunidade)
        return oportunidade

    def alterar_status_oportunidade(self, id_oportunidade, novo_status):
        """RF-04: alterna o status entre 'ativa' e 'encerrada' (inativacao logica)."""
        oportunidade = self._obter_ou_falhar(id_oportunidade)
        return self.oportunidade_repository.atualizar_status(oportunidade, novo_status)

    def _obter_ou_falhar(self, id_oportunidade):
        oportunidade = self.oportunidade_repository.buscar_por_id(id_oportunidade)
        if oportunidade is None:
            raise OportunidadeNaoEncontradaError(id_oportunidade)
        return oportunidade
