// supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lghjqmxssgrzeumechud.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnaGpxbXhzc2dyemV1bWVjaHVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTA5ODYsImV4cCI6MjA3Mjk4Njk4Nn0.5KrEkHXM5Z8RnjqEUJZvL6txJ0GardQDxc78YL5v8mk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth helper functions
export const signUpWithPhone = async (phone: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: phone,
  });
  return { data, error };
};

export const verifyOtp = async (phone: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: phone,
    token: token,
    type: 'sms'
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getAccessToken = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { accessToken: session?.access_token, error };
};
