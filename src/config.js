// Definition of every trackable field.
//
// `options`      – the ordered list of choices (low → high where it matters).
//                  `null` means the options are user-editable (stored in state).
// `chart`        – whether this field gets its own dashboard diagram.
// `color`        – line/dot colour for the chart (never pure red – red is
//                  reserved for "no value on this day" markers).
export const DEFAULT_MOOD_OVERALL = ['negative', 'neutral', 'positive']

export const FIELDS = [
  {
    key: 'moodOverall',
    label: 'Mood (overall)',
    options: null, // editable – see DEFAULT_MOOD_OVERALL / state.moodOverallOptions
    editable: true,
    chart: true,
    color: '#a78bfa',
  },
  {
    key: 'moodDetailed',
    label: 'Mood (detailed)',
    options: ['happy', 'irritable', 'sad'],
    chart: false,
    color: '#f472b6',
  },
  {
    key: 'energy',
    label: 'Energy level',
    options: ['no energy', 'low energy', 'neutral', 'high energy'],
    chart: true,
    color: '#fbbf24',
  },
  {
    key: 'sportOverall',
    label: 'Sport (overall)',
    options: ['no', 'low movement', 'yes'],
    chart: true,
    color: '#4ade80',
  },
  {
    key: 'sportSpecific',
    label: 'Sport (what)',
    options: ['volleyball', 'gym', 'home gym', 'running'],
    type: 'multi',
    chart: false,
    color: '#86efac',
  },
  {
    key: 'bloating',
    label: 'Bloating',
    options: ['no', 'little', 'medium', 'a lot'],
    chart: true,
    color: '#22d3ee',
  },
  {
    key: 'belly',
    label: 'Belly',
    options: ['flat', 'little belly', 'korea kugel'],
    chart: true,
    color: '#34d399',
  },
  {
    key: 'face',
    label: 'Face',
    options: ['bad', 'few pimples', 'clean'],
    chart: true,
    color: '#38bdf8',
  },
  {
    key: 'stuhlgang',
    label: 'Stuhlgang',
    options: ['soft', 'normal', 'hard'],
    chart: false,
    color: '#a3a3a3',
  },
  {
    key: 'fighting',
    label: 'Fighting with Pascal',
    options: ['no', 'light', 'strong'],
    chart: true,
    color: '#fb923c',
  },
  {
    key: 'sex',
    label: 'Sex',
    options: ['no', 'yes', 'self'],
    chart: true,
    color: '#e879f9',
  },
  {
    key: 'food',
    label: 'Food (what I ate)',
    type: 'text',
    chart: false,
    color: '#facc15',
  },
]

// Resolve the option list for a field, honouring editable fields.
export function optionsFor(field, state) {
  if (field.key === 'moodOverall') {
    return state.moodOverallOptions?.length
      ? state.moodOverallOptions
      : DEFAULT_MOOD_OVERALL
  }
  return field.options
}

// The index used to plot a day that has no value ("neutral" baseline).
// If an option literally named "neutral" exists we use it, otherwise the
// middle of the scale, so red null-dots line up on a consistent baseline.
export function neutralIndex(options) {
  const i = options.findIndex((o) => o.toLowerCase() === 'neutral')
  return i >= 0 ? i : (options.length - 1) / 2
}
