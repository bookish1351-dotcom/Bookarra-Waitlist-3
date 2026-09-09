import { useState, useEffect } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';
import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onOpenWaitlist: () => void;
  onOpenLearnMore: () => void;
}

const HEADLINE_TEXT = 'Your next favorite book is waiting.';
const SUBTEXT =
  'Bookarra brings your reading list, your goals, and your book community into one place — no spreadsheets, no sticky notes, no guesswork. Join the flock now.';

export function HeroSection({
  onOpenWaitlist,
  onOpenLearnMore,
}: HeroSectionProps) {
  const { displayed, done } = useTypewriter(HEADLINE_TEXT, 36, 400);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setContentVisible(true);
    }, 450);

    return () => window.clearTimeout(timer);
  }, []);

  const handleLearnMore = () => {
    const el = document.getElementById('features-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onOpenLearnMore();
    }
  };

  return (
    <section
      id="hero-section"
      className="relative z-[1] w-full min-h-screen flex flex-col justify-end pb-14 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden"
    >
      {/* Content container */}
      <div className="max-w-3xl lg:max-w-4xl relative z-10">
        {/* Headline in DM Serif Display */}
        <h1
          id="hero-headline"
          className="font-serif-display font-medium text-black mb-3 sm:mb-4 tracking-tight whitespace-nowrap"
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 'clamp(18px, 3.8vw, 38px)',
            lineHeight: 1.2,
            fontWeight: 600,
            minHeight: '46px',
          }}
        >
          {displayed}
          {!done && (
            <span
              className="inline-block w-[2px] h-[0.85em] bg-black align-middle ml-[3px] cursor-blink"
              aria-hidden="true"
            />
          )}
        </h1>

        {/* Subtext in DM Serif Display */}
        <p
          id="hero-subtext"
          className="font-serif-display text-neutral-800 text-[15px] sm:text-[17px] md:text-[19px] mb-6 sm:mb-7 leading-relaxed max-w-2xl"
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          {SUBTEXT}
        </p>

        {/* Action buttons */}
        <div
          id="action-buttons-container"
          className="flex flex-wrap items-center gap-3 transition-all duration-400 ease-out"
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
          }}
        >
          <button
            id="join-waitlist-btn"
            type="button"
            onClick={onOpenWaitlist}
            className="inline-flex items-center justify-center bg-black text-white font-bold text-[14px] sm:text-[15px] px-6 py-3 rounded-full hover:bg-neutral-800 transition-all duration-200 shadow-sm hover:shadow hover:scale-[1.02] cursor-pointer select-none"
          >
            Join the Waitlist
          </button>

          <button
            id="learn-more-btn"
            type="button"
            onClick={handleLearnMore}
            className="inline-flex items-center justify-center bg-white text-black border border-black/15 font-medium text-[14px] sm:text-[15px] px-6 py-3 rounded-full hover:bg-black hover:text-white transition-all duration-200 shadow-sm hover:shadow hover:scale-[1.02] cursor-pointer select-none"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Scroll indicator for features */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-black/40 hover:text-black transition-colors cursor-pointer select-none hidden sm:flex"
        onClick={handleLearnMore}
        title="Scroll to features"
      >
        <span className="text-[11px] uppercase tracking-widest font-mono">
          Features
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
}
