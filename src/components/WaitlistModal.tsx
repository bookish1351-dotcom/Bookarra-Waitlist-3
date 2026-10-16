import { useState, useEffect, type FormEvent } from 'react';
import {
  X,
  CheckCircle,
  ArrowRight,
  Loader2,
  Sparkles,
  Ticket,
  Copy,
  Check,
  Share2,
  Users,
  Gift,
} from 'lucide-react';
import { submitToWaitlist } from '../lib/supabase';
import {
  processReferralSignup,
  checkReferralCode,
  getShareableUrl,
  type ReferralSignupResult,
} from '../lib/referral';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (email: string, result?: ReferralSignupResult) => void;
  defaultReferralCode?: string;
}

export function WaitlistModal({
  isOpen,
  onClose,
  onSuccess,
  defaultReferralCode = '',
}: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState(defaultReferralCode);
  const [showReferralInput, setShowReferralInput] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [referralResult, setReferralResult] = useState<ReferralSignupResult | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Check URL query parameters for ?ref= or ?invite=
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRef = params.get('ref') || params.get('invite');
      if (urlRef) {
        setReferralCode(urlRef.trim().toUpperCase());
        setShowReferralInput(true);
      } else if (defaultReferralCode) {
        setReferralCode(defaultReferralCode.trim().toUpperCase());
        setShowReferralInput(true);
      }
    }
  }, [defaultReferralCode, isOpen]);

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

    const trimmedCode = referralCode.trim().toUpperCase();

    // If a referral code was typed, validate it first
    if (trimmedCode) {
      const validation = checkReferralCode(trimmedCode);
      if (!validation.valid) {
        setError(validation.error || 'Invalid referral code.');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      // 1. Process referral engine rules
      const refResult = processReferralSignup(cleanEmail, trimmedCode || undefined);
      if (!refResult.success) {
        setError(refResult.error || 'Could not process referral code.');
        setLoading(false);
        return;
      }

      // 2. Submit to Supabase / Local storage
      await submitToWaitlist(cleanEmail, {
        referralCode: refResult.referralCode,
        usedReferralCode: refResult.usedReferralCode,
        hasInvitePrivilege: refResult.hasOwnCode,
      });

      setReferralResult(refResult);
      setSubmitted(true);

      if (onSuccess) {
        onSuccess(cleanEmail, refResult);
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!referralResult?.referralCode) return;
    navigator.clipboard.writeText(referralResult.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    if (!referralResult?.referralCode) return;
    navigator.clipboard.writeText(getShareableUrl(referralResult.referralCode));
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      id="waitlist-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="waitlist-modal-card"
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-neutral-900 overflow-hidden border border-black/5"
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
          <div className="text-center py-2 animate-fade-in">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs">
              <CheckCircle className="w-6 h-6 stroke-[2.5]" />
            </div>

            <h3 className="font-serif-display text-2xl sm:text-3xl font-normal mb-1">
              {referralResult?.isGoldenTicketWinner
                ? 'Golden Ticket Unlocked!'
                : "You're on the list!"}
            </h3>

            <p className="text-neutral-600 text-xs sm:text-sm mb-5 leading-relaxed">
              Reserved for <span className="font-semibold text-neutral-900">{email}</span>.
            </p>

            {/* CASE 1: User got their own code (either direct signup OR 1-in-5 winner) */}
            {referralResult?.hasOwnCode && referralResult.referralCode && (
              <div className="bg-gradient-to-br from-neutral-50 to-neutral-100/90 rounded-2xl p-4 sm:p-5 border border-black/10 text-left mb-5 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-neutral-600 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Your Exclusive Invite Code</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-black text-white rounded-full font-bold">
                    5 Invites
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-black/10 mb-3 shadow-2xs">
                  <span className="font-mono text-base sm:text-lg font-bold tracking-widest text-neutral-950">
                    {referralResult.referralCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Premium Reward Badge */}
                <div className="flex items-center gap-2.5 p-3 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-300/80 rounded-xl mb-3 text-left shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-[11px] leading-snug">
                    <span className="font-bold text-amber-950 block text-xs">
                      Bonus Perk: 1 Month Free Premium!
                    </span>
                    <span className="text-amber-900/90 font-medium">
                      Get all 5 people to join with your code to unlock 1 month of Bookarra Premium for free at launch.
                    </span>
                  </div>
                </div>

                {/* 5-Invite Slots Visual Tracker */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-[11px] text-neutral-600 font-medium">
                    <span>Invite capacity:</span>
                    <span className="font-mono font-semibold text-neutral-900">
                      0 of 5 friends joined
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5].map((slot) => (
                      <div
                        key={slot}
                        className="h-2 rounded-full bg-neutral-200 border border-black/5"
                        title={`Invite slot ${slot}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Referral Rule Explanation */}
                <p className="text-[11px] text-neutral-500 leading-snug">
                  <strong className="text-neutral-800">Rule:</strong> Share with 5 people. Only 1 out of your 5 referrals will receive their own invite code to pass on.
                </p>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full mt-3 inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-black text-white text-xs font-medium py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Invite Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Copy Shareable Link</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* CASE 2: User signed up via someone's code and is one of the other 4 */}
            {!referralResult?.hasOwnCode && referralResult?.usedReferralCode && (
              <div className="bg-neutral-50 rounded-2xl p-4 sm:p-5 border border-black/10 text-left mb-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 mb-1.5">
                  <Ticket className="w-4 h-4 text-neutral-600" />
                  <span>Joined via {referralResult.usedReferralCode}</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed mb-2">
                  You secured spot{' '}
                  <strong className="text-neutral-950 font-bold">
                    #{referralResult.referralSlotNumber || 1} of 5
                  </strong>{' '}
                  under this referral code.
                </p>
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 text-[11px] text-amber-900 leading-snug">
                  <strong>Referral Rule:</strong> Only 1 out of 5 referred readers unlocks their own
                  invite codes. Your spot in line is locked in!
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full bg-black text-white font-medium py-3 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer text-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-full text-[11px] font-semibold tracking-wide text-neutral-700 uppercase mb-3">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Early Access</span>
            </div>

            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Join the Waitlist
            </h2>
            <p className="text-neutral-600 text-xs sm:text-sm mb-4 leading-relaxed">
              Reserve your spot for early access to Bookarra. Direct signups receive an exclusive
              invite code — invite 5 friends to earn <strong className="text-neutral-900 font-semibold">1 month free of Bookarra Premium</strong>!
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
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
              </div>

              {/* Referral Code Field */}
              {showReferralInput || referralCode ? (
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-1.5 animate-fade-in">
                  <div className="flex items-center justify-between text-xs text-neutral-700 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5 text-neutral-500" />
                      Referral Code
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setReferralCode('');
                        setShowReferralInput(false);
                      }}
                      className="text-[11px] text-neutral-400 hover:text-neutral-600 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <input
                    id="referral-code-input"
                    type="text"
                    placeholder="e.g. BOOK-VIP5"
                    value={referralCode}
                    onChange={(e) => {
                      setReferralCode(e.target.value.toUpperCase());
                      if (error) setError('');
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white font-mono text-sm tracking-wider uppercase focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <p className="text-[11px] text-neutral-500 leading-tight">
                    Joining with a friend's code? Only 1 in 5 referred members unlocks their own
                    invite code.
                  </p>
                </div>
              ) : (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowReferralInput(true)}
                    className="text-xs text-neutral-500 hover:text-neutral-900 underline underline-offset-2 transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Ticket className="w-3 h-3" />
                    Have a referral code?
                  </button>
                </div>
              )}

              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

              <button
                id="submit-waitlist-btn"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-black text-white font-medium py-3 px-5 rounded-full hover:bg-neutral-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all cursor-pointer group shadow-sm hover:shadow text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Reserving your spot...</span>
                  </>
                ) : (
                  <>
                    <span>Reserve My Spot</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
              <Users className="w-3 h-3" />
              <span>5 invites per code • 1-in-5 referral pass rule</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
