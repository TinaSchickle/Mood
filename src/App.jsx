import { useEffect, useRef, useState } from 'react'
import { load, save } from './storage.js'
import { todayKey } from './dates.js'
import EntryTab from './components/EntryTab.jsx'
import Dashboard from './components/Dashboard.jsx'

export default function App() {
  const [state, setState] = useState(load)
  const [tab, setTab] = useState('entry')
  const [date, setDate] = useState(todayKey())
  const fileInput = useRef(null)

  // Persist on every change.
  useEffect(() => {
    save(state)
  }, [state])

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mood-tracker-${todayKey()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function importData(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        if (parsed && parsed.entries) {
          setState({
            entries: parsed.entries,
            moodOverallOptions: parsed.moodOverallOptions || state.moodOverallOptions,
          })
        } else {
          alert('That file does not look like a Mood Tracker export.')
        }
      } catch {
        alert('Could not read that file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="min-h-screen">
      <header className="max-w-2xl mx-auto px-4 pt-5 pb-1 flex items-center justify-between">
        <h1 className="text-lg font-bold text-stone-100">🌸 Mood Tracker</h1>
        <div className="flex gap-1 text-xs">
          <button
            onClick={exportData}
            className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-stone-400"
          >
            Export
          </button>
          <button
            onClick={() => fileInput.current?.click()}
            className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-stone-400"
          >
            Import
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            onChange={importData}
            className="hidden"
          />
        </div>
      </header>

      {tab === 'entry' ? (
        <EntryTab state={state} setState={setState} date={date} setDate={setDate} />
      ) : (
        <Dashboard state={state} />
      )}

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 inset-x-0 bg-[#15151c] border-t border-white/10">
        <div className="max-w-2xl mx-auto grid grid-cols-2">
          <TabButton active={tab === 'entry'} onClick={() => setTab('entry')} label="Track" icon="✍️" />
          <TabButton
            active={tab === 'dashboard'}
            onClick={() => setTab('dashboard')}
            label="Dashboard"
            icon="📊"
          />
        </div>
      </nav>
    </div>
  )
}

function TabButton({ active, onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      className="py-3 flex flex-col items-center gap-0.5 text-xs transition-colors"
      style={{ color: active ? '#a78bfa' : '#78716c' }}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  )
}
