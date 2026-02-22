-- Crear base de datos con codificación moderna
CREATE DATABASE IF NOT EXISTS gestor_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gestor_db;

-- =====================================
-- Tabla: categorias
-- =====================================

CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  nombre VARCHAR(100) NOT NULL UNIQUE,
  
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================
-- Tabla: gastos
-- =====================================

CREATE TABLE gastos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  descripcion VARCHAR(255) NOT NULL,
  
  monto DECIMAL(10, 2) NOT NULL,
  
  fecha_gasto DATETIME NOT NULL,
  
  categoria_id INT NOT NULL,
  
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
    ON UPDATE CURRENT_TIMESTAMP,

  -- Validación de monto positivo
  CONSTRAINT chk_monto_positivo CHECK (monto > 0),

  -- Relación con categorias
  CONSTRAINT fk_gasto_categoria
    FOREIGN KEY (categoria_id)
    REFERENCES categorias(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  -- Prevención razonable de duplicados
  CONSTRAINT unique_gasto 
    UNIQUE (descripcion, monto, fecha_gasto),

  -- Índices para rendimiento
  INDEX idx_fecha_gasto (fecha_gasto),
  INDEX idx_categoria_id (categoria_id),
  INDEX idx_monto (monto)

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