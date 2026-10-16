/**
 * Bookarra Referral Engine
 * 
 * Rules:
 * 1. Direct signups (without a referral code) automatically get a referral code.
 * 2. Each code can be shared with up to 5 people.
 * 3. Out of every 5 people who join using a referral code, ONLY 1 person
 *    gets to generate and give out their own referral code (the "Golden Ticket").
 *    The other 4 people are secured on the waitlist with priority status, but do
 *    not receive their own invite codes.
 */

export interface ReferralCodeRecord {
  code: string;
  ownerEmail: string;
  maxUses: number; // 5
  usedCount: number; // 0 to 5
  referredEmails: string[];
  luckySlotNumber: number; // 1 to 5: which referral slot gets invite privileges
  createdAt: string;
}

export interface UserReferralProfile {
  email: string;
  hasOwnCode: boolean;
  referralCode?: string;
  usedReferralCode?: string;
  isGoldenTicketWinner?: boolean;
  referralSlotNumber?: number; // 1 to 5
  createdAt: string;
}

export interface ReferralSignupResult {
  success: boolean;
  hasOwnCode: boolean;
  referralCode?: string;
  usedReferralCode?: string;
  isGoldenTicketWinner?: boolean;
  referralSlotNumber?: number;
  remainingInvites?: number;
  message: string;
  error?: string;
}

const STORAGE_CODES_KEY = 'bookarra_referral_codes_v1';
const STORAGE_PROFILES_KEY = 'bookarra_user_profiles_v1';

// Starter codes to ensure users testing the app can try entering an existing code immediately
const INITIAL_CODES: Record<string, ReferralCodeRecord> = {
  'BOOK-VIP5': {
    code: 'BOOK-VIP5',
    ownerEmail: 'founder@bookarra.com',
    maxUses: 5,
    usedCount: 0,
    referredEmails: [],
    luckySlotNumber: 1, // 1st person who uses this code unlocks invite privileges
    createdAt: new Date().toISOString(),
  },
  'BOOK-READ': {
    code: 'BOOK-READ',
    ownerEmail: 'community@bookarra.com',
    maxUses: 5,
    usedCount: 0,
    referredEmails: [],
    luckySlotNumber: 2, // 2nd person unlocks invite privileges
    createdAt: new Date().toISOString(),
  },
};

/**
 * Generate a clean, memorable 8-character code: BOOK-XXXX
 */
export function generateCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BOOK-${random}`;
}

export function getAllCodes(): Record<string, ReferralCodeRecord> {
  if (typeof window === 'undefined') return INITIAL_CODES;
  try {
    const raw = localStorage.getItem(STORAGE_CODES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_CODES_KEY, JSON.stringify(INITIAL_CODES));
      return INITIAL_CODES;
    }
    return { ...INITIAL_CODES, ...JSON.parse(raw) };
  } catch {
    return INITIAL_CODES;
  }
}

export function saveCode(record: ReferralCodeRecord) {
  if (typeof window === 'undefined') return;
  try {
    const all = getAllCodes();
    all[record.code.toUpperCase()] = record;
    localStorage.setItem(STORAGE_CODES_KEY, JSON.stringify(all));
  } catch {
    // Ignore storage errors
  }
}

export function getAllProfiles(): Record<string, UserReferralProfile> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_PROFILES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveUserProfile(profile: UserReferralProfile) {
  if (typeof window === 'undefined') return;
  try {
    const profiles = getAllProfiles();
    profiles[profile.email.toLowerCase()] = profile;
    localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
    // Also save as active profile for session
    localStorage.setItem('bookarra_current_profile', JSON.stringify(profile));
  } catch {
    // Ignore storage errors
  }
}

export function getCurrentUserProfile(email?: string): UserReferralProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    if (email) {
      const profiles = getAllProfiles();
      if (profiles[email.toLowerCase()]) {
        return profiles[email.toLowerCase()];
      }
    }
    const raw = localStorage.getItem('bookarra_current_profile');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Validates a referral code input.
 */
export function checkReferralCode(rawCode: string): {
  valid: boolean;
  record?: ReferralCodeRecord;
  error?: string;
} {
  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return { valid: false, error: 'Please enter a referral code.' };
  }
  const all = getAllCodes();
  const record = all[code];
  if (!record) {
    return {
      valid: false,
      error: `Code "${code}" was not found. Please check for typos.`,
    };
  }
  if (record.usedCount >= record.maxUses) {
    return {
      valid: false,
      error: `Code "${code}" has already reached its 5-person limit!`,
    };
  }
  return { valid: true, record };
}

/**
 * Core signup processor enforcing the 1-in-5 referral privilege rule
 */
export function processReferralSignup(
  email: string,
  enteredCode?: string
): ReferralSignupResult {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = enteredCode?.trim().toUpperCase();

  // If user already signed up previously, return their existing profile
  const existingProfiles = getAllProfiles();
  if (existingProfiles[cleanEmail]) {
    const p = existingProfiles[cleanEmail];
    let remaining = 5;
    if (p.referralCode) {
      const rec = getAllCodes()[p.referralCode];
      if (rec) remaining = Math.max(0, rec.maxUses - rec.usedCount);
    }
    return {
      success: true,
      hasOwnCode: p.hasOwnCode,
      referralCode: p.referralCode,
      usedReferralCode: p.usedReferralCode,
      isGoldenTicketWinner: p.isGoldenTicketWinner,
      referralSlotNumber: p.referralSlotNumber,
      remainingInvites: remaining,
      message: 'Welcome back! Your waitlist status is confirmed.',
    };
  }

  // -------------------------------------------------------------
  // CASE A: Signed up WITHOUT a referral code
  // Rule: Automatically gets their own referral code to share with 5 people!
  // -------------------------------------------------------------
  if (!cleanCode) {
    let newCode = generateCode();
    const all = getAllCodes();
    while (all[newCode]) {
      newCode = generateCode();
    }

    // 1 lucky slot out of 5 gets the privilege when friends use it
    const luckySlotNumber = Math.floor(Math.random() * 5) + 1;

    const newRecord: ReferralCodeRecord = {
      code: newCode,
      ownerEmail: cleanEmail,
      maxUses: 5,
      usedCount: 0,
      referredEmails: [],
      luckySlotNumber,
      createdAt: new Date().toISOString(),
    };
    saveCode(newRecord);

    const profile: UserReferralProfile = {
      email: cleanEmail,
      hasOwnCode: true,
      referralCode: newCode,
      createdAt: new Date().toISOString(),
    };
    saveUserProfile(profile);

    return {
      success: true,
      hasOwnCode: true,
      referralCode: newCode,
      remainingInvites: 5,
      message: 'Direct signup: You have been assigned an exclusive invite code for 5 friends!',
    };
  }

  // -------------------------------------------------------------
  // CASE B: Signed up WITH a referral code
  // Rule: Verify code. Only 1 out of 5 gets their own referral code.
  // -------------------------------------------------------------
  const validation = checkReferralCode(cleanCode);
  if (!validation.valid || !validation.record) {
    return {
      success: false,
      hasOwnCode: false,
      message: validation.error || 'Invalid referral code.',
      error: validation.error || 'Invalid referral code.',
    };
  }

  const referrerRecord = { ...validation.record };
  // Determine which slot this user is (1, 2, 3, 4, or 5)
  const slotNumber = referrerRecord.usedCount + 1;
  referrerRecord.usedCount = slotNumber;
  referrerRecord.referredEmails = [...referrerRecord.referredEmails, cleanEmail];
  saveCode(referrerRecord);

  // Check if this person is the lucky 1 out of 5!
  const isWinner = slotNumber === referrerRecord.luckySlotNumber;

  if (isWinner) {
    // 1 out of 5 WINNER: Gets their own code to share with 5 people!
    let winnerCode = generateCode();
    const all = getAllCodes();
    while (all[winnerCode]) {
      winnerCode = generateCode();
    }

    const winnerRecord: ReferralCodeRecord = {
      code: winnerCode,
      ownerEmail: cleanEmail,
      maxUses: 5,
      usedCount: 0,
      referredEmails: [],
      luckySlotNumber: Math.floor(Math.random() * 5) + 1,
      createdAt: new Date().toISOString(),
    };
    saveCode(winnerRecord);

    const winnerProfile: UserReferralProfile = {
      email: cleanEmail,
      hasOwnCode: true,
      referralCode: winnerCode,
      usedReferralCode: cleanCode,
      isGoldenTicketWinner: true,
      referralSlotNumber: slotNumber,
      createdAt: new Date().toISOString(),
    };
    saveUserProfile(winnerProfile);

    return {
      success: true,
      hasOwnCode: true,
      referralCode: winnerCode,
      usedReferralCode: cleanCode,
      isGoldenTicketWinner: true,
      referralSlotNumber: slotNumber,
      remainingInvites: 5,
      message:
        'Golden Ticket! You are the 1 in 5 referred readers to unlock your own referral code!',
    };
  }

  // THE OTHER 4 IN 5: Reserved spot on the waitlist, but do not receive their own referral code
  const memberProfile: UserReferralProfile = {
    email: cleanEmail,
    hasOwnCode: false,
    usedReferralCode: cleanCode,
    isGoldenTicketWinner: false,
    referralSlotNumber: slotNumber,
    createdAt: new Date().toISOString(),
  };
  saveUserProfile(memberProfile);

  return {
    success: true,
    hasOwnCode: false,
    usedReferralCode: cleanCode,
    isGoldenTicketWinner: false,
    referralSlotNumber: slotNumber,
    message: `You're on the waitlist via ${cleanCode}! Spot #${slotNumber} of 5 secured.`,
  };
}

/**
 * Generate shareable link
 */
export function getShareableUrl(code: string): string {
  if (typeof window === 'undefined') return `https://bookarra.com/?ref=${code}`;
  const origin = window.location.origin;
  return `${origin}/?ref=${encodeURIComponent(code)}`;
}
