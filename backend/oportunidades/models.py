"""Camada de Modelo do app `oportunidades`.

O schema e provisionado por `database/01_schema_inicial.sql`, por isso os modelos
usam `managed = False`. O encerramento de vagas e inativacao logica
(`status = 'encerrada'`), nunca DELETE SQL.
"""

from django.db import models


class TipoCategoria(models.TextChoices):
    CURSO = 'curso', 'Curso'
    OFICINA = 'oficina', 'Oficina'
    EMPREGO = 'emprego', 'Emprego'
    ESTAGIO = 'estagio', 'Estagio'


class StatusOportunidade(models.TextChoices):
    ATIVA = 'ativa', 'Ativa'
    ENCERRADA = 'encerrada', 'Encerrada'


class Vertente(models.TextChoices):
    QUALIFICACAO = 'qualificacao', 'Qualificacao Profissional'
    MERCADO = 'mercado', 'Mercado de Trabalho'


class Oportunidade(models.Model):
    titulo = models.CharField(max_length=100, verbose_name='Titulo')
    tipo_categoria = models.CharField(
        max_length=20,
        choices=TipoCategoria.choices,
        verbose_name='Tipo / Categoria',
    )
    instituicao_empresa = models.CharField(
        max_length=100,
        verbose_name='Instituicao / Empresa',
    )
    descricao_requisitos = models.TextField(verbose_name='Descricao / Requisitos')
    link_ou_contato = models.CharField(
        max_length=255,
        verbose_name='Link ou Contato',
    )
    status = models.CharField(
        max_length=10,
        choices=StatusOportunidade.choices,
        default=StatusOportunidade.ATIVA,
        verbose_name='Status',
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')

    class Meta:
        db_table = 'oportunidades'
        ordering = ['-created_at']
        managed = False
        verbose_name = 'Oportunidade'
        verbose_name_plural = 'Oportunidades'

    def __str__(self):
        return f'{self.titulo} ({self.get_tipo_categoria_display()})'

    @property
    def esta_ativa(self):
        """Usado pelo Service do RF-03 para decidir a gravacao do log."""
        return self.status == StatusOportunidade.ATIVA


class VisualizacaoLog(models.Model):
    oportunidade = models.ForeignKey(
        Oportunidade,
        on_delete=models.CASCADE,
        related_name='visualizacoes',
        verbose_name='Oportunidade',
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Visualizado em')

    class Meta:
        db_table = 'visualizacoes_log'
        ordering = ['-created_at']
        managed = False
        verbose_name = 'Log de Visualizacao'
        verbose_name_plural = 'Logs de Visualizacao'

    def __str__(self):
        return f'Visualizacao de "{self.oportunidade_id}" em {self.created_at:%d/%m/%Y %H:%M}'
