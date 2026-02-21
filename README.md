# Backend - Gestor de Gastos API

Server Node.js + Express + Sequelize + MySQL

## 🚀 Instalación

### 1. Instalar dependencias
```bash
npm install
```

Se instalarán:
- `express` - Framework web
- `sequelize` - ORM para MySQL
- `mysql2` - Driver MySQL
- `cors` - CORS middleware
- `dotenv` - Variables de entorno
- `nodemon` - Auto-reload en desarrollo

### 2. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto con:

```env
DB_HOST=bef27zlg5ocbaklgbxot-mysql.services.clever-cloud.com
DB_NAME=bef27zlg5ocbaklgbxot
DB_USER=uhlruotyrhukat5x
DB_PASSWORD=Zh2rqSOeNXdzbDbyfUNR
DB_PORT=3306
PORT=3001
```

**Nota:** Ya existe `.env.example` como referencia

### 3. Iniciar el servidor

**Desarrollo (con auto-reload):**
```bash
npm run dev
```

**Producción:**
```bash
npm start
```

El servidor estará en: `http://localhost:3001`

---

## 📌 Endpoints

### GET /
```bash
curl http://localhost:3001/
```
Respuesta test del servidor

---

### 📂 Categorías

#### GET /api/categories
Obtener todas las categorías ordenadas alfabéticamente

```bash
curl http://localhost:3001/api/categories
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Alimentación",
    "created_at": "2024-02-19T10:00:00.000Z"
  }
]
```

#### POST /api/categories
Crear nueva categoría

```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Transporte"}'
```

**Request Body:**
```json
{
  "name": "Transporte"
}
```

**Response (201):**
```json
{
  "id": 2,
  "name": "Transporte",
  "created_at": "2024-02-19T11:00:00.000Z"
}
```

**Errores:**
- `400` - Nombre obligatorio
- `409` - Categoría ya existe
- `500` - Error del servidor

---

### 💰 Gastos

#### GET /api/expenses
Obtener gastos con filtrado, búsqueda, ordenamiento y paginación

**Query Parameters:**
- `page` (int, default: 1) - Número de página
- `limit` (int, default: 10) - Registros por página
- `sortBy` (string, default: "expense_date") - Campo: `expense_date`, `amount`, `description`
- `order` (string, default: "DESC") - `ASC` o `DESC`
- `category_id` (int, optional) - Filtrar por categoría
- `search` (string, optional) - Buscar en descripción

```bash
# Obtener primera página
curl "http://localhost:3001/api/expenses"

# Filtrar por categoría, ordenar por monto DESC
curl "http://localhost:3001/api/expenses?category_id=1&sortBy=amount&order=DESC"

# Buscar "almuerzo" en página 2
curl "http://localhost:3001/api/expenses?search=almuerzo&page=2&limit=5"
```

**Response:**
```json
{
  "total": 25,
  "page": 1,
  "totalPages": 3,
  "data": [
    {
      "id": 1,
      "description": "Almuerzo en restaurante",
      "amount": "45000.00",
      "expense_date": "2024-02-19T12:30:00.000Z",
      "category_id": 1,
      "category": {
        "id": 1,
        "name": "Alimentación"
      },
      "created_at": "2024-02-19T10:00:00.000Z",
      "updated_at": "2024-02-19T10:00:00.000Z"
    }
  ]
}
```

#### POST /api/expenses
Crear nuevo gasto

```bash
curl -X POST http://localhost:3001/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Almuerzo",
    "amount": 45000,
    "expense_date": "2024-02-19T12:30:00Z",
    "category_id": 1
  }'
```

**Request Body:**
```json
{
  "description": "string (required)",
  "amount": "number (required, > 0)",
  "expense_date": "ISO date (required)",
  "category_id": "integer (required)"
}
```

**Response (201):**
```json
{
  "id": 1,
  "description": "Almuerzo",
  "amount": "45000.00",
  "expense_date": "2024-02-19T12:30:00.000Z",
  "category_id": 1,
  "category": {
    "id": 1,
    "name": "Alimentación"
  },
  "created_at": "2024-02-19T10:00:00.000Z",
  "updated_at": "2024-02-19T10:00:00.000Z"
}
```

**Errores:**
- `400` - Campos obligatorios o monto inválido
- `409` - Gasto duplicado (mismo nombre y monto)
- `500` - Error del servidor

#### PUT /api/expenses/:id
Actualizar gasto existente

```bash
curl -X PUT http://localhost:3001/api/expenses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Almuerzo actualizado",
    "amount": 50000,
    "expense_date": "2024-02-19T13:00:00Z",
    "category_id": 1
  }'
```

**Response:**
```json
{
  "id": 1,
  "description": "Almuerzo actualizado",
  "amount": "50000.00",
  "category": {
    "id": 1,
    "name": "Alimentación"
  }
}
```

**Errores:**
- `404` - Gasto no encontrado
- `400` - Monto inválido
- `409` - Duplicado
- `500` - Error del servidor

#### DELETE /api/expenses/:id
Eliminar gasto

```bash
curl -X DELETE http://localhost:3001/api/expenses/1
```

**Response (200):**
```json
{
  "message": "Gasto eliminado correctamente"
}
```

**Errores:**
- `404` - Gasto no encontrado
- `500` - Error del servidor

---

## 🗂️ Estructura del Proyecto

```
backend/
├── controllers/
│   ├── categoryController.js     # Lógica GET y POST categorías
│   └── expenseController.js      # Lógica CRUD gastos
├── routes/
│   ├── categoryRoutes.js         # Rutas /api/categories
│   └── expenseRoutes.js          # Rutas /api/expenses
├── src/
│   ├── config/
│   │   └── db.js                 # Conexión Sequelize
│   ├── models/
│   │   ├── Category.js           # Modelo Category
│   │   ├── Expense.js            # Modelo Expense
│   │   └── index.js              # Relaciones entre modelos
│   └── app.js                    # Antiguo (usar server.js)
├── server.js                      # ⭐ PUNTO DE ENTRADA PRINCIPAL
├── package.json
├── .env                           # Variables de entorno
└── .env.example                   # Ejemplo de .env
```

---

## 🔌 Flujo de Requisitos

1. **Cliente (Frontend)** envía request a `http://localhost:3001/api/...`
2. **Server.js** inicia Express y conecta a BD
3. **Routes** reciben la requisición
4. **Controllers** procesa la lógica
5. **Models (Sequelize)** interactúan con MySQL
6. **Response** vuelve al cliente

---

## 🛠️ Comandos útiles

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev

# Iniciar en producción
npm start

# Test (si se configura)
npm test
```

---

## ⚙️ Configuración de BD

El proyecto usa **Sequelize** como ORM con **MySQL2** como driver.

En `server.js`:
```javascript
const { connectDB } = require('./src/config/db');

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
});
```

La conexión:
- Autentica con las credenciales de `.env`
- Sincroniza los modelos (crea/actualiza tablas automáticamente)
- Sale del proceso si hay error

---

## 🔍 Validaciones

### Backend valida:
- ✅ Campos obligatorios
- ✅ Monto > 0
- ✅ Fecha válida
- ✅ Categoría existente
- ✅ Prevención de duplicados

### Base de datos valida:
- ✅ CHECK (amount > 0)
- ✅ UNIQUE (description + amount)
- ✅ FOREIGN KEY (category_id existe)
- ✅ NOT NULL en campos obligatorios

---

## 📊 Relaciones de BD

```
categories (1) ----< (N) expenses

- 1 categoría puede tener muchos gastos
- 1 gasto pertenece a 1 categoría
- ON DELETE CASCADE: eliminar categoría elimina sus gastos
```

---

## 🐛 Debugging

### Logs del servidor:
```
✅ Conexión a MySQL exitosa
✅ Modelos sincronizados
🚀 Servidor corriendo en http://localhost:3001
```

### Ver errores de BD:
En `src/config/db.js` cambiar:
```javascript
logging: false,  // cambiar a console.log para ver queries
```

### Instalar herramientas de debugging
```bash
npm install --save-dev debug
```

---

## 🚀 Despliegue

Para producción:
1. Usar `npm start` en lugar de `npm run dev`
2. Configurar variables de entorno en el servidor
3. Usar un package como `pm2` para mantener el proceso vivo
4. Configurar un proxy reverso (nginx/apache)

```bash
npm install -g pm2
pm2 start server.js --name "gastos-api"
pm2 save
pm2 startup
```

---

## 📞 Soporte

- Revisar logs en consola
- Verificar conexión a BD
- Revisar variables de entorno (.env)
- Confirmar que puertos no estén en uso
