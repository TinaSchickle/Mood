// A free-text field (e.g. "what I ate today"). Saves as a plain string.
export default function TextField({ label, value, onChange }) {
  return (
    <div className="py-3 border-b border-white/5">
      <div className="text-sm font-medium text-stone-300 mb-2">{label}</div>
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        rows={2}
        placeholder="Type anything…"
        className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-stone-100 outline-none focus:border-white/30 resize-y"
      />
    </div>
  )
}
