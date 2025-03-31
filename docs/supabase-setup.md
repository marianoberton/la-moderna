# Configuración de Supabase para La Moderna

Este documento explica cómo configurar la base de datos en Supabase para el proyecto de La Moderna.

## Paso 1: Crear una cuenta en Supabase

1. Ve a [Supabase](https://supabase.com/) y crea una cuenta si aún no tienes una.
2. Crea un nuevo proyecto proporcionando un nombre y una contraseña segura.
3. Espera a que se inicialice el proyecto.

## Paso 2: Configurar las variables de entorno

1. En el panel de Supabase, ve a "Configuración" y luego a "API".
2. Copia la URL del proyecto y la clave anónima.
3. Crea un archivo `.env.local` en la raíz del proyecto basado en `.env.example` y pega los valores:

```
NEXT_PUBLIC_SUPABASE_URL=tu-url-del-proyecto
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anónima
```

## Paso 3: Configurar la base de datos

### Tabla `vehicles`

Crea una tabla llamada `vehicles` con la siguiente estructura:

| Columna         | Tipo             | Configuración            |
|-----------------|------------------|--------------------------|
| id              | uuid             | Primary Key, Default: gen_random_uuid() |
| marca           | text             | NOT NULL                 |
| modelo          | text             | NOT NULL                 |
| version         | text             | NOT NULL                 |
| año             | integer          | NOT NULL                 |
| precio          | integer          | NOT NULL                 |
| kilometraje     | integer          | NOT NULL                 |
| combustible     | text             | NOT NULL                 |
| transmision     | text             | NOT NULL                 |
| color           | text             |                          |
| puertas         | integer          | NOT NULL                 |
| pasajeros       | integer          | NOT NULL                 |
| ubicacion       | text             | NOT NULL                 |
| condicion       | text             | NOT NULL                 |
| tipo            | text             | NOT NULL                 |
| descripcion     | text             |                          |
| financiacion    | boolean          | NOT NULL, Default: false |
| permuta         | boolean          | NOT NULL, Default: false |
| caracteristicas | text[]           | NOT NULL, Default: {}    |
| equipamiento    | jsonb            | NOT NULL, Default: {}    |
| imagenes        | text[]           | NOT NULL, Default: {}    |
| estado          | text             | NOT NULL, Default: 'activo' |
| created_at      | timestamp with time zone | NOT NULL, Default: now() |
| updated_at      | timestamp with time zone | NOT NULL, Default: now() |

Para crear la tabla, puedes usar el Editor SQL en Supabase con la siguiente consulta:

```sql
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

-- Índices para mejorar el rendimiento
CREATE INDEX idx_vehicles_marca ON vehicles(marca);
CREATE INDEX idx_vehicles_modelo ON vehicles(modelo);
CREATE INDEX idx_vehicles_condicion ON vehicles(condicion);
CREATE INDEX idx_vehicles_estado ON vehicles(estado);
```

## Paso 4: Configurar Políticas de Seguridad (RLS)

Para permitir la lectura pública pero restringir la escritura a usuarios autenticados:

```sql
-- Habilitar RLS en la tabla
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública
CREATE POLICY "Vehicles are viewable by everyone" 
ON vehicles FOR SELECT USING (true);

-- Política para crear/editar/eliminar solo por usuarios autenticados
CREATE POLICY "Vehicles are editable by authenticated users" 
ON vehicles FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
```

## Paso 5: Configurar almacenamiento para imágenes

1. Ve a "Storage" en el panel de Supabase.
2. Crea un nuevo bucket llamado `vehicle-images`.
3. Configura las políticas de acceso:

```sql
-- Permitir lectura pública de imágenes
CREATE POLICY "Vehicle images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'vehicle-images');

-- Permitir carga de imágenes solo a usuarios autenticados
CREATE POLICY "Only authenticated users can upload vehicle images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'vehicle-images' AND
  auth.role() = 'authenticated'
);

-- Permitir actualización/eliminación solo a usuarios autenticados
CREATE POLICY "Only authenticated users can update vehicle images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'vehicle-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Only authenticated users can delete vehicle images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'vehicle-images' AND
  auth.role() = 'authenticated'
);
```

## Paso 6: Autenticación

Para la gestión de usuarios y autenticación, puedes configurar el método que prefieras (email, OAuth, magic link) desde la sección "Authentication" del panel de Supabase.

## Paso 7: Prueba

1. Instala las dependencias de Supabase:

```bash
npm install @supabase/supabase-js
```

2. Ejecuta la aplicación:

```bash
npm run dev
```

3. Verifica que puedes acceder al panel de administración y realizar operaciones CRUD. 