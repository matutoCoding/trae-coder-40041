import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useRealTimeUpdate } from '@/hooks/useRealTimeUpdate';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useAlarmStore } from '@/store/useAlarmStore';
import { useRecipeStore } from '@/store/useRecipeStore';

export function Layout() {
  useRealTimeUpdate();
  const loadHistory = useHistoryStore((state) => state.loadFromStorage);
  const loadAlarms = useAlarmStore((state) => state.loadFromStorage);
  const loadRecipes = useRecipeStore((state) => state.loadCurrentFromStorage);
  const saveAlarms = useAlarmStore((state) => state.saveToStorage);

  useEffect(() => {
    loadHistory();
    loadAlarms();
    loadRecipes();
  }, [loadHistory, loadAlarms, loadRecipes]);

  useEffect(() => {
    const interval = setInterval(() => {
      saveAlarms();
    }, 10000);
    return () => clearInterval(interval);
  }, [saveAlarms]);

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
