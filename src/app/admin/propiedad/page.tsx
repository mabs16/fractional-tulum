'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { updatePropertyDetailsAction } from '@/app/actions/admin'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save, Building2 } from 'lucide-react'

interface PropertyDetails {
  id: number
  project_name: string
  location_text: string
  description: string | null
  total_fractions: number
  construction_start_date: string | null
  estimated_delivery_date: string | null
  latitude: number | null
  longitude: number | null
  fraction_initial_price: number | null
  contract_details: string | null
  amenities: Record<string, unknown> | null
  media_gallery: Record<string, unknown> | null
}

export default function PropertyManagementPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    project_name: '',
    location_text: '',
    description: '',
    total_fractions: '',
    construction_start_date: '',
    estimated_delivery_date: '',
    latitude: '',
    longitude: '',
    fraction_initial_price: '',
    contract_details: '',
    amenities: '',
    media_gallery: ''
  })

  const supabase = createClient()

  useEffect(() => {
    loadPropertyDetails()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadPropertyDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('propiedad_alfa_details')
        .select('*')
        .eq('id', 1)
        .single()

      if (error) {
        console.error('Error loading property details:', error)
        toast.error('Error al cargar los detalles de la propiedad')
        return
      }

      setFormData({
        project_name: data.project_name || '',
        location_text: data.location_text || '',
        description: data.description || '',
        total_fractions: data.total_fractions?.toString() || '',
        construction_start_date: data.construction_start_date || '',
        estimated_delivery_date: data.estimated_delivery_date || '',
        latitude: data.latitude?.toString() || '',
        longitude: data.longitude?.toString() || '',
        fraction_initial_price: data.fraction_initial_price?.toString() || '',
        contract_details: data.contract_details || '',
        amenities: data.amenities ? JSON.stringify(data.amenities, null, 2) : '',
        media_gallery: data.media_gallery ? JSON.stringify(data.media_gallery, null, 2) : ''
      })
    } catch (error) {
      console.error('Error loading property details:', error)
      toast.error('Error al cargar los detalles de la propiedad')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value)
      })

      const result = await updatePropertyDetailsAction(formDataObj)

      if (result.success) {
        toast.success('Información de la propiedad actualizada exitosamente')
        await loadPropertyDetails() // Recargar datos
      } else {
        toast.error(result.error || 'Error al actualizar la información')
      }
    } catch (error) {
      console.error('Error updating property:', error)
      toast.error('Error al actualizar la información de la propiedad')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando información de la propiedad...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Gestión de Propiedad</h1>
        </div>
        <p className="text-muted-foreground">
          Administra toda la información del proyecto Tulum Fractional
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Proyecto</CardTitle>
          <CardDescription>
            Edita los detalles principales del proyecto inmobiliario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project_name">Nombre del Proyecto *</Label>
                <Input
                  id="project_name"
                  value={formData.project_name}
                  onChange={(e) => handleInputChange('project_name', e.target.value)}
                  placeholder="Ej: Tulum Fractional Resort"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location_text">Ubicación *</Label>
                <Input
                  id="location_text"
                  value={formData.location_text}
                  onChange={(e) => handleInputChange('location_text', e.target.value)}
                  placeholder="Ej: Tulum, Quintana Roo, México"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción del Proyecto</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción detallada del proyecto..."
                rows={4}
              />
            </div>

            {/* Información Numérica */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_fractions">Total de Fracciones *</Label>
                <Input
                  id="total_fractions"
                  type="number"
                  min="1"
                  value={formData.total_fractions}
                  onChange={(e) => handleInputChange('total_fractions', e.target.value)}
                  placeholder="Ej: 100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fraction_initial_price">Precio Inicial por Fracción (USD)</Label>
                <Input
                  id="fraction_initial_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.fraction_initial_price}
                  onChange={(e) => handleInputChange('fraction_initial_price', e.target.value)}
                  placeholder="Ej: 50000"
                />
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="construction_start_date">Fecha de Inicio de Construcción</Label>
                <Input
                  id="construction_start_date"
                  type="date"
                  value={formData.construction_start_date}
                  onChange={(e) => handleInputChange('construction_start_date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated_delivery_date">Fecha Estimada de Entrega</Label>
                <Input
                  id="estimated_delivery_date"
                  type="date"
                  value={formData.estimated_delivery_date}
                  onChange={(e) => handleInputChange('estimated_delivery_date', e.target.value)}
                />
              </div>
            </div>

            {/* Coordenadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitud</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  placeholder="Ej: 20.2114185"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitud</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  placeholder="Ej: -87.4653502"
                />
              </div>
            </div>

            {/* Detalles del Contrato */}
            <div className="space-y-2">
              <Label htmlFor="contract_details">Detalles del Contrato</Label>
              <Textarea
                id="contract_details"
                value={formData.contract_details}
                onChange={(e) => handleInputChange('contract_details', e.target.value)}
                placeholder="Términos y condiciones del contrato..."
                rows={4}
              />
            </div>

            {/* JSON Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amenities">Amenidades (JSON)</Label>
                <Textarea
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) => handleInputChange('amenities', e.target.value)}
                  placeholder={`{\n  "piscina": true,\n  "gym": true,\n  "spa": true\n}`}
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Formato JSON válido. Ejemplo: {'{"piscina": true, "gym": true}'}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="media_gallery">Galería de Medios (JSON)</Label>
                <Textarea
                  id="media_gallery"
                  value={formData.media_gallery}
                  onChange={(e) => handleInputChange('media_gallery', e.target.value)}
                  placeholder={`{\n  "images": ["url1", "url2"],\n  "videos": ["url3"]\n}`}
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Formato JSON válido. Ejemplo: {'{"images": ["url1", "url2"]}'}
                </p>
              </div>
            </div>

            {/* Botón de Guardar */}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={saving} className="min-w-[120px]">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}