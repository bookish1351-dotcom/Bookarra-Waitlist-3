import { useEffect, useState, type MouseEvent } from 'react';
import { X, Instagram, Pin, Video, Mail, ExternalLink, Copy, Check } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopyEmail?: () => void;
}

export const BOOKARRA_EMAIL_ADDRESS = 'Bookish1351@gmail.com';
export const BOOKISH_EMAIL_ADDRESS = BOOKARRA_EMAIL_ADDRESS;

export function ContactModal({ isOpen, onClose, onCopyEmail }: ContactModalProps) {
  const [copied, setCopied] = useState(false);

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

  const handleCopyEmail = (e?: MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigator.clipboard.writeText(BOOKARRA_EMAIL_ADDRESS);
    setCopied(true);
    if (onCopyEmail) {
      onCopyEmail();
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const contactItems = [
    {
      id: 'contact-email',
      name: 'Email Us',
      detail: 'Click to copy Bookish1351@gmail.com',
      icon: Mail,
      actionType: 'email',
      bgColor: 'bg-amber-50/70',
      iconColor: 'text-amber-900',
      borderColor: 'border-amber-200/60',
    },
    {
      id: 'contact-pinterest',
      name: 'Pinterest',
      detail: 'ca.pinterest.com/bookarra1351',
      href: 'https://ca.pinterest.com/bookarra1351/',
      icon: Pin,
      actionType: 'link',
      bgColor: 'bg-rose-50/70',
      iconColor: 'text-rose-900',
      borderColor: 'border-rose-200/60',
    },
    {
      id: 'contact-instagram',
      name: 'Instagram',
      detail: '@bookarra1351',
      href: 'https://www.instagram.com/bookarra1351/',
      icon: Instagram,
      actionType: 'link',
      bgColor: 'bg-purple-50/70',
      iconColor: 'text-purple-900',
      borderColor: 'border-purple-200/60',
    },
    {
      id: 'contact-tiktok',
      name: 'TikTok',
      detail: '@bookish1351d',
      href: 'https://www.tiktok.com/@bookish1351d',
      icon: Video,
      actionType: 'link',
      bgColor: 'bg-sky-50/70',
      iconColor: 'text-sky-900',
      borderColor: 'border-sky-200/60',
    },
  ];

  return (
    <div
      id="contact-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="contact-modal-card"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-neutral-900 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          id="close-contact-modal"
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-900 transition-colors p-1 rounded-full hover:bg-neutral-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-full text-xs font-semibold tracking-wide text-neutral-700 uppercase mb-3">
            Connect With Us
          </div>
          <h2
            className="font-serif-display text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-black"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Get in Touch
          </h2>
          <p className="text-neutral-600 text-sm leading-relaxed">
            Have questions, feedback, or want to follow the creation of Bookarra? Reach out directly or connect with us on our socials.
          </p>
        </div>

        {/* Contact Links Grid */}
        <div className="space-y-3">
          {contactItems.map((item) => {
            const Icon = item.icon;

            if (item.actionType === 'email') {
              return (
                <button
                  key={item.id}
                  id={item.id}
                  type="button"
                  onClick={() => handleCopyEmail()}
                  className={`w-full group flex items-center justify-between p-3.5 sm:p-4 rounded-xl border ${item.borderColor} ${item.bgColor} hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer text-left`}
                  title="Click to copy Bookish1351@gmail.com"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white shadow-xs ${item.iconColor} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-black">
                          {item.name}
                        </h3>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100/80 text-amber-800">
                          Click to copy
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 truncate">
                        {BOOKARRA_EMAIL_ADDRESS}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <div
                      className="p-1.5 rounded-md hover:bg-neutral-200/60 text-neutral-600 group-hover:text-black transition-colors"
                      aria-label="Copy email address"
                    >
                      {copied ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                          <Check className="w-3.5 h-3.5" /> Copied!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
                          <Copy className="w-4 h-4" /> Copy
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            }

            return (
              <a
                key={item.id}
                id={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-xl border ${item.borderColor} ${item.bgColor} hover:bg-white hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white shadow-xs ${item.iconColor} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-black">
                      {item.name}
                    </h3>
                    <p className="text-xs text-neutral-600 truncate">
                      {item.detail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-all" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span>We typically reply within 24 hours</span>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-900 font-semibold hover:underline underline-offset-4 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
