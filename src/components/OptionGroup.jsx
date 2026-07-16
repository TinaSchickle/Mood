import { useState } from 'react'

// A row of selectable pills. Clicking the active pill again clears the value
// (every field is optional). `editable` fields show a "+ add" control.
export default function OptionGroup({
  label,
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
    <div className="py-3 border-b border-white/5">
      <div className="text-sm font-medium text-stone-300 mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(active ? null : opt)}
              className="px-3 py-1.5 rounded-full text-sm border transition-colors"
              style={
                active
                  ? { background: color, borderColor: color, color: '#0f0f14', fontWeight: 600 }
                  : { borderColor: 'rgba(255,255,255,0.15)', color: '#d6d3d1' }
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
                className="px-2 py-1 rounded-full text-sm bg-white/10 border border-white/20 outline-none w-28"
              />
              <button
                type="button"
                onClick={commitAdd}
                className="px-2 py-1.5 rounded-full text-sm bg-white/10 border border-white/20"
              >
                ✓
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="px-3 py-1.5 rounded-full text-sm border border-dashed border-white/25 text-stone-400"
            >
              + add
            </button>
          ))}
      </div>
    </div>
  )
}
