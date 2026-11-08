export interface FreeBook {
  id: string;
  title: string;
  author: string;
  tagline?: string;
  synopsis: string;
  coverImage: string;
  pdfUrl: string;
  fileName: string;
  genre: string;
  badges: string[];
  pages?: string | number;
  format: 'PDF' | 'EPUB';
  featured?: boolean;
  status: 'available' | 'coming_soon';
  releaseDate?: string;
}

/**
 * Catalogue of free books for Bookarra waitlist members.
 * To add more books, simply add another object to this array!
 */
export const FREE_BOOKS: FreeBook[] = [
  {
    id: 'powerless',
    title: 'Powerless',
    author: 'Lauren Roberts',
    tagline: 'Hunted. Hunter. Destined for each other.',
    synopsis:
      "Only the extraordinary belong in the kingdom of Ilya—the exceptional, the empowered, the Elites. The powers these Elites have possessed for decades were gifted to them by the Plague. Paedyn Gray is Ordinary, surviving by pretending to be psychic in the violent slums of Loot. When she unwittingly saves the prince of Ilya, she is thrust into the Purging Trials—a ruthless competition where surviving against the kingdom's deadly Elites will take every ounce of her cunning.",
    coverImage: '/assets/aistudio/image_ce9cecb4.png',
    pdfUrl: '/assets/aistudio/Powerless_Lauren_Roberts_e1589ad3.pdf',
    fileName: 'Powerless_Lauren_Roberts.pdf',
    genre: 'Fantasy & YA Fiction',
    badges: ['#1 NYT Bestseller', 'Featured Drop', 'Instant Download'],
    pages: '487 pages',
    format: 'PDF',
    featured: true,
    status: 'available',
  },
  {
    id: 'inheritance-games',
    title: 'The Inheritance Games',
    author: 'Jennifer Lynn Barnes',
    tagline: 'She came from nothing. They have everything. Let the games begin.',
    synopsis:
      'Avery Grambs has a plan for a better future: survive high school, win a scholarship, and get out. But when billionaire Tobias Hawthorne dies and leaves her virtually his entire fortune, Avery has no idea why—or even who Tobias Hawthorne is. To receive her inheritance, Avery must move into the sprawling, secret passage-filled Hawthorne House, where every room bears the old man’s love of puzzles and riddles, and live alongside four dangerous, disinherited grandsons who grew up believing the fortune was theirs.',
    coverImage: '/assets/aistudio/image_c8220cc2.png',
    pdfUrl: '/assets/aistudio/the_inheritance_games_1_472bab84.pdf',
    fileName: 'The_Inheritance_Games_Jennifer_Lynn_Barnes.pdf',
    genre: 'Mystery & YA Thriller',
    badges: ['#1 NYT Bestseller', 'Community Favorite', 'Instant Download'],
    pages: '384 pages',
    format: 'PDF',
    featured: false,
    status: 'available',
  },
  {
    id: 'hawthorne-legacy',
    title: 'The Hawthorne Legacy',
    author: 'Jennifer Lynn Barnes',
    tagline: 'A deadly game. A puzzle to solve. A fortune at stake.',
    synopsis:
      'The thrilling sequel to The Inheritance Games! Avery Grambs thought solving the mystery of why billionaire Tobias Hawthorne left her his entire fortune was the end of the game. But as rumors spread that someone she thought was dead may still be alive, Avery and the Hawthorne brothers find themselves entangled in a dangerous new puzzle with high-stakes twists at every turn.',
    coverImage: '/assets/aistudio/image_bb96608f.png',
    pdfUrl: '/assets/aistudio/the_inheritance_games_2_5c552519.pdf',
    fileName: 'The_Hawthorne_Legacy_Jennifer_Lynn_Barnes.pdf',
    genre: 'Mystery & YA Thriller',
    badges: ['#1 NYT Bestseller', 'Book 2', 'Instant Download'],
    pages: '368 pages',
    format: 'PDF',
    featured: false,
    status: 'available',
  },
  {
    id: 'final-gambit',
    title: 'The Final Gambit',
    author: 'Jennifer Lynn Barnes',
    tagline: 'Riddles upon riddles. Secrets upon secrets. Winner takes all.',
    synopsis:
      'Eighteen-year-old Avery Grambs is weeks away from inheriting the multibillion-dollar Hawthorne fortune, but first she’ll have to survive a dangerous game against an old enemy looking for vengeance. With puzzles, traps, and secrets converging at Hawthorne House, the stakes have never been higher in this explosive conclusion to the trilogy.',
    coverImage: '/assets/aistudio/image_ce74943c.png',
    pdfUrl: '/assets/aistudio/the_inheritance_games_3_005ae0bf.pdf',
    fileName: 'The_Final_Gambit_Jennifer_Lynn_Barnes.pdf',
    genre: 'Mystery & YA Thriller',
    badges: ['#1 NYT Bestseller', 'The Final Game', 'Instant Download'],
    pages: '384 pages',
    format: 'PDF',
    featured: false,
    status: 'available',
  },
  {
    id: 'the-brothers-hawthorne',
    title: 'The Brothers Hawthorne',
    author: 'Jennifer Lynn Barnes',
    tagline: 'There is nothing more Hawthorne than winning.',
    synopsis:
      'Jameson and Grayson Hawthorne are each pulled into a different high-stakes game on opposite sides of the globe. Grayson must navigate family secrets, blackmail, and an unexpected sister in Phoenix, while Jameson infiltrates London’s most exclusive underground gambling club to win back an ancestral estate. To survive, they will have to decide who they want to be and what they are willing to sacrifice to win.',
    coverImage: '/assets/aistudio/image_b908c7bc.png',
    pdfUrl: '/assets/aistudio/the_inheritance_games_4_7efad459.pdf',
    fileName: 'The_Brothers_Hawthorne_Jennifer_Lynn_Barnes.pdf',
    genre: 'Mystery & YA Thriller',
    badges: ['#1 NYT Bestseller', 'Grayson & Jameson', 'Instant Download'],
    pages: '406 pages',
    format: 'PDF',
    featured: false,
    status: 'available',
  },
];
