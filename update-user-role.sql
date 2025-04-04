-- Script para actualizar el rol del usuario a 'authenticated'
-- Este script debe ejecutarse en la consola SQL de Supabase

-- Verificar si el usuario existe
DO $$ 
DECLARE
    user_exists boolean;
BEGIN
    -- Verificar si el usuario existe en la tabla auth.users
    SELECT EXISTS (
        SELECT FROM auth.users 
        WHERE email = 'admin@lamoderna.com' -- Reemplazar con el email del usuario
    ) INTO user_exists;

    IF user_exists THEN
        -- Actualizar el rol del usuario a 'authenticated'
        UPDATE auth.users
        SET raw_app_meta_data = jsonb_set(
            COALESCE(raw_app_meta_data, '{}'::jsonb),
            '{role}',
            '"authenticated"'
        )
        WHERE email = 'admin@lamoderna.com'; -- Reemplazar con el email del usuario
        
        RAISE NOTICE 'Rol del usuario actualizado a authenticated.';
    ELSE
        RAISE NOTICE 'El usuario no existe en la tabla auth.users.';
    END IF;
END $$; 