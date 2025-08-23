'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Trash2, Download, Upload, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { uploadDocumentAction, deleteDocumentAction } from '@/app/actions/admin'
import { supabase } from '@/lib/supabase'

type DocumentCategory = 'LEGAL' | 'MARKETING' | 'TECNICO' | 'FINANCIERO' | 'CONTRACTUAL' | 'OTROS'

interface Document {
  id: string
  file_name: string
  original_name: string
  category: DocumentCategory
  storage_path: string
  file_size: number
  mime_type: string
  created_at: string
  uploaded_by: string
}

const categoryLabels: Record<DocumentCategory, string> = {
  LEGAL: 'Legal',
  MARKETING: 'Marketing',
  TECNICO: 'Técnico',
  FINANCIERO: 'Financiero',
  CONTRACTUAL: 'Contractual',
  OTROS: 'Otros'
}

const categoryColors: Record<DocumentCategory, string> = {
  LEGAL: 'bg-blue-100 text-blue-800',
  MARKETING: 'bg-green-100 text-green-800',
  TECNICO: 'bg-purple-100 text-purple-800',
  FINANCIERO: 'bg-yellow-100 text-yellow-800',
  CONTRACTUAL: 'bg-red-100 text-red-800',
  OTROS: 'bg-gray-100 text-gray-800'
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function DocumentosPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState('')
  const [category, setCategory] = useState<DocumentCategory | ''>('')

  // supabase is already imported

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching documents:', error)
        toast.error('Error al cargar los documentos')
        return
      }

      setDocuments(data || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
      toast.error('Error al cargar los documentos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!fileName) {
        // Auto-llenar el nombre del archivo sin la extensión
        const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '')
        setFileName(nameWithoutExtension)
      }
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile || !fileName.trim() || !category) {
      toast.error('Por favor complete todos los campos')
      return
    }

    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('file_name', fileName.trim())
      formData.append('category', category)

      const result = await uploadDocumentAction(formData)
      
      if (result.success) {
        toast.success('Documento subido exitosamente')
        // Limpiar formulario
        setSelectedFile(null)
        setFileName('')
        setCategory('')
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement
        if (fileInput) fileInput.value = ''
        // Recargar documentos
        await fetchDocuments()
      } else {
        toast.error(result.error || 'Error al subir el documento')
      }
    } catch (error) {
      console.error('Error uploading document:', error)
      toast.error('Error al subir el documento')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (documentId: string, fileName: string) => {
    if (!confirm(`¿Está seguro de que desea eliminar el documento "${fileName}"?`)) {
      return
    }

    try {
      const result = await deleteDocumentAction(documentId)
      
      if (result.success) {
        toast.success('Documento eliminado exitosamente')
        await fetchDocuments()
      } else {
        toast.error(result.error || 'Error al eliminar el documento')
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      toast.error('Error al eliminar el documento')
    }
  }

  const handleDownload = async (doc: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(doc.storage_path)

      if (error) {
        toast.error('Error al descargar el documento')
        return
      }

      // Crear URL para descarga
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = doc.original_name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading document:', error)
      toast.error('Error al descargar el archivo')
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Documentos</h1>
        <p className="text-gray-600">Administra los documentos del proyecto</p>
      </div>

      {/* Formulario de subida */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Subir Nuevo Documento
          </CardTitle>
          <CardDescription>
            Sube documentos relacionados con el proyecto. Tamaño máximo: 50MB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="file-input">Archivo</Label>
                <Input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp,.zip,.rar"
                  required
                />
                {selectedFile && (
                  <p className="text-sm text-gray-500">
                    Archivo seleccionado: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file-name">Nombre del Documento</Label>
                <Input
                  id="file-name"
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Nombre descriptivo del documento"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={category} onValueChange={(value: DocumentCategory) => setCategory(value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" disabled={uploading} className="w-full md:w-auto">
              {uploading ? 'Subiendo...' : 'Subir Documento'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tabla de documentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentos Existentes
          </CardTitle>
          <CardDescription>
            Lista de todos los documentos subidos al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Cargando documentos...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay documentos subidos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Tamaño</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">{doc.file_name}</p>
                          <p className="text-sm text-gray-500">{doc.original_name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={categoryColors[doc.category]}>
                          {categoryLabels[doc.category]}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                      <TableCell>{formatDate(doc.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                            className="h-8 w-8 p-0"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(doc.id, doc.file_name)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}