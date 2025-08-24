import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default async function BienvenidaPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/acceder')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('user_id', user.id)
    .single()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Bienvenido a Fractional Tulum, {profile?.first_name || 'Prospecto'}!
      </h1>
      <p className="text-muted-foreground mb-6">
        Este es tu portal exclusivo para explorar la oportunidad de convertirte en copropietario.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Tus Próximos Pasos</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Completa tu perfil y explora los documentos en la &quot;Sala de Datos&quot;.</li>
            <li>Agenda una llamada con nuestro equipo para resolver tus dudas.</li>
            <li>Finaliza tu inversión y accede a tu portal de copropietario.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}