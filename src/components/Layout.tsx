import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useRealTimeUpdate } from '@/hooks/useRealTimeUpdate';

export function Layout() {
  useRealTimeUpdate();

  return (
    <div className="min-h-screen bg-industrial-bg">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
