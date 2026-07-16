import FieldCard from './FieldCard.jsx'

// A row of multi-select pills (checkboxes). `value` is an array of chosen
// options; clicking toggles membership. Optional, like everything else.
export default function MultiGroup({ label, emoji, options, value, color, onChange }) {
  const selected = Array.isArray(value) ? value : []

  function toggle(opt) {
    const next = selected.includes(opt)
      ? selected.filter((o) => o !== opt)
      : [...selected, opt]
    onChange(next.length ? next : null)
  }

  return (
    <FieldCard emoji={emoji} label={label}>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`pill ${active ? '' : 'pill-idle'}`}
              style={
                active
                  ? { background: color, color: '#fff', boxShadow: `0 4px 12px ${color}55` }
                  : undefined
              }
            >
              {active ? '✓ ' : ''}
              {opt}
            </button>
          )
        })}
      </div>
    </FieldCard>
  )
}
