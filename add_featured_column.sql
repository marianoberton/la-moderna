-- Script para agregar la columna is_featured a la tabla vehicles
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Actualiza cualquier registro existente que tenga 'featured' en true
UPDATE vehicles 
SET is_featured = true 
WHERE featured = true;

-- Nota: Después de verificar que todo funciona correctamente, 
-- puedes eliminar la columna 'featured' si ya no es necesaria usando:
-- ALTER TABLE vehicles DROP COLUMN featured; 