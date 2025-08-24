import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, FileText, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default async function CopropietarioDashboard() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/acceder');
  }

  // 1. Obtenemos el perfil del usuario para obtener su ID interno y nombre
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, first_name')
    .eq('user_id', user.id)
    .single();
  
  if (!profile) {
    // Si no hay perfil, algo está mal. Lo sacamos por seguridad.
    await supabase.auth.signOut();
    return redirect('/acceder');
  }

  // 2. Usamos el ID del perfil para buscar las fracciones que le pertenecen
  const { data: fractions } = await supabase
    .from('propiedad_alfa')
    .select('fraction_number')
    .eq('owner_id', profile.id);

  // 3. Obtenemos los detalles generales de la Propiedad Alfa
  const { data: details } = await supabase
    .from('propiedad_alfa_details')
    .select('estimated_delivery_date, project_name')
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Bienvenido de vuelta, {profile.first_name}!
        </h1>
        <p className="text-muted-foreground">Este es el centro de control de tu inversión en el paraíso.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Home size={20} /> Mis Fracciones</CardTitle>
            <CardDescription>Tus activos en {details?.project_name || 'Propiedad Alfa'}.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {fractions && fractions.length > 0 ? (
              fractions.map(f => <Badge key={f.fraction_number} variant="secondary">Fracción #{f.fraction_number}</Badge>)
            ) : (
              <p className="text-sm text-muted-foreground">Aún no tienes fracciones asignadas.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hitos del Proyecto</CardTitle>
             <CardDescription>Fechas clave de tu propiedad.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Fecha de Entrega Estimada:
              <span className="font-semibold ml-2">
                {details?.estimated_delivery_date ? new Date(details.estimated_delivery_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Por definir'}
              </span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Accesos Rápidos</CardTitle>
                <CardDescription>Navega a las secciones importantes.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
                <Link href="/copropietario/contratos" className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"><FileText size={16} /> Ver Mis Contratos</Link>
                <Link href="/copropietario/documentos" className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"><FileText size={16} /> Ir a Mi Bóveda</Link>
                <Link href="/copropietario/perfil" className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"><UserCircle size={16} /> Actualizar Mi Perfil</Link>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}