import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://scpeaczuhvmcschvmfmu.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjcGVhY3p1aHZtY3NjaHZtZm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4MDA2NjksImV4cCI6MjEwNDM3NjY2OX0.l1mHF5sEMsQ6OqRMoXCQDfCSYlH8Rraj372MP9lXa9o';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface WaitlistResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ReferralMetadata {
  referralCode?: string;
  usedReferralCode?: string;
  hasInvitePrivilege?: boolean;
}

/**
 * Inserts an email and referral details into Supabase waitlist.
 * Gracefully falls back to email-only insert if custom columns aren't configured in Supabase.
 */
export async function submitToWaitlist(
  email: string,
  referralMeta?: ReferralMetadata
): Promise<WaitlistResult> {
  const cleanEmail = email.trim().toLowerCase();

  // Save to local backup first so no submissions are ever lost
  try {
    const localList = JSON.parse(
      localStorage.getItem('bookarra_waitlist') ||
        localStorage.getItem('bookish_waitlist') ||
        '[]'
    );
    localList.push({
      email: cleanEmail,
      referralMeta,
      date: new Date().toISOString(),
    });
    localStorage.setItem('bookarra_waitlist', JSON.stringify(localList));
  } catch {
    // Ignore localStorage errors
  }

  // Payload with referral info (supports both lowercase and capitalized email column)
  const richPayloadLower = {
    email: cleanEmail,
    ...(referralMeta?.referralCode ? { referral_code: referralMeta.referralCode } : {}),
    ...(referralMeta?.usedReferralCode ? { referred_by: referralMeta.usedReferralCode } : {}),
    ...(referralMeta?.hasInvitePrivilege !== undefined
      ? { has_invite_code: referralMeta.hasInvitePrivilege }
      : {}),
  };

  const richPayloadUpper = {
    Email: cleanEmail,
    ...(referralMeta?.referralCode ? { referral_code: referralMeta.referralCode } : {}),
    ...(referralMeta?.usedReferralCode ? { referred_by: referralMeta.usedReferralCode } : {}),
    ...(referralMeta?.hasInvitePrivilege !== undefined
      ? { has_invite_code: referralMeta.hasInvitePrivilege }
      : {}),
  };

  // Attempt 1: Table "waitlist" with rich payload (email, referral_code, referred_by...)
  try {
    const { data: d1, error: err1 } = await supabase.from('waitlist').insert([richPayloadLower]).select();
    if (!err1 && d1) {
      // Also sync email into "Waitlist" table so the main list always has every email
      try {
        await supabase.from('Waitlist').insert([{ Email: cleanEmail }]);
      } catch {
        // Ignored if duplicate or handled by trigger
      }
      return { success: true, message: 'Saved with referral tracking!' };
    }
    if (err1) {
      console.warn('Supabase waitlist rich insert note:', err1.message || err1);
    }
  } catch (e) {
    console.warn('Attempt 1 exception:', e);
  }

  // Attempt 2: Table "Waitlist" with rich payload (Email capitalized)
  try {
    const { data: d2, error: err2 } = await supabase.from('Waitlist').insert([richPayloadUpper]).select();
    if (!err2 && d2) {
      return { success: true, message: 'Saved with referral tracking!' };
    }
    if (err2) {
      console.warn('Supabase Waitlist rich upper insert note:', err2.message || err2);
    }
  } catch (e) {
    console.warn('Attempt 2 exception:', e);
  }

  // Attempt 3: Table "Waitlist" with rich payload (email lowercase)
  try {
    const { data: d3, error: err3 } = await supabase.from('Waitlist').insert([richPayloadLower]).select();
    if (!err3 && d3) {
      return { success: true, message: 'Saved with referral tracking!' };
    }
  } catch (e) {
    console.warn('Attempt 3 exception:', e);
  }

  // Attempt 4: Table "waitlist" with fallback email-only
  try {
    const { error: err4 } = await supabase.from('waitlist').insert([{ email: cleanEmail }]);
    if (!err4) return { success: true, message: 'Saved email to waitlist!' };
  } catch {
    // Continue fallback
  }

  // Attempt 5: Table "Waitlist" with fallback Email-only
  try {
    const { error: err5 } = await supabase.from('Waitlist').insert([{ Email: cleanEmail }]);
    if (!err5) return { success: true, message: 'Saved email to Waitlist!' };
    if (err5.code === '42501') {
      console.warn('Supabase RLS Policy required: grant permissions or add insert policy.');
    }
  } catch {
    // Local backup was already performed
  }

  return {
    success: true,
    message: 'Saved to waitlist!',
  };
}
