/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BackgroundVideo } from './components/BackgroundVideo';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { WaitlistModal } from './components/WaitlistModal';
import { LearnMoreModal } from './components/LearnMoreModal';
import { ContactModal, BOOKARRA_EMAIL_ADDRESS } from './components/ContactModal';
import { WelcomePage } from './components/WelcomePage';
import { Instagram, Pin, Video, Mail, Check } from 'lucide-react';

export default function App() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [signedUpEmail, setSignedUpEmail] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const isWelcomeRoute =
        window.location.pathname === '/welcome' ||
        window.location.search.includes('welcome=true');
      if (isWelcomeRoute) {
        return localStorage.getItem('bookarra_last_email') || 'your email';
      }
    }
    return null;
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(BOOKARRA_EMAIL_ADDRESS);
    setShowCopyToast(true);
  };

  const handleWaitlistSuccess = (email: string) => {
    setIsWaitlistOpen(false);
    setSignedUpEmail(email);
    try {
      localStorage.setItem('bookarra_last_email', email);
      window.history.pushState({}, '', '/welcome');
    } catch {
      // Ignore history/storage errors
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSignedUpEmail(null);
    try {
      window.history.replaceState({}, '', '/');
    } catch {
      // Ignore history errors
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname !== '/welcome') {
        setSignedUpEmail(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!showCopyToast) return;
    const timer = setTimeout(() => {
      setShowCopyToast(false);
    }, 3200);
    return () => clearTimeout(timer);
  }, [showCopyToast]);

  // If the user signed up, show the dedicated welcome confirmation page
  if (signedUpEmail) {
    return (
      <WelcomePage
        email={signedUpEmail}
        onBackToHome={handleBackToHome}
      />
    );
  }

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden selection:bg-black selection:text-white">
      {/* Fixed Mouse-Scrubbed Background Video */}
      <BackgroundVideo />

      {/* Fixed Navigation Bar */}
      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      {/* Main Hero Content */}
      <HeroSection
        onOpenWaitlist={() => setIsWaitlistOpen(true)}
        onOpenLearnMore={() => setIsLearnMoreOpen(true)}
      />

      {/* 3 Core Features Section */}
      <FeaturesSection onOpenWaitlist={() => setIsWaitlistOpen(true)} />

      {/* Footer */}
      <footer className="relative z-10 py-12 px-5 sm:px-8 border-t border-black/10 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center gap-5">
          <p className="text-xs text-neutral-500 font-medium">
            © {new Date().getFullYear()} Bookarra. All rights reserved.
          </p>

          {/* Social Links & Email */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-neutral-800">
            <a
              id="footer-pinterest-link"
              href="https://ca.pinterest.com/bookarra1351/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium hover:text-black hover:underline underline-offset-4 transition-colors"
            >
              <Pin className="w-3.5 h-3.5 text-neutral-600" />
              <span>Pinterest</span>
            </a>

            <a
              id="footer-instagram-link"
              href="https://www.instagram.com/bookarra1351/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium hover:text-black hover:underline underline-offset-4 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-neutral-600" />
              <span>Instagram</span>
            </a>

            <a
              id="footer-tiktok-link"
              href="https://www.tiktok.com/@bookish1351d"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium hover:text-black hover:underline underline-offset-4 transition-colors"
            >
              <Video className="w-3.5 h-3.5 text-neutral-600" />
              <span>TikTok</span>
            </a>

            <button
              id="footer-email-button"
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1.5 font-medium hover:text-black hover:underline underline-offset-4 transition-colors cursor-pointer"
              title="Click to copy Bookish1351@gmail.com"
            >
              <Mail className="w-3.5 h-3.5 text-neutral-600" />
              <span>Bookish1351@gmail.com</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-neutral-500 pt-1">
            <button
              type="button"
              onClick={() => setIsLearnMoreOpen(true)}
              className="hover:text-black transition-colors cursor-pointer"
            >
              About
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsWaitlistOpen(true)}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Waitlist
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="hover:text-black transition-colors cursor-pointer font-medium text-neutral-800"
            >
              Get in touch
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        onSuccess={handleWaitlistSuccess}
      />
      <LearnMoreModal
        isOpen={isLearnMoreOpen}
        onClose={() => setIsLearnMoreOpen(false)}
        onOpenWaitlist={() => setIsWaitlistOpen(true)}
      />
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        onCopyEmail={handleCopyEmail}
      />

      {/* Bottom Right Toast Notification */}
      {showCopyToast && (
        <aside
          id="email-copied-toast"
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 bg-neutral-900/95 text-white rounded-xl shadow-2xl border border-neutral-800 text-xs sm:text-sm font-medium backdrop-blur-md animate-fade-in transition-all"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-semibold text-white">Email copied to clipboard!</span>
            <span className="text-[11px] text-neutral-400">{BOOKARRA_EMAIL_ADDRESS}</span>
          </div>
        </aside>
      )}
    </main>
  );
}
