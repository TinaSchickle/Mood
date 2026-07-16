import { createClient } from '@supabase/supabase-js'

// Supabase connection. These are PUBLIC values (the anon/publishable key is
// designed to ship in client apps) so it is fine that they live in the built
// bundle. This is the SAME project kitchenMagic uses — Mood keeps its data in
// its own `mood_days` / `mood_settings` tables, separate from recipes.
//
// DESIGN NOTE (intentional): like kitchenMagic, Mood has NO login. It is a
// single shared dataset so the same entries appear on every device. That means
// the data is readable by anyone who has this public key. Chosen deliberately
// for a personal single-user tracker.
const PROJECT_URL = 'https://wscuovmzdbhwugxsgfjw.supabase.co'
const ANON_KEY = 'sb_publishable_eAz7id9uPfkRq0wTll_UFA_HaR9JMj1'

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || PROJECT_URL
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ANON_KEY

export const isCloudConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export const supabase = isCloudConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    })
  : null
