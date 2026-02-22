from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Categoria, Gasto
from .serializers import CategoriaSerializer, GastoSerializer
from django.db.models import Sum


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class GastoViewSet(viewsets.ModelViewSet):
    queryset = Gasto.objects.all().order_by('-fecha_gasto')
    serializer_class = GastoSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['categoria']
    search_fields = ['descripcion']
    ordering_fields = ['fecha_gasto', 'monto', 'descripcion', 'categoria__nombre']

    @action(detail=False, methods=['get'])
    def total(self, request):
        total = Gasto.objects.aggregate(total=Sum('monto'))['total'] or 0
        return Response({'total': total})