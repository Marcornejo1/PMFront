# Estructura de Base de Datos para Reportes de Mantenimiento

## Análisis de la Estructura del Formulario

El formulario de `CrearReporte` contiene los siguientes grupos de datos:

1. **Información General** (Equipo y Sitio)
2. **Mediciones Eléctricas de Entrada** (3 tipos: FF, FN, Corriente)
3. **Mediciones Eléctricas de Salida** (3 tipos: FF, FN, Corriente)
4. **Datos Adicionales** (UPS, Batería, Temperatura)
5. **Observaciones**
6. **Imágenes de Referencia**

## Propuesta de Tablas Normalizadas

### 1. Tabla: `reportes` (Principal)

```sql
CREATE TABLE reportes (
  idReporte VARCHAR(50) PRIMARY KEY,
  cliente VARCHAR(255) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  encargado VARCHAR(255) NOT NULL,
  tipo ENUM('Preventivo', 'Correctivo', 'Emergencia', 'Instalación', 'Inspección') NOT NULL,
  estado ENUM('Completado', 'Borrador', 'Pendiente') NOT NULL DEFAULT 'Borrador',
  observaciones LONGTEXT,
  tecnico VARCHAR(255),
  usuarioCreador VARCHAR(255) NOT NULL,
  fechaCreacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fechaModificacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_cliente (cliente),
  INDEX idx_tipo (tipo),
  INDEX idx_estado (estado),
  INDEX idx_estadoCompletitud (estadoCompletitud),
  INDEX idx_usuarioCreador (usuarioCreador),
  INDEX idx_fechaCreacion (fechaCreacion)
);
```

### 2. Tabla: `equipos` (Información del Equipo/UPS)

```sql
CREATE TABLE equipos (
  idEquipo INT PRIMARY KEY AUTO_INCREMENT,
  idReporte VARCHAR(50) NOT NULL,
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  nSerie VARCHAR(100) NOT NULL UNIQUE,
  modeloBateria VARCHAR(100),
  cantidadBaterias INT,
  anioFabricacionBaterias INT,
  
  FOREIGN KEY (idReporte) REFERENCES reportes(idReporte) ON DELETE CASCADE,
  INDEX idx_idReporte (idReporte),
  INDEX idx_nSerie (nSerie)
);
```

### 3. Tabla: `mediciones_electricas` (Mediciones Entrada/Salida)

```sql
CREATE TABLE mediciones_electricas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reporteId INT NOT NULL,
  tipo ENUM('Entrada', 'Salida') NOT NULL,
  
  -- Tensión Fase-Fase
  tensionFFAB DECIMAL(6,2),
  tensionFFBC DECIMAL(6,2),
  tensionFFCA DECIMAL(6,2),
  
  -- Tensión Fase-Neutro
  tensionFNAN DECIMAL(6,2),
  tensionFNBN DECIMAL(6,2),
  tensionFNCN DECIMAL(6,2),
  
  -- Corriente
  corrienteA DECIMAL(6,2),
  corrienteB DECIMAL(6,2),
  corrienteC DECIMAL(6,2),
  
  FOREIGN KEY (reporteId) REFERENCES reportes(id) ON DELETE CASCADE,
  INDEX idx_reporteId (reporteId),
  INDEX idx_tipo (tipo)
);
```

### 4. Tabla: `datos_adicionales` (Parámetros de UPS)

```sql
CREATE TABLE datos_adicionales (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reporteId INT NOT NULL,
  
  frecuenciaEntrada DECIMAL(5,2),
  frecuenciaSalida DECIMAL(5,2),
  porcentajeCarga DECIMAL(5,2),
  
  tensionBateria DECIMAL(6,2),
  corrienteBateria DECIMAL(6,2),
  temperaturaUPS DECIMAL(5,2),
  
  FOREIGN KEY (reporteId) REFERENCES reportes(id) ON DELETE CASCADE,
  INDEX idx_reporteId (reporteId)
);
```

### 5. Tabla: `imagenes_referencia` (Archivos/URLs)

```sql
CREATE TABLE imagenes_referencia (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reporteId INT NOT NULL,
  nombreArchivo VARCHAR(500) NOT NULL,
  urlArchivo VARCHAR(1000) NOT NULL,
  tipoMime VARCHAR(50),
  tamanio BIGINT,
  fechaSubida DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (reporteId) REFERENCES reportes(id) ON DELETE CASCADE,
  INDEX idx_reporteId (reporteId)
);
```

## Estructura Completa (SQL)

```sql
-- Tabla Principal
CREATE TABLE reportes (
  idReporte VARCHAR(50) PRIMARY KEY,
  cliente VARCHAR(255) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  encargado VARCHAR(255) NOT NULL,
  tipo ENUM('Preventivo', 'Correctivo', 'Emergencia', 'Instalación', 'Inspección') NOT NULL,
  estado ENUM('Completado', 'Borrador', 'Pendiente') NOT NULL DEFAULT 'Borrador',
  estadoCompletitud ENUM('Completo', 'Parcial') NOT NULL DEFAULT 'Parcial',
  observaciones LONGTEXT,
  tecnico VARCHAR(255),
  usuarioCreador VARCHAR(255) NOT NULL,
  fechaCreacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fechaModificacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_cliente (cliente),
  INDEX idx_tipo (tipo),
  INDEX idx_estado (estado),
  INDEX idx_estadoCompletitud (estadoCompletitud),
  INDEX idx_usuarioCreador (usuarioCreador),
  INDEX idx_fechaCreacion (fechaCreacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Equipos
CREATE TABLE equipos (
  idEquipo INT PRIMARY KEY AUTO_INCREMENT,
  idReporte VARCHAR(50) NOT NULL,
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  nSerie VARCHAR(100) NOT NULL UNIQUE,
  modeloBateria VARCHAR(100),
  cantidadBaterias INT,
  anioFabricacionBaterias INT,
  
  FOREIGN KEY (idReporte) REFERENCES reportes(idReporte) ON DELETE CASCADE,
  INDEX idx_idReporte (idReporte),
  INDEX idx_nSerie (nSerie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Mediciones Eléctricas
CREATE TABLE mediciones_electricas (
  idMedicion INT PRIMARY KEY AUTO_INCREMENT,
  idReporte VARCHAR(50) NOT NULL,
  tipo ENUM('Entrada', 'Salida') NOT NULL,
  tensionFFAB DECIMAL(6,2),
  tensionFFBC DECIMAL(6,2),
  tensionFFCA DECIMAL(6,2),
  tensionFNAN DECIMAL(6,2),
  tensionFNBN DECIMAL(6,2),
  tensionFNCN DECIMAL(6,2),
  corrienteA DECIMAL(6,2),
  corrienteB DECIMAL(6,2),
  corrienteC DECIMAL(6,2),
  
  FOREIGN KEY (idReporte) REFERENCES reportes(idReporte) ON DELETE CASCADE,
  INDEX idx_idReporte (idReporte),
  INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Datos Adicionales
CREATE TABLE datos_adicionales (
  idDato INT PRIMARY KEY AUTO_INCREMENT,
  idReporte VARCHAR(50) NOT NULL,
  frecuenciaEntrada DECIMAL(5,2),
  frecuenciaSalida DECIMAL(5,2),
  porcentajeCarga DECIMAL(5,2),
  tensionBateria DECIMAL(6,2),
  corrienteBateria DECIMAL(6,2),
  temperaturaUPS DECIMAL(5,2),
  
  FOREIGN KEY (idReporte) REFERENCES reportes(idReporte) ON DELETE CASCADE,
  INDEX idx_idReporte (idReporte)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Imágenes
CREATE TABLE imagenes_referencia (
  idImagen INT PRIMARY KEY AUTO_INCREMENT,
  idReporte VARCHAR(50) NOT NULL,
  nombreArchivo VARCHAR(500) NOT NULL,
  urlArchivo VARCHAR(1000) NOT NULL,
  tipoMime VARCHAR(50),
  tamanio BIGINT,
  fechaSubida DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (idReporte) REFERENCES reportes(idReporte) ON DELETE CASCADE,
  INDEX idx_idReporte (idReporte)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Ventajas de Esta Estructura

| Aspecto | Beneficio |
|--------|-----------|
| **Normalización** | Elimina redundancia de datos |
| **Escalabilidad** | Fácil agregar nuevas mediciones o equipos |
| **Integridad** | FK garantiza consistencia entre tablas |
| **Consultas** | Índices optimizan búsquedas frecuentes |
| **Mantenimiento** | Cambios en una tabla no afectan otras |

## Mapeo FormData → Base de Datos

| FormData | Tabla | Campo |
|----------|-------|-------|
| `cliente` | `reportes` | `cliente` |
| `direccion` | `reportes` | `direccion` |
| `ciudad` | `reportes` | `ciudad` |
| `encargado` | `reportes` | `encargado` |
| `tipo` | `reportes` | `tipo` |
| `marca` | `equipos` | `marca` |
| `modelo` | `equipos` | `modelo` |
| `nSerie` | `equipos` | `nSerie` |
| `EnFFAB, EnFFBC, EnFFCA` | `mediciones_electricas` | tensiones FF (Entrada) |
| `EnFNAN, EnFNBN, ENFNCN` | `mediciones_electricas` | tensiones FN (Entrada) |
| `CorrA, CorrB, CorrC` | `mediciones_electricas` | corrientes (Entrada) |
| `SalFFAB, SalFFBC, SalFFCA` | `mediciones_electricas` | tensiones FF (Salida) |
| `SalFNAN, SalFNBN, SalFNCN` | `mediciones_electricas` | tensiones FN (Salida) |
| `CorrSalidaA, CorrSalidaB, CorrSalidaC` | `mediciones_electricas` | corrientes (Salida) |
| `FrecEntr, FrecSalid, PorCarga` | `datos_adicionales` | frecuencias y carga |
| `TenBateria, CorrBateria, TempUPS` | `datos_adicionales` | parámetros de batería/UPS |
| `ModeloBateria, CantBaterias, AñoFabricacionBaterias` | `equipos` | datos de batería |
| `Observaciones` | `reportes` | `observaciones` |
| `referenciaImages` | `imagenes_referencia` | URLs/archivos |
| **NEW** `usuarioCreador` | `reportes` | `usuarioCreador` |
| **NEW** `estadoCompletitud` | `reportes` | `estadoCompletitud` |

## Tipos de Datos Utilizados

- **VARCHAR**: Cadenas de texto de longitud variable (cliente, marca, etc.)
- **ENUM**: Opciones fijas (tipo, estado)
- **DECIMAL**: Números con decimales para mediciones (6,2) = máx 9999.99
- **LONGTEXT**: Para observaciones largas
- **DATETIME**: Timestamps de creación/modificación
- **BIGINT**: Tamaño de archivos
- **INT**: IDs y cantidades

## Notas Importantes

1. **Imágenes**: Se recomienda almacenar URLs/rutas en BD y archivos en storage (AWS S3, servidor de archivos, etc.)
2. **Reportes Duplicados**: Usar UUID en lugar de INT si se necesita distribuir entre servidores
3. **Auditoría**: Considerar agregar columna `usuarioId` para tracking de quién creó/modificó
4. **Borrador Automático**: La columna `fechaModificacion` se actualiza automáticamente

## Alternativa: Tabla Desnormalizada (Menos Óptima)

Si prefieres una sola tabla (menos flexible pero más simple inicialmente):

```sql
CREATE TABLE reportes_completos (
  idReporte VARCHAR(50) PRIMARY KEY,
  cliente VARCHAR(255),
  direccion VARCHAR(255),
  ciudad VARCHAR(100),
  encargado VARCHAR(255),
  marca VARCHAR(100),
  modelo VARCHAR(100),
  nSerie VARCHAR(100) UNIQUE,
  tipo ENUM(...),
  estado ENUM(...),
  estadoCompletitud ENUM('Completo', 'Parcial'),
  usuarioCreador VARCHAR(255),
  
  -- Mediciones entrada
  EnFFAB DECIMAL(6,2), EnFFBC DECIMAL(6,2), EnFFCA DECIMAL(6,2),
  EnFNAN DECIMAL(6,2), EnFNBN DECIMAL(6,2), ENFNCN DECIMAL(6,2),
  CorrA DECIMAL(6,2), CorrB DECIMAL(6,2), CorrC DECIMAL(6,2),
  
  -- Mediciones salida
  SalFFAB DECIMAL(6,2), SalFFBC DECIMAL(6,2), SalFFCA DECIMAL(6,2),
  SalFNAN DECIMAL(6,2), SalFNBN DECIMAL(6,2), SalFNCN DECIMAL(6,2),
  CorrSalidaA DECIMAL(6,2), CorrSalidaB DECIMAL(6,2), CorrSalidaC DECIMAL(6,2),
  
  -- Datos adicionales
  FrecEntr DECIMAL(5,2), FrecSalid DECIMAL(5,2), PorCarga DECIMAL(5,2),
  TenBateria DECIMAL(6,2), CorrBateria DECIMAL(6,2), TempUPS DECIMAL(5,2),
  ModeloBateria VARCHAR(100), CantBaterias INT, AñoFabricacionBaterias INT,
  
  observaciones LONGTEXT,
  tecnico VARCHAR(255),
  fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fechaModificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**⚠️ No recomendada**: Muchas columnas NULL, difícil de mantener y escalar.

---

**Recomendación**: Usar la estructura normalizada con 5 tablas para un proyecto profesional y escalable.
