-- Función para obtener perfiles duplicados
CREATE OR REPLACE FUNCTION get_duplicate_profiles()
RETURNS TABLE (
  id uuid,
  email text,
  role text,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.email, p.role, p.created_at
  FROM profiles p
  WHERE EXISTS (
    SELECT 1
    FROM profiles p2
    WHERE p2.email = p.email
    AND p2.id != p.id
  )
  ORDER BY p.email, p.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para eliminar perfiles duplicados
CREATE OR REPLACE FUNCTION delete_duplicate_profiles()
RETURNS integer AS $$
DECLARE
  deleted_count integer := 0;
BEGIN
  WITH duplicates AS (
    SELECT id,
           email,
           created_at,
           ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at) as rn
    FROM profiles
  )
  DELETE FROM profiles
  WHERE id IN (
    SELECT id
    FROM duplicates
    WHERE rn > 1
  )
  RETURNING 1;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear un perfil de usuario si no existe
CREATE OR REPLACE FUNCTION create_user_profile_if_not_exists(
  user_id uuid,
  user_email text,
  user_name text DEFAULT NULL,
  user_role text DEFAULT 'viewer'
)
RETURNS boolean AS $$
DECLARE
  profile_exists boolean;
BEGIN
  -- Verificar si el perfil ya existe
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = user_id
  ) INTO profile_exists;
  
  -- Si el perfil no existe, crearlo
  IF NOT profile_exists THEN
    INSERT INTO profiles (id, email, name, role)
    VALUES (
      user_id,
      user_email,
      COALESCE(user_name, 'Usuario'),
      CASE 
        WHEN user_role IN ('admin', 'editor', 'viewer') THEN user_role
        ELSE 'viewer'
      END
    );
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar y corregir roles inválidos
CREATE OR REPLACE FUNCTION fix_invalid_roles()
RETURNS integer AS $$
DECLARE
  fixed_count integer := 0;
BEGIN
  WITH invalid_roles AS (
    SELECT id
    FROM profiles
    WHERE role NOT IN ('admin', 'editor', 'viewer')
  )
  UPDATE profiles
  SET role = 'viewer'
  WHERE id IN (SELECT id FROM invalid_roles)
  RETURNING 1;
  
  GET DIAGNOSTICS fixed_count = ROW_COUNT;
  RETURN fixed_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar y corregir todos los problemas de perfiles
CREATE OR REPLACE FUNCTION fix_all_profile_issues()
RETURNS TABLE (
  users_without_profiles integer,
  invalid_roles_fixed integer,
  duplicates_removed integer
) AS $$
DECLARE
  users_fixed integer := 0;
  roles_fixed integer := 0;
  duplicates_fixed integer := 0;
BEGIN
  -- 1. Crear perfiles para usuarios que no los tienen
  WITH users_without_profiles AS (
    SELECT au.id, au.email, au.raw_user_meta_data
    FROM auth.users au
    WHERE NOT EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = au.id
    )
  )
  INSERT INTO profiles (id, email, name, role)
  SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'name', 'Usuario'),
    COALESCE(raw_user_meta_data->>'role', 'viewer')
  FROM users_without_profiles
  RETURNING 1;
  
  GET DIAGNOSTICS users_fixed = ROW_COUNT;
  
  -- 2. Corregir roles inválidos
  SELECT fix_invalid_roles() INTO roles_fixed;
  
  -- 3. Eliminar perfiles duplicados
  SELECT delete_duplicate_profiles() INTO duplicates_fixed;
  
  RETURN QUERY SELECT 
    users_fixed,
    roles_fixed,
    duplicates_fixed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 