-- Función para crear un perfil de usuario si no existe
CREATE OR REPLACE FUNCTION create_user_profile_if_not_exists(user_id UUID, user_email TEXT, user_name TEXT DEFAULT NULL, user_role TEXT DEFAULT 'viewer')
RETURNS BOOLEAN AS $$
DECLARE
  profile_exists BOOLEAN;
BEGIN
  -- Verificar si el perfil ya existe
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = user_id
  ) INTO profile_exists;
  
  -- Si el perfil no existe, crearlo
  IF NOT profile_exists THEN
    INSERT INTO profiles (id, email, name, role)
    VALUES (user_id, user_email, user_name, user_role);
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ejemplo de uso:
-- SELECT create_user_profile_if_not_exists('00000000-0000-0000-0000-000000000000', 'usuario@ejemplo.com', 'Nombre Usuario', 'admin'); 