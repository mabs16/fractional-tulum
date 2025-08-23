-- Crear tabla para gestión de documentos
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('LEGAL', 'MARKETING', 'TECNICO', 'FINANCIERO', 'CONTRACTUAL', 'OTROS')),
  storage_path TEXT NOT NULL UNIQUE,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);

-- Habilitar RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Política para que solo admins puedan ver documentos
CREATE POLICY "Admin can view documents" ON documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'ADMIN'
    )
  );

-- Política para que solo admins puedan insertar documentos
CREATE POLICY "Admin can insert documents" ON documents
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'ADMIN'
    )
  );

-- Política para que solo admins puedan eliminar documentos
CREATE POLICY "Admin can delete documents" ON documents
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'ADMIN'
    )
  );

-- Comentarios para documentación
COMMENT ON TABLE documents IS 'Tabla para almacenar metadata de documentos subidos al sistema';
COMMENT ON COLUMN documents.file_name IS 'Nombre personalizado del archivo';
COMMENT ON COLUMN documents.original_name IS 'Nombre original del archivo subido';
COMMENT ON COLUMN documents.category IS 'Categoría del documento';
COMMENT ON COLUMN documents.storage_path IS 'Ruta del archivo en Supabase Storage';
COMMENT ON COLUMN documents.file_size IS 'Tamaño del archivo en bytes';
COMMENT ON COLUMN documents.mime_type IS 'Tipo MIME del archivo';
COMMENT ON COLUMN documents.uploaded_by IS 'Usuario que subió el documento';