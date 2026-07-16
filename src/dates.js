// Local-date helpers. We key entries by "YYYY-MM-DD" in *local* time so a day
// never shifts due to UTC conversion.

export function toKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function fromKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayKey() {
  return toKey(new Date())
}

export function addDays(key, n) {
  const d = fromKey(key)
  d.setDate(d.getDate() + n)
  return toKey(d)
}

export function diffDays(aKey, bKey) {
  const a = fromKey(aKey)
  const b = fromKey(bKey)
  return Math.round((a - b) / 86400000)
}

// All day-keys from startKey to endKey inclusive.
export function rangeKeys(startKey, endKey) {
  const out = []
  let k = startKey
  while (diffDays(k, endKey) <= 0) {
    out.push(k)
    k = addDays(k, 1)
  }
  return out
}

// Cycle day for `key`: 1 on the most recent "start of new period" tick on or
// before that day, counting up each day after. null if no start tick yet.
export function cycleDay(entries, key) {
  let k = key
  for (let i = 0; i < 400; i++) {
    if (entries[k]?.periodStart) return diffDays(key, k) + 1
    k = addDays(k, -1)
  }
  return null
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function shortLabel(key) {
  const d = fromKey(key)
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export function longLabel(key) {
  const d = fromKey(key)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return `${days[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}
