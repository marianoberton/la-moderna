-- Script para verificar y corregir perfiles de usuario

-- 1. Verificar si hay usuarios en auth.users que no tienen perfiles
SELECT au.id, au.email
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 2. Crear perfiles para usuarios que no los tienen
INSERT INTO profiles (id, email, name, role)
SELECT 
  au.id, 
  au.email, 
  COALESCE(au.raw_user_meta_data->>'name', 'Usuario'),
  COALESCE(au.raw_user_meta_data->>'role', 'viewer')
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 3. Verificar si hay perfiles con roles inválidos
SELECT id, email, role
FROM profiles
WHERE role NOT IN ('admin', 'editor', 'viewer');

-- 4. Corregir roles inválidos
UPDATE profiles
SET role = 'viewer'
WHERE role NOT IN ('admin', 'editor', 'viewer');

-- 5. Verificar si hay perfiles duplicados
SELECT id, COUNT(*) as count
FROM profiles
GROUP BY id
HAVING COUNT(*) > 1;

-- 6. Eliminar perfiles duplicados (mantener solo uno)
WITH duplicates AS (
  SELECT id, MIN(created_at) as min_created_at
  FROM profiles
  GROUP BY id
  HAVING COUNT(*) > 1
)
DELETE FROM profiles p
WHERE EXISTS (
  SELECT 1 FROM duplicates d
  WHERE p.id = d.id AND p.created_at > d.min_created_at
); 