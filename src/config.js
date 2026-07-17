// Definition of every trackable field.
//
// `options`      – the ordered list of choices (low → high where it matters).
// `type`         – 'single' (pills, default), 'multi' (checkboxes) or 'text'.
// `editable`     – user can add custom options (stored in state.customOptions).
// `chart`        – whether this field gets its own dashboard diagram.
// `color`        – line/dot colour for the chart (never pure red – red is
//                  reserved for "no value on this day" markers).
// `emoji`        – a friendly icon shown next to the label.
export const FIELDS = [
  {
    key: 'moodOverall',
    label: 'Mood',
    emoji: '🌈',
    options: ['negative', 'neutral', 'positive'],
    chart: true,
    color: '#a855f7',
  },
  {
    key: 'moodDetailed',
    label: 'Mood in detail',
    emoji: '💭',
    options: ['happy', 'irritable', 'sad'],
    editable: true,
    chart: false,
    color: '#f472b6',
  },
  {
    key: 'energy',
    label: 'Energy',
    emoji: '⚡',
    options: ['no energy', 'low energy', 'neutral', 'high energy'],
    chart: true,
    color: '#f59e0b',
  },
  {
    key: 'sportOverall',
    label: 'Sport',
    emoji: '🤸‍♀️',
    options: ['no', 'low movement', 'yes'],
    chart: true,
    color: '#22c55e',
  },
  {
    key: 'sportSpecific',
    label: 'What sport',
    emoji: '🏐',
    options: ['volleyball', 'gym', 'home gym', 'running'],
    type: 'multi',
    editable: true,
    chart: false,
    color: '#4ade80',
  },
  {
    key: 'bloating',
    label: 'Bloating',
    emoji: '🎈',
    options: ['no', 'little', 'medium', 'a lot'],
    chart: true,
    color: '#06b6d4',
  },
  {
    key: 'belly',
    label: 'Belly',
    emoji: '🫃',
    options: ['flat', 'little belly', 'korea kugel'],
    chart: true,
    color: '#14b8a6',
  },
  {
    key: 'face',
    label: 'Face',
    emoji: '✨',
    options: ['bad', 'few pimples', 'clean'],
    chart: true,
    color: '#38bdf8',
  },
  {
    key: 'stuhlgang',
    label: 'Stuhlgang',
    emoji: '💩',
    options: ['soft', 'normal', 'hard'],
    chart: false,
    color: '#b08968',
  },
  {
    key: 'fighting',
    label: 'Fighting with Pascal',
    emoji: '💢',
    options: ['no', 'light', 'strong'],
    chart: true,
    color: '#fb7185',
  },
  {
    key: 'sex',
    label: 'Sex',
    emoji: '💗',
    options: ['no', 'yes', 'self'],
    chart: true,
    color: '#ec4899',
  },
  {
    key: 'food',
    label: 'Food',
    emoji: '🍽️',
    type: 'text',
    chart: false,
    color: '#eab308',
  },
]

// Resolve the option list for a field. Editable fields append any custom
// options the user has added (stored per field key in state.customOptions).
export function optionsFor(field, state) {
  const base = field.options || []
  if (field.editable) {
    const extra = state.customOptions?.[field.key] || []
    return [...base, ...extra.filter((o) => !base.includes(o))]
  }
  return base
}

// The index used to plot a day that has no value ("neutral" baseline).
// If an option literally named "neutral" exists we use it, otherwise the
// middle of the scale, so red null-dots line up on a consistent baseline.
export function neutralIndex(options) {
  const i = options.findIndex((o) => o.toLowerCase() === 'neutral')
  return i >= 0 ? i : (options.length - 1) / 2
}
