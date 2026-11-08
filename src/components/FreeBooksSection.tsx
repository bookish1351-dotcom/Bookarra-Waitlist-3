import { Gift, Ticket, Download, ArrowRight, Check } from 'lucide-react';

interface FreeBooksSectionProps {
  onOpenWaitlist: () => void;
  onOpenFreeBooksModal: () => void;
}

export function FreeBooksSection({
  onOpenWaitlist,
  onOpenFreeBooksModal,
}: FreeBooksSectionProps) {
  return (
    <section
      id="free-books"
      className="relative z-10 py-16 sm:py-24 px-5 sm:px-8 border-t border-black/10 bg-white/70 backdrop-blur-md"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-xs font-semibold tracking-wide text-amber-900 uppercase mb-3">
            <Gift className="w-3.5 h-3.5 text-amber-700" />
            <span>Reader Rewards</span>
          </div>
          <h2
            className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-neutral-950 mb-4"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Read More. Earn Free Books & Perks.
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            We are building Bookarra for passionate readers. Share your love of
            reading with friends and unlock free access, exclusive book drops,
            and 1 month of free Bookarra Premium.
          </p>
        </div>

        {/* 2 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 max-w-4xl mx-auto">
          {/* Pillar 1 */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-900 flex items-center justify-center mb-5">
                <Ticket className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                  Referral Perk
                </span>
              </div>
              <h3
                className="font-serif-display text-xl sm:text-2xl font-normal text-neutral-900 mb-2"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                1 Month Free Premium
              </h3>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed mb-4">
                Share your personal code with friends. When 5 friends join the
                waitlist using your link, an exclusive one-time code for 1 month
                free Bookarra Premium is automatically issued.
              </p>
            </div>
            <div className="pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tracked live in your referral dashboard</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-100/70 text-sky-900 flex items-center justify-center mb-5">
                <Download className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200/50">
                  Instant Download Library
                </span>
              </div>
              <h3
                className="font-serif-display text-xl sm:text-2xl font-normal text-neutral-900 mb-2"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                Free Online Books Catalogue
              </h3>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed mb-4">
                Join our waitlist and receive immediate access to a handpicked catalogue of online books to download in DRM-free EPUB & PDF formats. Read on Kindle, iPad, Kobo, or phone — yours to keep forever with zero subscription fees.
              </p>
            </div>
            <div className="pt-3 border-t border-neutral-100 flex flex-col gap-1 text-xs text-neutral-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>EPUB & PDF compatible with all e-readers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>New curated titles added every month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Callout Banner */}
        <div className="bg-neutral-900 text-white rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-lg text-center sm:text-left">
            <h3
              className="font-serif-display text-2xl sm:text-3xl font-normal mb-2 text-white"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Ready to claim your reading perks?
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Join thousands of readers counting down to the Bookarra launch.
              Receive your invite code immediately upon sign up.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="free-books-section-waitlist-btn"
              type="button"
              onClick={onOpenWaitlist}
              className="inline-flex items-center justify-center gap-2 bg-white text-black font-semibold text-sm px-6 py-3 rounded-full hover:bg-neutral-100 transition-colors shadow-sm cursor-pointer select-none"
            >
              <span>Join the Waitlist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenFreeBooksModal}
              className="inline-flex items-center justify-center text-neutral-300 hover:text-white underline underline-offset-4 text-xs sm:text-sm px-3 py-2 cursor-pointer font-medium"
            >
              View Free Books Details
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
