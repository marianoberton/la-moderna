-- Creación de la tabla vehicles
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  version TEXT,
  año INTEGER,
  precio INTEGER,
  kilometraje INTEGER,
  combustible TEXT,
  transmision TEXT,
  color TEXT,
  puertas INTEGER,
  pasajeros INTEGER,
  ubicacion TEXT,
  condicion TEXT CHECK (condicion IN ('0km', 'usado')),
  tipo TEXT CHECK (tipo IN ('sedan', 'suv', 'pickup', 'hatchback', 'coupe', 'cabriolet')),
  descripcion TEXT,
  financiacion BOOLEAN DEFAULT false,
  permuta BOOLEAN DEFAULT false,
  caracteristicas TEXT[] DEFAULT '{}',
  equipamiento JSONB DEFAULT '{}',
  imagenes TEXT[] DEFAULT '{}',
  estado TEXT CHECK (estado IN ('activo', 'vendido', 'reservado', 'en_pausa')) DEFAULT 'activo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Creación de índice para búsqueda por marca y modelo
CREATE INDEX IF NOT EXISTS vehicles_marca_modelo_idx ON vehicles (marca, modelo);

-- Creación de índice para búsqueda por condición
CREATE INDEX IF NOT EXISTS vehicles_condicion_idx ON vehicles (condicion);

-- Creación de índice para búsqueda por estado
CREATE INDEX IF NOT EXISTS vehicles_estado_idx ON vehicles (estado);

-- Creación de índice para búsqueda por año
CREATE INDEX IF NOT EXISTS vehicles_año_idx ON vehicles (año);

-- Creación de índice para ordenamiento por fecha de creación
CREATE INDEX IF NOT EXISTS vehicles_created_at_idx ON vehicles (created_at DESC);

-- Política RLS: Permitir lectura para todos
CREATE POLICY "Permitir lectura para todos" ON vehicles
  FOR SELECT USING (true);

-- Política RLS: Permitir inserción, actualización y eliminación solo para usuarios autenticados
CREATE POLICY "Permitir inserción para autenticados" ON vehicles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir actualización para autenticados" ON vehicles
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir eliminación para autenticados" ON vehicles
  FOR DELETE USING (auth.role() = 'authenticated');

-- Activar RLS para la tabla
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY; 