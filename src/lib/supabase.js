import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// TODO: Paste your actual Project URL and Anon Key here:
const supabaseUrl = 'https://olmlxemplstltknzrcaj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbWx4ZW1wbHN0bHRrbnpyY2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MDY3NDUsImV4cCI6MjA5NTQ4Mjc0NX0.LCdgireHDw04mxm5CVJYHMOdZz2jPrOKj8yMWJc2AHQ';

// We export this to let the UI know if you have added your keys yet
export const isConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
