import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { useState } from 'react';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DashboardSidebar />
      <main className="ml-64 min-h-screen p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
