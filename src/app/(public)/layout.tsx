'use client';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { PublicNavbar } from '@/components/PublicNavbar';
import { BackgroundVideo } from '@/components/layout/BackgroundVideo';

export default function PublicLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '/propiedad-inteligente';
  
  return (
    <div>
      <BackgroundVideo />
      <PublicNavbar />
      <main className={`relative z-10 ${isHomePage ? '' : ''}`}>
        {children}
      </main>
    </div>
  );
}