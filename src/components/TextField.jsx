import FieldCard from './FieldCard.jsx'

// A free-text field (e.g. "what I ate today"). Saves as a plain string.
export default function TextField({ label, emoji, value, onChange }) {
  return (
    <FieldCard emoji={emoji} label={label}>
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        rows={2}
        placeholder="Type anything you like…"
        className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-[15px] outline-none focus:border-indigo-300 resize-y"
        style={{ color: 'var(--ink)' }}
      />
    </FieldCard>
  )
}
