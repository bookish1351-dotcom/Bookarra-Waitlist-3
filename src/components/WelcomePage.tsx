import { Check, ChevronLeft, Mail } from 'lucide-react';
import { BackgroundVideo } from './BackgroundVideo';

interface WelcomePageProps {
  email?: string;
  onBackToHome: () => void;
}

export function WelcomePage({ email, onBackToHome }: WelcomePageProps) {
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
          className="font-serif-display text-5xl sm:text-6xl md:text-7xl font-normal text-black tracking-tight leading-[1.04] mb-6 sm:mb-7 select-none drop-shadow-xs"
        >
          You're in.
          <br />
          Almost.
        </h1>

        {/* Step Progress Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-black/10 text-[11px] sm:text-xs font-mono font-medium tracking-widest text-neutral-800 uppercase mb-7 sm:mb-8 shadow-xs select-none">
          Step 1 of 3 Complete
        </div>

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
              <span>Reserved for <strong className="text-neutral-900 font-semibold">{email}</strong></span>
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
