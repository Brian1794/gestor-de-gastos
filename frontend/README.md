# 💸 Gestor de Gastos — Frontend

> Interfaz web desarrollada con **React 19** + **TypeScript** + **Tailwind CSS v4** + **Vite 8**

---

## 🧰 Tecnologías

| Tecnología | Versión |
|------------|---------|
| React | 19 |
| TypeScript | 5+ |
| Tailwind CSS | v4 |
| Vite | 8 (beta) |
| Axios | latest |

---

## 📋 Requisitos previos

- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Brian1794/gestor-de-gastos
cd gestor-de-gastos/frontend
```

### 2. Instalar dependencias

```bash
npm install --legacy-peer-deps
```

> ⚠️ Se usa `--legacy-peer-deps` por compatibilidad con Vite 8 beta.

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La app estará disponible en: **http://localhost:5173**

---

## ⚙️ Configuración

El frontend apunta al backend en `http://127.0.0.1:8000`. Si tu backend corre en otro puerto o host, actualiza la `baseURL` en:

```ts
// src/services/api.ts
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',  // <- cambia aquí
})
```

---

## 📌 Funcionalidades

### 💰 Gestión de Gastos
- ✅ Listar todos los gastos en tabla con paginación (10 por página)
- ✅ Crear nuevo gasto con formulario modal
- ✅ Editar gasto existente
- ✅ Eliminar gasto con confirmación
- ✅ Ver total de gastos en tiempo real

### 🔍 Filtros y Búsqueda
- ✅ Buscar por descripción
- ✅ Filtrar por categoría
- ✅ Limpiar filtros con un clic

### 📊 Ordenamiento
- ✅ Ordenar por Descripción
- ✅ Ordenar por Monto
- ✅ Ordenar por Fecha y Hora
- ✅ Ordenar por Categoría
- ✅ Orden ascendente / descendente al hacer clic en el encabezado

### 📂 Categorías
- ✅ Seleccionar categoría al crear/editar gasto
- ✅ Crear nueva categoría directamente desde el formulario

### ✅ Validaciones
- ✅ Descripción obligatoria
- ✅ Monto mayor que cero
- ✅ Fecha obligatoria
- ✅ Categoría obligatoria
- ✅ Manejo de errores del backend (duplicados, etc.)

---

## 🗂️ Estructura del proyecto

```

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

## 🔌 Conexión con el Backend

El archivo `src/services/api.ts` centraliza todas las llamadas a la API:

| Función | Método | Endpoint | Descripción |
|---------|--------|----------|-------------|
| `getCategorias()` | GET | `/api/categorias/` | Listar categorías |
| `createCategoria()` | POST | `/api/categorias/` | Crear categoría |
| `getGastos()` | GET | `/api/gastos/` | Listar gastos |
| `createGasto()` | POST | `/api/gastos/` | Crear gasto |
| `updateGasto()` | PUT | `/api/gastos/{id}/` | Editar gasto |
| `deleteGasto()` | DELETE | `/api/gastos/{id}/` | Eliminar gasto |
| `getTotalGastos()` | GET | `/api/gastos/total/` | Total de gastos |

---

## 🛠️ Comandos útiles

```bash
# Instalar dependencias
npm install --legacy-peer-deps

# Iniciar en desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de producción
npm run preview
```

---

## 🐛 Solución de problemas

**Pantalla en negro al iniciar:**
Abre la consola del navegador (F12) y revisa los errores en rojo.

**Error de CORS:**
Asegúrate de que el backend tenga `CORS_ALLOW_ALL_ORIGINS = True` en `settings.py` y que esté corriendo.

**Error de conexión al backend:**
Verifica que el backend esté corriendo en `http://127.0.0.1:8000` antes de iniciar el frontend.

**Dependencias con conflicto:**
Usa siempre `--legacy-peer-deps` al instalar nuevos paquetes:
```bash
npm install <paquete> --legacy-peer-deps
```