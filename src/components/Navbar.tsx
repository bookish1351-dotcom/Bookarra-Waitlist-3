import type React from 'react';

const LOGO_SRC = '/bookarra-logo-transparent.png?v=3';

interface NavbarProps {
  onOpenContact?: () => void;
}

export function Navbar({ onOpenContact }: NavbarProps) {
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

      {/* Right Action */}
      <button
        id="desktop-cta"
        type="button"
        onClick={onOpenContact}
        className="text-[17px] sm:text-[20px] md:text-[23px] text-black underline underline-offset-4 hover:opacity-60 transition-opacity select-none font-medium cursor-pointer"
      >
        Get in touch
      </button>
    </header>
  );
}
