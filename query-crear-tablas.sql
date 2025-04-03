-- Tabla de vehículos
CREATE TABLE vehicles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  marca text NOT NULL,
  modelo text NOT NULL,
  version text NOT NULL,
  año integer NOT NULL,
  precio integer NOT NULL,
  kilometraje integer NOT NULL,
  combustible text NOT NULL,
  transmision text NOT NULL,
  color text,
  puertas integer NOT NULL,
  pasajeros integer NOT NULL,
  ubicacion text NOT NULL,
  condicion text NOT NULL,
  tipo text NOT NULL,
  descripcion text,
  financiacion boolean NOT NULL DEFAULT false,
  permuta boolean NOT NULL DEFAULT false,
  caracteristicas text[] NOT NULL DEFAULT '{}',
  equipamiento jsonb NOT NULL DEFAULT '{}',
  imagenes text[] NOT NULL DEFAULT '{}',
  estado text NOT NULL DEFAULT 'activo',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Índices para mejorar el rendimiento de búsquedas frecuentes
CREATE INDEX idx_vehicles_marca ON vehicles(marca);
CREATE INDEX idx_vehicles_modelo ON vehicles(modelo);
CREATE INDEX idx_vehicles_condicion ON vehicles(condicion);
CREATE INDEX idx_vehicles_estado ON vehicles(estado);
CREATE INDEX idx_vehicles_precio ON vehicles(precio);
CREATE INDEX idx_vehicles_año ON vehicles(año);

-- Tabla de consultas/contactos 
CREATE TABLE contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre text NOT NULL,
  email text NOT NULL,
  telefono text NOT NULL,
  mensaje text NOT NULL,
  vehicle_id uuid REFERENCES vehicles(id),
  estado text NOT NULL DEFAULT 'pendiente',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla de vehículos

-- Política para que cualquiera pueda ver los vehículos
CREATE POLICY "Vehicles are viewable by everyone" 
ON vehicles FOR SELECT USING (true);

-- Política para que solo usuarios autenticados puedan modificar vehículos
CREATE POLICY "Vehicles are editable by authenticated users" 
ON vehicles FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Vehicles are updatable by authenticated users" 
ON vehicles FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Vehicles are deletable by authenticated users" 
ON vehicles FOR DELETE 
USING (auth.role() = 'authenticated');

-- Políticas para la tabla de contactos

-- Política para que cualquiera pueda crear contactos (enviar mensajes)
CREATE POLICY "Anyone can create contacts" 
ON contacts FOR INSERT 
WITH CHECK (true);

-- Política para que solo usuarios autenticados puedan ver y modificar contactos
CREATE POLICY "Contacts are viewable by authenticated users" 
ON contacts FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Contacts are updatable by authenticated users" 
ON contacts FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Contacts are deletable by authenticated users" 
ON contacts FOR DELETE 
USING (auth.role() = 'authenticated');

-- Configuración para almacenamiento de imágenes

-- Este bloque debe ejecutarse desde la interfaz de usuario de Supabase:
-- 1. Crear un bucket llamado 'vehicle-images'
-- 2. Marcar la opción 'Public bucket'
-- 3. Luego crear las siguientes políticas:

/* Políticas para el almacenamiento (ejecutar en la UI de Supabase)

-- Permitir lectura pública de imágenes
CREATE POLICY "Vehicle images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'vehicle-images');

-- Permitir subida de imágenes para usuarios autenticados
CREATE POLICY "Vehicle images can be uploaded by authenticated users"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'vehicle-images' AND auth.role() = 'authenticated');

-- Permitir actualización de imágenes para usuarios autenticados
CREATE POLICY "Vehicle images can be updated by authenticated users"
ON storage.objects FOR UPDATE
USING (bucket_id = 'vehicle-images' AND auth.role() = 'authenticated');

-- Permitir eliminación de imágenes para usuarios autenticados
CREATE POLICY "Vehicle images can be deleted by authenticated users"
ON storage.objects FOR DELETE
USING (bucket_id = 'vehicle-images' AND auth.role() = 'authenticated');
*/

-- Crear un usuario de prueba para administración (ejecutar en la UI de Supabase)
-- Ir a Authentication > Users > Add User
-- Email: admin@lamoderna.com
-- Password: [contraseña segura] 