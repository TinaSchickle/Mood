import { supabase, isCloudConfigured } from './supabase.js'

export { isCloudConfigured }

// Shape:
//   mood_days      : date (text pk) | data (jsonb) | updated_at
//   mood_settings  : key  (text pk) | value (jsonb) | updated_at
const OPTIONS_KEY = 'moodOverallOptions'

// Pull the whole dataset from the cloud. Returns null when not configured.
export async function fetchAll() {
  if (!supabase) return null
  const [daysRes, setRes] = await Promise.all([
    supabase.from('mood_days').select('date, data'),
    supabase.from('mood_settings').select('key, value').eq('key', OPTIONS_KEY).maybeSingle(),
  ])
  if (daysRes.error) throw daysRes.error

  const entries = {}
  for (const row of daysRes.data || []) entries[row.date] = row.data || {}

  let moodOverallOptions = null
  if (!setRes.error && setRes.data) moodOverallOptions = setRes.data.value
  return { entries, moodOverallOptions }
}

export async function upsertDay(date, data) {
  if (!supabase) return
  const { error } = await supabase
    .from('mood_days')
    .upsert({ date, data, updated_at: new Date().toISOString() }, { onConflict: 'date' })
  if (error) throw error
}

export async function upsertOptions(options) {
  if (!supabase) return
  const { error } = await supabase
    .from('mood_settings')
    .upsert(
      { key: OPTIONS_KEY, value: options, updated_at: new Date().toISOString() },
      { onConflict: 'key' },
    )
  if (error) throw error
}

// Live updates from other devices. `onChange` fires on any insert/update/delete
// to either table. Returns an unsubscribe function.
export function subscribe(onChange) {
  if (!supabase) return () => {}
  const channel = supabase
    .channel('mood-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'mood_days' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'mood_settings' }, onChange)
    .subscribe()
  return () => supabase.removeChannel(channel)
}
