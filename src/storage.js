const KEY = 'mood-tracker-v1'

const empty = () => ({
  entries: {}, // { 'YYYY-MM-DD': { moodOverall, energy, ..., periodStart } }
  customOptions: {}, // { [fieldKey]: [extra option strings] }
})

export function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    const parsed = JSON.parse(raw)
    return {
      entries: parsed.entries || {},
      customOptions: parsed.customOptions || {},
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
