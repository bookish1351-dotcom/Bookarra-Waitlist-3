import { useEffect } from 'react';
import {
  X,
  Gift,
  Ticket,
  ArrowRight,
  Download,
  CheckCircle2,
  Check,
} from 'lucide-react';

interface FreeBooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWaitlist: () => void;
  onOpenCatalogue?: () => void;
}

export function FreeBooksModal({
  isOpen,
  onClose,
  onOpenWaitlist,
}: FreeBooksModalProps) {
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

  return (
    <div
      id="free-books-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="free-books-modal-card"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-neutral-900 overflow-hidden border border-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-free-books-modal"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close Free Books modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-xs font-semibold tracking-wide text-amber-900 uppercase mb-3">
            <Gift className="w-3.5 h-3.5 text-amber-700" />
            <span>Exclusive Reader Rewards</span>
          </div>
          <h2
            className="font-serif-display text-2xl sm:text-3xl font-normal tracking-tight mb-2 text-neutral-950"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Free Books & Perks with Bookarra
          </h2>
          <p className="text-neutral-600 text-sm leading-relaxed">
            We believe reading should be celebrated and rewarded. Here is how
            every Bookarra waitlist member unlocks free books and membership
            perks.
          </p>
        </div>

        {/* Perks List */}
        <div className="space-y-3.5 mb-6 max-h-[50vh] overflow-y-auto pr-1">
          {/* Perk 1: Refer 5 Friends */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-gradient-to-br from-amber-50/60 to-orange-50/40 border border-amber-200/60">
            <div className="p-2.5 bg-white rounded-lg shadow-2xs text-amber-900 shrink-0 border border-amber-100">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="font-serif-display text-base font-semibold text-neutral-900">
                  1 Month Free Bookarra Premium
                </h4>
                <span className="text-[10px] uppercase font-bold bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded">
                  5 Referrals
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Invite 5 fellow readers using your unique referral code. Once 5
                friends join the waitlist, you automatically receive a single-use
                promo code for 1 full month of free Bookarra Premium!
              </p>
            </div>
          </div>

          {/* Perk 2: Catalogue of Online Books to Download */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-gradient-to-br from-sky-50/70 via-white to-blue-50/40 border border-sky-200/70 shadow-2xs">
            <div className="p-2.5 bg-sky-600 rounded-lg shadow-xs text-white shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-serif-display text-base font-semibold text-neutral-900">
                  Free Online Books Catalogue
                </h4>
                <span className="text-[10px] uppercase font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded border border-sky-200/60">
                  Instant Access
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed mb-2.5">
                Join the waitlist and unlock exclusive access to our ever-expanding catalogue of free online books. Download full titles straight to your Kindle, e-reader, tablet, or phone to read anywhere, anytime — completely offline.
              </p>

              {/* Key Highlights to Convert Reader */}
              <div className="space-y-1.5 pt-2 border-t border-sky-100/80 text-[11px] text-neutral-700">
                <div className="flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>EPUB & PDF formats — yours to keep forever with zero DRM lock-in</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Handpicked timeless classics, indie releases, and community favorites</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% free with no monthly subscription or hidden fees</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Early members get first pick as new books drop every month</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-sky-200/60">
                <span className="text-[11px] font-semibold text-neutral-800">
                  📖 Now Available: <em>Powerless</em>, <em>The Inheritance Games</em> series & more
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          id="free-books-join-cta"
          type="button"
          onClick={() => {
            onClose();
            onOpenWaitlist();
          }}
          className="w-full flex items-center justify-center gap-2 bg-black text-white font-semibold py-3 px-6 rounded-xl hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer select-none text-sm sm:text-base"
        >
          <span>Get Your Invite Code & Free Perks</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-[11px] text-neutral-400 mt-3 flex items-center justify-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
          <span>No credit card required. Free during early access.</span>
        </p>
      </div>
    </div>
  );
}
