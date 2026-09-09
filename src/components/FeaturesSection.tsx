import { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  Target,
  Users,
  Share2,
  Bot,
  MessageCircleQuestion,
  Timer,
  ScanBarcode,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface FeaturesSectionProps {
  onOpenWaitlist: () => void;
}

const FEATURES = [
  {
    id: 'feature-1',
    badge: '01 / CATALOG',
    title: 'Track Every Book',
    description:
      'Log every book you read, rate it, and build a complete reading history you can look back on anytime.',
    icon: BookOpen,
    category: 'Bookarra Core',
  },
  {
    id: 'feature-2',
    badge: '02 / PROGRESS',
    title: 'The TBR Jar + Smart Goals',
    description:
      'Toss your to-be-read titles into the jar, set reading goals, and let advanced analytics show you exactly how close you are to hitting them.',
    icon: Target,
    category: 'Bookarra Goals',
  },
  {
    id: 'feature-3',
    badge: '03 / COMMUNITY',
    title: 'Book Clubs Built In',
    description:
      'Join a club, pick a read together, and discuss it in one place — no separate group chats or spreadsheets needed.',
    icon: Users,
    category: 'Bookarra Social',
  },
  {
    id: 'feature-4',
    badge: '04 / SHARE',
    title: 'Shareable Progress Cards',
    description:
      'Turn your reading stats into beautiful cards you can share — your streak, your goal progress, your favorite reads of the month.',
    icon: Share2,
    category: 'Bookarra Showcase',
  },
  {
    id: 'feature-5',
    badge: '05 / INTELLIGENCE',
    title: 'Your AI Reading Assistant',
    description:
      'Get personalized book recommendations and goal coaching from an assistant that actually knows your reading habits.',
    icon: Bot,
    category: 'Bookarra AI',
  },
  {
    id: 'feature-6',
    badge: '06 / COMPANION',
    title: 'Ask This Book',
    description:
      'A spoiler-safe AI companion tied to exactly where you are in the book. Ask "who is this again?" or "what happened with the letter?" and get answers using only what you\'ve already read — never a spoiler ahead of your page.',
    icon: MessageCircleQuestion,
    category: 'Bookarra Companion',
  },
  {
    id: 'feature-7',
    badge: '07 / FOCUS',
    title: 'Reading Sessions',
    description:
      'Start a timed reading session and track your real pace as you go. See how close you are to today\'s goal, and get nudged at the moment you\'re most likely to actually finish it.',
    icon: Timer,
    category: 'Bookarra Tracker',
  },
  {
    id: 'feature-8',
    badge: '08 / SCANNER',
    title: 'Instant Book Add',
    description:
      'Scan a barcode or search a title and the cover, author, pages, and summary fill in automatically — no manual typing, no hunting for details.',
    icon: ScanBarcode,
    category: 'Bookarra Quick Add',
  },
];

export function FeaturesSection({ onOpenWaitlist }: FeaturesSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateScrollState = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

    // Approximate active card
    const cardElements = el.children;
    if (cardElements.length > 0) {
      let closestIdx = 0;
      let minDistance = Infinity;
      for (let i = 0; i < cardElements.length; i++) {
        const child = cardElements[i] as HTMLElement;
        const distance = Math.abs(child.offsetLeft - (scrollLeft + el.offsetLeft));
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = i;
        }
      }
      setActiveIndex(closestIdx);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = 360; // scroll by roughly one card + gap
    el.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  };

  const scrollToCard = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const card = el.children[index] as HTMLElement;
    if (card) {
      card.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  };

  return (
    <section
      id="features-section"
      className="relative z-10 w-full py-20 px-5 sm:px-8 md:px-10 max-w-6xl mx-auto"
      aria-label="Bookarra Features"
    >
      {/* Section Header with Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full text-xs font-semibold tracking-wider text-neutral-800 uppercase mb-3 select-none">
            Key Features
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-neutral-950 font-normal tracking-tight mb-4 leading-tight">
            Everything your books deserve.
          </h2>
          <p className="text-neutral-700 text-base sm:text-lg leading-relaxed">
            Bookarra brings your reading list, your goals, and your book community into one place — no spreadsheets, no sticky notes, no guesswork. Join the flock now.
          </p>
        </div>

        {/* Horizontal Navigation Controls */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
          <span className="text-xs font-mono text-neutral-500 mr-1 hidden sm:inline select-none">
            Scroll for more ({activeIndex + 1}/{FEATURES.length})
          </span>
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll features left"
            className="p-3 rounded-full border border-black/10 bg-white/90 backdrop-blur-md shadow-xs text-neutral-900 hover:bg-neutral-100 disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll features right"
            className="p-3 rounded-full border border-black/10 bg-white/90 backdrop-blur-md shadow-xs text-neutral-900 hover:bg-neutral-100 disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontally Scrollable Feature Carousel */}
      <div className="relative mb-6">
        <div
          ref={scrollContainerRef}
          id="features-scroll-bar"
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-2 -mx-5 px-5 sm:-mx-8 sm:px-8 md:-mx-10 md:px-10 no-scrollbar cursor-grab active:cursor-grabbing"
          style={{ scrollPaddingLeft: '1.25rem' }}
        >
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            const isHighlight = idx >= 3;
            return (
              <div
                key={feature.id}
                id={feature.id}
                className={`group flex flex-col justify-between w-[300px] sm:w-[350px] md:w-[370px] shrink-0 snap-start bg-white/90 backdrop-blur-md rounded-2xl border p-6 sm:p-8 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                  isHighlight ? 'border-black/20 ring-1 ring-black/5' : 'border-black/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-black/5 group-hover:bg-black group-hover:text-white text-neutral-900 rounded-xl transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-medium tracking-wider text-neutral-400 group-hover:text-neutral-700 transition-colors">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="font-serif-display text-xl sm:text-2xl font-normal text-neutral-950 tracking-tight mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    {feature.category}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 group-hover:bg-black transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Pagination Indicators */}
      <div className="flex items-center justify-center gap-2 mb-14">
        {FEATURES.map((feat, idx) => (
          <button
            key={feat.id}
            type="button"
            onClick={() => scrollToCard(idx)}
            aria-label={`Go to ${feat.title}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              activeIndex === idx
                ? 'w-8 bg-neutral-950'
                : 'w-2 bg-neutral-300 hover:bg-neutral-400'
            }`}
          />
        ))}
      </div>

      {/* Bottom CTA Card */}
      <div
        id="features-cta-banner"
        className="bg-neutral-950 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
      >
        <div className="max-w-lg text-center md:text-left">
          <h3 className="font-serif-display text-2xl sm:text-3xl font-normal tracking-tight mb-2">
            Ready to experience Bookarra?
          </h3>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Reserve your early member spot today to receive access to the private beta and upcoming drops.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenWaitlist}
          className="inline-flex items-center justify-center gap-2 bg-white text-black font-bold text-sm sm:text-base px-7 py-3.5 rounded-full hover:bg-neutral-200 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer whitespace-nowrap group"
        >
          <span>Join the Waitlist</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}

