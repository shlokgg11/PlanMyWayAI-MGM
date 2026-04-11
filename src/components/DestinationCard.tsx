import { Clock, Sparkles } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  tagline: string;
  price: number;
  image: string;
  highlights: string[];
  duration: string;
}

interface Props {
  destination: Destination;
  onBook: () => void;
}

export default function DestinationCard({ destination, onBook }: Props) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-stone-100">
      <div className="relative overflow-hidden h-56">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-2xl font-bold">{destination.name}</h3>
          <p className="text-sm text-white/80">{destination.tagline}</p>
        </div>
        <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          From ₹{destination.price}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-4">
          <Clock className="w-3.5 h-3.5" />
          {destination.duration}
        </div>

        <ul className="space-y-1.5 mb-5">
          {destination.highlights.map((h, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-stone-600">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
              {h}
            </li>
          ))}
        </ul>

        <button
          onClick={onBook}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
        >
          <Sparkles className="w-4 h-4" />
          Book Now
        </button>
      </div>
    </div>
  );
}
