import { useNavigate } from 'react-router-dom';
import { Home, Plane } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Plane className="w-10 h-10 text-amber-500" />
        </div>
        <h1 className="text-7xl font-bold text-stone-200 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-stone-800 mb-3">Page Not Found</h2>
        <p className="text-stone-400 mb-8 max-w-sm">
          Looks like this destination doesn't exist on our map. Let's get you back on track.
        </p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors mx-auto"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </button>
      </div>
    </div>
  );
}
