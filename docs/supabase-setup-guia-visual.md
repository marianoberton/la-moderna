# Guía Visual para Configurar Supabase en La Moderna

Esta guía te mostrará paso a paso, con capturas visuales, cómo configurar Supabase para tu proyecto de La Moderna.

## 1. Crear una cuenta en Supabase

1. Ve a [https://supabase.com/](https://supabase.com/) y haz clic en "Sign Up" o "Start for free".
2. Regístrate con GitHub o Google para una configuración más rápida.
3. Una vez dentro, haz clic en "New Project".

![Crear nuevo proyecto](https://i.imgur.com/JZQQoLZ.png)

4. Completa los detalles del proyecto:
   - Nombre: "La Moderna"
   - Contraseña de base de datos: crea una contraseña segura
   - Región: elige la más cercana a tus usuarios (probablemente US East o South America)
   - Plan: Free tier

![Detalles del proyecto](https://i.imgur.com/Z55rUg1.png)

5. Haz clic en "Create new project" y espera a que se configure (puede tardar unos minutos).

## 2. Obtener y configurar las credenciales de API

1. Una vez creado el proyecto, ve al panel principal.
2. En la barra lateral izquierda, haz clic en "Project Settings" (ícono de engranaje en la parte inferior).
3. Selecciona "API" en el menú.
4. Aquí encontrarás:
   - URL del proyecto
   - Clave anónima (anon key)

![Credenciales API](https://i.imgur.com/xoTkdFv.png)

5. Copia estas credenciales.
6. En tu proyecto local, crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```
NEXT_PUBLIC_SUPABASE_URL=tu-url-del-proyecto
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anónima
```

## 3. Crear la tabla de vehículos

1. En el panel de Supabase, ve a "Table Editor" en la barra lateral.
2. Haz clic en "New Table".

![Nuevo tabla](https://i.imgur.com/N1hJgQg.png)

3. Configura la tabla:
   - Nombre: `vehicles`
   - Activa "Enable Row Level Security (RLS)"
   - Comienza con las columnas básicas (ID, created_at, etc.)

4. Luego, añade las columnas adicionales una por una. Para cada columna:
   - Haz clic en "Add column"
   - Ingresa el nombre de la columna
   - Selecciona el tipo de datos adecuado
   - Configura si es obligatorio (NOT NULL)
   - Establece valores por defecto si es necesario

![Configuración de columnas](https://i.imgur.com/HHYtvRv.png)

5. Alternativamente, puedes usar el Editor SQL:
   - Ve a "SQL Editor" en la barra lateral
   - Crea una nueva consulta
   - Pega y ejecuta el siguiente código:

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

![Editor SQL](https://i.imgur.com/r6aBvEL.png)

## 4. Configurar políticas de seguridad

1. Ve a la tabla "vehicles" en Table Editor.
2. Haz clic en "Policies" en la parte superior.
3. Haz clic en "New Policy".

![Nueva política](https://i.imgur.com/LI0c7Ps.png)

4. Configura la política para lectura pública:
   - Tipo de política: Selecciona "Select (read)" 
   - Nombre: "Vehicles are viewable by everyone"
   - Policy definition: Usar el template "Enable read access to everyone"
   - Usando el editor, confirma que la expresión es `true`

![Política de lectura](https://i.imgur.com/nR5HmNr.png)

5. Haz clic en "Save Policy".
6. Repite para crear políticas para Insert, Update y Delete, pero esta vez seleccionando "Authenticated users only" para cada una.

## 5. Configurar almacenamiento para imágenes

1. Ve a "Storage" en la barra lateral.
2. Haz clic en "New Bucket".
3. Nombra el bucket "vehicle-images" y activa "Public bucket" si deseas que las imágenes sean públicas.

![Nuevo bucket](https://i.imgur.com/Fh2mJu7.png)

4. Haz clic en "Create Bucket".
5. Una vez creado, haz clic en "Policies" para el bucket.
6. Configura políticas similares a las de la tabla:
   - Acceso de lectura para todos
   - Insert, Update y Delete solo para usuarios autenticados

## 6. Implementar CRUD en tu aplicación

Ya tienes implementado un servicio para manejar las operaciones CRUD en `src/services/vehicleService.ts`. Aquí hay ejemplos de cómo usar estas funciones:

### Obtener todos los vehículos

```typescript
import { getVehicles } from '@/services/vehicleService';

// En un componente React:
useEffect(() => {
  async function fetchVehicles() {
    try {
      const vehicles = await getVehicles();
      setVehicles(vehicles);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  fetchVehicles();
}, []);
```

### Crear un nuevo vehículo

```typescript
import { createVehicle } from '@/services/vehicleService';

// En un formulario de envío:
async function handleSubmit(formData) {
  try {
    const newVehicle = await createVehicle({
      marca: formData.marca,
      modelo: formData.modelo,
      version: formData.version,
      año: parseInt(formData.año),
      precio: parseInt(formData.precio),
      // ... resto de los campos
    });
    
    console.log('Vehículo creado:', newVehicle);
    // Redireccionar o actualizar la UI
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Subir imágenes

```typescript
import { uploadImage } from '@/services/vehicleService';

// En un componente de subida de archivos:
async function handleFileUpload(file) {
  try {
    const imageUrl = await uploadImage(file);
    console.log('Imagen subida:', imageUrl);
    // Añadir URL a un array de imágenes
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## 7. Crear una página de administración

Para acceder al CRUD, necesitas crear una interfaz de administración. Puedes usar el panel ya existente en `/admin/vehiculos` o crear uno nuevo:

1. Crea un formulario para añadir/editar vehículos con todos los campos necesarios
2. Implementa una tabla o grid para mostrar los vehículos existentes
3. Añade botones de editar y eliminar para cada vehículo
4. Implementa un sistema de subida de imágenes

## 8. Implementar autenticación

Para proteger el panel de administración:

1. Ve a "Authentication" en la barra lateral de Supabase
2. Configura el método de autenticación que prefieras (email, magic link, etc.)
3. Para desarrollo, puedes crear un usuario manualmente:
   - Ve a "Authentication" > "Users"
   - Haz clic en "Add User"
   - Ingresa email y contraseña

![Añadir usuario](https://i.imgur.com/bpLJmmu.png)

4. Luego, implementa la autenticación en tu aplicación usando las funciones de Supabase.

## Solución de problemas comunes

### "Error: Relation does not exist"
- Asegúrate de que el nombre de la tabla esté escrito correctamente (incluyendo mayúsculas/minúsculas)
- Verifica que la tabla se haya creado correctamente en el Table Editor

### "Error: Permission denied"
- Verifica que las políticas RLS estén configuradas correctamente
- Para operaciones de escritura, asegúrate de estar autenticado

### "Error al subir imágenes"
- Verifica que el bucket de almacenamiento exista
- Asegúrate de que las políticas de almacenamiento estén configuradas correctamente
- Verifica que el tamaño del archivo no exceda los límites

## Conclusión

¡Felicidades! Has configurado Supabase para tu proyecto La Moderna. Ahora puedes:

1. Almacenar información de vehículos en una base de datos segura
2. Subir y gestionar imágenes de vehículos
3. Proteger tu panel de administración con autenticación
4. Realizar operaciones CRUD en tus datos

Si necesitas más ayuda, consulta la [documentación oficial de Supabase](https://supabase.com/docs). 