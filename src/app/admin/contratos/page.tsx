'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Loader2, Upload, Download, FileText, X } from 'lucide-react'
import { updateContractStatusAction, uploadContractAction } from '@/app/actions/admin'
import { toast } from 'sonner'

type ContractStatus = 'BORRADOR' | 'ENVIADO' | 'FIRMADO' | 'CANCELADO'

interface Contract {
  id: string
  buyer_id: string
  fraction_id: number
  status: ContractStatus
  created_at: string
  buyer_name: string
  buyer_email: string
  document_id?: string
  file_name?: string
  storage_path?: string
}

interface ContractWithProfile {
  id: string
  buyer_id: string
  fraction_id: number
  status: ContractStatus
  created_at: string
  document_id?: string
  profiles: {
    first_name: string
    last_name: string
    email: string
  }[] | null
  documents: {
    file_name: string
    storage_path: string
  }[] | null
}

interface Buyer {
  id: string
  first_name: string
  last_name: string
  email: string
}

interface Fraction {
  fraction_number: number
  status: string
}

const getStatusBadgeVariant = (status: ContractStatus) => {
  switch (status) {
    case 'BORRADOR':
      return 'secondary'
    case 'ENVIADO':
      return 'default' // warning equivalent
    case 'FIRMADO':
      return 'default' // success equivalent - we'll use custom styling
    case 'CANCELADO':
      return 'destructive'
    default:
      return 'secondary'
  }
}

const getStatusColor = (status: ContractStatus) => {
  switch (status) {
    case 'BORRADOR':
      return 'bg-gray-100 text-gray-800'
    case 'ENVIADO':
      return 'bg-yellow-100 text-yellow-800'
    case 'FIRMADO':
      return 'bg-green-100 text-green-800'
    case 'CANCELADO':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function ContractsManagementPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingContract, setUpdatingContract] = useState<string | null>(null)
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [fractions, setFractions] = useState<Fraction[]>([])
  const [uploadingContract, setUploadingContract] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const supabase = createClientComponentClient()

  const loadContracts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          id,
          buyer_id,
          fraction_id,
          status,
          created_at,
          document_id,
          profiles!buyer_id (
            first_name,
            last_name,
            email
          ),
          documents (
            file_name,
            storage_path
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading contracts:', error)
        toast.error('Error al cargar los contratos')
        return
      }

      const formattedContracts = data?.map((contract: ContractWithProfile) => ({
        id: contract.id,
        buyer_id: contract.buyer_id,
        fraction_id: contract.fraction_id,
        status: contract.status,
        created_at: contract.created_at,
        document_id: contract.document_id,
        buyer_name: contract.profiles && contract.profiles.length > 0
          ? `${contract.profiles[0].first_name} ${contract.profiles[0].last_name}`.trim()
          : 'Usuario eliminado',
        buyer_email: contract.profiles && contract.profiles.length > 0 ? contract.profiles[0].email : 'N/A',
        file_name: contract.documents && contract.documents.length > 0 ? contract.documents[0].file_name : undefined,
        storage_path: contract.documents && contract.documents.length > 0 ? contract.documents[0].storage_path : undefined
      })) || []

      setContracts(formattedContracts)
    } catch (error) {
      console.error('Error loading contracts:', error)
      toast.error('Error al cargar los contratos')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const loadBuyers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .not('first_name', 'is', null)
        .not('last_name', 'is', null)
        .order('first_name')

      if (error) {
        console.error('Error loading buyers:', error)
        return
      }

      setBuyers(data || [])
    } catch (error) {
      console.error('Error loading buyers:', error)
    }
  }, [supabase])

  const loadFractions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('propiedad_alfa')
        .select('fraction_number, status')
        .eq('status', 'DISPONIBLE')
        .order('fraction_number')

      if (error) {
        console.error('Error loading fractions:', error)
        return
      }

      setFractions(data || [])
    } catch (error) {
      console.error('Error loading fractions:', error)
    }
  }, [supabase])

  const handleStatusUpdate = async (contractId: string, newStatus: ContractStatus) => {
    setUpdatingContract(contractId)
    
    try {
      const formData = new FormData()
      formData.append('contractId', contractId)
      formData.append('status', newStatus)
      
      const result = await updateContractStatusAction(formData)
      
      if (result.success) {
        toast.success('Estado del contrato actualizado correctamente')
        await loadContracts() // Recargar la lista
      } else {
        toast.error(result.error || 'Error al actualizar el estado del contrato')
      }
    } catch (error) {
      console.error('Error updating contract status:', error)
      toast.error('Error al actualizar el estado del contrato')
    } finally {
      setUpdatingContract(null)
    }
  }

  useEffect(() => {
    loadContracts()
    loadBuyers()
    loadFractions()
  }, [loadContracts, loadBuyers, loadFractions])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleUploadContract = async (formData: FormData) => {
    setUploadingContract(true)
    try {
      const result = await uploadContractAction(formData)
      if (result.success) {
        toast.success('Contrato subido exitosamente')
        setShowUploadForm(false)
        loadContracts()
      } else {
        toast.error(result.error || 'Error al subir el contrato')
      }
    } catch (error) {
      console.error('Error uploading contract:', error)
      toast.error('Error al subir el contrato')
    } finally {
      setUploadingContract(false)
    }
  }

  const handleDownloadContract = async (storagePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('contracts')
        .download(storagePath)

      if (error) {
        console.error('Error downloading contract:', error)
        toast.error('Error al descargar el contrato')
        return
      }

      // Crear URL para descarga
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading contract:', error)
      toast.error('Error al descargar el contrato')
    }
  }

  const getAvailableStatuses = (currentStatus: ContractStatus): ContractStatus[] => {
    switch (currentStatus) {
      case 'BORRADOR':
        return ['ENVIADO', 'CANCELADO']
      case 'ENVIADO':
        return ['FIRMADO', 'CANCELADO']
      case 'FIRMADO':
        return ['CANCELADO']
      case 'CANCELADO':
        return ['BORRADOR']
      default:
        return []
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando contratos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Contratos</h1>
            <p className="text-muted-foreground">
              Administra los contratos y su estado en el proceso legal
            </p>
          </div>
          <Button 
            onClick={() => setShowUploadForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="mr-2 h-4 w-4" />
            Subir Contrato
          </Button>
        </div>
      </div>

      {/* Formulario de subida de contratos */}
      {showUploadForm && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Subir Nuevo Contrato</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowUploadForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form action={handleUploadContract} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contract-file">Archivo del Contrato (PDF)</Label>
                  <Input
                    id="contract-file"
                    name="file"
                    type="file"
                    accept=".pdf"
                    required
                    className="cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contract-name">Nombre del Contrato</Label>
                  <Input
                    id="contract-name"
                    name="contractName"
                    type="text"
                    placeholder="Ej: Contrato Fracción 1 - Juan Pérez"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buyer-select">Comprador</Label>
                  <select
                    id="buyer-select"
                    name="buyerId"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Seleccionar comprador...</option>
                    {buyers.map((buyer) => (
                      <option key={buyer.id} value={buyer.id}>
                        {buyer.first_name} {buyer.last_name} ({buyer.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fraction-select">Fracción</Label>
                  <select
                    id="fraction-select"
                    name="fractionId"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Seleccionar fracción...</option>
                    {fractions.map((fraction) => (
                      <option key={fraction.fraction_number} value={fraction.fraction_number}>
                        Fracción #{fraction.fraction_number}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowUploadForm(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={uploadingContract}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {uploadingContract ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Subir Contrato
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contratos Registrados</CardTitle>
          <CardDescription>
            Lista de todos los contratos con su estado actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay contratos registrados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comprador</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Nº de Fracción</TableHead>
                  <TableHead>Archivo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">
                      {contract.buyer_name}
                    </TableCell>
                    <TableCell>{contract.buyer_email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        Fracción #{contract.fraction_id}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {contract.file_name && contract.storage_path ? (
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm truncate max-w-[150px]" title={contract.file_name}>
                            {contract.file_name}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadContract(contract.storage_path!, contract.file_name!)}
                            className="h-6 w-6 p-0"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Sin archivo</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusBadgeVariant(contract.status)}
                        className={contract.status === 'FIRMADO' ? getStatusColor(contract.status) : ''}
                      >
                        {contract.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(contract.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                            disabled={updatingContract === contract.id}
                          >
                            {updatingContract === contract.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {getAvailableStatuses(contract.status).map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => handleStatusUpdate(contract.id, status)}
                            >
                              Cambiar a {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}