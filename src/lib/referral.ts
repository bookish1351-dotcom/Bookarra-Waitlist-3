/**
 * Bookarra Referral Engine
 */

import { supabase } from './supabase';

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
  premiumRewardCode?: string; // One-time promo code unlocked after 5 referrals join
  premiumRewardClaimedAt?: string;
  createdAt: string;
}

export interface ReferralSignupResult {
  success: boolean;
  isExistingUser?: boolean;
  hasOwnCode: boolean;
  referralCode?: string;
  usedReferralCode?: string;
  isGoldenTicketWinner?: boolean;
  referralSlotNumber?: number;
  remainingInvites?: number;
  premiumRewardCode?: string;
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

/**
 * Generate a unique, one-time-use Bookarra Premium redemption code: PREM-1MO-XXXX
 */
export function generatePremiumPromoCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PREM-1MO-${random}`;
}

/**
 * Claim or retrieve the one-time promo code once 5 referrals join
 */
export function claimOrGetPremiumRewardCode(email?: string): string | null {
  if (typeof window === 'undefined') return null;
  const profile = getCurrentUserProfile(email);
  if (!profile || !profile.referralCode) return null;

  if (profile.premiumRewardCode) {
    return profile.premiumRewardCode;
  }

  const allCodes = getAllCodes();
  const codeRec = allCodes[profile.referralCode];
  if (codeRec && codeRec.usedCount >= 5) {
    const promoCode = generatePremiumPromoCode();
    profile.premiumRewardCode = promoCode;
    profile.premiumRewardClaimedAt = new Date().toISOString();
    saveUserProfile(profile);
    return promoCode;
  }

  return null;
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
 * Validates a referral code input against both local cache and Supabase waitlist.
 */
export async function checkReferralCode(rawCode: string): Promise<{
  valid: boolean;
  record?: ReferralCodeRecord;
  error?: string;
}> {
  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return { valid: false, error: 'Please enter a referral code.' };
  }

  // 1. Check local starter/cached codes
  const all = getAllCodes();
  let record = all[code];

  // 2. Query Supabase "waitlist" table for this code
  try {
    const { data: owners, error: ownerErr } = await supabase
      .from('waitlist')
      .select('id, email, referral_code, created_at')
      .eq('referral_code', code)
      .limit(1);

    if (!ownerErr && owners && owners.length > 0) {
      const ownerRow = owners[0];

      // Query all friends who joined using this code
      const { data: referredUsers } = await supabase
        .from('waitlist')
        .select('email')
        .eq('referred_by', code);

      const referredEmails = referredUsers?.map((u: any) => u.email).filter(Boolean) || [];

      record = {
        code,
        ownerEmail: ownerRow.email,
        maxUses: 5,
        usedCount: referredEmails.length,
        referredEmails,
        luckySlotNumber: 1,
        createdAt: ownerRow.created_at || new Date().toISOString(),
      };
      saveCode(record);
    }
  } catch (err) {
    console.warn('Supabase code lookup note:', err);
  }

  if (record) {
    return { valid: true, record };
  }

  return {
    valid: false,
    error: `Code "${code}" was not found. Please check for typos.`,
  };
}

/**
 * Comprehensive lookup to check if a user is already signed up across
 * local profiles, active code records, localStorage waitlist backups, and Supabase.
 * Guarantees that existing users always retrieve their existing code, friend stats,
 * and rewards, and NEVER have a new referral code generated.
 */
export async function lookupExistingUserProfile(
  email: string
): Promise<UserReferralProfile | null> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return null;

  // 1. Check local profiles cache
  const profiles = getAllProfiles();
  if (profiles[cleanEmail]) {
    const p = profiles[cleanEmail];
    if (p.referralCode) {
      const allCodes = getAllCodes();
      const codeRec = allCodes[p.referralCode];
      if (codeRec && !codeRec.ownerEmail) {
        codeRec.ownerEmail = cleanEmail;
        saveCode(codeRec);
      }
    }
    return p;
  }

  // 2. Check if any code in getAllCodes() is owned by this email
  const allCodes = getAllCodes();
  for (const codeKey of Object.keys(allCodes)) {
    const rec = allCodes[codeKey];
    if (rec.ownerEmail && rec.ownerEmail.toLowerCase() === cleanEmail) {
      const profileFromCode: UserReferralProfile = {
        email: cleanEmail,
        hasOwnCode: true,
        referralCode: rec.code,
        createdAt: rec.createdAt || new Date().toISOString(),
      };
      saveUserProfile(profileFromCode);
      return profileFromCode;
    }
  }

  // 3. Check localStorage waitlist backups ('bookarra_waitlist', 'bookish_waitlist')
  try {
    const rawWaitlist =
      localStorage.getItem('bookarra_waitlist') ||
      localStorage.getItem('bookish_waitlist');
    if (rawWaitlist) {
      const list = JSON.parse(rawWaitlist);
      if (Array.isArray(list)) {
        const item = list.find((it: any) =>
          it === cleanEmail ||
          (typeof it === 'object' && it?.email?.toLowerCase() === cleanEmail)
        );
        if (item && typeof item === 'object') {
          const meta = item.referralMeta || {};
          if (meta.referralCode) {
            const profileFromWaitlist: UserReferralProfile = {
              email: cleanEmail,
              hasOwnCode: Boolean(meta.hasInvitePrivilege ?? true),
              referralCode: meta.referralCode,
              usedReferralCode: meta.usedReferralCode,
              createdAt: item.date || new Date().toISOString(),
            };
            saveUserProfile(profileFromWaitlist);
            return profileFromWaitlist;
          }
        }
      }
    }
  } catch {
    // Ignore storage parse errors
  }

  // 4. Check Supabase "waitlist" table (case-insensitive with ilike)
  try {
    const { data: rows, error: err } = await supabase
      .from('waitlist')
      .select('*')
      .ilike('email', cleanEmail)
      .limit(1);

    if (!err && rows && rows.length > 0) {
      const row = rows[0];
      const hasCode = Boolean(row.has_invite_code || row.referral_code);

      // Hydrate code record from Supabase if they have a code
      if (row.referral_code) {
        try {
          const { data: friends } = await supabase
            .from('waitlist')
            .select('email, created_at')
            .eq('referred_by', row.referral_code);

          const friendEmails = friends?.map((f: any) => f.email).filter(Boolean) || [];
          const codeRecord: ReferralCodeRecord = {
            code: row.referral_code,
            ownerEmail: cleanEmail,
            maxUses: 5,
            usedCount: friendEmails.length,
            referredEmails: friendEmails,
            luckySlotNumber: 1,
            createdAt: row.created_at || new Date().toISOString(),
          };
          saveCode(codeRecord);
        } catch {
          // Ignore
        }
      }

      const profileFromSupabase: UserReferralProfile = {
        email: cleanEmail,
        hasOwnCode: hasCode,
        referralCode: row.referral_code || undefined,
        usedReferralCode: row.referred_by || undefined,
        isGoldenTicketWinner: hasCode && Boolean(row.referred_by),
        referralSlotNumber: row.referral_slot_number || undefined,
        createdAt: row.created_at || new Date().toISOString(),
      };
      saveUserProfile(profileFromSupabase);
      return profileFromSupabase;
    }
  } catch (e) {
    console.warn('Supabase waitlist lookup exception:', e);
  }

  // 5. Check Supabase legacy "Waitlist" table (capital W)
  try {
    const { data: legacyRows } = await supabase
      .from('Waitlist')
      .select('*')
      .ilike('Email', cleanEmail)
      .limit(1);

    if (legacyRows && legacyRows.length > 0) {
      const legRow = legacyRows[0];
      const legCode = legRow.ReferralCode || legRow.referral_code;
      const legReferredBy = legRow.ReferredBy || legRow.referred_by;

      const profileFromLegacy: UserReferralProfile = {
        email: cleanEmail,
        hasOwnCode: Boolean(legCode),
        referralCode: legCode || undefined,
        usedReferralCode: legReferredBy || undefined,
        createdAt: legRow.created_at || new Date().toISOString(),
      };
      saveUserProfile(profileFromLegacy);
      return profileFromLegacy;
    }
  } catch (e) {
    console.warn('Supabase Waitlist legacy lookup exception:', e);
  }

  return null;
}

/**
 * Core signup processor enforcing the 1-in-5 referral privilege rule
 */
export async function processReferralSignup(
  email: string,
  enteredCode?: string
): Promise<ReferralSignupResult> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = enteredCode?.trim().toUpperCase();

  // 1. Check if user already exists
  const existingProfile = await lookupExistingUserProfile(cleanEmail);
  if (existingProfile) {
    let remaining = 5;
    if (existingProfile.referralCode) {
      const rec = getAllCodes()[existingProfile.referralCode];
      if (rec) remaining = Math.max(0, rec.maxUses - rec.usedCount);
    }

    saveUserProfile(existingProfile);

    return {
      success: true,
      isExistingUser: true,
      hasOwnCode: existingProfile.hasOwnCode,
      referralCode: existingProfile.referralCode,
      usedReferralCode: existingProfile.usedReferralCode,
      isGoldenTicketWinner: existingProfile.isGoldenTicketWinner,
      referralSlotNumber: existingProfile.referralSlotNumber,
      remainingInvites: remaining,
      premiumRewardCode: existingProfile.premiumRewardCode,
      message: "Welcome back! You're already on the waitlist. Opening your invite pass...",
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
  const validation = await checkReferralCode(cleanCode);
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

  // If the referrer has reached 5 people, unlock their exclusive one-time promo code!
  if (referrerRecord.usedCount >= 5) {
    const profiles = getAllProfiles();
    const refEmail = referrerRecord.ownerEmail.toLowerCase();
    const refProf = profiles[refEmail];
    if (refProf && !refProf.premiumRewardCode) {
      refProf.premiumRewardCode = generatePremiumPromoCode();
      refProf.premiumRewardClaimedAt = new Date().toISOString();
      saveUserProfile(refProf);
    }
  }

  // Check if this person is the lucky 1 out of 5 in each cohort of 5 referrals!
  const isWinner = ((slotNumber - 1) % 5) + 1 === referrerRecord.luckySlotNumber;

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
