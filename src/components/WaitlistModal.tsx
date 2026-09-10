import { useState, useEffect, type FormEvent } from 'react';
import { X, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { submitToWaitlist } from '../lib/supabase';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (email: string) => void;
}

export function WaitlistModal({ isOpen, onClose, onSuccess }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitToWaitlist(cleanEmail);
      setSubmitted(true);
      if (onSuccess) {
        onSuccess(cleanEmail);
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="waitlist-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="waitlist-modal-card"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-neutral-900 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-waitlist-modal"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="font-serif-display text-2xl sm:text-3xl font-normal mb-2">You're on the list!</h3>
            <p className="text-neutral-600 text-sm mb-6 leading-relaxed">
              Thank you for signing up with <span className="font-semibold">{email}</span>. We'll send your exclusive invitation when early access opens.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-black text-white font-medium py-3 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-full text-xs font-semibold tracking-wide text-neutral-700 uppercase mb-4">
              Early Access
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Join the Waitlist
            </h2>
            <p className="text-neutral-600 text-sm mb-6 leading-relaxed">
              Be among the first to experience Bookarra. Enter your email to reserve your spot to get the first look into Bookarra and get updates on the making of it.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="waitlist-email" className="sr-only">
                  Email Address
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm text-neutral-900 placeholder:text-neutral-400"
                  autoFocus
                />
                {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
              </div>

              <button
                id="submit-waitlist-btn"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-black text-white font-medium py-3 px-5 rounded-full hover:bg-neutral-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all cursor-pointer group shadow-sm hover:shadow"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Reserving...</span>
                  </>
                ) : (
                  <>
                    <span>Reserve My Spot</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <p className="text-neutral-400 text-xs text-center mt-4">
              Zero spam. Unsubscribe at any time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
