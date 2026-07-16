import { neutralIndex } from '../config.js'
import { shortLabel, longLabel } from '../dates.js'

// A compact categorical time-series chart drawn as plain SVG (no chart lib).
//
// For each day we plot a dot at the option's index on the Y axis. Days with no
// value are plotted at the "neutral" baseline and drawn as a RED dot so missing
// data is obvious while the line stays continuous.
export default function Chart({ field, options, days }) {
  const NULL_COLOR = '#f43f5e'
  const nIdx = neutralIndex(options)
  const maxIdx = Math.max(options.length - 1, 1)

  const mL = 92
  const mR = 14
  const mT = 14
  const mB = 40
  const colW = 20
  const rowH = 30
  const plotW = Math.max(days.length * colW, 40)
  const plotH = maxIdx * rowH
  const width = mL + plotW + mR
  const height = mT + plotH + mB

  const x = (i) => mL + (days.length === 1 ? plotW / 2 : (i / (days.length - 1)) * plotW)
  const y = (idx) => mT + ((maxIdx - idx) / maxIdx) * plotH

  const points = days.map((d, i) => {
    const val = d.entry?.[field.key] ?? null
    const idx = val != null ? options.indexOf(val) : nIdx
    return {
      i,
      key: d.key,
      val,
      idx: idx < 0 ? nIdx : idx,
      isNull: val == null,
      cx: x(i),
      cy: y(idx < 0 ? nIdx : idx),
    }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.cx} ${p.cy}`).join(' ')
  const labelEvery = Math.max(1, Math.ceil(days.length / 8))

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg" aria-hidden="true">
          {field.emoji}
        </span>
        <h3 className="text-[15px] font-bold" style={{ color: 'var(--ink)' }}>
          {field.label}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${field.label} over time`}
        >
          {/* Y gridlines + category labels */}
          {options.map((opt, idx) => (
            <g key={opt}>
              <line
                x1={mL}
                x2={mL + plotW}
                y1={y(idx)}
                y2={y(idx)}
                stroke="rgba(140,110,180,0.13)"
              />
              <text x={mL - 8} y={y(idx) + 4} textAnchor="end" fontSize="11" fontWeight="600" fill="#9089a0">
                {opt}
              </text>
            </g>
          ))}

          {/* Connecting line */}
          <path d={linePath} fill="none" stroke={field.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" opacity="0.5" />

          {/* Dots */}
          {points.map((p) => (
            <circle
              key={p.key}
              cx={p.cx}
              cy={p.cy}
              r={p.isNull ? 3.5 : 5}
              fill={p.isNull ? NULL_COLOR : field.color}
              stroke="#ffffff"
              strokeWidth="1.5"
            >
              <title>
                {longLabel(p.key)}: {p.isNull ? 'no value' : p.val}
              </title>
            </circle>
          ))}

          {/* X labels */}
          {points.map((p) =>
            p.i % labelEvery === 0 ? (
              <text
                key={`x${p.key}`}
                x={p.cx}
                y={height - 22}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="#b3adbf"
              >
                {shortLabel(p.key)}
              </text>
            ) : null,
          )}
        </svg>
      </div>
    </div>
  )
}
