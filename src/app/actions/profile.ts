'use server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfileAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Usuario no autenticado.' };
  }

  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;
  const phone = formData.get('phone') as string;
  const avatarFile = formData.get('avatar_file') as File;

  let avatarUrl = formData.get('current_avatar_url') as string;

  // Lógica para subir la nueva foto de perfil si existe
  if (avatarFile && avatarFile.size > 0) {
    const filePath = `${user.id}/avatar-${Date.now()}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars') // Asegúrate de que tu bucket se llame 'avatars'
      .upload(filePath, avatarFile, {
        upsert: true, // Sobrescribe el archivo si ya existe uno
      });

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      return { success: false, error: 'No se pudo subir la nueva foto de perfil.' };
    }

    // Obtenemos la URL pública de la nueva imagen
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    avatarUrl = data.publicUrl;
  }

  // Actualizamos los datos en la tabla 'profiles'
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id);

  if (updateError) {
    console.error('Error updating profile:', updateError);
    return { success: false, error: 'No se pudo actualizar el perfil.' };
  }

  // Revalidamos la ruta para que los cambios se vean al instante
  revalidatePath('/copropietario/perfil');
  return { success: true, message: '¡Perfil actualizado exitosamente!' };
}