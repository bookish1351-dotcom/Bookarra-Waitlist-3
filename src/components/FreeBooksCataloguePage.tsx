import { useState, useMemo } from 'react';
import {
  Download,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Smartphone,
  Tablet,
  Laptop,
  Share2,
  Check,
  Search,
  Filter,
  Clock,
  X,
} from 'lucide-react';
import { FREE_BOOKS, type FreeBook } from '../data/freeBooks';

interface FreeBooksCataloguePageProps {
  onBack: () => void;
  userEmail?: string;
}

export function FreeBooksCataloguePage({
  onBack,
  userEmail,
}: FreeBooksCataloguePageProps) {
  const [downloadingBookTitle, setDownloadingBookTitle] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [activeModalBook, setActiveModalBook] = useState<FreeBook | null>(null);

  // Identify featured book (defaults to Powerless)
  const featuredBook = useMemo(() => {
    return FREE_BOOKS.find((b) => b.featured) || FREE_BOOKS[0];
  }, []);

  // Compute genres list dynamically
  const genres = useMemo(() => {
    const list = Array.from(new Set(FREE_BOOKS.map((b) => b.genre)));
    return ['all', ...list];
  }, []);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return FREE_BOOKS.filter((book) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGenre =
        selectedGenre === 'all' || book.genre === selectedGenre;

      return matchesSearch && matchesGenre;
    });
  }, [searchQuery, selectedGenre]);

  const handleDownload = (book: FreeBook) => {
    if (book.status !== 'available' || !book.pdfUrl || book.pdfUrl === '#') {
      setActiveModalBook(book);
      return;
    }

    setDownloadingBookTitle(book.title);

    // Direct browser download
    const link = document.createElement('a');
    link.href = book.pdfUrl;
    link.download = book.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingBookTitle(null);
    }, 4500);
  };

  const handleCopyShareLink = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const availableCount = FREE_BOOKS.filter((b) => b.status === 'available').length;

  return (
    <div
      id="free-books-catalogue-page"
      className="min-h-screen w-full bg-[#fbf9f5] text-neutral-900 selection:bg-amber-200 selection:text-neutral-900"
    >
      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-black/5 px-4 sm:px-8 py-3.5 sm:py-4 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <button
            id="catalogue-back-btn"
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-700 hover:text-black py-1.5 px-3 rounded-lg hover:bg-neutral-100/80 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>{userEmail ? 'Back to Waitlist Pass' : 'Back to Home'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className="font-serif-display text-lg sm:text-xl font-normal tracking-tight text-neutral-950"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Bookarra
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs sm:text-sm font-medium text-neutral-600">
              Free Books Catalogue
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100/80 border border-amber-300/70 text-[11px] font-semibold text-amber-900">
              <Sparkles className="w-3 h-3 text-amber-700" />
              <span>Free Books Unlocked</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-24">
        {/* Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-4 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Complimentary Member Library</span>
          </div>

          <h1
            className="font-serif-display text-3xl sm:text-5xl font-normal text-neutral-950 tracking-tight leading-tight mb-4"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Your Free Books Catalogue
          </h1>

          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Welcome to the Bookarra digital library. Download complete, DRM-free
            e-books directly to your phone, Kindle, or e-reader. Click on any
            book cover or download button to start reading immediately.
          </p>
        </div>

        {/* Global Download Feedback State */}
        {downloadingBookTitle && (
          <div className="max-w-xl mx-auto mb-8 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-900 flex items-center gap-2.5 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Downloading <strong>{downloadingBookTitle}</strong> (PDF)... Happy reading!
            </span>
          </div>
        )}

        {/* Featured Book Showcase (Powerless by Lauren Roberts) */}
        {featuredBook && (
          <section className="bg-white rounded-3xl border border-black/10 shadow-xl overflow-hidden p-6 sm:p-10 mb-14">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-neutral-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500">
                Featured Book Drop
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-center">
              {/* Featured Book Cover (Clickable to Download) */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div
                  id="featured-book-cover"
                  onClick={() => handleDownload(featuredBook)}
                  className="group relative cursor-pointer select-none transition-transform duration-300 hover:scale-[1.03] active:scale-[0.99]"
                  title={`Click to download ${featuredBook.title} (${featuredBook.format})`}
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 via-purple-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />

                  <div className="relative rounded-xl overflow-hidden shadow-2xl border border-black/20 bg-neutral-900 max-w-[280px] sm:max-w-[320px] mx-auto ring-1 ring-black/5">
                    <img
                      src={featuredBook.coverImage}
                      alt={`${featuredBook.title} by ${featuredBook.author}`}
                      className="w-full h-auto object-cover block"
                      loading="eager"
                    />

                    {/* Spine highlight overlay */}
                    <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/50 via-white/10 to-transparent pointer-events-none" />

                    {/* Hover Overlay with Download prompt */}
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center text-white backdrop-blur-[2px]">
                      <div className="w-14 h-14 rounded-full bg-white/95 text-black flex items-center justify-center shadow-xl mb-3 transform group-hover:scale-110 transition-transform">
                        <Download className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <span className="font-semibold text-sm sm:text-base drop-shadow-md">
                        Click to Download PDF
                      </span>
                      <span className="text-xs text-white/80 mt-1">
                        Full novel ({featuredBook.pages || 'Complete Edition'})
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 group-hover:text-black transition-colors">
                      <Download className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                      <span>Click book cover to download</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Book Info & Synopsis */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-mono text-xs font-semibold uppercase tracking-wider">
                    {featuredBook.genre}
                  </span>
                  {featuredBook.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/70 text-xs font-semibold"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <h2
                  className="font-serif-display text-3xl sm:text-4xl text-neutral-950 font-normal leading-tight mb-1"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  {featuredBook.title}
                </h2>
                <p className="text-base sm:text-lg text-neutral-700 font-medium mb-3">
                  by {featuredBook.author}
                </p>

                {featuredBook.tagline && (
                  <div className="border-l-2 border-neutral-900 pl-3 py-1 mb-5 italic text-sm sm:text-base text-neutral-800">
                    “{featuredBook.tagline}”
                  </div>
                )}

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                  {featuredBook.synopsis}
                </p>

                {/* Format Chips */}
                <div className="grid grid-cols-3 gap-2.5 mb-6 text-xs text-neutral-700">
                  <div className="bg-neutral-50 border border-neutral-200/70 rounded-xl p-2.5 text-center">
                    <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">
                      Format
                    </span>
                    <span className="font-semibold text-neutral-900">
                      {featuredBook.format} Document
                    </span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200/70 rounded-xl p-2.5 text-center">
                    <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">
                      Length
                    </span>
                    <span className="font-semibold text-neutral-900">
                      {featuredBook.pages || 'Complete'}
                    </span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200/70 rounded-xl p-2.5 text-center">
                    <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">
                      Status
                    </span>
                    <span className="font-semibold text-emerald-700">
                      100% Free
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    id="download-featured-book-btn"
                    type="button"
                    onClick={() => handleDownload(featuredBook)}
                    className="flex-1 inline-flex items-center justify-center gap-2.5 bg-black hover:bg-neutral-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-md cursor-pointer text-sm sm:text-base group"
                  >
                    <Download className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span>Download {featuredBook.title} ({featuredBook.format})</span>
                  </button>

                  {featuredBook.pdfUrl && featuredBook.pdfUrl !== '#' && (
                    <a
                      id="preview-featured-book-link"
                      href={featuredBook.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium py-3.5 px-5 rounded-xl transition-colors cursor-pointer text-xs sm:text-sm border border-neutral-200"
                    >
                      <BookOpen className="w-4 h-4 text-neutral-600" />
                      <span>Open in Browser</span>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Multi-Book Library Explorer */}
        <section className="mb-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3
                className="font-serif-display text-2xl sm:text-3xl text-neutral-950 font-normal"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                All Books in Catalogue ({filteredBooks.length})
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                More titles are added regularly for waitlist members.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by title, author, genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-black"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Genre Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            <span className="text-xs font-semibold text-neutral-500 shrink-0 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Genre:</span>
            </span>
            {genres.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGenre(g)}
                className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
                  selectedGenre === g
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                {g === 'all' ? 'All Genres' : g}
              </button>
            ))}
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => {
              const isAvailable = book.status === 'available';

              return (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div className="p-5">
                    {/* Top Thumbnail & Badges */}
                    <div className="flex gap-4 mb-4">
                      <div
                        onClick={() => handleDownload(book)}
                        className="relative w-24 h-34 sm:w-28 sm:h-40 rounded-lg overflow-hidden shrink-0 border border-black/15 shadow-md bg-neutral-900 cursor-pointer group-hover:scale-102 transition-transform"
                      >
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                        {isAvailable ? (
                          <div className="absolute bottom-1.5 right-1.5 bg-black/85 text-white p-1 rounded-md shadow-xs opacity-90 group-hover:opacity-100">
                            <Download className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-2 text-center">
                            <span className="text-[10px] font-mono uppercase font-bold text-amber-300">
                              Coming Soon
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          {isAvailable ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                              Available Now
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              <span>Coming Soon</span>
                            </span>
                          )}
                        </div>

                        <h4
                          className="font-serif-display text-lg text-neutral-950 font-normal leading-tight line-clamp-2"
                          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                        >
                          {book.title}
                        </h4>
                        <span className="text-xs text-neutral-600 font-medium mb-1">
                          {book.author}
                        </span>
                        <span className="text-[11px] text-neutral-400 font-mono">
                          {book.genre}
                        </span>

                        <div className="mt-auto pt-2 flex items-center gap-2 text-[10px] text-neutral-500">
                          <span>{book.format}</span>
                          {book.pages && (
                            <>
                              <span>•</span>
                              <span>{book.pages}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Synopsis snippet */}
                    <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                      {book.synopsis}
                    </p>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModalBook(book)}
                      className="text-xs font-semibold text-neutral-600 hover:text-black cursor-pointer"
                    >
                      View Details
                    </button>

                    {isAvailable ? (
                      <button
                        type="button"
                        onClick={() => handleDownload(book)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-mono text-neutral-400">
                        {book.releaseDate || 'In queue'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200">
              <p className="text-neutral-500 text-sm">
                No books matched your search for &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGenre('all');
                }}
                className="mt-3 text-xs font-semibold text-neutral-900 underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Compatibility & Reading Tips */}
        <section className="bg-white/80 rounded-2xl border border-black/10 p-6 sm:p-8 mb-12">
          <h3
            className="font-serif-display text-xl sm:text-2xl text-neutral-900 font-normal mb-3"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            How to Read Your Downloaded Books
          </h3>
          <p className="text-neutral-600 text-xs sm:text-sm mb-6">
            All books in the Bookarra digital library are DRM-free and ready to
            enjoy on your preferred app or reading device:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <div className="flex items-center gap-2 font-semibold text-neutral-900 mb-2">
                <Tablet className="w-4 h-4 text-neutral-700" />
                <span>Kindle & E-Readers</span>
              </div>
              <p className="text-neutral-600 leading-relaxed">
                Use Amazon&apos;s Send-to-Kindle web tool or email the file to
                your Kindle address to read with adjustable font sizing and page
                turns.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <div className="flex items-center gap-2 font-semibold text-neutral-900 mb-2">
                <Smartphone className="w-4 h-4 text-neutral-700" />
                <span>iPhone, iPad & Android</span>
              </div>
              <p className="text-neutral-600 leading-relaxed">
                Open directly in Apple Books, Google Play Books, or any standard
                PDF reader. Turn on dark mode for comfortable night reading.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <div className="flex items-center gap-2 font-semibold text-neutral-900 mb-2">
                <Laptop className="w-4 h-4 text-neutral-700" />
                <span>Laptop & Desktop</span>
              </div>
              <p className="text-neutral-600 leading-relaxed">
                Open in your favorite browser, Acrobat Reader, or desktop e-book
                software like Calibre to read on larger screens with search
                tools.
              </p>
            </div>
          </div>
        </section>

        {/* Adding More Books Info / Share Section */}
        <section className="bg-gradient-to-br from-amber-50 via-white to-orange-50/40 rounded-2xl border border-amber-200/70 p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-sm">
          <div className="w-10 h-10 rounded-full bg-amber-200/60 text-amber-900 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-5 h-5 text-amber-800" />
          </div>
          <h4
            className="font-serif-display text-xl sm:text-2xl text-neutral-950 font-normal mb-2"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            More Books Arriving Soon
          </h4>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-5">
            We are curating dozens of bestselling novels and indie gems for
            Bookarra members. Keep your invite code handy to unlock free
            membership months when we launch!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="catalogue-share-link-btn"
              type="button"
              onClick={handleCopyShareLink}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-amber-300 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors shadow-2xs cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Share Bookarra with Friends</span>
                </>
              )}
            </button>

            <button
              id="catalogue-bottom-back-btn"
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{userEmail ? 'Return to Waitlist Pass' : 'Return Home'}</span>
            </button>
          </div>
        </section>
      </main>

      {/* Book Details Quick View Modal */}
      {activeModalBook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
          onClick={() => setActiveModalBook(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-neutral-900 overflow-hidden border border-neutral-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModalBook(null)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-5 mb-5">
              <img
                src={activeModalBook.coverImage}
                alt={activeModalBook.title}
                className="w-24 h-36 sm:w-28 sm:h-40 object-cover rounded-xl shadow-md border border-black/10 shrink-0"
              />
              <div className="flex flex-col justify-center">
                <span className="text-[11px] font-mono uppercase text-neutral-500 mb-1">
                  {activeModalBook.genre}
                </span>
                <h3
                  className="font-serif-display text-2xl text-neutral-950 font-normal leading-tight"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  {activeModalBook.title}
                </h3>
                <span className="text-sm font-medium text-neutral-700 mb-2">
                  by {activeModalBook.author}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-mono">
                    {activeModalBook.format}
                  </span>
                  {activeModalBook.status === 'available' ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      Free Download
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold">
                      {activeModalBook.releaseDate || 'Coming Soon'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {activeModalBook.tagline && (
              <p className="italic text-xs sm:text-sm text-neutral-700 border-l-2 border-neutral-300 pl-3 mb-4">
                &ldquo;{activeModalBook.tagline}&rdquo;
              </p>
            )}

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 max-h-48 overflow-y-auto pr-1">
              {activeModalBook.synopsis}
            </p>

            <div className="flex items-center gap-3">
              {activeModalBook.status === 'available' ? (
                <button
                  type="button"
                  onClick={() => {
                    handleDownload(activeModalBook);
                    setActiveModalBook(null);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-semibold py-3 px-5 rounded-xl transition-all shadow-xs cursor-pointer text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Now ({activeModalBook.format})</span>
                </button>
              ) : (
                <div className="w-full text-center py-2.5 px-4 bg-amber-50 rounded-xl border border-amber-200 text-xs font-semibold text-amber-900">
                  ⏳ This book will be unlocked in our next drop!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
