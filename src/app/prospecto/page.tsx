import { redirect } from 'next/navigation';

export default function ProspectoRootPage() {
  // Redirige permanentemente a la página de bienvenida del prospecto
  redirect('/prospecto/bienvenida');
}