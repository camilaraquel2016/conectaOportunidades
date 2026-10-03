"""Camada Controller: protocolo HTTP (validação, status codes e JSON)."""

from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import OportunidadeSerializer, OportunidadeStatusUpdateSerializer
from .services import OportunidadeService
from .services.exceptions import OportunidadeNaoEncontradaError

service = OportunidadeService()


class OportunidadeListCreateView(APIView):
    """GET (RF-02) e POST (RF-01) em /api/oportunidades/."""

    def get(self, request):
        oportunidades = service.listar_oportunidades_ativas(
            categoria=request.query_params.get('categoria'),
            vertente=request.query_params.get('vertente'),
        )
        return Response(OportunidadeSerializer(oportunidades, many=True).data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = OportunidadeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        oportunidade = service.cadastrar_oportunidade(serializer.validated_data)
        return Response(OportunidadeSerializer(oportunidade).data, status=status.HTTP_201_CREATED)


class OportunidadeDetailView(APIView):
    """GET (RF-03) em /api/oportunidades/<id>/."""

    def get(self, request, pk):
        try:
            oportunidade = service.obter_detalhes_e_registrar_log(pk)
        except OportunidadeNaoEncontradaError as excecao:
            raise NotFound(str(excecao))
        return Response(OportunidadeSerializer(oportunidade).data, status=status.HTTP_200_OK)


class OportunidadeStatusView(APIView):
    """PATCH (RF-04) em /api/oportunidades/<id>/status/."""

    def patch(self, request, pk):
        serializer = OportunidadeStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            oportunidade = service.alterar_status_oportunidade(pk, serializer.validated_data['status'])
        except OportunidadeNaoEncontradaError as excecao:
            raise NotFound(str(excecao))
        return Response(OportunidadeSerializer(oportunidade).data, status=status.HTTP_200_OK)
