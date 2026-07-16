import { FIELDS, optionsFor } from '../config.js'
import { todayKey, addDays, longLabel, cycleDay } from '../dates.js'
import OptionGroup from './OptionGroup.jsx'
import MultiGroup from './MultiGroup.jsx'
import TextField from './TextField.jsx'

export default function EntryTab({ state, date, setDate, updateDay, addMoodOption }) {
  const entry = state.entries[date] || {}
  const day = cycleDay(state.entries, date)

  function setField(key, value) {
    updateDay(date, { [key]: value })
  }

  function togglePeriodStart() {
    setField('periodStart', !entry.periodStart)
  }

  const isToday = date === todayKey()

  return (
    <div className="max-w-xl mx-auto px-4 pb-28">
      {/* Date navigator */}
      <div className="flex items-center justify-between gap-2 py-3 mb-1">
        <button
          onClick={() => setDate(addDays(date, -1))}
          className="w-10 h-10 rounded-full card grid place-items-center text-xl text-violet-500 active:scale-90 transition"
          aria-label="Previous day"
        >
          ‹
        </button>
        <div className="text-center">
          <div className="font-display text-lg font-bold" style={{ color: 'var(--ink)' }}>
            {isToday ? 'Today' : longLabel(date).split(',')[0]}
          </div>
          <label className="text-xs font-semibold cursor-pointer" style={{ color: 'var(--ink-soft)' }}>
            {longLabel(date)}
            <input
              type="date"
              value={date}
              max={todayKey()}
              onChange={(e) => e.target.value && setDate(e.target.value)}
              className="block mx-auto mt-0.5 bg-transparent text-center outline-none text-violet-400"
            />
          </label>
        </div>
        <button
          onClick={() => setDate(addDays(date, 1))}
          disabled={isToday}
          className="w-10 h-10 rounded-full card grid place-items-center text-xl text-violet-500 active:scale-90 transition disabled:opacity-30"
          aria-label="Next day"
        >
          ›
        </button>
      </div>

      {/* Period tracker */}
      <section
        className="card p-4 mb-3"
        style={{ background: 'linear-gradient(135deg,#fff1f6,#ffe9f2)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl" aria-hidden="true">
            🌸
          </span>
          <h2 className="text-[15px] font-bold text-rose-500">Period</h2>
          {day != null && (
            <span className="ml-auto text-sm font-extrabold text-rose-500 bg-white/70 rounded-full px-3 py-1">
              Cycle day {day}
            </span>
          )}
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!!entry.periodStart}
            onChange={togglePeriodStart}
            className="w-5 h-5 accent-rose-400"
          />
          <span className="text-sm font-semibold text-rose-600/90">Start of new period today</span>
        </label>
        {day == null && (
          <p className="mt-2 text-xs text-rose-400">
            Tick the box on the first day of a period and the cycle day counts up from there.
          </p>
        )}
      </section>

      {/* All the optional fields */}
      {FIELDS.map((f) => {
        if (f.type === 'text') {
          return (
            <TextField
              key={f.key}
              label={f.label}
              emoji={f.emoji}
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
              emoji={f.emoji}
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
            emoji={f.emoji}
            options={optionsFor(f, state)}
            value={entry[f.key] ?? null}
            color={f.color}
            onChange={(v) => setField(f.key, v)}
            editable={f.editable}
            onAddOption={addMoodOption}
          />
        )
      })}

      <p className="text-center text-xs mt-4" style={{ color: 'var(--ink-soft)' }}>
        Everything is optional & saved automatically 💜
      </p>
    </div>
  )
}
