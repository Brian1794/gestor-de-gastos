# gastos/serializers.py

from rest_framework import serializers
from .models import Categoria, Gasto


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'fecha_creacion']


class GastoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(
        source='categoria.nombre', read_only=True
    )

    class Meta:
        model = Gasto
        fields = [
            'id',
            'descripcion',
            'monto',
            'fecha_gasto',
            'categoria',
            'categoria_nombre',
            'fecha_creacion',
            'fecha_actualizacion'
        ]

    def validate_monto(self, value):
        if value <= 0:
            raise serializers.ValidationError("El monto debe ser mayor que cero.")
        return value

    def validate_descripcion(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("La descripción no puede estar vacía.")
        return value.strip()

    def validate_fecha_gasto(self, value):
        if value is None:
            raise serializers.ValidationError("La fecha del gasto es obligatoria.")
        return value

    def validate(self, data):
        # Validación de duplicados a nivel de serializer como respaldo
        descripcion = data.get('descripcion')
        monto = data.get('monto')
        fecha_gasto = data.get('fecha_gasto')

        qs = Gasto.objects.filter(
            descripcion=descripcion,
            monto=monto,
            fecha_gasto=fecha_gasto
        )

        # Si es una actualización, excluimos el registro actual
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError(
                "Ya existe un gasto con la misma descripción, monto y fecha."
            )

        return data