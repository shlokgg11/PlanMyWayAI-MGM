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
import ChatBot from '@/components/ChatBot';

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

interface LocationPoint {
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
  locations: LocationPoint[];
  days: Day[];
  tips: string[];
  totalEstimatedCost: string;
}

type FormDataType = {
  destination: string;
  duration: string;
  budget: string;
  interests: string;
  travellerCount: string;
  tripType: string;
  travelStyle: string;
  pace: string;
  hotelPreference: string;
  foodPreference: string;
  ageGroup: string;
  specialRequests: string;
};

type Question = {
  key: keyof FormDataType;
  title: string;
  subtitle: string;
  type: 'input' | 'textarea' | 'options';
  placeholder?: string;
  inputType?: string;
  options?: string[];
  optional?: boolean;
  condition?: (formData: FormDataType) => boolean;
};

const GENERATE_URL = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/generate-itinerary`;

export default function TripPlanner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormDataType>({
    destination: '',
    duration: '',
    budget: '',
    interests: '',
    travellerCount: '1',
    tripType: '',
    travelStyle: '',
    pace: '',
    hotelPreference: '',
    foodPreference: '',
    ageGroup: '',
    specialRequests: '',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const state = location.state as { itinerary?: Itinerary } | null;
    if (state?.itinerary) setItinerary(state.itinerary);
  }, [location.state]);

  useEffect(() => {
    if (formData.tripType === 'solo') {
      setFormData((prev) => ({ ...prev, travellerCount: '1' }));
    } else if (formData.tripType === 'couple') {
      setFormData((prev) => ({ ...prev, travellerCount: '2' }));
    } else if (
      (formData.tripType === 'family' ||
        formData.tripType === 'friends' ||
        formData.tripType === 'other' ||
        formData.tripType === 'business') &&
      (prevNeedsReset(prevTravellerCount(formData.travellerCount)))
    ) {
      setFormData((prev) => ({ ...prev, travellerCount: '3-5' }));
    }
  }, [formData.tripType]);

  function prevTravellerCount(value: string) {
    return value;
  }

  function prevNeedsReset(value: string) {
    return value === '1' || value === '2' || !value;
  }

  const updateField = (name: keyof FormDataType, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const questions: Question[] = [
    {
      key: 'destination',
      title: 'Where would you like to travel?',
      subtitle:
        'Tell me your destination and I’ll build the trip around it.',
      type: 'input',
      placeholder: 'e.g. Manali, Paris, Bali, Tokyo...',
    },
    {
      key: 'duration',
      title: 'How many days are you planning for?',
      subtitle: 'I’ll spread the itinerary properly across these days.',
      type: 'input',
      inputType: 'number',
      placeholder: 'e.g. 5',
    },
    {
      key: 'budget',
      title: 'What budget should I plan around?',
      subtitle: 'I’ll try to keep the trip realistic and within budget.',
      type: 'input',
      inputType: 'text',
      placeholder: 'e.g. 25000',
    },
    {
      key: 'tripType',
      title: 'Who is this trip for?',
      subtitle: 'This helps me personalize the vibe of your itinerary.',
      type: 'options',
      options: ['solo', 'couple', 'family', 'friends', 'business', 'other'],
    },
    {
      key: 'travellerCount',
      title: 'How many travellers are going?',
      subtitle: 'This helps me choose suitable places and planning style.',
      type: 'options',
      options: ['3-5', '6+'],
      condition: (data) =>
        data.tripType === 'family' ||
        data.tripType === 'friends' ||
        data.tripType === 'other' ||
        data.tripType === 'business',
    },
    {
      key: 'interests',
      title: 'What kind of experiences do you want?',
      subtitle:
        'You can mention beaches, food, shopping, culture, nature, adventure, photography...',
      type: 'input',
      placeholder: 'e.g. food, beaches, culture, photography',
      optional: true,
    },
    {
      key: 'travelStyle',
      title: 'What style of travel do you prefer?',
      subtitle: 'I’ll adjust stay suggestions and overall planning style.',
      type: 'options',
      options: ['budget', 'balanced', 'luxury'],
    },
    {
      key: 'pace',
      title: 'What pace do you want for the trip?',
      subtitle:
        'Relaxed trips have more breathing space. Packed trips cover more.',
      type: 'options',
      options: ['relaxed', 'moderate', 'packed'],
    },
    {
      key: 'hotelPreference',
      title: 'What kind of stay do you prefer?',
      subtitle: 'I’ll try to match the trip with your stay preference.',
      type: 'options',
      options: [
        'budget hotel',
        '3-star',
        '4-star',
        '5-star',
        'hostel',
        'resort',
        'apartment',
      ],
    },
    {
      key: 'foodPreference',
      title: 'What food preference should I keep in mind?',
      subtitle: 'This helps me suggest better dining options.',
      type: 'options',
      options: [
        'veg',
        'non-veg',
        'both',
        'jain',
        'vegan',
        'local food',
        'fine dining',
      ],
    },
    {
      key: 'ageGroup',
      title: 'What age group best fits the travellers?',
      subtitle: 'I’ll use this to make the trip more suitable.',
      type: 'options',
      options: ['kids', 'young adults', 'adults', 'seniors', 'mixed'],
    },
    {
      key: 'specialRequests',
      title: 'Any special requests?',
      subtitle:
        'Optional — things like avoid nightlife, more shopping, religious places, romantic places...',
      type: 'textarea',
      placeholder: 'Type any extra preferences...',
      optional: true,
    },
  ];

  const visibleQuestions = questions.filter(
    (q) => !q.condition || q.condition(formData)
  );

  const currentQuestion = visibleQuestions[step];
  const progress = currentQuestion
    ? ((step + 1) / visibleQuestions.length) * 100
    : 0;

  useEffect(() => {
    if (step > visibleQuestions.length - 1) {
      setStep(Math.max(visibleQuestions.length - 1, 0));
    }
  }, [step, visibleQuestions.length]);

  const handleNext = () => {
    if (!currentQuestion) return;

    const value = formData[currentQuestion.key];
    const isOptional = currentQuestion.optional;

    if (!isOptional && !String(value).trim()) {
      setError('Please answer this question before continuing.');
      return;
    }

    if (currentQuestion.key === 'duration') {
      const durationNum = parseInt(formData.duration, 10);
      if (isNaN(durationNum) || durationNum < 1) {
        setError('Please enter a valid number of days.');
        return;
      }
    }

    setError('');
    if (step < visibleQuestions.length - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setError('');
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const handleGenerate = async () => {
    if (
      !formData.destination.trim() ||
      !formData.duration.trim() ||
      !formData.budget.trim() ||
      !formData.tripType.trim() ||
      !formData.travelStyle.trim() ||
      !formData.pace.trim() ||
      !formData.hotelPreference.trim() ||
      !formData.foodPreference.trim() ||
      !formData.ageGroup.trim()
    ) {
      setError('Please complete the trip questions before generating.');
      return;
    }

    const durationNum = parseInt(formData.duration, 10);
    if (isNaN(durationNum) || durationNum < 1) {
      setError('Please enter a valid duration.');
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
          ...formData,
          duration: durationNum,
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      budget: formData.budget.trim(),
      summary: itinerary.summary,
      itinerary_data: {
        ...itinerary,
        userInputs: formData,
        userEnteredBudget: formData.budget.trim(),
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

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    const value = formData[currentQuestion.key];

    if (currentQuestion.type === 'input') {
      return (
        <input
          type={currentQuestion.inputType || 'text'}
          value={value}
          onChange={(e) => updateField(currentQuestion.key, e.target.value)}
          placeholder={currentQuestion.placeholder}
          disabled={loading}
          min={currentQuestion.key === 'duration' ? 1 : undefined}
          max={currentQuestion.key === 'duration' ? 365 : undefined}
          className="w-full px-4 py-4 border border-stone-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all disabled:opacity-50"
        />
      );
    }

    if (currentQuestion.type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => updateField(currentQuestion.key, e.target.value)}
          placeholder={currentQuestion.placeholder}
          disabled={loading}
          rows={4}
          className="w-full px-4 py-4 border border-stone-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all disabled:opacity-50 resize-none"
        />
      );
    }

    if (currentQuestion.type === 'options') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQuestion.options?.map((option) => {
            const selected = value === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => updateField(currentQuestion.key, option)}
                className={`text-left px-4 py-4 rounded-2xl border transition-all ${
                  selected
                    ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm'
                    : 'border-stone-200 hover:border-amber-300 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span className="capitalize font-medium">{option}</span>
              </button>
            );
          })}
        </div>
      );
    }

    return null;
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

        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-800">
                AI Trip Planner
              </h1>
              <p className="text-stone-500 text-sm">
                Answer a few smart questions and I’ll build your trip.
              </p>
            </div>
          </div>

          <div className="w-full bg-stone-100 rounded-full h-2 mb-6">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {currentQuestion && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
                  Question {step + 1} of {visibleQuestions.length}
                </p>
                <h2 className="text-2xl font-bold text-stone-800 mb-2">
                  {currentQuestion.title}
                </h2>
                <p className="text-stone-500 text-sm">
                  {currentQuestion.subtitle}
                </p>
              </div>

              {renderQuestionInput()}

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleBack}
                  disabled={step === 0 || loading}
                  className="sm:w-auto w-full px-5 py-3 rounded-2xl border border-stone-200 text-stone-600 disabled:opacity-50"
                >
                  Back
                </button>

                {step === visibleQuestions.length - 1 ? (
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-3.5 rounded-2xl transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating your itinerary...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate My AI Itinerary
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-2xl transition-all"
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          )}
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
                <div className="flex gap-2 flex-shrink-0 flex-wrap">
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

      <ChatBot />
    </div>
  );
}