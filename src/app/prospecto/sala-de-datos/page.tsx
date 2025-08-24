import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DownloadButton } from './download-button'

interface Document {
  id: string
  file_name: string
  storage_path: string
  category: string
  created_at: string
}

export default async function SalaDeDatosPage() {
  const supabase = await createSupabaseServerClient()

  // Consultar documentos públicos para prospectos (categoría MARKETING)
  const { data: documents, error } = await supabase
    .from('documents')
    .select('id, file_name, storage_path, category, created_at')
    .eq('category', 'MARKETING')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching documents:', error)
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Sala de Datos</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error al cargar los documentos. Por favor, intenta de nuevo.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Sala de Datos</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Documentos Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          {documents && documents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre del Documento</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document: Document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">
                      {document.file_name}
                    </TableCell>
                    <TableCell className="text-right">
                      <DownloadButton 
                        documentPath={document.storage_path}
                        documentName={document.file_name}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No hay documentos disponibles en este momento.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}