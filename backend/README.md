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

Antes de comenzar, asegúrate de tener instalado:

- [Python 3.10+](https://www.python.org/downloads/)
- [XAMPP](https://www.apachefriends.org/) o MySQL 8+ / MariaDB 10.4+
- [Git](https://git-scm.com/)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Brian1794/gestor-de-gastos
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

**macOS / Linux:**
```bash
source .venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Crear la base de datos

Tienes dos opciones:

**Opción A — Usar el script SQL incluido** *(recomendado)*

Abre **phpMyAdmin** (XAMPP), **MySQL Workbench** o tu cliente MySQL preferido e importa el archivo:

```
backend/gestor_db.sql
```

**Opción B — Crear manualmente**

```sql
CREATE DATABASE IF NOT EXISTS gestor_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gestor_db;

-- =====================================
-- Tabla: categorias
-- =====================================
CREATE TABLE categorias (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(100) NOT NULL UNIQUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================
-- Tabla: gastos
-- =====================================
CREATE TABLE gastos (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  descripcion         VARCHAR(255) NOT NULL,
  monto               DECIMAL(10, 2) NOT NULL,
  fecha_gasto         DATETIME NOT NULL,
  categoria_id        INT NOT NULL,
  fecha_creacion      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        ON UPDATE CURRENT_TIMESTAMP,

  -- Monto siempre positivo
  CONSTRAINT chk_monto_positivo CHECK (monto > 0),

  -- Relación con categorias
  CONSTRAINT fk_gasto_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  -- Prevención de duplicados
  CONSTRAINT unique_gasto UNIQUE (descripcion, monto, fecha_gasto),

  -- Índices para rendimiento
  INDEX idx_fecha_gasto  (fecha_gasto),
  INDEX idx_categoria_id (categoria_id),
  INDEX idx_monto        (monto)
) ENGINE=InnoDB;

-- =====================================
-- Datos iniciales
-- =====================================
INSERT INTO categorias (nombre) VALUES
  ('Alimentación'),
  ('Transporte'),
  ('Entretenimiento'),
  ('Salud'),
  ('Servicios');
```

### 5. Configurar la conexión a la base de datos

Abre `core/settings.py` y actualiza la sección `DATABASES` con tus credenciales:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'gestor_db',
        'USER': 'root',   # tu usuario MySQL
        'PASSWORD': '',   # tu contraseña (dejar vacío si no tiene)
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

El servidor quedará disponible en: **http://127.0.0.1:8000**

---

## 📌 Endpoints de la API

### Raíz

```
GET /
```
Retorna un listado de todos los endpoints disponibles.

---

### 📂 Categorías — `/api/categorias/`

#### `GET /api/categorias/`
Obtiene todas las categorías disponibles.

```bash
curl http://127.0.0.1:8000/api/categorias/
```

**Respuesta `200 OK`:**
```json
[
  {
    "id": 1,
    "nombre": "Alimentación",
    "fecha_creacion": "2026-02-22T10:00:00Z"
  }
]
```

---

#### `POST /api/categorias/`
Crea una nueva categoría.

```bash
curl -X POST http://127.0.0.1:8000/api/categorias/ \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Inversión"}'
```

**Errores posibles:**

| Código | Descripción |
|--------|-------------|
| `400` | Nombre obligatorio |
| `400` | La categoría ya existe |

---

### 💰 Gastos — `/api/gastos/`

#### `GET /api/gastos/`
Obtiene los gastos con soporte de paginación, búsqueda, filtros y ordenamiento.

```bash
# Primera página (10 registros por defecto)
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

**Respuesta `200 OK`:**
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

---

#### `POST /api/gastos/`
Crea un nuevo gasto.

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

**Errores posibles:**

| Código | Descripción |
|--------|-------------|
| `400` | Campos obligatorios faltantes |
| `400` | El monto debe ser mayor que cero |
| `400` | Gasto duplicado (misma descripción, monto y fecha) |

---

#### `PUT /api/gastos/{id}/`
Actualiza un gasto existente por completo.

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

---

#### `DELETE /api/gastos/{id}/`
Elimina un gasto por su ID.

```bash
curl -X DELETE http://127.0.0.1:8000/api/gastos/1/
```

**Respuesta:** `204 No Content`

---

#### `GET /api/gastos/total/`
Retorna la suma total de todos los gastos registrados.

```bash
curl http://127.0.0.1:8000/api/gastos/total/
```

**Respuesta `200 OK`:**
```json
{
  "total": "350000.00"
}
```

---

## 🔍 Parámetros de consulta

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `page` | `int` | Número de página | `?page=2` |
| `categoria` | `int` | Filtrar por ID de categoría | `?categoria=1` |
| `search` | `string` | Buscar en la descripción | `?search=almuerzo` |
| `ordering` | `string` | Ordenar por campo (prefijo `-` = descendente) | `?ordering=-monto` |

**Campos válidos para `ordering`:**

| Campo | Descripción |
|-------|-------------|
| `fecha_gasto` / `-fecha_gasto` | Por fecha del gasto |
| `monto` / `-monto` | Por monto |
| `descripcion` / `-descripcion` | Por descripción alfabética |
| `categoria__nombre` / `-categoria__nombre` | Por nombre de categoría |

---

## ✅ Validaciones

Las validaciones están implementadas en **dos capas** para mayor robustez:

### Capa de Serializer (Django)
- ✅ Monto debe ser mayor que cero
- ✅ Descripción no puede estar vacía
- ✅ Fecha del gasto es obligatoria
- ✅ Prevención de duplicados (descripción + monto + fecha)

### Capa de Base de Datos (MySQL)
- ✅ `CHECK (monto > 0)` — integridad a nivel motor
- ✅ `UNIQUE (descripcion, monto, fecha_gasto)` — duplicados imposibles
- ✅ `FOREIGN KEY (categoria_id)` — referencia íntegra a categorías
- ✅ `NOT NULL` en todos los campos obligatorios

> La validación en ambas capas garantiza consistencia incluso si los datos llegan por fuera del API.

---

## 🔌 Flujo de una petición

```
Cliente (Frontend React)
        │
        ▼
  core/urls.py             →  Enruta /api/ hacia gastos/urls.py
        │
        ▼
  gastos/urls.py           →  Enruta al ViewSet correspondiente
        │
        ▼
  gastos/views.py          →  Procesa la lógica de negocio
        │
        ▼
  gastos/serializers.py    →  Valida y serializa los datos
        │
        ▼
  gastos/models.py         →  Interactúa con MySQL
        │
        ▼
  Respuesta JSON           →  Regresa al cliente
```

---

## 🗂️ Estructura del proyecto

```
backend/
├── core/
│   ├── settings.py          # Configuración global del proyecto
│   ├── urls.py              # Enrutamiento principal
│   ├── asgi.py
│   └── wsgi.py
├── gastos/
│   ├── migrations/          # Migraciones de Django
│   ├── models.py            # Modelos: Gasto y Categoría
│   ├── serializers.py       # Validaciones y serialización de datos
│   ├── views.py             # Lógica de los endpoints (ViewSets)
│   ├── urls.py              # Rutas de la app gastos
│   ├── admin.py             # Registro en el panel de administración
│   └── apps.py
├── gestor_db.sql            # Script SQL para crear la base de datos
├── manage.py
├── requirements.txt         # Dependencias del proyecto
└── README.md
```

---

## 📊 Relaciones de base de datos

```
categorias (1) ────────────< (N) gastos

Una categoría puede tener muchos gastos.
Un gasto pertenece a exactamente una categoría.

ON DELETE RESTRICT  →  No se puede eliminar una categoría que tenga gastos asociados.
ON UPDATE CASCADE   →  Si el ID de una categoría cambia, se actualiza en todos sus gastos.
```

---

## 🗄️ Categorías iniciales

El script `gestor_db.sql` inserta automáticamente estas categorías al crear la base de datos:

| ID | Nombre |
|----|--------|
| 1 | Alimentación |
| 2 | Transporte |
| 3 | Entretenimiento |
| 4 | Salud |
| 5 | Servicios |

---

## ⚙️ Variables clave en `settings.py`

| Variable | Valor por defecto | Descripción |
|----------|-------------------|-------------|
| `DEBUG` | `True` | Cambiar a `False` en producción |
| `CORS_ALLOW_ALL_ORIGINS` | `True` | Permite peticiones desde el frontend |
| `PAGE_SIZE` | `10` | Cantidad de registros por página |

---

## 🛠️ Comandos de referencia rápida

```bash
# Activar entorno virtual
.venv\Scripts\activate          # Windows
source .venv/bin/activate       # macOS / Linux

# Instalar dependencias
pip install -r requirements.txt

# Migraciones
python manage.py makemigrations
python manage.py migrate

# Iniciar servidor de desarrollo
python manage.py runserver

# Guardar dependencias actuales
pip freeze > requirements.txt
```
