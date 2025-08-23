import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, Home, FileText, DollarSign } from 'lucide-react'

interface KPICardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  description: string
  trend?: string
}

function KPICard({ title, value, icon, description, trend }: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
          {trend && <span className="text-green-600 ml-1">{trend}</span>}
        </p>
      </CardContent>
    </Card>
  )
}

export default async function AdminDashboard() {
  const cookieStore = await cookies()

  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  // Obtener todos los KPIs en paralelo para mejor performance
  const [
    totalUsersResult,
    pendingUsersResult,
    soldFractionsResult,
    availableFractionsResult,
    contractsByStatusResult
  ] = await Promise.all([
    // Total usuarios registrados
    supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact', head: true }),
    
    // Usuarios pendientes de aprobación
    supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'PENDIENTE'),
    
    // Fracciones vendidas
    supabaseAdmin
      .from('propiedad_alfa')
      .select('fraction_number', { count: 'exact', head: true })
      .eq('status', 'VENDIDA'),
    
    // Fracciones disponibles
    supabaseAdmin
      .from('propiedad_alfa')
      .select('fraction_number', { count: 'exact', head: true })
      .eq('status', 'DISPONIBLE'),
    
    // Contratos por estado
    supabaseAdmin
      .from('contracts')
      .select('status')
  ])

  // Procesar datos de contratos por estado
  const contractsData = contractsByStatusResult.data || []
  const contractStats = contractsData.reduce((acc, contract) => {
    acc[contract.status] = (acc[contract.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalContracts = contractsData.length
  const activeContracts = (contractStats['ENVIADO'] || 0) + (contractStats['FIRMADO'] || 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Administración</h1>
        <p className="text-muted-foreground">
          Resumen de métricas clave del proyecto de inversión fraccionada
        </p>
      </div>

      {/* Grid de KPIs principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Usuarios"
          value={totalUsersResult.count || 0}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Usuarios registrados"
        />
        
        <KPICard
          title="Usuarios Pendientes"
          value={pendingUsersResult.count || 0}
          icon={<UserCheck className="h-4 w-4 text-yellow-600" />}
          description="Esperando aprobación"
        />
        
        <KPICard
          title="Fracciones Vendidas"
          value={soldFractionsResult.count || 0}
          icon={<Home className="h-4 w-4 text-green-600" />}
          description="Unidades vendidas"
        />
        
        <KPICard
          title="Fracciones Disponibles"
          value={availableFractionsResult.count || 0}
          icon={<Home className="h-4 w-4 text-blue-600" />}
          description="Unidades disponibles"
        />
      </div>

      {/* Grid de métricas secundarias */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <KPICard
          title="Contratos Totales"
          value={totalContracts}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          description="Contratos generados"
        />
        
        <KPICard
          title="Contratos Activos"
          value={activeContracts}
          icon={<FileText className="h-4 w-4 text-green-600" />}
          description="Enviados y firmados"
        />
        
        <KPICard
          title="Tasa de Conversión"
          value={totalUsersResult.count ? `${Math.round((soldFractionsResult.count || 0) / (totalUsersResult.count || 1) * 100)}%` : '0%'}
          icon={<DollarSign className="h-4 w-4 text-purple-600" />}
          description="Usuarios a ventas"
        />
      </div>

      {/* Desglose de contratos por estado */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Contratos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{contractStats['BORRADOR'] || 0}</div>
              <div className="text-sm text-muted-foreground">Borradores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{contractStats['ENVIADO'] || 0}</div>
              <div className="text-sm text-muted-foreground">Enviados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{contractStats['FIRMADO'] || 0}</div>
              <div className="text-sm text-muted-foreground">Firmados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{contractStats['CANCELADO'] || 0}</div>
              <div className="text-sm text-muted-foreground">Cancelados</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}