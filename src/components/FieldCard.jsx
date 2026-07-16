// Shared friendly card wrapper: rounded white card with an emoji + label header.
export default function FieldCard({ emoji, label, children }) {
  return (
    <section className="card p-4 mb-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl" aria-hidden="true">
          {emoji}
        </span>
        <h2 className="text-[15px] font-bold" style={{ color: 'var(--ink)' }}>
          {label}
        </h2>
      </div>
      {children}
    </section>
  )
}
