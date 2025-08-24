import { ReactNode } from 'react';
import { PublicNavbar } from '@/components/PublicNavbar';
import { BackgroundVideo } from '@/components/layout/BackgroundVideo';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <BackgroundVideo />
      <PublicNavbar />
      <main className="relative z-10 pt-24">
        {children}
      </main>
    </div>
  );
}