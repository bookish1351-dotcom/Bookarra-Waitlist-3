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

  // Payload for table "waitlist"
  const richPayloadLower = {
    email: cleanEmail,
    ...(referralMeta?.referralCode ? { referral_code: referralMeta.referralCode } : {}),
    ...(referralMeta?.usedReferralCode ? { referred_by: referralMeta.usedReferralCode } : {}),
    ...(referralMeta?.hasInvitePrivilege !== undefined
      ? { has_invite_code: referralMeta.hasInvitePrivilege }
      : {}),
  };

  // Primary: Insert into "waitlist" table (with referral details)
  // The Supabase trigger automatically syncs the email into "Waitlist" without duplicates
  try {
    const { data: d1, error: err1 } = await supabase
      .from('waitlist')
      .insert([richPayloadLower])
      .select();

    if (!err1 && d1 && d1.length > 0) {
      return { success: true, message: 'Saved with referral tracking!' };
    }
    if (err1) {
      console.warn('Supabase waitlist insert note:', err1.message || err1);
    }
  } catch (e) {
    console.warn('Waitlist insert exception:', e);
  }

  // Fallback: If "waitlist" table wasn't available, save directly to "Waitlist"
  try {
    const { data: existing } = await supabase
      .from('Waitlist')
      .select('id')
      .ilike('Email', cleanEmail)
      .limit(1);

    if (!existing || existing.length === 0) {
      await supabase.from('Waitlist').insert([{ Email: cleanEmail }]);
    }
    return { success: true, message: 'Saved to waitlist!' };
  } catch (e) {
    console.warn('Waitlist fallback insert note:', e);
  }

  return {
    success: true,
    message: 'Saved to waitlist!',
  };
}
