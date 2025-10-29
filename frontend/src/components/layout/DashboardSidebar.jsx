import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard, BookOpen, CreditCard, ShoppingCart,
  Award, Users, HeadphonesIcon, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export const DashboardSidebar = () => {
  const { user, clearAuth } = useAuthStore();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const getMenuItems = () => {
    if (user?.role === 'STUDENT') {
      return [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/student' },
        { icon: BookOpen, label: 'My Courses', path: '/student/my-courses' },
        { icon: ShoppingCart, label: 'Browse Courses', path: '/courses' },
        { icon: Award, label: 'Certificates', path: '/student/certificates' },
      ];
    }
    
    if (user?.role === 'INSTRUCTOR') {
      return [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/instructor' },
        { icon: BookOpen, label: 'My Courses', path: '/instructor' },
        { icon: Users, label: 'Create Course', path: '/instructor/create-course' },
      ];
    }
    
    if (user?.role === 'ADMIN') {
      return [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: BookOpen, label: 'Pending Courses', path: '/admin/pending-courses' },
        { icon: Users, label: 'All Courses', path: '/admin/all-courses' },
      ];
    }
    
    return [];
  };
  
  const menuItems = getMenuItems();
  
  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-[var(--card-fill)] border-r border-[var(--border)] transition-all duration-300 z-40 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border)]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold">S</span>
            </div>
            <span className="font-bold text-foreground">SKILLSPHERE</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-[var(--muted)] rounded-lg transition-all"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      {/* Menu Items */}
      <div className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-[var(--primary)] text-black'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--muted)] hover:text-[var(--primary)]'
              }`}
              title={collapsed ? item.label : ''}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
      
      {/* Bottom Items */}
      <div className="absolute bottom-4 left-0 right-0 px-4 space-y-2">
        <Link
          to="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--muted)] hover:text-[var(--primary)] transition-all"
        >
          <HeadphonesIcon size={20} />
          {!collapsed && <span>Support</span>}
        </Link>
        <button
          onClick={() => clearAuth()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--muted)] hover:text-red-500 transition-all"
        >
          <LogOut size={20} />
          {!collapsed && <span>Exit</span>}
        </button>
      </div>
    </aside>
  );
};
