from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'categorias'
        managed = False 

    def __str__(self):
        return self.nombre


class Gasto(models.Model):
    descripcion = models.CharField(max_length=255)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_gasto = models.DateTimeField()
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.RESTRICT,
        db_column='categoria_id'
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'gastos'
        managed = False  

    def __str__(self):
        return self.descripcion