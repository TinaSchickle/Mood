import { DEFAULT_MOOD_OVERALL } from './config.js'

const KEY = 'mood-tracker-v1'

const empty = () => ({
  entries: {}, // { 'YYYY-MM-DD': { moodOverall, energy, ..., periodStart } }
  moodOverallOptions: [...DEFAULT_MOOD_OVERALL],
})

export function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    const parsed = JSON.parse(raw)
    return {
      entries: parsed.entries || {},
      moodOverallOptions: parsed.moodOverallOptions?.length
        ? parsed.moodOverallOptions
        : [...DEFAULT_MOOD_OVERALL],
    }
  } catch {
    return empty()
  }
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage full / unavailable – ignore */
  }
}
