# Estructura de Base de Datos para Reportes de Mantenimiento (SQL Server)

## Análisis de la Estructura del Formulario

El formulario de `CrearReporte` contiene los siguientes grupos de datos:

1. **Información General** (Equipo y Sitio)
2. **Mediciones Eléctricas de Entrada** (3 tipos: FF, FN, Corriente)
3. **Mediciones Eléctricas de Salida** (3 tipos: FF, FN, Corriente)
4. **Datos Adicionales** (UPS, Batería, Temperatura)
5. **Observaciones**
6. **Imágenes de Referencia**

## Propuesta de Tablas Normalizadas (SQL Server)

### 1. Tabla: `reportes` (Principal)

```sql
CREATE TABLE reportes(
  idReporte UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  cliente NVARCHAR(255) NOT NULL, 
  direccion NVARCHAR(255) NOT NULL, 
  ciudad NVARCHAR(100) NOT NULL, 
  encargado NVARCHAR(255) NOT NULL,
  tipo NVARCHAR(20) NOT NULL CHECK (tipo IN ('Arranque', 'Entrega', 'Preventivo', 'Correctivo', 'Otro')),
  estado NVARCHAR(20) NOT NULL DEFAULT 'Borrador' CHECK(estado IN ('Completado', 'Borrador', 'Pendiente')),
  observaciones NVARCHAR(MAX),
  nombreRealizo NVARCHAR(255),
  nombreRecibio NVARCHAR(255),
  usuarioCreador NVARCHAR(255) NOT NULL,
  fechaRealizo DATE NOT NULL DEFAULT GETDATE(),
  fechaRecibio DATE NOT NULL DEFAULT GETDATE(),
  fechaCreacion DATE NOT NULL DEFAULT GETDATE(),
  fechaModificacion DATE NOT NULL DEFAULT GETDATE()
);

CREATE INDEX idx_cliente ON reportes(cliente);
CREATE INDEX idx_tipo ON reportes(tipo);
CREATE INDEX idx_estado ON reportes(estado);
CREATE INDEX idx_usuarioCreador ON reportes(usuarioCreador);
CREATE INDEX idx_fechaCreacion ON reportes(fechaCreacion);
```

### 2. Tabla: `equipos` (Información del Equipo/UPS)

```sql
CREATE TABLE equipos (
  idEquipo UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  idReporte UNIQUEIDENTIFIER NOT NULL,
  marca NVARCHAR(100) NOT NULL,
  modelo NVARCHAR(100) NOT NULL,
  nSerie NVARCHAR(100) NOT NULL UNIQUE,
  modeloBateria NVARCHAR(100),
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
  idMedicion UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  idReporte UNIQUEIDENTIFIER NOT NULL,
  tipo NVARCHAR(10) NOT NULL CHECK (tipo IN ('Entrada', 'Salida')),
  
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
  
  FOREIGN KEY (idReporte) REFERENCES reportes(idReporte) ON DELETE CASCADE,
  INDEX idx_idReporte (idReporte),
  INDEX idx_tipo (tipo)
);
```

### 4. Tabla: `datos_adicionales` (Parámetros de UPS)

```sql
CREATE TABLE datos_adicionales (
  idDato UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  idReporte UNIQUEIDENTIFIER NOT NULL,
  
  frecuenciaEntrada DECIMAL(5,2),
  frecuenciaSalida DECIMAL(5,2),
  porcentajeCarga DECIMAL(5,2),
  tensionBateria DECIMAL(6,2),
  corrienteBateria DECIMAL(6,2),
  temperaturaUPS DECIMAL(5,2),
  
  FOREIGN KEY (idReporte) REFERENCES reportes(idReporte) ON DELETE CASCADE,
  INDEX idx_idReporte (idReporte)
);
```

### 5. Tabla: `imagenes_referencia` (Archivos/URLs)

```sql
CREATE TABLE imagenes_referencia (
  idImagen UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  idReporte UNIQUEIDENTIFIER NOT NULL,
  nombreArchivo NVARCHAR(500) NOT NULL,
  urlArchivo NVARCHAR(1000) NOT NULL,
  tipoMime NVARCHAR(50),
  tamanio BIGINT,
  fechaSubida DATE NOT NULL DEFAULT GETDATE(),
  
  FOREIGN KEY (idReporte) REFERENCES reportes(idReporte) ON DELETE CASCADE,
  INDEX idx_idReporte (idReporte)
);
```

## Estructura Completa (SQL Server)

```sql
-- Tabla Principal
CREATE TABLE reportes(
  idReporte UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  cliente NVARCHAR(255) NOT NULL, 
  direccion NVARCHAR(255) NOT NULL, 
  ciudad NVARCHAR(100) NOT NULL, 
  encargado NVARCHAR(255) NOT NULL,
  tipo NVARCHAR(20) NOT NULL CHECK (tipo IN ('Arranque', 'Entrega', 'Preventivo', 'Correctivo', 'Otro')),
  estado NVARCHAR(20) NOT NULL DEFAULT 'Borrador' CHECK(estado IN ('Completado', 'Borrador', 'Pendiente')),
  observaciones NVARCHAR(MAX),
  nombreRealizo NVARCHAR(255),
  nombreRecibio NVARCHAR(255),
  usuarioCreador NVARCHAR(255) NOT NULL,
  fechaRealizo DATE NOT NULL DEFAULT GETDATE(),
  fechaRecibio DATE NOT NULL DEFAULT GETDATE(),
  fechaCreacion DATE NOT NULL DEFAULT GETDATE(),
  fechaModificacion DATE NOT NULL DEFAULT GETDATE()
);

CREATE INDEX idx_cliente ON reportes(cliente);
CREATE INDEX idx_tipo ON reportes(tipo);
CREATE INDEX idx_estado ON reportes(estado);
CREATE INDEX idx_usuarioCreador ON reportes(usuarioCreador);
CREATE INDEX idx_fechaCreacion ON reportes(fechaCreacion);

-- Tabla de Equipos
CREATE TABLE equipos (
  idEquipo UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  idReporte UNIQUEIDENTIFIER NOT NULL,
  marca NVARCHAR(100) NOT NULL,
  modelo NVARCHAR(100) NOT NULL,
  nSerie NVARCHAR(100) NOT NULL UNIQUE,
  modeloBateria NVARCHAR(100),
  cantidadBaterias INT,
  anioFabricacionBaterias INT,
  
  FOREIGN KEY (idReporte) REFERENCES reportes(idReporte) ON DELETE CASCADE,
  INDEX idx_idReporte (idReporte),
  INDEX idx_nSerie (nSerie)
);

-- Tabla de Mediciones Eléctricas
CREATE TABLE mediciones_electricas (
  idMedicion UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  idReporte UNIQUEIDENTIFIER NOT NULL,
  tipo NVARCHAR(10) NOT NULL CHECK (tipo IN ('Entrada', 'Salida')),
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
);

-- Tabla de Datos Adicionales
CREATE TABLE datos_adicionales (
  idDato UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  idReporte UNIQUEIDENTIFIER NOT NULL,
  frecuenciaEntrada DECIMAL(5,2),
  frecuenciaSalida DECIMAL(5,2),
  porcentajeCarga DECIMAL(5,2),
  tensionBateria DECIMAL(6,2),
  corrienteBateria DECIMAL(6,2),
  temperaturaUPS DECIMAL(5,2),
  
  FOREIGN KEY (idReporte) REFERENCES reportes(idReporte) ON DELETE CASCADE,
  INDEX idx_idReporte (idReporte)
);

-- Tabla de Imágenes
CREATE TABLE imagenes_referencia (
  idImagen UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  idReporte UNIQUEIDENTIFIER NOT NULL,
  nombreArchivo NVARCHAR(500) NOT NULL,
  urlArchivo NVARCHAR(1000) NOT NULL,
  tipoMime NVARCHAR(50),
  tamanio BIGINT,
  fechaSubida DATE NOT NULL DEFAULT GETDATE(),
  
  FOREIGN KEY (idReporte) REFERENCES reportes(idReporte) ON DELETE CASCADE,
  INDEX idx_idReporte (idReporte)
);

-- Trigger para actualizar fechaModificacion automáticamente
CREATE TRIGGER trg_UpdateFechaModificacion
ON reportes
AFTER UPDATE
AS
BEGIN
    UPDATE reportes
    SET fechaModificacion = GETDATE()
    FROM reportes r
    INNER JOIN inserted i ON r.idReporte = i.idReporte;
END;
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
| `usuarioCreador` | `reportes` | `usuarioCreador` |
| `nombreRealizo` | `reportes` | `nombreRealizo` |
| `nombreRecibio` | `reportes` | `nombreRecibio` |
| `fechaRealizo` | `reportes` | `fechaRealizo` |
| `fechaRecibio` | `reportes` | `fechaRecibio` |

## Tipos de Datos Utilizados

- **UNIQUEIDENTIFIER**: Identificadores únicos globales (GUID) para todas las claves primarias
- **NVARCHAR**: Cadenas de texto Unicode de longitud variable (cliente, marca, etc.)
- **NVARCHAR con CHECK**: Opciones fijas usando restricciones CHECK (tipo, estado)
- **DECIMAL**: Números con decimales para mediciones (6,2) = máx 9999.99
- **NVARCHAR(MAX)**: Para observaciones largas
- **DATE**: Fechas sin hora
- **BIGINT**: Tamaño de archivos
- **INT**: Cantidades y números enteros

## Notas Importantes

1. **Imágenes**: Se recomienda almacenar URLs/rutas en BD y archivos en storage (AWS S3, servidor de archivos, etc.)
2. **Reportes Duplicados**: Usar UNIQUEIDENTIFIER evita conflictos en sistemas distribuidos
3. **Auditoría**: Considerar agregar columna `usuarioId` para tracking de quién creó/modificó
4. **Borrador Automático**: La columna `fechaModificacion` se actualiza automáticamente con un trigger
5. **Unicode**: Se usa NVARCHAR para soporte completo de caracteres Unicode

## Alternativa: Tabla Desnormalizada (Menos Óptima)

Si prefieres una sola tabla (menos flexible pero más simple inicialmente):

```sql
CREATE TABLE reportes_completos (
  idReporte UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  cliente NVARCHAR(255),
  direccion NVARCHAR(255),
  ciudad NVARCHAR(100),
  encargado NVARCHAR(255),
  marca NVARCHAR(100),
  modelo NVARCHAR(100),
  nSerie NVARCHAR(100) UNIQUE,
  tipo NVARCHAR(20) CHECK (tipo IN ('Arranque', 'Entrega', 'Preventivo', 'Correctivo', 'Otro')),
  estado NVARCHAR(20) DEFAULT 'Borrador' CHECK (estado IN ('Completado', 'Borrador', 'Pendiente')),
  usuarioCreador NVARCHAR(255),
  nombreRealizo NVARCHAR(255),
  nombreRecibio NVARCHAR(255),
  
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
  ModeloBateria NVARCHAR(100), CantBaterias INT, AñoFabricacionBaterias INT,
  
  observaciones NVARCHAR(MAX),
  fechaRealizo DATE DEFAULT GETDATE(),
  fechaRecibio DATE DEFAULT GETDATE(),
  fechaCreacion DATE DEFAULT GETDATE(),
  fechaModificacion DATE DEFAULT GETDATE()
);
```

**⚠️ No recomendada**: Muchas columnas NULL, difícil de mantener y escalar.

---

**Recomendación**: Usar la estructura normalizada con 5 tablas para un proyecto profesional y escalable.
