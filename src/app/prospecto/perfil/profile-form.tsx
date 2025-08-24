'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Upload } from 'lucide-react'
import { updateProfileAction } from '@/app/actions/profile'
import { toast } from 'sonner'

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string
  phone: string | null
  avatar_url: string | null
  created_at: string
}

interface ProfileFormProps {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    
    try {
      // Añadir el archivo de avatar si existe
      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }
      
      const result = await updateProfileAction(formData)
      
      if (result.success) {
        toast.success('Perfil actualizado correctamente')
        // Limpiar preview si se subió un nuevo avatar
        if (avatarFile) {
          setAvatarFile(null)
          setPreviewUrl(null)
        }
      } else {
        toast.error(result.error || 'Error al actualizar el perfil')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Error al actualizar el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const displayAvatarUrl = previewUrl || profile.avatar_url
  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase()

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Sección de Avatar */}
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={displayAvatarUrl || undefined} alt="Avatar" />
          <AvatarFallback className="text-lg">
            {initials || <User className="h-8 w-8" />}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col items-center space-y-2">
          <Label htmlFor="avatar" className="cursor-pointer">
            <div className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800">
              <Upload className="h-4 w-4" />
              <span>Cambiar foto de perfil</span>
            </div>
          </Label>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          {avatarFile && (
            <p className="text-xs text-gray-600">
              Archivo seleccionado: {avatarFile.name}
            </p>
          )}
        </div>
      </div>

      {/* Campos del formulario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">Nombre</Label>
          <Input
            id="first_name"
            name="first_name"
            type="text"
            defaultValue={profile.first_name || ''}
            placeholder="Ingresa tu nombre"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last_name">Apellido</Label>
          <Input
            id="last_name"
            name="last_name"
            type="text"
            defaultValue={profile.last_name || ''}
            placeholder="Ingresa tu apellido"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={profile.email}
          disabled
          className="bg-gray-50"
        />
        <p className="text-xs text-gray-600">
          El email no se puede modificar
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={profile.phone || ''}
          placeholder="Ingresa tu teléfono"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Actualizando...' : 'Actualizar Perfil'}
      </Button>
    </form>
  )
}