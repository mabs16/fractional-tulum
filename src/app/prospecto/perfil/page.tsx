import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileForm } from './profile-form'

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string
  phone: string | null
  avatar_url: string | null
  created_at: string
}

export default async function MiPerfilPage() {
  const supabase = await createSupabaseServerClient()

  // Verificar autenticación
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/login')
  }

  // Obtener datos del perfil
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, email, phone, avatar_url, created_at')
    .eq('user_id', user.id)
    .single()

  if (profileError) {
    console.error('Error fetching profile:', profileError)
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error al cargar el perfil. Por favor, intenta de nuevo.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  )
}