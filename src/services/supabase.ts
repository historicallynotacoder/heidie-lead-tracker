import { createClient } from '@supabase/supabase-js';
import type { LeadTracker } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchAllLeads(): Promise<LeadTracker[]> {
  const { data, error } = await supabase
    .from('lead_tracker')
    .select('*')
    .order('username', { ascending: true });

  if (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }

  return data || [];
}

export async function fetchLeadByUsername(username: string): Promise<LeadTracker | null> {
  const { data, error } = await supabase
    .from('lead_tracker')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    console.error('Error fetching lead:', error);
    throw error;
  }

  return data;
}
