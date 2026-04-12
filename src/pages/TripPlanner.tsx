import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Plane,
  MapPin,
  Clock,
  IndianRupee,
  Sparkles,
  Download,
  Loader2,
  Lightbulb,
  Save,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ItineraryMap from '@/components/ItineraryMap';
import { generateItineraryPDF } from '@/lib/pdfGenerator';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

interface Activity {
  time: string;
  activity: string;
  location: string;
  cost: string;
}

interface Day {
  day: number;
  title: string;
  activities: Activity[];
}

interface Location {
  name: string;
  lat: number;
  lng: number;
  description: string;
}

interface Itinerary {
  title: string;
  destination: string;
  duration: string;
  budget: string;
  summary: string;
  locations: Location[];
  days: Day[];
  tips: string[];
  totalEstimatedCost: string;
}

const GENERATE_URL = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/generate-itinerary`;

export default function TripPlanner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [interests, setInterests] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const state = location.state as { itinerary?: Itinerary } | null;
    if (state?.itinerary) setItinerary(state.itinerary);
  }, [location.state]);

  const handleGenerate = async () => {
    if (!destination.trim() || !duration.trim() || !budget.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setLoading(true);
    setItinerary(null);
    try {
      const resp = await fetch(GENERATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          destination: destination.trim(),
          duration: parseInt(duration),
          budget: budget.trim(),
          interests: interests.trim(),
        }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error || 'Failed to generate itinerary'
        );
      }
      const data = await resp.json();
      setItinerary(data.itinerary);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!itinerary) return;
    generateItineraryPDF(itinerary);
  };

  const handleSaveItinerary = async () => {
    if (!itinerary || !user) {
      navigate('/auth');
      return;
    }

    setSaving(true);

    const { error } = await supabase.from('trips').insert({
      user_id: user.id,
      title: itinerary.title,
      destination: itinerary.destination,
      duration: itinerary.duration,
      budget: budget.trim(),
      summary: itinerary.summary,
      itinerary_data: {
        ...itinerary,
        userEnteredBudget: budget.trim(),
        estimatedCost: itinerary.totalEstimatedCost,
      } as unknown as Record<string, unknown>,
    });
    setSaving(false);

    if (error) {
      setError('Failed to save trip: ' + error.message);
      console.log('Save trip error:', error);
    } else {
      setError('');
      console.log('Trip saved successfully');
    }
  };
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

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-800">
                Plan Your Perfect Trip
              </h1>
              <p className="text-stone-400 text-sm">
                Get a detailed day-by-day itinerary with map
              </p>
            </div>
          </div>

          <div className="border-t border-stone-100 mt-5 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                Destination *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Manali, Paris, Bali, Tokyo..."
                  disabled={loading}
                  className="w-full pl-9 pr-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                Duration (days) *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 5"
                  min={1}
                  max={30}
                  disabled={loading}
                  className="w-full pl-9 pr-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                Budget (₹) *
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 25000"
                  disabled={loading}
                  className="w-full pl-9 pr-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                Interests (optional)
              </label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g. adventure, food, culture, nature, photography..."
                disabled={loading}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-5 w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-3.5 rounded-xl transition-all text-base"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating your itinerary...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate AI Itinerary
              </>
            )}
          </button>
        </div>

        {itinerary && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Plane className="w-5 h-5 text-amber-500" />
                    <h2 className="text-xl font-bold text-stone-800">
                      {itinerary.title}
                    </h2>
                  </div>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {itinerary.summary}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium px-3 py-2 rounded-xl transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={handleSaveItinerary}
                    disabled={saving}
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-medium px-3 py-2 rounded-xl transition-colors"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Trip
                  </button>
                  {user && (
                    <button
                      onClick={() => navigate('/my-trips')}
                      className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-white text-sm font-medium px-3 py-2 rounded-xl transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      My Trips
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Clock, text: itinerary.duration },
                  { icon: IndianRupee, text: itinerary.totalEstimatedCost },
                  { icon: MapPin, text: itinerary.destination },
                ].map(({ icon: Icon, text }) => (
                  <span
                    key={text}
                    className="flex items-center gap-1.5 bg-stone-50 border border-stone-100 text-stone-600 text-sm px-3 py-1.5 rounded-full"
                  >
                    <Icon className="w-3.5 h-3.5 text-amber-500" />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {itinerary.locations && itinerary.locations.length > 0 && (
              <div>
                <h3 className="font-semibold text-stone-700 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  Trip Locations
                </h3>
                <ItineraryMap
                  locations={itinerary.locations}
                  destination={itinerary.destination}
                />
              </div>
            )}

            <div className="space-y-4">
              {itinerary.days.map((day) => (
                <div
                  key={day.day}
                  className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-stone-100">
                    <h3 className="font-bold text-stone-800">
                      <span className="text-amber-600">Day {day.day}:</span>{' '}
                      {day.title}
                    </h3>
                  </div>
                  <div className="divide-y divide-stone-50">
                    {day.activities.map((act, i) => (
                      <div
                        key={i}
                        className="px-6 py-4 hover:bg-stone-50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full flex-shrink-0 w-fit">
                            {act.time}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-stone-800 text-sm">
                              {act.activity}
                            </p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                              <span className="flex items-center gap-1 text-xs text-stone-400">
                                <MapPin className="w-3 h-3" />
                                {act.location}
                              </span>
                              {act.cost && act.cost !== '₹0' && (
                                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                  <IndianRupee className="w-3 h-3" />
                                  {act.cost.replace('₹', '')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {itinerary.tips && itinerary.tips.length > 0 && (
              <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6">
                <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Travel Tips
                </h3>
                <ul className="space-y-2">
                  {itinerary.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-stone-600"
                    >
                      <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
