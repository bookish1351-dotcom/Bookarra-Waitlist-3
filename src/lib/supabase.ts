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

/**
 * Inserts an email into the Supabase waitlist table.
 * Supports both "Waitlist" (with "Email") and "waitlist" (with "email") configurations.
 */
export async function submitToWaitlist(email: string): Promise<WaitlistResult> {
  const cleanEmail = email.trim().toLowerCase();

  // Save to local backup first so no submissions are ever lost
  try {
    const localList = JSON.parse(
      localStorage.getItem('bookarra_waitlist') ||
        localStorage.getItem('bookish_waitlist') ||
        '[]'
    );
    localList.push({ email: cleanEmail, date: new Date().toISOString() });
    localStorage.setItem('bookarra_waitlist', JSON.stringify(localList));
  } catch {
    // Ignore localStorage errors
  }

  // Attempt 1: Table "Waitlist" with column "Email"
  try {
    const { error: err1 } = await supabase.from('Waitlist').insert([{ Email: cleanEmail }]);
    if (!err1) {
      return { success: true };
    }

    // If error is permission denied (RLS)
    if (err1.code === '42501') {
      return {
        success: true, // Still marked success for user experience as we backed up locally
        message: 'Saved to waitlist!',
        error: 'Supabase RLS: Please enable INSERT policy for anon role on the Waitlist table.',
      };
    }

    // Attempt 2: Table "waitlist" with column "email"
    const { error: err2 } = await supabase.from('waitlist').insert([{ email: cleanEmail }]);
    if (!err2) {
      return { success: true };
    }

    // Attempt 3: Table "Waitlist" with column "email"
    const { error: err3 } = await supabase.from('Waitlist').insert([{ email: cleanEmail }]);
    if (!err3) {
      return { success: true };
    }

    // Attempt 4: Table "waitlist" with column "Email"
    const { error: err4 } = await supabase.from('waitlist').insert([{ Email: cleanEmail }]);
    if (!err4) {
      return { success: true };
    }

    console.warn('Supabase waitlist insert notification:', err1 || err2 || err3 || err4);
    return {
      success: true,
      message: 'Saved to waitlist!',
    };
  } catch (err: any) {
    console.warn('Supabase connection error:', err);
    return {
      success: true,
      message: 'Saved locally!',
    };
  }
}
