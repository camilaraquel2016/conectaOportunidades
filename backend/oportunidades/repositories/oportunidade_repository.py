"""Acesso a tabela `oportunidades` via Django ORM (sem regra de negocio)."""

from ..models import Oportunidade, StatusOportunidade, TipoCategoria, Vertente

CATEGORIAS_POR_VERTENTE = {
    Vertente.QUALIFICACAO.value: [
        TipoCategoria.CURSO.value,
        TipoCategoria.OFICINA.value,
    ],
    Vertente.MERCADO.value: [
        TipoCategoria.EMPREGO.value,
        TipoCategoria.ESTAGIO.value,
    ],
}


class OportunidadeRepository:
    @staticmethod
    def criar(dados_validados):
        """RF-01: insere e retorna a nova oportunidade (dicionario ja validado)."""
        dados = dict(dados_validados)
        dados.setdefault('status', StatusOportunidade.ATIVA.value)
        return Oportunidade.objects.create(**dados)

    @staticmethod
    def listar_ativas(categoria=None, vertente=None):
        """RF-02: oportunidades com status 'ativa', filtradas por categoria ou vertente."""
        consulta = Oportunidade.objects.filter(status=StatusOportunidade.ATIVA.value)

        categoria = OportunidadeRepository._normalizar(categoria)
        vertente = OportunidadeRepository._normalizar(vertente)

        if vertente:
            categorias = CATEGORIAS_POR_VERTENTE.get(vertente, [])
            if not categorias:
                return consulta.none()
            consulta = consulta.filter(tipo_categoria__in=categorias)

        if categoria:
            consulta = consulta.filter(tipo_categoria=categoria)

        return consulta

    @staticmethod
    def buscar_por_id(id):
        """Retorna a oportunidade pelo id ou None se nao existir."""
        return Oportunidade.objects.filter(pk=id).first()

    @staticmethod
    def atualizar_status(oportunidade, novo_status):
        """RF-04: alterna o status (Soft Delete), preservando o registro."""
        oportunidade.status = novo_status
        oportunidade.save(update_fields=['status'])
        return oportunidade

    @staticmethod
    def _normalizar(valor):
        if valor is None:
            return None
        return str(valor).strip().lower() or None
