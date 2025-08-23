'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { UserRole } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function updateUserRoleAction(userId: string, newRole: UserRole) {
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

  // Llamamos a nuestra nueva función de base de datos a través de RPC
  console.log('--- [DEBUG] Llamando a la función RPC update_user_role con:', { target_user_id: userId, new_role_text: newRole });

  const { data, error } = await supabaseAdmin.rpc('update_user_role', {
    target_user_id: userId,
    new_role_text: newRole,
  })

  // ESTE ES EL LOG MÁS IMPORTANTE
  console.log('--- [DEBUG] Resultado de la llamada RPC:', { data, error });

  if (error) {
    console.error('Error updating role via RPC:', error)
    // Devuelve un error para que la UI pueda reaccionar
    return { success: false, error: 'No se pudo actualizar el rol.' }
  }

  // Revalidamos la ruta para que la tabla en la UI se actualice al instante
  revalidatePath('/admin/users')
  return { success: true }
}

export async function updatePropertyDetailsAction(formData: FormData) {
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

  try {
    // Validación y preparación de datos
    const projectName = formData.get('project_name') as string
    const locationText = formData.get('location_text') as string
    const description = formData.get('description') as string
    const totalFractions = parseInt(formData.get('total_fractions') as string)
    const constructionStartDate = formData.get('construction_start_date') as string
    const estimatedDeliveryDate = formData.get('estimated_delivery_date') as string
    const latitude = formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null
    const longitude = formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null
    const fractionInitialPrice = formData.get('fraction_initial_price') ? parseFloat(formData.get('fraction_initial_price') as string) : null
    const contractDetails = formData.get('contract_details') as string
    const amenitiesText = formData.get('amenities') as string
    const mediaGalleryText = formData.get('media_gallery') as string

    // Validación básica
    if (!projectName || !locationText) {
      return { success: false, error: 'Nombre del proyecto y ubicación son requeridos' }
    }

    if (isNaN(totalFractions) || totalFractions < 1) {
      return { success: false, error: 'El número total de fracciones debe ser un número válido mayor a 0' }
    }

    // Parsear JSON para amenities y media_gallery
    let amenities = null
    let mediaGallery = null

    if (amenitiesText && amenitiesText.trim()) {
      try {
        amenities = JSON.parse(amenitiesText)
      } catch (error) {
        return { success: false, error: 'El formato JSON de amenidades no es válido' }
      }
    }

    if (mediaGalleryText && mediaGalleryText.trim()) {
      try {
        mediaGallery = JSON.parse(mediaGalleryText)
      } catch (error) {
        return { success: false, error: 'El formato JSON de galería de medios no es válido' }
      }
    }

    // Preparar datos para actualización
    const propertyData = {
      project_name: projectName,
      location_text: locationText,
      description: description || null,
      total_fractions: totalFractions,
      construction_start_date: constructionStartDate || null,
      estimated_delivery_date: estimatedDeliveryDate || null,
      latitude,
      longitude,
      fraction_initial_price: fractionInitialPrice,
      contract_details: contractDetails || null,
      amenities,
      media_gallery: mediaGallery
    }

    console.log('--- [DEBUG] Actualizando propiedad con datos:', propertyData)

    // Actualizar la única fila (id = 1)
    const { error } = await supabaseAdmin
      .from('propiedad_alfa_details')
      .update(propertyData)
      .eq('id', 1)

    if (error) {
      console.error('Error updating property details:', error)
      return { success: false, error: 'Error al actualizar la información de la propiedad: ' + error.message }
    }

    console.log('--- [DEBUG] Propiedad actualizada exitosamente')

    // Revalidar rutas
    revalidatePath('/admin/propiedad')
    revalidatePath('/') // Portal público
    return { success: true }

  } catch (error) {
    console.error('Error in updatePropertyDetailsAction:', error)
    return { success: false, error: 'Error interno del servidor' }
  }
}

export async function uploadDocumentAction(formData: FormData) {
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

  try {
    const file = formData.get('file') as File
    const fileName = formData.get('file_name') as string
    const category = formData.get('category') as string

    // Validaciones
    if (!file || file.size === 0) {
      return { success: false, error: 'Debe seleccionar un archivo' }
    }

    if (!fileName || fileName.trim() === '') {
      return { success: false, error: 'El nombre del archivo es requerido' }
    }

    if (!category) {
      return { success: false, error: 'La categoría es requerida' }
    }

    // Validar tamaño máximo (50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB en bytes
    if (file.size > maxSize) {
      return { success: false, error: 'El archivo no puede ser mayor a 50MB' }
    }

    // Validar tipos de archivo permitidos
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/zip',
      'application/x-rar-compressed'
    ]

    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Tipo de archivo no permitido' }
    }

    // Obtener el usuario actual
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    // Generar nombre único para el archivo
    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = `${uuidv4()}.${fileExtension}`
    const storagePath = `documents/${uniqueFileName}`

    console.log('--- [DEBUG] Subiendo archivo:', { fileName, category, size: file.size, type: file.type })

    // Subir archivo a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('documents')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading file to storage:', uploadError)
      return { success: false, error: 'Error al subir el archivo: ' + uploadError.message }
    }

    // Guardar metadata en la base de datos
    const { error: dbError } = await supabaseAdmin
      .from('documents')
      .insert({
        file_name: fileName.trim(),
        original_name: file.name,
        category: category,
        storage_path: storagePath,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: user.id
      })

    if (dbError) {
      console.error('Error saving document metadata:', dbError)
      // Si falla la inserción en BD, eliminar el archivo del storage
      await supabaseAdmin.storage.from('documents').remove([storagePath])
      return { success: false, error: 'Error al guardar la información del documento: ' + dbError.message }
    }

    console.log('--- [DEBUG] Documento subido exitosamente')

    // Revalidar la página de documentos
    revalidatePath('/admin/documentos')
    return { success: true }

  } catch (error) {
    console.error('Error in uploadDocumentAction:', error)
    return { success: false, error: 'Error interno del servidor' }
  }
}

export async function deleteDocumentAction(documentId: string) {
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

  try {
    if (!documentId) {
      return { success: false, error: 'ID del documento es requerido' }
    }

    console.log('--- [DEBUG] Eliminando documento con ID:', documentId)

    // Obtener información del documento antes de eliminarlo
    const { data: document, error: fetchError } = await supabaseAdmin
      .from('documents')
      .select('storage_path')
      .eq('id', documentId)
      .single()

    if (fetchError || !document) {
      console.error('Error fetching document:', fetchError)
      return { success: false, error: 'Documento no encontrado' }
    }

    // Eliminar archivo del storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('documents')
      .remove([document.storage_path])

    if (storageError) {
      console.error('Error deleting file from storage:', storageError)
      return { success: false, error: 'Error al eliminar el archivo del almacenamiento: ' + storageError.message }
    }

    // Eliminar registro de la base de datos
    const { error: dbError } = await supabaseAdmin
      .from('documents')
      .delete()
      .eq('id', documentId)

    if (dbError) {
      console.error('Error deleting document from database:', dbError)
      return { success: false, error: 'Error al eliminar el documento de la base de datos: ' + dbError.message }
    }

    console.log('--- [DEBUG] Documento eliminado exitosamente')

    // Revalidar la página de documentos
    revalidatePath('/admin/documentos')
    return { success: true }

  } catch (error) {
    console.error('Error in deleteDocumentAction:', error)
    return { success: false, error: 'Error interno del servidor' }
  }
}

export async function uploadContractAction(formData: FormData) {
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

  try {
    const file = formData.get('file') as File
    const fileName = formData.get('file_name') as string
    const buyerId = formData.get('buyer_id') as string
    const fractionId = formData.get('fraction_id') as string

    // Validaciones
    if (!file || file.size === 0) {
      return { success: false, error: 'Debe seleccionar un archivo PDF' }
    }

    if (!fileName || fileName.trim() === '') {
      return { success: false, error: 'El nombre del archivo es requerido' }
    }

    if (!buyerId) {
      return { success: false, error: 'Debe seleccionar un comprador' }
    }

    if (!fractionId) {
      return { success: false, error: 'Debe seleccionar una fracción' }
    }

    // Validar que sea un archivo PDF
    if (file.type !== 'application/pdf') {
      return { success: false, error: 'Solo se permiten archivos PDF' }
    }

    // Validar tamaño máximo (50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB en bytes
    if (file.size > maxSize) {
      return { success: false, error: 'El archivo no puede ser mayor a 50MB' }
    }

    // Verificar que el comprador existe y es válido
    const { data: buyer, error: buyerError } = await supabaseAdmin
      .from('profiles')
      .select('id, first_name, last_name')
      .eq('id', buyerId)
      .single()

    if (buyerError || !buyer) {
      return { success: false, error: 'Comprador no encontrado' }
    }

    // Verificar que la fracción existe y está disponible
    const { data: fraction, error: fractionError } = await supabaseAdmin
      .from('fractions')
      .select('id, status')
      .eq('id', parseInt(fractionId))
      .single()

    if (fractionError || !fraction) {
      return { success: false, error: 'Fracción no encontrada' }
    }

    // Verificar que no existe ya un contrato para esta fracción
    const { data: existingContract, error: contractCheckError } = await supabaseAdmin
      .from('contracts')
      .select('id')
      .eq('fraction_id', parseInt(fractionId))
      .eq('buyer_id', buyerId)
      .single()

    if (existingContract) {
      return { success: false, error: 'Ya existe un contrato para esta fracción y comprador' }
    }

    // Obtener el usuario actual
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    // Generar nombre único para el archivo
    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = `${uuidv4()}.${fileExtension}`
    const storagePath = `contracts/${uniqueFileName}`

    console.log('--- [DEBUG] Subiendo contrato:', { fileName, buyerId, fractionId, size: file.size })

    // Subir archivo a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('documents')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading contract to storage:', uploadError)
      return { success: false, error: 'Error al subir el archivo: ' + uploadError.message }
    }

    // Guardar documento en la tabla documents
    const { data: documentData, error: documentError } = await supabaseAdmin
      .from('documents')
      .insert({
        file_name: fileName.trim(),
        original_name: file.name,
        category: 'CONTRACTUAL',
        storage_path: storagePath,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: user.id
      })
      .select('id')
      .single()

    if (documentError || !documentData) {
      console.error('Error saving document metadata:', documentError)
      // Si falla la inserción en BD, eliminar el archivo del storage
      await supabaseAdmin.storage.from('documents').remove([storagePath])
      return { success: false, error: 'Error al guardar la información del documento: ' + (documentError?.message || 'Error desconocido') }
    }

    // Crear registro en la tabla contracts
    const { error: contractError } = await supabaseAdmin
      .from('contracts')
      .insert({
        buyer_id: buyerId,
        fraction_id: parseInt(fractionId),
        document_id: documentData.id,
        status: 'BORRADOR'
      })

    if (contractError) {
      console.error('Error creating contract:', contractError)
      // Si falla la creación del contrato, eliminar el documento y archivo
      await supabaseAdmin.from('documents').delete().eq('id', documentData.id)
      await supabaseAdmin.storage.from('documents').remove([storagePath])
      return { success: false, error: 'Error al crear el contrato: ' + contractError.message }
    }

    console.log('--- [DEBUG] Contrato subido exitosamente')

    // Revalidar la página de contratos
    revalidatePath('/admin/contratos')
    return { success: true }

  } catch (error) {
    console.error('Error in uploadContractAction:', error)
    return { success: false, error: 'Error interno del servidor' }
  }
}

export async function updateContractStatusAction(formData: FormData) {
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

  try {
    const contractId = formData.get('contractId') as string
    const newStatus = formData.get('status') as string

    // Validaciones
    if (!contractId) {
      return { success: false, error: 'ID del contrato es requerido' }
    }

    if (!newStatus) {
      return { success: false, error: 'El nuevo estado es requerido' }
    }

    // Validar que el estado sea válido
    const validStatuses = ['BORRADOR', 'ENVIADO', 'FIRMADO', 'CANCELADO']
    if (!validStatuses.includes(newStatus)) {
      return { success: false, error: 'Estado no válido' }
    }

    console.log('--- [DEBUG] Actualizando estado del contrato:', { contractId, newStatus })

    // Verificar que el contrato existe
    const { data: existingContract, error: fetchError } = await supabaseAdmin
      .from('contracts')
      .select('id, status')
      .eq('id', contractId)
      .single()

    if (fetchError || !existingContract) {
      console.error('Error fetching contract:', fetchError)
      return { success: false, error: 'Contrato no encontrado' }
    }

    // Actualizar el estado del contrato
    const { error: updateError } = await supabaseAdmin
      .from('contracts')
      .update({ status: newStatus })
      .eq('id', contractId)

    if (updateError) {
      console.error('Error updating contract status:', updateError)
      return { success: false, error: 'Error al actualizar el estado del contrato: ' + updateError.message }
    }

    console.log('--- [DEBUG] Estado del contrato actualizado exitosamente')

    // Revalidar la página de contratos
    revalidatePath('/admin/contratos')
    return { success: true }

  } catch (error) {
    console.error('Error in updateContractStatusAction:', error)
    return { success: false, error: 'Error interno del servidor' }
  }
}