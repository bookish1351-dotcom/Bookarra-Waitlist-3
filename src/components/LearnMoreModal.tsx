import { useEffect } from 'react';
import {
  X,
  BookOpen,
  Target,
  Users,
  Share2,
  Bot,
  MessageCircleQuestion,
  Timer,
  ScanBarcode,
  ArrowRight,
} from 'lucide-react';

interface LearnMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWaitlist: () => void;
}

export function LearnMoreModal({
  isOpen,
  onClose,
  onOpenWaitlist,
}: LearnMoreModalProps) {
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
      id="learn-more-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="learn-more-modal-card"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-neutral-900 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-learn-more-modal"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-full text-xs font-semibold tracking-wide text-neutral-700 uppercase mb-3">
            About Bookarra
          </div>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-normal tracking-tight mb-2">
            Where your reading life finally makes sense.
          </h2>
          <p className="text-neutral-600 text-sm leading-relaxed">
            Bookarra brings your reading list, your goals, and your book community into one place — no spreadsheets, no sticky notes, no guesswork. Join the flock now.
          </p>
        </div>

        <div className="space-y-3.5 mb-6 max-h-[55vh] overflow-y-auto pr-1">
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
            <div className="p-2.5 bg-white rounded-lg shadow-2xs text-black shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif-display text-base font-semibold text-neutral-900 mb-0.5">
                Track Every Book
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Log every book you read, rate it, and build a complete reading history you can look back on anytime.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
            <div className="p-2.5 bg-white rounded-lg shadow-2xs text-black shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif-display text-base font-semibold text-neutral-900 mb-0.5">
                The TBR Jar + Smart Goals
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Toss your to-be-read titles into the jar, set reading goals, and let advanced analytics show you exactly how close you are to hitting them.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
            <div className="p-2.5 bg-white rounded-lg shadow-2xs text-black shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif-display text-base font-semibold text-neutral-900 mb-0.5">
                Book Clubs Built In
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Join a club, pick a read together, and discuss it in one place — no separate group chats or spreadsheets needed.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
            <div className="p-2.5 bg-white rounded-lg shadow-2xs text-black shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif-display text-base font-semibold text-neutral-900 mb-0.5">
                Shareable Progress Cards
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Turn your reading stats into beautiful cards you can share — your streak, your goal progress, your favorite reads of the month.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
            <div className="p-2.5 bg-white rounded-lg shadow-2xs text-black shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif-display text-base font-semibold text-neutral-900 mb-0.5">
                Your AI Reading Assistant
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Get personalized book recommendations and goal coaching from an assistant that actually knows your reading habits.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
            <div className="p-2.5 bg-white rounded-lg shadow-2xs text-black shrink-0">
              <MessageCircleQuestion className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif-display text-base font-semibold text-neutral-900 mb-0.5">
                Ask This Book
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                A spoiler-safe AI companion tied to exactly where you are in the book. Ask "who is this again?" or "what happened with the letter?" and get answers using only what you've already read — never a spoiler ahead of your page.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
            <div className="p-2.5 bg-white rounded-lg shadow-2xs text-black shrink-0">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif-display text-base font-semibold text-neutral-900 mb-0.5">
                Reading Sessions
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Start a timed reading session and track your real pace as you go. See how close you are to today's goal, and get nudged at the moment you're most likely to actually finish it.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
            <div className="p-2.5 bg-white rounded-lg shadow-2xs text-black shrink-0">
              <ScanBarcode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif-display text-base font-semibold text-neutral-900 mb-0.5">
                Instant Book Add
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Scan a barcode or search a title and the cover, author, pages, and summary fill in automatically — no manual typing, no hunting for details.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            id="modal-join-waitlist-btn"
            type="button"
            onClick={() => {
              onClose();
              onOpenWaitlist();
            }}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-black text-white font-bold py-3 px-5 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer text-center text-sm group"
          >
            <span>Join the Waitlist</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 rounded-full border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer text-center text-sm"
          >
            Back to page
          </button>
        </div>
      </div>
    </div>
  );
}
