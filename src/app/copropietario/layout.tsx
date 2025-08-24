import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default async function CopropietarioLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/acceder');
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, first_name')
    .eq('user_id', user.id)
    .single();

  // Esta barrera asegura que solo copropietarios (o admins) puedan ver este layout
  if (profile?.role !== 'COPROPIETARIO' && profile?.role !== 'ADMIN') {
    return redirect('/acceder');
  }
  
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-foreground">Fractional Tulum</Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/copropietario/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
          <Link href="/copropietario/contratos" className="text-muted-foreground transition-colors hover:text-foreground">Mis Contratos</Link>
          <Link href="/copropietario/documentos" className="text-muted-foreground transition-colors hover:text-foreground">Mi Bóveda</Link>
          <Link href="/copropietario/perfil" className="text-muted-foreground transition-colors hover:text-foreground">Mi Perfil</Link>
        </nav>
        <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Hola, {profile?.first_name}</span>
            <ThemeSwitcher />
            {/* Aquí irá el componente de Cerrar Sesión */}
        </div>
      </header>
      <main className="p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}