import { useState } from 'react'
import { FIELDS, optionsFor } from '../config.js'
import { todayKey, addDays, rangeKeys, diffDays, cycleDay } from '../dates.js'
import Chart from './Chart.jsx'

const RANGES = [
  { label: '14d', days: 14 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
  { label: 'All', days: null },
]

export default function Dashboard({ state }) {
  const [rangeDays, setRangeDays] = useState(30)

  const today = todayKey()
  const entryKeys = Object.keys(state.entries)
  const earliest =
    entryKeys.length > 0 ? entryKeys.sort()[0] : today

  let startKey
  if (rangeDays == null) {
    startKey = diffDays(earliest, today) < 0 ? earliest : today
  } else {
    startKey = addDays(today, -(rangeDays - 1))
  }

  const days = rangeKeys(startKey, today).map((key) => ({
    key,
    entry: state.entries[key],
  }))

  const chartFields = FIELDS.filter((f) => f.chart)
  const curCycle = cycleDay(state.entries, today)

  return (
    <div className="max-w-2xl mx-auto px-4 pb-24">
      <div className="flex items-center justify-between py-4 gap-3 flex-wrap sticky top-0 bg-[#0f0f14] z-10">
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setRangeDays(r.days)}
              className="px-3 py-1 rounded-md text-sm transition-colors"
              style={
                rangeDays === r.days
                  ? { background: '#a78bfa', color: '#0f0f14', fontWeight: 600 }
                  : { color: '#d6d3d1' }
              }
            >
              {r.label}
            </button>
          ))}
        </div>
        {curCycle != null && (
          <div className="text-sm text-rose-300">Cycle day {curCycle}</div>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-stone-400 mb-3 px-1">
        <span className="inline-flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> = no value that day
          (shown at neutral)
        </span>
      </div>

      <div className="grid gap-4">
        {chartFields.map((f) => (
          <Chart key={f.key} field={f} options={optionsFor(f, state)} days={days} />
        ))}
      </div>
    </div>
  )
}
