import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DocumentDownloadButton from '@/components/documents/DocumentDownloadButton'; // Crearemos este componente

export default async function DocumentosPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/acceder');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    return <div>Error: Perfil no encontrado.</div>;
  }

  // Obtenemos todos los documentos asignados a este perfil, excluyendo los contratos
  const { data: documents } = await supabase
    .from('documents')
    .select('id, file_name, category, storage_path, created_at')
    .eq('profile_id', profile.id)
    .neq('category', 'CONTRATO') // Excluimos los contratos
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mi Bóveda</h1>
      <Card>
        <CardHeader>
          <CardTitle>Mis Documentos</CardTitle>
          <CardDescription>
            Aquí encontrarás todos tus documentos importantes, como reportes financieros y reglamentos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre del Documento</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Fecha de Subida</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents && documents.length > 0 ? (
                documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.file_name}</TableCell>
                    <TableCell>{doc.category}</TableCell>
                    <TableCell>{new Date(doc.created_at).toLocaleDateString('es-ES')}</TableCell>
                    <TableCell className="text-right">
                      <DocumentDownloadButton storagePath={doc.storage_path} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Aún no tienes documentos asignados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}