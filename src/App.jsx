import { useEffect, useRef, useState } from 'react'
import { load, save } from './storage.js'
import { todayKey } from './dates.js'
import { isCloudConfigured, fetchAll, upsertDay, upsertOptions, subscribe } from './cloud.js'
import EntryTab from './components/EntryTab.jsx'
import Dashboard from './components/Dashboard.jsx'

export default function App() {
  const [state, setState] = useState(load)
  const [tab, setTab] = useState('entry')
  const [date, setDate] = useState(todayKey())
  // 'off' (no cloud) | 'syncing' | 'ok' | 'error'
  const [cloud, setCloud] = useState(isCloudConfigured ? 'syncing' : 'off')
  const fileInput = useRef(null)
  const pushTimers = useRef({})

  // Persist locally on every change (works offline / as a cache).
  useEffect(() => {
    save(state)
  }, [state])

  // Initial cloud pull + live subscription.
  useEffect(() => {
    if (!isCloudConfigured) return
    let cancelled = false

    ;(async () => {
      try {
        const remote = await fetchAll()
        if (cancelled || !remote) return
        setState((local) => {
          const entries = { ...local.entries, ...remote.entries } // cloud wins per day
          const customOptions = remote.customOptions || local.customOptions || {}
          // Push up any days that only existed locally (e.g. entered offline).
          for (const [d, v] of Object.entries(local.entries)) {
            if (!(d in remote.entries)) upsertDay(d, v).catch(() => {})
          }
          if (!remote.customOptions && Object.keys(customOptions).length) {
            upsertOptions(customOptions).catch(() => {})
          }
          return { entries, customOptions }
        })
        setCloud('ok')
      } catch (err) {
        console.warn('Cloud sync unavailable, using local storage only:', err.message)
        if (!cancelled) setCloud('error')
      }
    })()

    const unsub = subscribe(async () => {
      try {
        const remote = await fetchAll()
        if (cancelled || !remote) return
        setState((local) => ({
          entries: { ...local.entries, ...remote.entries },
          customOptions: remote.customOptions || local.customOptions || {},
        }))
      } catch {
        /* ignore transient realtime refetch errors */
      }
    })

    return () => {
      cancelled = true
      unsub()
    }
  }, [])

  // Debounced push of a single day to the cloud (the food textarea fires often).
  function pushDaySoon(d, data) {
    if (!isCloudConfigured) return
    clearTimeout(pushTimers.current[d])
    pushTimers.current[d] = setTimeout(() => {
      upsertDay(d, data)
        .then(() => setCloud((c) => (c === 'off' ? c : 'ok')))
        .catch((err) => {
          console.warn('Could not sync day', d, err.message)
          setCloud('error')
        })
    }, 500)
  }

  // Merge a patch into a given day and sync it.
  function updateDay(d, patch) {
    setState((s) => {
      const next = { ...(s.entries[d] || {}), ...patch }
      pushDaySoon(d, next)
      return { ...s, entries: { ...s.entries, [d]: next } }
    })
  }

  // Add a custom option to an editable field (e.g. "Mood in detail", "What sport").
  function addOption(fieldKey, opt) {
    setState((s) => {
      const existing = s.customOptions?.[fieldKey] || []
      if (existing.includes(opt)) return s
      const customOptions = { ...s.customOptions, [fieldKey]: [...existing, opt] }
      if (isCloudConfigured) upsertOptions(customOptions).catch(() => setCloud('error'))
      return { ...s, customOptions }
    })
  }

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
          const next = {
            entries: parsed.entries,
            customOptions: parsed.customOptions || state.customOptions || {},
          }
          setState(next)
          if (isCloudConfigured) {
            for (const [d, v] of Object.entries(next.entries)) upsertDay(d, v).catch(() => {})
            upsertOptions(next.customOptions).catch(() => {})
          }
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
      <header className="max-w-2xl mx-auto px-4 pt-5 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--ink)' }}>
            🌸 Mood
          </h1>
          <SyncBadge status={cloud} />
        </div>
        <div className="flex gap-1.5 text-xs font-bold">
          <button
            onClick={exportData}
            className="px-3 py-1.5 rounded-full card text-indigo-500 active:scale-95 transition"
          >
            Export
          </button>
          <button
            onClick={() => fileInput.current?.click()}
            className="px-3 py-1.5 rounded-full card text-indigo-500 active:scale-95 transition"
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
        <EntryTab
          state={state}
          date={date}
          setDate={setDate}
          updateDay={updateDay}
          addOption={addOption}
        />
      ) : (
        <Dashboard state={state} />
      )}

      <nav className="fixed bottom-0 inset-x-0 z-20 bg-white/80 backdrop-blur-md border-t border-slate-200 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-2xl mx-auto grid grid-cols-2 p-2 gap-2">
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

function SyncBadge({ status }) {
  if (status === 'off') return null
  const map = {
    syncing: { text: 'Syncing…', color: '#a89f2f', bg: '#fbfbe8' },
    ok: { text: '● Synced', color: '#16a34a', bg: '#e9fbef' },
    error: { text: '● Local only', color: '#b4780a', bg: '#fef6e6' },
  }
  const s = map[status] || map.syncing
  return (
    <span
      className="text-[11px] font-bold rounded-full px-2 py-0.5"
      style={{ color: s.color, background: s.bg }}
      title="Cross-device sync status"
    >
      {s.text}
    </span>
  )
}

function TabButton({ active, onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      className="py-2.5 rounded-2xl flex flex-col items-center gap-0.5 text-xs font-bold transition-all"
      style={
        active
          ? { color: '#4f46e5', background: '#eef0fe' }
          : { color: '#9aa1b3', background: 'transparent' }
      }
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  )
}
