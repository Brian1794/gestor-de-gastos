# 💸 Gestor de Gastos — Backend API

> API REST desarrollada con **Django 4.2** + **Django REST Framework** + **MySQL**

---

## 🧰 Tecnologías

| Tecnología | Versión |
|------------|---------|
| Python | 3.10+ |
| Django | 4.2 |
| Django REST Framework | 3.14+ |
| MySQL / MariaDB | 10.4+ |
| django-cors-headers | latest |
| django-filter | latest |

---

## 📋 Requisitos previos

Antes de comenzar asegúrate de tener instalado:

- [Python 3.10+](https://www.python.org/downloads/)
- [XAMPP](https://www.apachefriends.org/) o MySQL 8+ / MariaDB 10.4+
- [Git](https://git-scm.com/)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/gestor-de-gastos.git
cd gestor-de-gastos/backend
```

### 2. Crear y activar el entorno virtual

```bash
python -m venv .venv
```

**Windows:**
```bash
.venv\Scripts\activate
```

**Mac / Linux:**
```bash
source .venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Crear la base de datos

Abre **phpMyAdmin** (XAMPP), **MySQL Workbench** o tu cliente MySQL y ejecuta el archivo incluido:

```bash
gestor_db.sql
```

O créala manualmente:

```sql
CREATE DATABASE IF NOT EXISTS gestor_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### 5. Configurar la base de datos

Abre `core/settings.py` y actualiza la sección `DATABASES` con tus credenciales:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'gestor_db',
        'USER': 'root',       # tu usuario MySQL
        'PASSWORD': '',       # tu contraseña (vacío si no tiene)
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}
```

### 6. Aplicar migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Iniciar el servidor

```bash
python manage.py runserver
```

El servidor estará disponible en: **http://127.0.0.1:8000**

---

## 📌 Endpoints

### Raíz

```
GET /
```
Retorna un listado de todos los endpoints disponibles.

---

### 📂 Categorías

#### GET /api/categorias/
Obtener todas las categorías

```bash
curl http://127.0.0.1:8000/api/categorias/
```

**Response:**
```json
[
  {
    "id": 1,
    "nombre": "Alimentación",
    "fecha_creacion": "2026-02-22T10:00:00Z"
  }
]
```

#### POST /api/categorias/
Crear nueva categoría

```bash
curl -X POST http://127.0.0.1:8000/api/categorias/ \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Inversión"}'
```

**Errores:**
- `400` — Nombre obligatorio
- `400` — Categoría ya existe

---

### 💰 Gastos

#### GET /api/gastos/
Obtener gastos con paginación, filtros y ordenamiento

```bash
# Obtener primera página
curl http://127.0.0.1:8000/api/gastos/

# Filtrar por categoría
curl "http://127.0.0.1:8000/api/gastos/?categoria=1"

# Buscar por descripción
curl "http://127.0.0.1:8000/api/gastos/?search=almuerzo"

# Ordenar por monto descendente
curl "http://127.0.0.1:8000/api/gastos/?ordering=-monto"

# Página 2
curl "http://127.0.0.1:8000/api/gastos/?page=2"
```

**Response:**
```json
{
  "count": 25,
  "next": "http://127.0.0.1:8000/api/gastos/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "descripcion": "Almuerzo restaurante",
      "monto": "45000.00",
      "fecha_gasto": "2026-02-22T12:30:00Z",
      "categoria": 1,
      "categoria_nombre": "Alimentación",
      "fecha_creacion": "2026-02-22T10:00:00Z",
      "fecha_actualizacion": "2026-02-22T10:00:00Z"
    }
  ]
}
```

#### POST /api/gastos/
Crear nuevo gasto

```bash
curl -X POST http://127.0.0.1:8000/api/gastos/ \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion": "Almuerzo",
    "monto": 45000,
    "fecha_gasto": "2026-02-22T12:30:00Z",
    "categoria": 1
  }'
```

**Errores:**
- `400` — Campos obligatorios faltantes
- `400` — Monto debe ser mayor que cero
- `400` — Gasto duplicado

#### PUT /api/gastos/{id}/
Actualizar gasto existente

```bash
curl -X PUT http://127.0.0.1:8000/api/gastos/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion": "Almuerzo actualizado",
    "monto": 50000,
    "fecha_gasto": "2026-02-22T13:00:00Z",
    "categoria": 1
  }'
```

#### DELETE /api/gastos/{id}/
Eliminar gasto

```bash
curl -X DELETE http://127.0.0.1:8000/api/gastos/1/
```

#### GET /api/gastos/total/
Obtener el total de todos los gastos

```bash
curl http://127.0.0.1:8000/api/gastos/total/
```

**Response:**
```json
{
  "total": "350000.00"
}
```

---

## 🔍 Parámetros de consulta

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `page` | int | Número de página | `?page=2` |
| `categoria` | int | Filtrar por categoría | `?categoria=1` |
| `search` | string | Buscar en descripción | `?search=almuerzo` |
| `ordering` | string | Ordenar por campo | `?ordering=-monto` |

**Campos para `ordering`:**
- `fecha_gasto` / `-fecha_gasto`
- `monto` / `-monto`
- `descripcion` / `-descripcion`
- `categoria__nombre` / `-categoria__nombre`

---

## ✅ Validaciones

### Serializer valida:
- ✅ Monto mayor que cero
- ✅ Descripción no vacía
- ✅ Fecha del gasto obligatoria
- ✅ Prevención de duplicados (descripción + monto + fecha)

### Base de datos valida:
- ✅ `CHECK (monto > 0)`
- ✅ `UNIQUE (descripcion, monto, fecha_gasto)`
- ✅ `FOREIGN KEY (categoria_id)`
- ✅ `NOT NULL` en campos obligatorios

---

## 🗂️ Estructura del proyecto

```
backend/
├── core/
│   ├── settings.py          # Configuración del proyecto
│   ├── urls.py              # URLs principales
│   └── wsgi.py
├── gastos/
│   ├── migrations/          # Migraciones de Django
│   ├── models.py            # Modelos Gasto y Categoría
│   ├── serializers.py       # Validaciones y serialización
│   ├── views.py             # Lógica de los endpoints
│   ├── urls.py              # URLs de la app
│   └── admin.py
├── gestor_db.sql            # Script SQL para crear la base de datos
├── manage.py
├── requirements.txt
└── README.md
```

---

## 🔌 Flujo de una petición

```
Cliente (Frontend)
      ↓
  core/urls.py          → Enruta /api/ a gastos/urls.py
      ↓
  gastos/urls.py        → Enruta al ViewSet correspondiente
      ↓
  gastos/views.py       → Procesa la lógica del negocio
      ↓
  gastos/serializers.py → Valida y serializa los datos
      ↓
  gastos/models.py      → Interactúa con MySQL
      ↓
  Response JSON         → Regresa al cliente
```

---

## 🗄️ Categorías iniciales

El archivo `gestor_db.sql` incluye las siguientes categorías por defecto:

- Alimentación
- Transporte
- Entretenimiento
- Salud
- Servicios

---

## 🛠️ Comandos útiles

```bash
# Activar entorno virtual (Windows)
.venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Iniciar servidor
python manage.py runserver

# Guardar dependencias actuales
pip freeze > requirements.txt
```

---

## ⚙️ Variables importantes en settings.py

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `DEBUG` | `True` | Cambiar a `False` en producción |
| `CORS_ALLOW_ALL_ORIGINS` | `True` | Permite peticiones desde el frontend |
| `PAGE_SIZE` | `10` | Registros por página |

---

## 📊 Relaciones de base de datos

```
categorias (1) ────< (N) gastos

- 1 categoría puede tener muchos gastos
- 1 gasto pertenece a 1 categoría
- ON DELETE RESTRICT: no se puede eliminar una categoría con gastos asociados
- ON UPDATE CASCADE: si cambia el id de categoría, se actualiza en gastos
```