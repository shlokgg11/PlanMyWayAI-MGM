import { useState } from 'react';
import { X, CreditCard, CheckCircle, Loader2, Lock } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  tagline: string;
  price: number;
  duration: string;
}

interface Props {
  destination: Destination;
  onClose: () => void;
}

export default function PaymentModal({ destination, onClose }: Props) {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    await new Promise((r) => setTimeout(r, 2000));
    setStep('success');
  };

  const formatCard = (val: string) => {
    return val
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim();
  };

  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
    return clean;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <div>
            <h2 className="font-bold text-stone-800 text-lg">Confirm Booking</h2>
            <p className="text-sm text-stone-500">{destination.name} — {destination.duration}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        {step === 'details' && (
          <form onSubmit={handlePay} className="p-5 space-y-4">
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm text-stone-600">Amount Due</span>
              <span className="text-2xl font-bold text-amber-600">₹{destination.price}</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Name on Card</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCard(e.target.value))}
                  className="w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Expiry</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <Lock className="w-4 h-4" />
              Pay ₹{destination.price} Securely
            </button>

            <p className="text-center text-xs text-stone-400">
              256-bit SSL encryption. Your details are secure.
            </p>
          </form>
        )}

        {step === 'processing' && (
          <div className="p-12 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            <p className="text-stone-600 font-medium">Processing your payment...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-10 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-9 h-9 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-800">Booking Confirmed!</h3>
              <p className="text-stone-500 text-sm mt-1">
                Your trip to {destination.name} has been booked. Check your email for details.
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-2.5 rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
