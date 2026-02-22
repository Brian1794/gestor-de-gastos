from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, GastoViewSet

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'gastos', GastoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]