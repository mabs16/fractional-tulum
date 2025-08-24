import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import DocumentDownloadButton from '@/components/documents/DocumentDownloadButton'; // Reutilizamos este componente

// Tipo para los documentos del contrato
type ContractDocument = {
  storage_path?: string;
};

type ContractDocuments = ContractDocument | ContractDocument[];

export default async function MisContratosPage() {
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

  // Obtenemos los contratos del usuario.
  // Hacemos un "JOIN" implícito para obtener el storage_path del documento asociado.
  const { data: contracts } = await supabase
    .from('contracts')
    .select(`
      id,
      fraction_id,
      status,
      created_at,
      documents (
        storage_path
      )
    `)
    .eq('buyer_id', profile.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mis Contratos</h1>
      <Card>
        <CardHeader>
          <CardTitle>Historial de Contratos</CardTitle>
          <CardDescription>
            Aquí encontrarás todos tus contratos de compra-venta firmados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fracción No.</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de Creación</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts && contracts.length > 0 ? (
                contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">#{contract.fraction_id}</TableCell>
                    <TableCell>
                      <Badge variant={contract.status === 'FIRMADO' ? 'default' : 'secondary'}>
                        {contract.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(contract.created_at).toLocaleDateString('es-ES')}</TableCell>
                    <TableCell className="text-right">
                      {(() => {
                        const docs = contract.documents as ContractDocuments;
                        if (Array.isArray(docs) && docs.length > 0 && docs[0]?.storage_path) {
                          return <DocumentDownloadButton storagePath={docs[0].storage_path} />;
                        } else if (docs && !Array.isArray(docs) && docs.storage_path) {
                          return <DocumentDownloadButton storagePath={docs.storage_path} />;
                        } else {
                          return <span>No disponible</span>;
                        }
                      })()} 
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Aún no tienes contratos registrados.
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