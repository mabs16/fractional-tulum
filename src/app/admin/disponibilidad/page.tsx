'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { getAvailabilityAction, updateAvailabilityAction, type AvailabilityData } from '@/app/actions/availability'

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' }
]

export default function DisponibilidadPage() {
  const [schedule, setSchedule] = useState<AvailabilityData>({
    monday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    tuesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    wednesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    thursday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    friday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    saturday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    sunday: { enabled: false, startTime: '09:00', endTime: '17:00' }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Cargar disponibilidad existente al montar el componente
  useEffect(() => {
    async function loadAvailability() {
      try {
        const data = await getAvailabilityAction()
        setSchedule(data)
      } catch (error) {
        console.error('Error loading availability:', error)
        toast.error('Error al cargar la disponibilidad')
      } finally {
        setLoading(false)
      }
    }

    loadAvailability()
  }, [])

  // Manejar cambio de checkbox (habilitar/deshabilitar día)
  const handleDayToggle = (day: string, enabled: boolean) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled
      }
    }))
  }

  // Manejar cambio de hora
  const handleTimeChange = (day: string, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }))
  }

  // Guardar horario
  const handleSave = async () => {
    setSaving(true)
    try {
      const result = await updateAvailabilityAction(schedule)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Horario guardado exitosamente')
      }
    } catch (error) {
      console.error('Error saving schedule:', error)
      toast.error('Error al guardar el horario')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="text-lg">Cargando disponibilidad...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Configurar mi Disponibilidad Semanal</CardTitle>
          <CardDescription>
            Define los días y horarios en los que estarás disponible para atender citas con prospectos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
            {DAYS_OF_WEEK.map(({ key, label }) => {
              const dayData = schedule[key]
              return (
                <div key={key} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 min-w-[120px]">
                    <Checkbox
                      id={`${key}-enabled`}
                      checked={dayData.enabled}
                      onCheckedChange={(checked: boolean) => handleDayToggle(key, checked)}
                    />
                    <Label htmlFor={`${key}-enabled`} className="font-medium">
                      {label}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`${key}-start`} className="text-sm text-gray-600">
                        Hora de Inicio:
                      </Label>
                      <Input
                        id={`${key}-start`}
                        type="time"
                        value={dayData.startTime}
                        onChange={(e) => handleTimeChange(key, 'startTime', e.target.value)}
                        disabled={!dayData.enabled}
                        className="w-32"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`${key}-end`} className="text-sm text-gray-600">
                        Hora de Fin:
                      </Label>
                      <Input
                        id={`${key}-end`}
                        type="time"
                        value={dayData.endTime}
                        onChange={(e) => handleTimeChange(key, 'endTime', e.target.value)}
                        disabled={!dayData.enabled}
                        className="w-32"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
            
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={saving} className="min-w-[150px]">
                {saving ? 'Guardando...' : 'Guardar Horario'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}