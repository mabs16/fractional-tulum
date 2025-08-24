'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { toast } from 'sonner'
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import { getAppointmentsAction, updateAppointmentStatusAction, deleteAppointmentAction, type Appointment, type AppointmentStatus } from '@/app/actions/appointments'

const statusConfig = {
  CONFIRMADA: {
    label: 'Confirmada',
    variant: 'default' as const,
    color: 'bg-green-100 text-green-800'
  },
  CANCELADA: {
    label: 'Cancelada',
    variant: 'destructive' as const,
    color: 'bg-red-100 text-red-800'
  },
  COMPLETADA: {
    label: 'Completada',
    variant: 'secondary' as const,
    color: 'bg-blue-100 text-blue-800'
  }
}

export default function CitasPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const result = await getAppointmentsAction()
      
      if (result.success && result.appointments) {
        setAppointments(result.appointments)
      } else {
        toast.error(result.error || 'Error al cargar las citas')
      }
    } catch (error) {
      console.error('Error loading appointments:', error)
      toast.error('Error al cargar las citas')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (appointmentId: string, newStatus: AppointmentStatus) => {
    try {
      setUpdatingId(appointmentId)
      const result = await updateAppointmentStatusAction(appointmentId, newStatus)
      
      if (result.success) {
        toast.success(`Cita ${statusConfig[newStatus].label.toLowerCase()} exitosamente`)
        await loadAppointments()
      } else {
        toast.error(result.error || 'Error al actualizar la cita')
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
      toast.error('Error al actualizar la cita')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (appointmentId: string) => {
    try {
      setUpdatingId(appointmentId)
      const result = await deleteAppointmentAction(appointmentId)
      
      if (result.success) {
        toast.success('Cita eliminada exitosamente')
        await loadAppointments()
      } else {
        toast.error(result.error || 'Error al eliminar la cita')
      }
    } catch (error) {
      console.error('Error deleting appointment:', error)
      toast.error('Error al eliminar la cita')
    } finally {
      setUpdatingId(null)
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando citas...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Citas</h1>
          <p className="text-muted-foreground">
            Administra las citas agendadas por los prospectos
          </p>
        </div>
        <Button onClick={loadAppointments} variant="outline">
          Actualizar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Citas Agendadas
          </CardTitle>
          <CardDescription>
            {appointments.length} cita{appointments.length !== 1 ? 's' : ''} en total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay citas agendadas</h3>
              <p className="text-muted-foreground">
                Las citas aparecerán aquí cuando los prospectos las agenden
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Asesor</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => {
                    const startDateTime = formatDateTime(appointment.start_time)
                    const endDateTime = formatDateTime(appointment.end_time)
                    const status = statusConfig[appointment.status]
                    
                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">
                                {appointment.prospect_profile.full_name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {appointment.prospect_profile.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              {appointment.prospect_profile.email}
                            </div>
                            {appointment.prospect_profile.phone && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3" />
                                {appointment.prospect_profile.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm font-medium">
                              <Calendar className="h-3 w-3" />
                              {startDateTime.date}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {startDateTime.time} - {endDateTime.time}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">
                              {appointment.admin_profile.full_name}
                            </div>
                            <div className="text-muted-foreground">
                              {appointment.admin_profile.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={status.variant}
                            className={status.color}
                          >
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {appointment.status === 'CONFIRMADA' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusUpdate(appointment.id, 'COMPLETADA')}
                                  disabled={updatingId === appointment.id}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Completar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusUpdate(appointment.id, 'CANCELADA')}
                                  disabled={updatingId === appointment.id}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Cancelar
                                </Button>
                              </>
                            )}
                            
                            {appointment.status === 'CANCELADA' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(appointment.id, 'CONFIRMADA')}
                                disabled={updatingId === appointment.id}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Reactivar
                              </Button>
                            )}
                            
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updatingId === appointment.id}
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                if (confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
                                  handleDelete(appointment.id)
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}