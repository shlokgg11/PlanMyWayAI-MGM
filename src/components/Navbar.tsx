import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Plane, LogIn, LogOut, BookOpen, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMobileOpen(false);
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-amber-600 font-semibold'
      : 'text-stone-600 hover:text-amber-600';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center group-hover:bg-amber-600 transition-colors">
            <Plane className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-stone-800 text-lg tracking-tight">
            PlanMyWay-AI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className={`text-sm transition-colors ${isActive('/')}`}>
            Home
          </Link>
          <Link
            to="/planner"
            className={`text-sm transition-colors ${isActive('/planner')}`}
          >
            Trip Planner
          </Link>
          {user && (
            <Link
              to="/my-trips"
              className={`text-sm transition-colors ${isActive('/my-trips')}`}
            >
              My Trips
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs text-stone-400 max-w-[140px] truncate">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-sm text-stone-600 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1.5 text-sm bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>

        <button
          className="md:hidden p-2 text-stone-600 hover:text-amber-600"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-4 py-4 flex flex-col gap-3">
          <Link
            to="/"
            className={`text-sm py-2 ${isActive('/')}`}
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/planner"
            className={`text-sm py-2 ${isActive('/planner')}`}
            onClick={() => setMobileOpen(false)}
          >
            Trip Planner
          </Link>
          {user && (
            <Link
              to="/my-trips"
              className={`flex items-center gap-2 text-sm py-2 ${isActive(
                '/my-trips'
              )}`}
              onClick={() => setMobileOpen(false)}
            >
              <BookOpen className="w-4 h-4" /> My Trips
            </Link>
          )}
          {user ? (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-red-600 py-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 text-sm text-amber-600 font-medium py-2"
              onClick={() => setMobileOpen(false)}
            >
              <LogIn className="w-4 h-4" /> Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
