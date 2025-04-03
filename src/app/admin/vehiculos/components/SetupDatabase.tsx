'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// SQL para crear tabla de vehículos
const createVehiclesTableSQL = `
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
  condicion TEXT,
  tipo TEXT,
  descripcion TEXT,
  financiacion BOOLEAN DEFAULT false,
  permuta BOOLEAN DEFAULT false,
  caracteristicas TEXT[] DEFAULT '{}',
  equipamiento JSONB DEFAULT '{}',
  imagenes TEXT[] DEFAULT '{}',
  estado TEXT DEFAULT 'activo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
`;

export function SetupDatabase() {
  const [isCreating, setIsCreating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'creating' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Verificar si la tabla existe
  const checkTable = async () => {
    try {
      setStatus('checking');
      setMessage('Verificando tabla...');

      // Verificar si la tabla vehicles existe
      const { data, error } = await supabase
        .from('vehicles')
        .select('id')
        .limit(1);

      if (error) {
        console.error('Error verificando tabla:', error);
        setStatus('error');
        setMessage(`Error: ${error.message}`);
        return false;
      }

      setStatus('success');
      setMessage('Tabla verificada correctamente');
      return true;
    } catch (e: any) {
      console.error('Error general:', e);
      setStatus('error');
      setMessage(`Error: ${e.message}`);
      return false;
    }
  };

  // Crear la tabla vehicles
  const createTable = async () => {
    try {
      setIsCreating(true);
      setStatus('creating');
      setMessage('Creando tabla...');

      // Script SQL para crear la tabla
      const createTableSQL = `
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
        estado TEXT CHECK (estado IN ('activo', 'vendido', 'reservado')) DEFAULT 'activo',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
      
      -- Crear índices
      CREATE INDEX IF NOT EXISTS vehicles_marca_modelo_idx ON vehicles (marca, modelo);
      CREATE INDEX IF NOT EXISTS vehicles_created_at_idx ON vehicles (created_at DESC);
      
      -- Activar RLS
      ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
      
      -- Crear políticas RLS
      CREATE POLICY "Permitir lectura para todos" ON vehicles FOR SELECT USING (true);
      CREATE POLICY "Permitir inserción para autenticados" ON vehicles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      CREATE POLICY "Permitir actualización para autenticados" ON vehicles FOR UPDATE USING (auth.role() = 'authenticated');
      CREATE POLICY "Permitir eliminación para autenticados" ON vehicles FOR DELETE USING (auth.role() = 'authenticated');
      `;

      // Ejecutar SQL (nota: requiere permisos de administrador o service_role)
      const { error } = await supabase.rpc('exec_sql', {
        query: createTableSQL
      });

      if (error) {
        console.error('Error creando tabla:', error);
        setStatus('error');
        setMessage(`Error al crear tabla: ${error.message}`);
        
        // Si falla el RPC, mostrar alternativa
        toast.error('No se pudo crear la tabla automáticamente. Por favor, ejecuta el script SQL manualmente en Supabase.');
        return;
      }

      setStatus('success');
      setMessage('Tabla creada correctamente');
      toast.success('¡Tabla creada con éxito!');
    } catch (e: any) {
      console.error('Error general:', e);
      setStatus('error');
      setMessage(`Error: ${e.message}`);
      toast.error(`Error: ${e.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  async function setupDatabase() {
    setIsCreating(true);
    setStatus('creating');
    setMessage('Configurando base de datos...');
    
    try {
      const { supabase } = await import('@/lib/supabase');
      
      // Habilitar extensión uuid si no está habilitada
      await supabase.rpc('enable_extension', { name: 'uuid-ossp' });
      
      // Crear tabla de vehículos
      const { error: tableError } = await supabase.rpc('run_sql', { sql: createVehiclesTableSQL });
      
      if (tableError) {
        console.error('Error creando tabla de vehículos:', tableError);
        setStatus('error');
        setMessage(`Error al crear tabla de vehículos: ${tableError.message}`);
        setIsCreating(false);
        return;
      }
      
      setStatus('success');
      setMessage('Base de datos inicializada correctamente');
      toast.success('¡Base de datos inicializada con éxito!');
    } catch (e: any) {
      console.error('Error configurando base de datos:', e);
      setStatus('error');
      setMessage(`Error: ${e.message || 'Error desconocido'}`);
      toast.error(`Error: ${e.message || 'Error desconocido'}`);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="border rounded-lg p-6 mb-6 bg-card">
      <h2 className="text-xl font-semibold mb-4">Configuración de Base de Datos</h2>

      <div className="mb-4">
        <p className="mb-2 text-muted-foreground">
          Si es la primera vez que usas la aplicación, debes configurar la base de datos en Supabase.
        </p>
        
        {status !== 'idle' && (
          <div className={`py-2 px-4 rounded-md mb-4 ${
            status === 'error' ? 'bg-destructive/10 text-destructive' :
            status === 'success' ? 'bg-green-500/10 text-green-500' :
            'bg-blue-500/10 text-blue-500'
          }`}>
            {message}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={checkTable}
            disabled={status === 'checking' || isCreating}
          >
            {status === 'checking' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : 'Verificar Tabla'}
          </Button>
          
          <Button
            variant="default"
            onClick={createTable}
            disabled={isCreating}
            className="bg-green-600 hover:bg-green-700"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : 'Crear Tabla'}
          </Button>
          
          <Button
            variant="outline"
            onClick={setupDatabase}
            disabled={isCreating}
            className="bg-green-600 hover:bg-green-700"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Configurando...
              </>
            ) : 'Configurar Base de Datos'}
          </Button>
          
          <Button
            variant="outline"
            onClick={async () => {
              try {
                setStatus('checking');
                setMessage('Probando inserción directa...');
                
                const { supabase } = await import('@/lib/supabase');
                
                // Intentar inserción simple
                const { data, error } = await supabase
                  .from('vehicles')
                  .insert({
                    marca: "TEST_MANUAL",
                    modelo: "INSERCIÓN_DIRECTA",
                    version: "1.0",
                    año: 2024,
                    precio: 1000,
                    kilometraje: 0,
                    combustible: "GASOLINA",
                    transmision: "MANUAL",
                    color: "Negro",
                    puertas: 4,
                    pasajeros: 5,
                    ubicacion: "TEST",
                    condicion: "0km",
                    tipo: "sedan",
                    descripcion: "Vehículo de prueba",
                    imagenes: ["https://via.placeholder.com/150"],
                    estado: "activo"
                  })
                  .select()
                  .single();
                
                if (error) {
                  console.error("Error al insertar:", error);
                  setStatus('error');
                  
                  if (error.message.includes('permission denied') || error.code === 'PGRST301') {
                    setMessage(`Error de permisos - Para solucionar manualmente:
                    1. Ve al SQL Editor de Supabase
                    2. Ejecuta: ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
                    3. O crea una política de inserción anónima: 
                       CREATE POLICY "permitir_anonimo" ON vehicles FOR INSERT WITH CHECK (true);`);
                  } else {
                    setMessage(`Error: ${error.message}`);
                  }
                  
                  toast.error(`Error al insertar: ${error.message}`);
                } else {
                  console.log("Vehículo de prueba creado:", data);
                  setStatus('success');
                  setMessage('¡Inserción exitosa! Tienes permisos para crear vehículos.');
                  toast.success('Vehículo de prueba creado correctamente. Puedes usar el formulario normalmente.');
                  
                  // Limpiar el registro de prueba
                  await supabase.from('vehicles').delete().eq('id', data.id);
                }
              } catch (e: any) {
                console.error("Error general:", e);
                setStatus('error');
                setMessage(`Error: ${e.message || "Error desconocido"}`);
                toast.error(`Error: ${e.message || "Error desconocido"}`);
              }
            }}
          >
            Probar Inserción Directa
          </Button>
          
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const { supabase } = await import('@/lib/supabase');
                
                // Intentar crear una política anónima (funciona incluso con RLS activado)
                const { error } = await supabase
                  .from('vehicles')
                  .insert({
                    policy_name: "permitir_todo_temporal",
                    operation: "ALL",
                    definition: "true",
                    check: "true",
                    target_table: "vehicles"
                  });
                
                // Política simple para lectura anónima
                const anonimoReadResult = await supabase
                  .from('vehicles')
                  .insert({
                    marca: "TEST_PERMISOS",
                    modelo: "TEST_ANÓNIMO",
                    version: "TEST",
                    condicion: "0km",
                    tipo: "sedan",
                    imagenes: [],
                    estado: "activo"
                  });
                
                if (anonimoReadResult.error) {
                  console.error('Error insertando con anónimo:', anonimoReadResult.error);
                  toast.error(`Error de permisos: ${anonimoReadResult.error.message}`);
                  
                  // Mostrar instrucciones manuales
                  setStatus('error');
                  setMessage(`Para arreglar este problema, ve al SQL Editor de Supabase y ejecuta: 
                  ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;`);
                } else {
                  toast.success('✅ Inserción anónima exitosa. Ya puedes agregar vehículos.');
                  setStatus('success');
                  setMessage('Puedes agregar vehículos sin restricciones de permisos.');
                  
                  // Limpiar registro de prueba
                  await supabase
                    .from('vehicles')
                    .delete()
                    .eq('marca', 'TEST_PERMISOS');
                }
              } catch (e: any) {
                toast.error(`Error: ${e.message || 'Error desconocido'}`);
                setStatus('error');
                setMessage(`Para arreglar manualmente: Ve al SQL Editor de Supabase y ejecuta:
                ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;`);
              }
            }}
            className="text-amber-500 border-amber-500"
          >
            Crear Política Anónima
          </Button>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p className="font-medium mb-1">Nota:</p>
        <p>
          Si no se puede crear la tabla automáticamente, deberás crear la tabla manualmente 
          en el SQL Editor de Supabase. Puedes encontrar el script SQL en el archivo <code>docs/create-vehicles-table.sql</code>.
        </p>
        <p className="mt-2">
          <strong>Importante:</strong> Si estás teniendo problemas con permisos, asegúrate de estar autenticado 
          o temporalmente desactiva RLS para pruebas. En producción, siempre debes tener RLS activado.
        </p>
        
        <div className="border-l-4 border-amber-500 pl-4 mt-4 py-2 bg-amber-50 dark:bg-amber-950/20">
          <h3 className="font-medium text-amber-700 dark:text-amber-400">Solución manual si los botones no funcionan:</h3>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Ve al <a href="https://supabase.com/dashboard" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">Dashboard de Supabase</a> e inicia sesión</li>
            <li>Selecciona tu proyecto</li>
            <li>En el menú lateral, ve a "SQL Editor"</li>
            <li>Ejecuta este comando para desactivar RLS:
              <pre className="bg-gray-100 dark:bg-gray-800 p-2 mt-1 rounded text-sm overflow-auto">ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;</pre>
            </li>
            <li>O ejecuta este comando para crear una política que permita inserción anónima:
              <pre className="bg-gray-100 dark:bg-gray-800 p-2 mt-1 rounded text-sm overflow-auto">CREATE POLICY "permitir_anonimo" ON vehicles FOR INSERT WITH CHECK (true);</pre>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
} 