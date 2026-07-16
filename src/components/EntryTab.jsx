import { FIELDS, optionsFor } from '../config.js'
import { todayKey, addDays, longLabel, cycleDay } from '../dates.js'
import OptionGroup from './OptionGroup.jsx'
import MultiGroup from './MultiGroup.jsx'
import TextField from './TextField.jsx'

export default function EntryTab({ state, setState, date, setDate }) {
  const entry = state.entries[date] || {}
  const day = cycleDay(state.entries, date)

  function setField(key, value) {
    setState((s) => {
      const cur = s.entries[date] || {}
      const next = { ...cur, [key]: value }
      return { ...s, entries: { ...s.entries, [date]: next } }
    })
  }

  function togglePeriodStart() {
    setField('periodStart', !entry.periodStart)
  }

  function addMoodOption(opt) {
    setState((s) => {
      const opts = s.moodOverallOptions || []
      if (opts.includes(opt)) return s
      return { ...s, moodOverallOptions: [...opts, opt] }
    })
  }

  const isToday = date === todayKey()

  return (
    <div className="max-w-xl mx-auto px-4 pb-24">
      {/* Date navigator */}
      <div className="flex items-center justify-between gap-2 py-4 sticky top-0 bg-[#0f0f14] z-10">
        <button
          onClick={() => setDate(addDays(date, -1))}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-lg"
          aria-label="Previous day"
        >
          ‹
        </button>
        <div className="text-center">
          <input
            type="date"
            value={date}
            max={todayKey()}
            onChange={(e) => e.target.value && setDate(e.target.value)}
            className="bg-transparent text-center text-stone-200 text-sm outline-none"
          />
          <div className="text-xs text-stone-400">
            {longLabel(date)}
            {isToday && ' · today'}
          </div>
        </div>
        <button
          onClick={() => setDate(addDays(date, 1))}
          disabled={isToday}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-lg disabled:opacity-30"
          aria-label="Next day"
        >
          ›
        </button>
      </div>

      {/* Period tracker */}
      <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 mb-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!!entry.periodStart}
            onChange={togglePeriodStart}
            className="w-5 h-5 accent-rose-400"
          />
          <span className="text-sm text-stone-200">Start of new period</span>
        </label>
        <div className="mt-2 text-sm text-rose-200/80">
          {day == null
            ? 'No cycle started yet — tick the box on the first day of a period.'
            : `Cycle day ${day}`}
        </div>
      </div>

      {/* All the optional fields */}
      {FIELDS.map((f) => {
        if (f.type === 'text') {
          return (
            <TextField
              key={f.key}
              label={f.label}
              value={entry[f.key] ?? null}
              onChange={(v) => setField(f.key, v)}
            />
          )
        }
        if (f.type === 'multi') {
          return (
            <MultiGroup
              key={f.key}
              label={f.label}
              options={optionsFor(f, state)}
              value={entry[f.key] ?? null}
              color={f.color}
              onChange={(v) => setField(f.key, v)}
            />
          )
        }
        return (
          <OptionGroup
            key={f.key}
            label={f.label}
            options={optionsFor(f, state)}
            value={entry[f.key] ?? null}
            color={f.color}
            onChange={(v) => setField(f.key, v)}
            editable={f.editable}
            onAddOption={addMoodOption}
          />
        )
      })}

      <p className="text-xs text-stone-500 mt-4">
        Everything is optional and saved automatically on this device.
      </p>
    </div>
  )
}
