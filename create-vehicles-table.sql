-- Crear la función handle_updated_at primero
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Verificar si la tabla vehicles existe
DO $$ 
DECLARE
    table_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'vehicles'
    ) INTO table_exists;

    IF NOT table_exists THEN
        -- Crear la tabla vehicles
        CREATE TABLE public.vehicles (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            marca TEXT NOT NULL,
            modelo TEXT NOT NULL,
            version TEXT,
            año INTEGER,
            kilometraje INTEGER,
            precio DECIMAL(10,2),
            condicion TEXT CHECK (condicion IN ('nuevo', 'usado')),
            estado TEXT CHECK (estado IN ('disponible', 'vendido', 'reservado')),
            tipo TEXT CHECK (tipo IN ('auto', 'camioneta', 'suv', 'comercial')),
            transmision TEXT CHECK (transmision IN ('manual', 'automatica')),
            combustible TEXT CHECK (combustible IN ('nafta', 'diesel', 'gnc', 'electrico', 'hibrido')),
            traccion TEXT CHECK (traccion IN ('4x2', '4x4', 'awd')),
            puertas INTEGER CHECK (puertas IN (2, 3, 4, 5)),
            asientos INTEGER CHECK (asientos BETWEEN 2 AND 9),
            color_exterior TEXT,
            color_interior TEXT,
            motor TEXT,
            potencia INTEGER,
            torque INTEGER,
            consumo TEXT,
            equipamiento TEXT[],
            seguridad TEXT[],
            confort TEXT[],
            multimedia TEXT[],
            descripcion TEXT,
            imagenes TEXT[],
            destacado BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        -- Crear índices
        CREATE INDEX idx_vehicles_estado ON public.vehicles(estado);
        CREATE INDEX idx_vehicles_condicion ON public.vehicles(condicion);
        CREATE INDEX idx_vehicles_tipo ON public.vehicles(tipo);
        CREATE INDEX idx_vehicles_created_at ON public.vehicles(created_at);

        -- Habilitar RLS
        ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

        -- Crear políticas de seguridad
        CREATE POLICY "Permitir lectura pública de vehículos"
            ON public.vehicles FOR SELECT
            USING (true);

        CREATE POLICY "Permitir inserción a usuarios autenticados"
            ON public.vehicles FOR INSERT
            WITH CHECK (auth.role() = 'authenticated');

        CREATE POLICY "Permitir actualización a usuarios autenticados"
            ON public.vehicles FOR UPDATE
            USING (auth.role() = 'authenticated');

        CREATE POLICY "Permitir eliminación a usuarios autenticados"
            ON public.vehicles FOR DELETE
            USING (auth.role() = 'authenticated');

        -- Crear trigger para actualizar updated_at
        CREATE TRIGGER set_updated_at
            BEFORE UPDATE ON public.vehicles
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_updated_at();

        -- Insertar algunos vehículos de ejemplo
        INSERT INTO public.vehicles (
            marca, modelo, version, año, kilometraje, precio, condicion, estado, tipo,
            transmision, combustible, traccion, puertas, asientos, color_exterior,
            color_interior, motor, potencia, torque, consumo, equipamiento,
            seguridad, confort, multimedia, descripcion, imagenes, destacado
        ) VALUES
        (
            'Toyota', 'Hilux', 'SRV 4x4', 2023, 0, 45000000, 'nuevo', 'disponible', 'camioneta',
            'automatica', 'diesel', '4x4', 4, 5, 'Blanco',
            'Negro', '2.8L Turbo Diesel', 204, 500, '7.8L/100km', 
            ARRAY['Luces LED', 'Espejos eléctricos', 'Sensores de estacionamiento'],
            ARRAY['ABS', 'ESP', 'Airbags frontales y laterales', 'Control de estabilidad'],
            ARRAY['Aire acondicionado', 'Dirección asistida', 'Asientos tapizados'],
            ARRAY['Radio AM/FM', 'Bluetooth', 'USB', 'Apple CarPlay'],
            'Toyota Hilux SRV 4x4 2023, la pick-up más completa del segmento.',
            ARRAY['https://example.com/hilux1.jpg', 'https://example.com/hilux2.jpg'],
            true
        ),
        (
            'Volkswagen', 'Amarok', 'V6', 2023, 0, 52000000, 'nuevo', 'disponible', 'camioneta',
            'automatica', 'diesel', '4x4', 4, 5, 'Negro',
            'Negro', '3.0L V6 TDI', 258, 580, '8.2L/100km',
            ARRAY['Luces LED', 'Espejos eléctricos', 'Sensores de estacionamiento'],
            ARRAY['ABS', 'ESP', 'Airbags frontales y laterales', 'Control de estabilidad'],
            ARRAY['Aire acondicionado', 'Dirección asistida', 'Asientos tapizados'],
            ARRAY['Radio AM/FM', 'Bluetooth', 'USB', 'Apple CarPlay'],
            'Volkswagen Amarok V6 2023, potencia y versatilidad en su máxima expresión.',
            ARRAY['https://example.com/amarok1.jpg', 'https://example.com/amarok2.jpg'],
            true
        );

        RAISE NOTICE 'Tabla vehicles creada exitosamente con datos de ejemplo.';
    ELSE
        RAISE NOTICE 'La tabla vehicles ya existe.';
    END IF;
END $$;

-- Asegurarse de que las políticas de seguridad estén correctamente configuradas
DO $$ 
BEGIN
    -- Eliminar políticas existentes para evitar duplicados
    DROP POLICY IF EXISTS "Permitir lectura pública de vehículos" ON public.vehicles;
    DROP POLICY IF EXISTS "Permitir inserción a usuarios autenticados" ON public.vehicles;
    DROP POLICY IF EXISTS "Permitir actualización a usuarios autenticados" ON public.vehicles;
    DROP POLICY IF EXISTS "Permitir eliminación a usuarios autenticados" ON public.vehicles;
    
    -- Crear políticas de seguridad actualizadas
    CREATE POLICY "Permitir lectura pública de vehículos"
        ON public.vehicles FOR SELECT
        USING (true);

    CREATE POLICY "Permitir inserción a usuarios autenticados"
        ON public.vehicles FOR INSERT
        WITH CHECK (auth.role() = 'authenticated');

    CREATE POLICY "Permitir actualización a usuarios autenticados"
        ON public.vehicles FOR UPDATE
        USING (auth.role() = 'authenticated');

    CREATE POLICY "Permitir eliminación a usuarios autenticados"
        ON public.vehicles FOR DELETE
        USING (auth.role() = 'authenticated');
        
    RAISE NOTICE 'Políticas de seguridad actualizadas correctamente.';
END $$; 