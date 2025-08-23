import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MoreHorizontal } from 'lucide-react'
import { updateUserRoleAction } from '@/app/actions/admin'
import { Profile, UserRole } from '@/lib/supabase'

// Componente para el formulario de actualización de rol
function RoleUpdateForm({ userId, currentRole }: { userId: string; currentRole: UserRole }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Gestionar Rol</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {currentRole !== 'COPROPIETARIO' && (
          <DropdownMenuItem asChild>
            <form action={async () => {
              'use server'
              await updateUserRoleAction(userId, 'COPROPIETARIO')
            }}>
              <button type="submit" className="w-full text-left">
                Aprobar como Copropietario
              </button>
            </form>
          </DropdownMenuItem>
        )}
        {currentRole !== 'PROSPECTO' && (
          <DropdownMenuItem asChild>
            <form action={async () => {
              'use server'
              await updateUserRoleAction(userId, 'PROSPECTO')
            }}>
              <button type="submit" className="w-full text-left">
                Aprobar como Prospecto
              </button>
            </form>
          </DropdownMenuItem>
        )}
        {currentRole !== 'ADMIN' && (
          <DropdownMenuItem asChild>
            <form action={async () => {
              'use server'
              await updateUserRoleAction(userId, 'ADMIN')
            }}>
              <button type="submit" className="w-full text-left">
                Hacer Administrador
              </button>
            </form>
          </DropdownMenuItem>
        )}
        {currentRole !== 'PENDIENTE' && (
          <DropdownMenuItem asChild>
            <form action={async () => {
              'use server'
              await updateUserRoleAction(userId, 'PENDIENTE')
            }}>
              <button type="submit" className="w-full text-left">
                Regresar a Pendiente
              </button>
            </form>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Función para obtener el color del badge según el rol
function getRoleBadgeVariant(role: UserRole) {
  switch (role) {
    case 'ADMIN':
      return 'destructive'
    case 'COPROPIETARIO':
      return 'default'
    case 'PROSPECTO':
      return 'secondary'
    case 'PENDIENTE':
      return 'outline'
    default:
      return 'outline'
  }
}

export default async function AdminUsersPage() {
  const cookieStore = await cookies()

  // Crear cliente de Supabase para server component
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Obtener todos los usuarios de la tabla profiles
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>
        <div className="text-red-500">Error al cargar los usuarios: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <div className="text-sm text-muted-foreground">
          Total: {users?.length || 0} usuarios
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Fecha de Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users && users.length > 0 ? (
              users.map((user: Profile) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.first_name && user.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user.first_name || user.last_name || 'Sin nombre'}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || 'No especificado'}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell className="text-right">
                    <RoleUpdateForm userId={user.user_id} currentRole={user.role} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No hay usuarios registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}