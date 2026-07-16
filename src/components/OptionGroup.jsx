import { useState } from 'react'
import FieldCard from './FieldCard.jsx'

// A row of selectable pills. Clicking the active pill again clears the value
// (every field is optional). `editable` fields show a "+ add" control.
export default function OptionGroup({
  label,
  emoji,
  options,
  value,
  color,
  onChange,
  editable,
  onAddOption,
}) {
  const [adding, setAdding] = useState(false)
  const [text, setText] = useState('')

  function commitAdd() {
    const v = text.trim()
    if (v) onAddOption(v)
    setText('')
    setAdding(false)
  }

  return (
    <FieldCard emoji={emoji} label={label}>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(active ? null : opt)}
              className={`pill ${active ? '' : 'pill-idle'}`}
              style={
                active
                  ? { background: color, color: '#fff', boxShadow: `0 4px 12px ${color}55` }
                  : undefined
              }
            >
              {opt}
            </button>
          )
        })}

        {editable &&
          (adding ? (
            <span className="inline-flex items-center gap-1">
              <input
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitAdd()
                  if (e.key === 'Escape') {
                    setAdding(false)
                    setText('')
                  }
                }}
                placeholder="new option"
                className="px-3 py-2 rounded-full text-sm bg-indigo-50 border border-indigo-200 outline-none w-28"
              />
              <button
                type="button"
                onClick={commitAdd}
                className="pill"
                style={{ background: color, color: '#fff' }}
              >
                ✓
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="pill pill-idle border-dashed"
            >
              + add
            </button>
          ))}
      </div>
    </FieldCard>
  )
}
