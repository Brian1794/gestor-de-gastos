# 💸 Gestor de Gastos

> Aplicación web full-stack para registrar, visualizar y gestionar gastos mensuales.

Sistema desarrollado como solución a una prueba técnica, enfocado en buenas prácticas de arquitectura, validación de datos, separación de responsabilidades y desarrollo full-stack moderno.

---

## 🧰 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
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
├── backend/
│   ├── core/
│   │   ├── __pycache__/
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── gastos/
│   │   ├── __pycache__/
│   │   ├── migrations/
│   │   │   ├── __pycache__/
│   │   │   ├── 0001_initial.py
│   │   │   └── __init__.py
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── gestor_db.sql
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   │   └── react.svg
    │   ├── components/
    │   │   └── GastoForm.tsx
    │   ├── pages/
    │   │   └── GastosPage.tsx
    │   ├── services/
    │   │   └── api.ts
    │   ├── App.css
    │   ├── App.tsx
    │   ├── index.css
    │   └── main.tsx
    ├── .gitignore
    ├── .hintrc
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    └── README.md
```

---

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Brian1794/gestor-de-gastos
cd gestor-de-gastos
```

### 2. Configuración del Backend y Frontend

Cada módulo del proyecto tiene su propio `README.md` con instrucciones detalladas de instalación, configuración y ejecución:

Esto permite mantener una separación clara de responsabilidades y documentación modular.

---

## 📊 Modelo de Datos

```
categorias
├── id               (PK)
├── nombre           (único)
└── fecha_creacion

gastos
├── id               (PK)
├── descripcion
├── monto            (> 0)
├── fecha_gasto
├── categoria_id     (FK → categorias)
├── fecha_creacion
└── fecha_actualizacion
```

---

## 🧑‍💻 Autor

Desarrollado por **Brian Gerardo Alfonso Rodríguez** como prueba técnica full-stack.

