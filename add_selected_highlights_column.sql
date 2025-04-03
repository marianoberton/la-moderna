-- Script para agregar la columna selected_highlights a la tabla vehicles
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS selected_highlights TEXT[] DEFAULT '{}';

-- Nota: Esta columna almacenará un array de textos con las características destacadas
-- seleccionadas manualmente para cada vehículo (hasta 3 elementos).
-- 
-- Ejemplo para actualizar un vehículo:
-- UPDATE vehicles SET selected_highlights = ARRAY['Aire acondicionado', 'Dirección asistida', 'Airbags'] WHERE id = '123'; 