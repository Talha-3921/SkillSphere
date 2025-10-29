import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Home, BookOpen, Users, Compass, User, LogOut } from 'lucide-react';

export const Navigation = () => {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };
  
  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'STUDENT') return '/student';
    if (user.role === 'INSTRUCTOR') return '/instructor';
    if (user.role === 'ADMIN') return '/admin';
    return '/';
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold text-foreground">SKILLSPHERE</span>
          </Link>
          
          {/* Center Navigation - Icon Based */}
          <div className="hidden md:flex items-center gap-2 bg-[var(--card-fill)] px-4 py-2 rounded-full">
            <Link to="/" className="nav-link p-3 rounded-full" title="Home">
              <Home size={20} />
            </Link>
            <Link to="/courses" className="nav-link p-3 rounded-full" title="Courses">
              <BookOpen size={20} />
            </Link>
            <Link to="#" className="nav-link p-3 rounded-full" title="Community">
              <Users size={20} />
            </Link>
            <Link to="#" className="nav-link p-3 rounded-full" title="Resources">
              <Compass size={20} />
            </Link>
          </div>
          
          {/* Right Navigation */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link 
                  to={getDashboardLink()}
                  className="bg-[var(--card-fill)] px-4 py-2 rounded-full hover:bg-[var(--muted)] transition-all"
                >
                  <User size={20} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-[var(--card-fill)] px-4 py-2 rounded-full hover:bg-[var(--muted)] transition-all"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="bg-[var(--card-fill)] px-6 py-2 rounded-full hover:bg-[var(--muted)] transition-all"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register"
                  className="bg-[var(--primary)] text-black px-6 py-2 rounded-full hover:opacity-90 transition-all font-semibold"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
