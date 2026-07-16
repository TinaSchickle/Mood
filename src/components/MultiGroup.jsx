// A row of multi-select pills (checkboxes). `value` is an array of chosen
// options; clicking toggles membership. Optional, like everything else.
export default function MultiGroup({ label, options, value, color, onChange }) {
  const selected = Array.isArray(value) ? value : []

  function toggle(opt) {
    const next = selected.includes(opt)
      ? selected.filter((o) => o !== opt)
      : [...selected, opt]
    onChange(next.length ? next : null)
  }

  return (
    <div className="py-3 border-b border-white/5">
      <div className="text-sm font-medium text-stone-300 mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className="px-3 py-1.5 rounded-full text-sm border transition-colors"
              style={
                active
                  ? { background: color, borderColor: color, color: '#0f0f14', fontWeight: 600 }
                  : { borderColor: 'rgba(255,255,255,0.15)', color: '#d6d3d1' }
              }
            >
              {active ? '✓ ' : ''}
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
