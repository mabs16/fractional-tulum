'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { getSecureDocumentUrlAction } from '@/app/actions/documents'
import { toast } from 'sonner'

interface DownloadButtonProps {
  documentPath: string
  documentName: string
}

export function DownloadButton({ documentPath, documentName }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    
    try {
      const result = await getSecureDocumentUrlAction(documentPath)
      
      if (result.success && result.url) {
        // Crear un enlace temporal para descargar el archivo
        const link = document.createElement('a')
        link.href = result.url
        link.download = documentName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast.success('Descarga iniciada correctamente')
      } else {
        toast.error(result.error || 'Error al generar el enlace de descarga')
      }
    } catch (error) {
      console.error('Error downloading document:', error)
      toast.error('Error al descargar el documento')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      size="sm"
      variant="outline"
    >
      <Download className="h-4 w-4 mr-2" />
      {isDownloading ? 'Descargando...' : 'Descargar'}
    </Button>
  )
}