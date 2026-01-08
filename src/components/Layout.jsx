import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <nav className="bg-white border-b border-[#dadce0] sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1a73e8] rounded flex items-center justify-center text-white font-bold text-xs">RM</div>
            <span className="text-[22px] font-medium text-[#5f6368] hidden sm:inline tracking-tight">Repetición Máxima</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900 leading-none">{user.email}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-[#1a73e8] hover:bg-blue-50 px-4 py-2 rounded-md transition-colors border border-transparent hover:border-blue-100"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="text-sm font-medium text-[#1a73e8] px-4 py-2 hover:bg-blue-50 rounded-md">Login</Link>
                <Link to="/register" className="text-sm font-medium bg-[#1a73e8] text-white px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow">Empezar ahora</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow py-8 px-4 w-full max-w-screen-xl mx-auto">
        {children}
      </main>

      <footer className="py-12 border-t border-[#dadce0] bg-white mt-12">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <p className="text-sm text-[#5f6368]">© 2026 Repetición Máxima. Rendimiento y simplicidad.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
