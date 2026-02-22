# 💸 Gestor de Gastos

> Aplicación web full-stack para registrar, visualizar y gestionar gastos mensuales.

---

## 🧰 Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 19 + TypeScript + Tailwind CSS v4 + Vite 8 |
| Backend | Django 4.2 + Django REST Framework |
| Base de datos | MySQL / MariaDB 10.4+ |
| HTTP Client | Axios |

---

## 📌 Funcionalidades

- ✅ Registrar gastos con descripción, monto, fecha y categoría
- ✅ Listar gastos con paginación (10 por página)
- ✅ Editar y eliminar gastos
- ✅ Total de gastos en tiempo real
- ✅ Ordenar por cualquier columna (descripción, monto, fecha, categoría)
- ✅ Buscar por descripción
- ✅ Filtrar por categoría
- ✅ Crear nuevas categorías desde el formulario
- ✅ Prevención de gastos duplicados
- ✅ Validaciones en frontend y backend

---

## 🗂️ Estructura del Proyecto

```
gestor-de-gastos/
├── backend/                  # API REST con Django
│   ├── core/
│   │   ├── settings.py
│   │   └── urls.py
│   ├── gastos/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── gestor_db.sql         # Script SQL de la base de datos
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md
└── frontend/
    └── frontend/             # App React + TypeScript
        ├── src/
        │   ├── services/
        │   │   └── api.ts
        │   ├── components/
        │   │   └── GastoForm.tsx
        │   ├── pages/
        │   │   └── GastosPage.tsx
        │   ├── App.tsx
        │   └── index.css
        ├── vite.config.ts
        ├── package.json
        └── README.md
```

---

## 🚀 Instalación y ejecución

### Requisitos previos

- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [XAMPP](https://www.apachefriends.org/) o MySQL 8+ / MariaDB 10.4+
- [Git](https://git-scm.com/)

---

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/gestor-de-gastos.git
cd gestor-de-gastos
```

---

### 2. Configurar el Backend

```bash
cd backend

# Crear y activar entorno virtual
python -m venv .venv

# Windows
.venv\Scripts\activate

# Mac/Linux
source .venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

**Crear la base de datos** — abre phpMyAdmin o MySQL Workbench y ejecuta:

```bash
gestor_db.sql
```

**Configurar credenciales** en `core/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'gestor_db',
        'USER': 'root',       # tu usuario MySQL
        'PASSWORD': '',       # tu contraseña
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

**Aplicar migraciones e iniciar:**

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

✅ Backend disponible en: **http://127.0.0.1:8000**

---

### 3. Configurar el Frontend

```bash
cd ../frontend/frontend

# Instalar dependencias
npm install --legacy-peer-deps

# Iniciar
npm run dev
```

✅ Frontend disponible en: **http://localhost:5173**

---

## 🔗 Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/gastos/` | Listar gastos |
| POST | `/api/gastos/` | Crear gasto |
| PUT | `/api/gastos/{id}/` | Editar gasto |
| DELETE | `/api/gastos/{id}/` | Eliminar gasto |
| GET | `/api/gastos/total/` | Total de gastos |
| GET | `/api/categorias/` | Listar categorías |
| POST | `/api/categorias/` | Crear categoría |

---

## 📊 Modelo de datos

```
categorias
├── id (PK)
├── nombre (único)
└── fecha_creacion

gastos
├── id (PK)
├── descripcion
├── monto (> 0)
├── fecha_gasto
├── categoria_id (FK → categorias)
├── fecha_creacion
└── fecha_actualizacion
```

---

## 🐛 Solución de problemas

**El backend no conecta a MySQL:**
Verifica que XAMPP esté corriendo y que las credenciales en `settings.py` sean correctas.

**Error de CORS:**
Asegúrate de que `CORS_ALLOW_ALL_ORIGINS = True` esté en `settings.py`.

**Error de dependencias en el frontend:**
Usa `--legacy-peer-deps` al instalar paquetes por compatibilidad con Vite 8 beta.

**Pantalla en negro en el frontend:**
Abre la consola del navegador (F12) y revisa los errores en rojo.