import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  IndianRupee,
  Trash2,
  Eye,
  Plane,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

interface SavedTrip {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  duration: string | null;
  budget: string | null;
  summary: string | null;
  created_at: string;
  itinerary_data: unknown;
}

export default function MyTrips() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTrips = async () => {
    if (!user) {
      setTrips([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    console.log('Current user:', user);
    console.log('Trips data:', data);
    console.log('Trips error:', error);

    if (error) {
      setTrips([]);
    } else {
      setTrips((data as SavedTrip[]) || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchTrips();
    } else {
      setTrips([]);
      setLoading(false);
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;

    setDeletingId(id);

    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) {
      setTrips((prev) => prev.filter((t) => t.id !== id));
    } else {
      console.log('Delete trip error:', error);
    }

    setDeletingId(null);
  };

  const handleView = (trip: SavedTrip) => {
    navigate('/planner', { state: { itinerary: trip.itinerary_data } });
  };

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8 text-center">
            <h2 className="text-xl font-bold text-stone-800 mb-2">
              Sign in to view your trips
            </h2>
            <p className="text-stone-500 text-sm mb-6">
              Your saved itineraries will appear here after you log in.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-500" />
              My Trips
            </h1>
            <p className="text-stone-400 text-sm mt-1">
              Your saved AI-generated itineraries
            </p>
          </div>

          <button
            onClick={() => navigate('/planner')}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plane className="w-4 h-4" />
            Plan New Trip
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-stone-100 shadow-sm">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plane className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-stone-700 mb-2">
              No saved trips yet
            </h3>
            <p className="text-stone-400 text-sm mb-6 max-w-xs mx-auto">
              Generate an itinerary with PlanMyWay-AI and save it to see it here
            </p>
            <button
              onClick={() => navigate('/planner')}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              Start Planning
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4 border-b border-stone-100">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-stone-800 text-sm leading-tight line-clamp-2">
                      {trip.title}
                    </h3>

                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleView(trip)}
                        className="p-1.5 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="View itinerary"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(trip.id)}
                        disabled={deletingId === trip.id}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete trip"
                      >
                        {deletingId === trip.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {trip.summary && (
                    <p className="text-stone-500 text-xs line-clamp-2 mb-4">
                      {trip.summary}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <span className="flex items-center gap-1 text-xs text-stone-400">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {trip.destination}
                    </span>

                    {trip.duration && (
                      <span className="flex items-center gap-1 text-xs text-stone-400">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {trip.duration}
                      </span>
                    )}

                    {trip.budget && (
                      <span className="flex items-center gap-1 text-xs text-stone-400">
                        <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
                        {trip.budget}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-300 mt-3">
                    Saved{' '}
                    {new Date(trip.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
