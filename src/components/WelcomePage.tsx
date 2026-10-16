import { useState } from 'react';
import {
  Check,
  ChevronLeft,
  Mail,
  Sparkles,
  Copy,
  Share2,
  Ticket,
  Users,
  Award,
  Gift,
} from 'lucide-react';
import { BackgroundVideo } from './BackgroundVideo';
import {
  getCurrentUserProfile,
  getAllCodes,
  getShareableUrl,
  claimOrGetPremiumRewardCode,
  simulateAddReferral,
  type UserReferralProfile,
} from '../lib/referral';

interface WelcomePageProps {
  email?: string;
  onBackToHome: () => void;
  referralProfile?: UserReferralProfile | null;
  isWelcomeBack?: boolean;
}

export function WelcomePage({
  email,
  onBackToHome,
  referralProfile: propProfile,
  isWelcomeBack,
}: WelcomePageProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPromoCode, setCopiedPromoCode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Retrieve user profile (from props or storage)
  const profile = propProfile || getCurrentUserProfile(email);

  // If user has their own code, look up active stats
  const allCodes = getAllCodes();
  const codeRecord = profile?.referralCode ? allCodes[profile.referralCode] : null;
  const usedCount = codeRecord ? codeRecord.usedCount : 0;
  const maxUses = codeRecord ? codeRecord.maxUses : 5;
  const remaining = Math.max(0, maxUses - usedCount);

  // If 5 people joined, retrieve or generate their one-time promo code!
  const promoCode =
    profile?.premiumRewardCode ||
    (usedCount >= 5 && profile?.email ? claimOrGetPremiumRewardCode(profile.email) : null);

  const handleCopyCode = () => {
    if (!profile?.referralCode) return;
    navigator.clipboard.writeText(profile.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    if (!profile?.referralCode) return;
    navigator.clipboard.writeText(getShareableUrl(profile.referralCode));
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPromoCode = () => {
    if (!promoCode) return;
    navigator.clipboard.writeText(promoCode);
    setCopiedPromoCode(true);
    setTimeout(() => setCopiedPromoCode(false), 2000);
  };

  const handleSimulateFriend = () => {
    if (!profile?.referralCode) return;
    simulateAddReferral(profile.referralCode);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div
      id="welcome-page"
      className="relative min-h-screen w-full bg-[#ea6e76] text-neutral-900 flex flex-col justify-between items-center py-10 px-5 sm:px-8 overflow-x-hidden selection:bg-black selection:text-white"
    >
      {/* Fixed Mouse-Scrubbed Background Video from Main Home Page */}
      <BackgroundVideo />

      {/* Subtle ambient warm pink overlay to ensure video tones and contrast match */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-[#ea6e76]/20 via-transparent to-[#ea6e76]/30"
        aria-hidden="true"
      />

      {/* Top Brand Header */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-center pt-2 sm:pt-4">
        <button
          type="button"
          onClick={onBackToHome}
          className="flex items-center justify-center gap-2 group transition-transform duration-200 hover:scale-[1.02] cursor-pointer bg-white/85 backdrop-blur-md px-5 py-2.5 rounded-full border border-black/10 shadow-xs hover:bg-white"
          aria-label="Back to Bookarra Home"
        >
          <img
            src="/bookarra-logo-transparent.png?v=3"
            alt="Bookarra"
            className="h-9 sm:h-10 w-auto object-contain select-none"
            referrerPolicy="no-referrer"
          />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center text-center my-auto py-8 sm:py-12">
        {/* Main Headline */}
        <h1
          id="welcome-headline"
          className="font-serif-display text-5xl sm:text-6xl md:text-7xl font-normal text-black tracking-tight leading-[1.04] mb-4 sm:mb-5 select-none drop-shadow-xs"
        >
          {profile?.isGoldenTicketWinner ? (
            <>
              Golden Ticket.
              <br />
              You're in.
            </>
          ) : (
            <>
              You're in.
              <br />
              Almost.
            </>
          )}
        </h1>

        {/* Welcome Back Banner for Returning Members */}
        {isWelcomeBack && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-emerald-400 text-emerald-950 text-xs sm:text-sm font-semibold mb-4 shadow-sm animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            <span>Welcome back! You're already signed up. Here is your referral pass:</span>
          </div>
        )}

        {/* Step Progress Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-black/10 text-[11px] sm:text-xs font-mono font-medium tracking-widest text-neutral-800 uppercase mb-6 sm:mb-7 shadow-xs select-none">
          Step 1 of 3 Complete
        </div>

        {/* ============================================================== */}
        {/* EXCLUSIVE REFERRAL PASS SECTION                               */}
        {/* ============================================================== */}
        {profile?.hasOwnCode && profile.referralCode ? (
          <div
            id="referral-pass-card"
            className="w-full bg-white/95 backdrop-blur-md rounded-3xl border border-black/10 p-6 sm:p-7 shadow-2xl mb-7 text-left transition-all relative overflow-hidden"
          >
            {/* Ambient accent ribbon */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-200/40 via-rose-100/30 to-transparent pointer-events-none rounded-bl-full" />

            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-neutral-900 text-amber-400 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold block">
                    {profile.isGoldenTicketWinner
                      ? '1-in-5 Golden Ticket Winner'
                      : 'Exclusive Waitlist Pass'}
                  </span>
                  <h4 className="text-base sm:text-lg font-serif-display font-bold text-neutral-950">
                    Your 5-Person Invite Code
                  </h4>
                </div>
              </div>

              <span className="text-[11px] font-mono font-bold bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-full border border-neutral-200">
                {remaining} of 5 spots left
              </span>
            </div>

            {/* Code Box */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-neutral-50 p-3.5 rounded-2xl border border-black/10 mb-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <Ticket className="w-5 h-5 text-neutral-500 shrink-0" />
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-black select-all">
                  {profile.referralCode}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-semibold border border-black/10 transition-colors cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* UNLOCKED ONE-TIME CODE CARD (Shown when 5 friends have joined!) */}
            {promoCode ? (
              <div className="bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-amber-500/15 border-2 border-amber-400/90 rounded-2xl p-4 sm:p-5 mb-4 text-left shadow-lg relative overflow-hidden animate-fade-in">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-amber-500 text-white rounded-lg shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-900 font-bold block">
                        Goal Reached: 5 of 5 Friends Joined!
                      </span>
                      <h5 className="text-sm sm:text-base font-serif-display font-bold text-neutral-950">
                        Your 1 Month Free Premium Code
                      </h5>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 bg-emerald-700 text-white rounded-full font-bold shadow-2xs">
                    One-Time Use
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-amber-300 mb-2.5 shadow-xs">
                  <span className="font-mono text-lg sm:text-xl font-bold tracking-widest text-neutral-950 select-all">
                    {promoCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPromoCode}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-black hover:bg-neutral-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    {copiedPromoCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Code Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] sm:text-xs text-neutral-800 leading-snug">
                  🎉 <strong>Redemption details:</strong> This is your unique one-time code. Enter it at checkout when Bookarra launches to enjoy your first month of Premium completely free.
                </p>
              </div>
            ) : (
              /* 1 Month Free Premium Reward Banner (In Progress) */
              <div className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-amber-500/15 border border-amber-300 rounded-2xl mb-4 text-left shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Gift className="w-5 h-5" />
                </div>
                <div className="flex-1 text-xs leading-snug">
                  <span className="font-bold text-amber-950 block text-sm">
                    1 Month Free Bookarra Premium
                  </span>
                  <span className="text-amber-950/80 font-medium">
                    Get 5 people to join with your invite code to unlock an exclusive one-time use code for 1 month of Bookarra Premium free!
                  </span>
                </div>
              </div>
            )}

            {/* 5-Slot Visual Tracker */}
            <div className="space-y-2 mb-4 bg-white/70 rounded-2xl p-3.5 border border-neutral-200/70">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-700 font-medium flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-neutral-500" />
                  Friends joined with your code:
                </span>
                <span className="font-mono font-bold text-neutral-900">
                  {usedCount} / {maxUses}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((slot) => {
                  const filled = slot <= usedCount;
                  return (
                    <div
                      key={slot}
                      className={`h-2.5 rounded-full transition-all ${
                        filled
                          ? 'bg-black shadow-xs'
                          : 'bg-neutral-200/90 border border-black/5'
                      }`}
                      title={`Invite Slot ${slot} (${filled ? 'Claimed' : 'Available'})`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-1">
                {usedCount < maxUses ? (
                  <button
                    type="button"
                    onClick={handleSimulateFriend}
                    className="text-[10px] text-neutral-500 hover:text-black hover:underline cursor-pointer transition-colors"
                    title="Test simulator: click to simulate a friend using your code"
                  >
                    + Simulate friend joining (Test)
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> All 5 slots filled
                  </span>
                )}

                <div className="text-[11px] font-medium text-right">
                  {usedCount >= maxUses ? (
                    <span className="text-emerald-700 font-bold flex items-center justify-end gap-1">
                      <Check className="w-3.5 h-3.5" />
                      One-Time Code Ready!
                    </span>
                  ) : (
                    <span className="text-amber-800">
                      {remaining} more friend{remaining === 1 ? '' : 's'} to unlock code
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Crucial Rule Explanation */}
            <div className="bg-amber-50/70 rounded-xl p-3 border border-amber-200/60 text-[11px] sm:text-xs text-amber-950 leading-relaxed">
              <strong>How It Works:</strong> Share your code with 5 people. When all 5 join, you get a{' '}
              <span className="font-bold underline decoration-amber-400">one-time use code for 1 month free of Bookarra Premium</span>.
              Plus, exactly 1 out of your 5 referrals will unlock their own code to invite others!
            </div>
          </div>
        ) : profile?.usedReferralCode ? (
          /* Referred member who did not win code (the other 4 out of 5) */
          <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl border border-black/10 p-5 sm:p-6 shadow-xl mb-7 text-left">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-neutral-800">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Priority Access Spot Confirmed via {profile.usedReferralCode}</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-3">
              You are locked in as spot{' '}
              <strong className="text-neutral-950 font-bold">
                #{profile.referralSlotNumber || 1} of 5
              </strong>{' '}
              from your friend's invite code.
            </p>
            <div className="bg-neutral-100 rounded-xl p-3 text-[11px] text-neutral-600 leading-relaxed">
              <strong>Waitlist Invite Rule:</strong> To keep early access curated, only 1 out of
              every 5 referred readers unlocks their own invite codes to distribute. Your early
              access spot is 100% saved!
            </div>
          </div>
        ) : null}

        {/* 3-Step Progress List */}
        <div className="w-full max-w-sm bg-white/90 backdrop-blur-md rounded-3xl border border-black/10 p-6 sm:p-7 shadow-xl space-y-4 mb-7 text-left">
          {/* Step 1: Complete */}
          <div className="flex items-center gap-3.5">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div className="flex-1 flex items-baseline justify-between gap-2">
              <span className="text-neutral-950 font-semibold text-sm sm:text-base">
                <span className="font-mono text-neutral-400 mr-2 text-xs">1:</span>
                Reserved your spot
              </span>
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                Done
              </span>
            </div>
          </div>

          {/* Step 2: In Progress / Upcoming */}
          <div className="flex items-center gap-3.5 opacity-60">
            <div className="w-6 h-6 rounded-full border border-neutral-300 text-neutral-500 flex items-center justify-center shrink-0 text-xs font-mono">
              2
            </div>
            <div className="flex-1">
              <span className="text-neutral-700 font-medium text-sm sm:text-base">
                <span className="font-mono text-neutral-400 mr-2 text-xs">2:</span>
                We open the doors
              </span>
            </div>
          </div>

          {/* Step 3: Upcoming */}
          <div className="flex items-center gap-3.5 opacity-60">
            <div className="w-6 h-6 rounded-full border border-neutral-300 text-neutral-500 flex items-center justify-center shrink-0 text-xs font-mono">
              3
            </div>
            <div className="flex-1">
              <span className="text-neutral-700 font-medium text-sm sm:text-base">
                <span className="font-mono text-neutral-400 mr-2 text-xs">3:</span>
                You step in first
              </span>
            </div>
          </div>
        </div>

        {/* Narrative Copy */}
        <div className="space-y-3.5 text-center max-w-md px-6 py-5 bg-white/85 backdrop-blur-md rounded-2xl border border-black/10 shadow-lg">
          <p className="font-serif-display text-xl sm:text-2xl text-neutral-950 font-normal leading-snug">
            The library's still being built.
            <br />
            When it opens, you'll be the first one in.
          </p>
          <p className="text-neutral-700 text-sm sm:text-base leading-relaxed">
            Watch your inbox. We only email when it matters.
          </p>
          {email && (
            <div className="inline-flex items-center gap-2 pt-1 text-xs text-neutral-600 font-mono">
              <Mail className="w-3.5 h-3.5 text-neutral-500" />
              <span>
                Reserved for <strong className="text-neutral-900 font-semibold">{email}</strong>
              </span>
            </div>
          )}
        </div>
      </main>

      {/* Footer / Navigation Link */}
      <footer className="relative z-10 w-full max-w-4xl flex items-center justify-center pb-2 sm:pb-4">
        <button
          id="back-to-home-btn"
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-900 hover:text-black transition-all cursor-pointer py-2.5 px-5 rounded-full bg-white/90 backdrop-blur-md border border-black/10 shadow-xs hover:bg-white hover:shadow-md group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>back to home</span>
        </button>
      </footer>
    </div>
  );
}
