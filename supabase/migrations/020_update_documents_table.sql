-- Actualizar tabla documents para gestión completa de archivos

-- Agregar columnas faltantes
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS original_name TEXT,
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS mime_type TEXT,
ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Actualizar columnas existentes para que no sean nulas (excepto uploaded_by)
UPDATE documents SET 
  original_name = file_name WHERE original_name IS NULL;

UPDATE documents SET 
  file_size = 0 WHERE file_size IS NULL;

UPDATE documents SET 
  mime_type = 'application/octet-stream' WHERE mime_type IS NULL;

-- Hacer las columnas NOT NULL después de actualizar
ALTER TABLE documents 
ALTER COLUMN original_name SET NOT NULL,
ALTER COLUMN file_size SET NOT NULL,
ALTER COLUMN mime_type SET NOT NULL;

-- Crear nuevo tipo de categoría con más opciones
DO $$ 
BEGIN
    -- Verificar si el tipo existe y recrearlo
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_category_new') THEN
        DROP TYPE document_category_new CASCADE;
    END IF;
    
    CREATE TYPE document_category_new AS ENUM (
        'LEGAL', 'MARKETING', 'TECNICO', 'FINANCIERO', 'CONTRACTUAL', 'OTROS'
    );
END $$;

-- Migrar datos de categoría existentes
ALTER TABLE documents ADD COLUMN category_new document_category_new;

UPDATE documents SET category_new = 
  CASE 
    WHEN category::text = 'LEGAL' THEN 'LEGAL'::document_category_new
    WHEN category::text = 'FINANCIERO' THEN 'FINANCIERO'::document_category_new
    WHEN category::text = 'REGLAMENTO' THEN 'LEGAL'::document_category_new
    WHEN category::text = 'REPORTE' THEN 'TECNICO'::document_category_new
    WHEN category::text = 'CONTRATO' THEN 'CONTRACTUAL'::document_category_new
    WHEN category::text = 'PROSPECTO' THEN 'MARKETING'::document_category_new
    ELSE 'OTROS'::document_category_new
  END;

-- Eliminar columna antigua y renombrar la nueva
ALTER TABLE documents DROP COLUMN category;
ALTER TABLE documents RENAME COLUMN category_new TO category;
ALTER TABLE documents ALTER COLUMN category SET NOT NULL;

-- Eliminar el tipo antiguo
DROP TYPE IF EXISTS document_category CASCADE;

-- Renombrar el nuevo tipo
ALTER TYPE document_category_new RENAME TO document_category;

-- Crear índices adicionales
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_file_size ON documents(file_size);
CREATE INDEX IF NOT EXISTS idx_documents_mime_type ON documents(mime_type);

-- Actualizar políticas RLS para usar uploaded_by en lugar de profile_id
DROP POLICY IF EXISTS "Admin can view documents" ON documents;
DROP POLICY IF EXISTS "Admin can insert documents" ON documents;
DROP POLICY IF EXISTS "Admin can delete documents" ON documents;

-- Nuevas políticas RLS
CREATE POLICY "Admin can view documents" ON documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Admin can insert documents" ON documents
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Admin can delete documents" ON documents
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'ADMIN'
    )
  );

-- Actualizar comentarios
COMMENT ON TABLE documents IS 'Tabla para almacenar metadata de documentos subidos al sistema';
COMMENT ON COLUMN documents.file_name IS 'Nombre personalizado del archivo';
COMMENT ON COLUMN documents.original_name IS 'Nombre original del archivo subido';
COMMENT ON COLUMN documents.category IS 'Categoría del documento';
COMMENT ON COLUMN documents.storage_path IS 'Ruta del archivo en Supabase Storage';
COMMENT ON COLUMN documents.file_size IS 'Tamaño del archivo en bytes';
COMMENT ON COLUMN documents.mime_type IS 'Tipo MIME del archivo';
COMMENT ON COLUMN documents.uploaded_by IS 'Usuario que subió el documento';
COMMENT ON COLUMN documents.profile_id IS 'DEPRECATED: Usar uploaded_by en su lugar';