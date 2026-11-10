import { useState } from 'react';
import type React from 'react';
import { X } from 'lucide-react';

const LOGO_SRC = '/bookarra-logo-transparent.png?v=3';

interface NavbarProps {
  onOpenContact?: () => void;
  onOpenFreeBooks?: () => void;
}

export function Navbar({ onOpenContact, onOpenFreeBooks }: NavbarProps) {
  const [isPointerDismissed, setIsPointerDismissed] = useState(false);

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <header
      id="navbar"
      className="fixed top-0 left-0 right-0 w-full z-20 px-5 sm:px-8 py-3 sm:py-4 flex justify-between items-center"
    >
      {/* Logo (left) */}
      <a
        id="brand-logo"
        href="#"
        onClick={handleScrollToTop}
        className="flex items-center group transition-transform duration-200 hover:scale-[1.03] cursor-pointer"
        aria-label="Bookarra Home"
      >
        <img
          id="bookarra-logo-img"
          src={LOGO_SRC}
          alt="Bookarra"
          className="h-10 sm:h-12 md:h-[58px] w-auto object-contain select-none"
          referrerPolicy="no-referrer"
        />
      </a>

      {/* Right Actions */}
      <div className="flex items-center gap-4 sm:gap-7">
        <div className="relative flex flex-col items-center">
          <button
            id="navbar-free-books-button"
            type="button"
            onClick={onOpenFreeBooks}
            className="text-[17px] sm:text-[20px] md:text-[23px] text-black underline underline-offset-4 hover:opacity-60 transition-opacity select-none font-medium cursor-pointer"
          >
            Free books
          </button>

          {/* Pointer pointing to Free books button */}
          {!isPointerDismissed && (
            <div
              id="pinterest-free-books-pointer"
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-30 select-none animate-bounce"
              style={{ animationDuration: '2.5s' }}
            >
              {/* Arrow caret pointing directly up at Free books button */}
              <div className="flex justify-center -mb-0.5">
                <div className="w-0 h-0 border-x-[6px] border-x-transparent border-b-[6px] border-b-neutral-950" />
              </div>

              {/* Callout Pill */}
              <div
                onClick={onOpenFreeBooks}
                className="flex items-center gap-1.5 sm:gap-2 bg-neutral-950/95 hover:bg-neutral-900 backdrop-blur-md text-white text-[11px] sm:text-xs font-medium pl-3 pr-2 py-1.5 sm:pl-3.5 sm:pr-2.5 sm:py-1.5 rounded-full shadow-2xl border border-white/20 whitespace-nowrap cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 group"
                title="Came here from Pinterest looking for a book? Click here to view and download"
              >
                <span className="font-semibold tracking-tight text-white/95">
                  Came here from Pinterest looking for a book?
                </span>

                {/* Finger pointer pointing up */}
                <span className="text-amber-300 text-xs sm:text-sm shrink-0">👆</span>

                {/* Quick dismiss button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPointerDismissed(true);
                  }}
                  className="ml-0.5 p-0.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Dismiss pointer"
                  title="Dismiss"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          id="desktop-cta"
          type="button"
          onClick={onOpenContact}
          className="text-[17px] sm:text-[20px] md:text-[23px] text-black underline underline-offset-4 hover:opacity-60 transition-opacity select-none font-medium cursor-pointer"
        >
          Get in touch
        </button>
      </div>
    </header>
  );
}

