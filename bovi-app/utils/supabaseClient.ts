// supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lghjqmxssgrzeumechud.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnaGpxbXhzc2dyemV1bWVjaHVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTA5ODYsImV4cCI6MjA3Mjk4Njk4Nn0.5KrEkHXM5Z8RnjqEUJZvL6txJ0GardQDxc78YL5v8mk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);