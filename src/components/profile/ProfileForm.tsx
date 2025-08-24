'use client'
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { updateProfileAction } from '@/app/actions/profile';

// Definimos un tipo para los datos del perfil
type Profile = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string | null;
  phone: string | null;
}

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const result = await updateProfileAction(formData);

    if (result.success) {
      setMessage(result.message || 'Éxito');
    } else {
      setMessage(result.error || 'Error');
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center gap-4">
        <Image
          src={profile.avatar_url || '/default-avatar.png'}
          alt="Foto de perfil"
          width={80}
          height={80}
          className="rounded-full"
        />
        <div>
          <Label htmlFor="avatar_file">Cambiar foto de perfil</Label>
          <Input id="avatar_file" name="avatar_file" type="file" />
          <input type="hidden" name="current_avatar_url" value={profile.avatar_url || ''} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">Nombre(s)</Label>
          <Input id="first_name" name="first_name" defaultValue={profile.first_name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Apellido(s)</Label>
          <Input id="last_name" name="last_name" defaultValue={profile.last_name} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input id="email" name="email" defaultValue={profile.email} disabled />
        <p className="text-xs text-muted-foreground">El correo electrónico no se puede modificar.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input id="phone" name="phone" defaultValue={profile.phone || ''} />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Actualizando...' : 'Actualizar Perfil'}
      </Button>

      {message && <p className="text-sm mt-4">{message}</p>}
    </form>
  );
}