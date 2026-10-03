"""Camada de Serializacao: validacao de contrato HTTP e formatacao dos payloads JSON."""

import re

from rest_framework import serializers

from .models import Oportunidade, StatusOportunidade, VisualizacaoLog

CARACTERES_TELEFONE = re.compile(r'^\+?[\d\s().-]+$')
FORMATO_EMAIL = re.compile(r'^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$')


class OportunidadeSerializer(serializers.ModelSerializer):
    titulo = serializers.CharField(max_length=100, min_length=5)
    instituicao_empresa = serializers.CharField(max_length=100)
    descricao_requisitos = serializers.CharField(max_length=1000)
    link_ou_contato = serializers.CharField(max_length=255)

    class Meta:
        model = Oportunidade
        fields = [
            'id',
            'titulo',
            'tipo_categoria',
            'instituicao_empresa',
            'descricao_requisitos',
            'link_ou_contato',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'status', 'created_at']

    def validate_link_ou_contato(self, valor):
        """Aceita apenas URL (http/https), e-mail ou telefone/WhatsApp."""
        contato = str(valor).strip()
        formatos_validos = (
            contato.lower().startswith(('http://', 'https://')),
            bool(FORMATO_EMAIL.match(contato)),
            self._e_telefone(contato),
        )
        if not any(formatos_validos):
            raise serializers.ValidationError(
                'Informe um link, e-mail ou WhatsApp válido para a inscrição.'
            )
        return contato

    @staticmethod
    def _e_telefone(valor):
        digitos = re.sub(r'\D', '', valor)
        return bool(CARACTERES_TELEFONE.match(valor)) and 10 <= len(digitos) <= 13


class OportunidadeStatusUpdateSerializer(serializers.Serializer):
    """Payload exclusivo do RF-04 (ativa <-> encerrada)."""

    status = serializers.ChoiceField(choices=StatusOportunidade.choices)


class VisualizacaoLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisualizacaoLog
        fields = ['id', 'oportunidade', 'created_at']
        read_only_fields = fields
