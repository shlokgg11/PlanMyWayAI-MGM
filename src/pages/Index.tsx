import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Star,
  Users,
  Globe,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DestinationCard from '@/components/DestinationCard';
import PaymentModal from '@/components/PaymentModal';
import ChatBot from '@/components/ChatBot';
import Navbar from '@/components/Navbar';

const destinations = [
  {
    id: 'kerala',
    price: '30,000',
    name: 'Kerala',
    tagline: "God's Own Country",
    image:
      'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800',
    highlights: [
      'Backwater houseboat cruise',
      'Munnar tea plantations',
      'Ayurvedic spa experience',
      'Fort Kochi heritage walk',
    ],
    duration: '5 Days / 4 Nights',
  },
  {
    id: 'goa',
    price: '22,000',
    name: 'Goa',
    tagline: 'Beach Paradise',
    image:
      'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg?auto=compress&cs=tinysrgb&w=800',
    highlights: [
      'Beach hopping tour',
      'Old Goa heritage sites',
      'Dudhsagar Falls trip',
      'Night cruise party',
    ],
    duration: '4 Days / 3 Nights',
  },
  {
    id: 'amritsar',
    price: '12,000',
    name: 'Amritsar',
    tagline: 'The Golden City',
    image:
      'https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=800',
    highlights: [
      'Golden Temple visit',
      'Wagah Border ceremony',
      'Jallianwala Bagh memorial',
      'Street food trail',
    ],
    duration: '3 Days / 2 Nights',
  },
  {
    id: 'london',
    price: '180,000',
    name: 'London',
    tagline: 'Historic & Modern City',
    image:
      'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800',
    highlights: [
      'Big Ben',
      'London Eye',
      'Buckingham Palace',
      'Thames River walk',
    ],
    duration: '4 Days / 3 Nights',
  },
  {
    id: 'bali',
    price: '80,000',
    name: 'Bali',
    tagline: 'Island of Gods',
    image:
      'https://images.pexels.com/photos/753339/pexels-photo-753339.jpeg?auto=compress&cs=tinysrgb&w=800',
    highlights: ['Beach clubs', 'Ubud temples', 'Rice terraces', 'Waterfalls'],
    duration: '5 Days / 4 Nights',
  },
  {
    id: 'dubai',
    price: '90,000',
    name: 'Dubai',
    tagline: 'Luxury & Futuristic City',
    image:
      'https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg?auto=compress&cs=tinysrgb&w=800',
    highlights: [
      'Burj Khalifa',
      'Desert Safari',
      'Dubai Mall',
      'Palm Jumeirah',
    ],
    duration: '4 Days / 3 Nights',
  },
];

const stats = [
  { icon: Users, value: '10,000+', label: 'Happy Travelers' },
  { icon: Globe, value: '50+', label: 'Destinations' },
  { icon: Star, value: '4.9', label: 'Average Rating' },
];

export default function Index() {
  const [selectedDest, setSelectedDest] = useState<
    (typeof destinations)[0] | null
  >(null);
  const [chatOpen, setChatOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBook = (dest: (typeof destinations)[0]) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setSelectedDest(dest);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/40" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-white/90 text-sm">
              AI-Powered Travel Planning
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Plan Your
            <span className="text-amber-400 block mt-1">Perfect Trip</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Explore India's most beautiful destinations with AI-generated
            itineraries & curated experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/planner')}
              className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-105 text-base shadow-lg shadow-amber-500/30"
            >
              <Sparkles className="w-5 h-5" />
              Generate AI Itinerary
            </button>
            <a
              href="#destinations"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 text-base"
            >
              Explore Plans
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-8 sm:gap-16">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Icon className="w-4 h-4 text-amber-400" />
                <span className="text-white font-bold text-lg">{value}</span>
              </div>
              <p className="text-white/60 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="destinations" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Featured Destinations
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-4">
              Our Travel Plans
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto">
              Choose your dream destination and embark on an unforgettable
              journey crafted by our AI travel engine
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onBook={() => handleBook(dest)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-amber-500 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="w-10 h-10 text-white/80 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Plan Any Trip with AI
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Enter any destination worldwide — our AI generates a complete
            day-by-day itinerary with activities, costs, locations, and travel
            tips in seconds
          </p>
          <button
            onClick={() => navigate('/planner')}
            className="flex items-center gap-2 bg-white text-amber-600 hover:bg-amber-50 font-bold px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-105 mx-auto text-base shadow-lg"
          >
            Try PlanMyWay-AI
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider mb-3">
                About Us
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-6">
                Your Trusted Travel Companion
              </h2>
              <p className="text-stone-500 leading-relaxed mb-6 text-lg">
                <strong className="text-stone-700">PlanMyWay-AI</strong> is your
                intelligent travel companion, curating the best experiences
                across India and beyond. We believe everyone deserves to
                explore.
              </p>
              <p className="text-stone-500 leading-relaxed text-lg">
                Our AI travel assistant is available 24/7 to help you plan your
                perfect getaway, generate custom itineraries, and answer all
                your travel questions.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                {[
                  'AI-Powered Planning',
                  '24/7 Chat Support',
                  'Budget Friendly',
                  'India Specialists',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="bg-amber-50 text-amber-700 text-sm font-medium px-4 py-2 rounded-full border border-amber-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Travel"
                className="rounded-2xl w-full h-72 object-cover shadow-xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-stone-100">
                <p className="text-amber-600 font-bold text-2xl">4.9 ★</p>
                <p className="text-stone-500 text-xs">
                  Rated by 10,000+ travelers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-4 bg-stone-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider mb-2">
            Contact
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-4">
            Get In Touch
          </h2>
          <p className="text-stone-500 mb-12">
            We'd love to hear from you. Reach out anytime.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Phone,
                label: 'Phone',
                value: '+91 9372399964',
                href: 'tel:+919372399964',
              },
              {
                icon: Mail,
                label: 'Email',
                value: 'planmywayai@gmail.com',
                href: 'mailto:planmywayai@gmail.com',
              },
              {
                icon: MapPin,
                label: 'Location',
                value: 'Mumbai, India',
                href:  'https://www.google.com/maps/search/?api=1&query=Mumbai+India'
              },
            ].map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-amber-200 transition-colors">
                  <Icon className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-stone-500 text-xs mb-1">{label}</p>
                <p className="font-semibold text-stone-700">{value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-stone-900 text-stone-400 py-8 px-4 text-center">
        <p className="font-bold text-white mb-1">PlanMyWay-AI</p>
        <p className="text-sm">
          © 2026 PlanMyWay. All rights reserved. Made with love for Indian
          travelers.
        </p>
      </footer>

      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-4 w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg shadow-amber-500/40 flex items-center justify-center transition-all hover:scale-110 z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {chatOpen && <ChatBot onClose={() => setChatOpen(false)} />}
      {selectedDest && (
        <PaymentModal
          destination={selectedDest}
          onClose={() => setSelectedDest(null)}
        />
      )}
    </div>
  );
}
