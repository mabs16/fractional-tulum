'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getSecureDocumentUrlAction } from '@/app/actions/documents';
import { Download } from 'lucide-react';

export default function DocumentDownloadButton({ storagePath }: { storagePath: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    const result = await getSecureDocumentUrlAction(storagePath);

    if (result.success && result.url) {
      // Abrimos la URL segura en una nueva pestaña para iniciar la descarga
      window.open(result.url, '_blank');
    } else {
      // Aquí puedes añadir una notificación de error con un "toast"
      alert(result.error || 'No se pudo obtener el enlace de descarga.');
    }
    setIsLoading(false);
  };

  return (
    <Button onClick={handleDownload} disabled={isLoading} variant="outline" size="sm">
      <Download className="mr-2 h-4 w-4" />
      {isLoading ? 'Generando...' : 'Descargar'}
    </Button>
  );
}