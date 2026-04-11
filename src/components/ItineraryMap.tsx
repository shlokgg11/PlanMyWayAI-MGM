import { MapPin } from 'lucide-react';

interface Location {
  name: string;
  lat: number;
  lng: number;
  description: string;
}

interface Props {
  locations: Location[];
  destination: string;
}

const COLORS = [
  'bg-amber-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-rose-500',
  'bg-violet-500',
  'bg-orange-500',
];

export default function ItineraryMap({ locations, destination }: Props) {
  if (!locations || locations.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <div
        className="bg-gradient-to-r from-sky-50 to-blue-50 relative"
        style={{ height: '200px' }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, #cbd5e1 40px, #cbd5e1 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #cbd5e1 40px, #cbd5e1 41px)`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sky-400 text-sm font-medium flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {destination} — {locations.length} location
            {locations.length !== 1 ? 's' : ''}
          </p>
        </div>

        {locations.map((loc, i) => {
          const xOffset = 15 + i * (70 / Math.max(locations.length - 1, 1));
          const yOffset = 30 + (i % 2 === 0 ? 0 : 30);

          return (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{
                left: `${Math.min(xOffset, 85)}%`,
                top: `${yOffset}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className={`w-6 h-6 ${
                  COLORS[i % COLORS.length]
                } rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md border-2 border-white`}
              >
                {i + 1}
              </div>
              <div className="mt-1 bg-white/90 backdrop-blur-sm rounded-md px-1.5 py-0.5 text-xs text-stone-700 font-medium shadow-sm whitespace-nowrap max-w-[100px] text-center truncate">
                {loc.name}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {locations.map((loc, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors"
            >
              <div
                className={`w-6 h-6 ${
                  COLORS[i % COLORS.length]
                } rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5`}
              >
                {i + 1}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-stone-800 text-sm truncate">
                  {loc.name}
                </p>
                {loc.description && (
                  <p className="text-stone-500 text-xs mt-0.5 line-clamp-2">
                    {loc.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
