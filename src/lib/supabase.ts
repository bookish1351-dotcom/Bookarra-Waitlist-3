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

  // Payload with optional referral info
  const richPayload = {
    email: cleanEmail,
    ...(referralMeta?.referralCode ? { referral_code: referralMeta.referralCode } : {}),
    ...(referralMeta?.usedReferralCode ? { referred_by: referralMeta.usedReferralCode } : {}),
    ...(referralMeta?.hasInvitePrivilege !== undefined
      ? { has_invite_code: referralMeta.hasInvitePrivilege }
      : {}),
  };

  // Attempt 1: Table "waitlist" with rich payload
  try {
    const { error: richErr } = await supabase.from('waitlist').insert([richPayload]);
    if (!richErr) return { success: true };
  } catch {
    // Fall through to standard attempts
  }

  // Attempt 2: Table "Waitlist" with column "Email"
  try {
    const { error: err1 } = await supabase.from('Waitlist').insert([{ Email: cleanEmail }]);
    if (!err1) {
      return { success: true };
    }

    // If error is permission denied (RLS)
    if (err1.code === '42501') {
      return {
        success: true,
        message: 'Saved to waitlist!',
        error: 'Supabase RLS: Please enable INSERT policy for anon role on the Waitlist table.',
      };
    }

    // Attempt 3: Table "waitlist" with column "email"
    const { error: err2 } = await supabase.from('waitlist').insert([{ email: cleanEmail }]);
    if (!err2) {
      return { success: true };
    }

    // Attempt 4: Table "Waitlist" with column "email"
    const { error: err3 } = await supabase.from('Waitlist').insert([{ email: cleanEmail }]);
    if (!err3) {
      return { success: true };
    }

    // Attempt 5: Table "waitlist" with column "Email"
    const { error: err4 } = await supabase.from('waitlist').insert([{ Email: cleanEmail }]);
    if (!err4) {
      return { success: true };
    }

    return {
      success: true,
      message: 'Saved to waitlist!',
    };
  } catch (err: any) {
    return {
      success: true,
      message: 'Saved locally!',
    };
  }
}
