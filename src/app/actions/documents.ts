'use server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function getSecureDocumentUrlAction(storagePath: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Usuario no autenticado.' };
  }

  // Generamos una URL firmada que es válida por 60 segundos
  const { data, error } = await supabase
    .storage
    .from('documents') // Asegúrate de que tu bucket de documentos se llame así
    .createSignedUrl(storagePath, 60);

  if (error) {
    console.error('Error creating signed URL:', error);
    return { success: false, error: 'No se pudo generar el enlace de descarga.' };
  }

  return { success: true, url: data.signedUrl };
}