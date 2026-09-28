import { useRef, useState, useEffect } from 'react'
import { Form, STEPS } from './Form'
import { CV } from './Preview'
import { defaultSettings, emptyData, useCV } from './store'
import type { CVData, TemplateId } from './types'
import { completeness } from './utils'

const TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: 'modern', label: 'Modern' },
  { id: 'classic', label: 'Classic' },
  { id: 'sidebar', label: 'Sidebar' },
  { id: 'ats', label: 'ATS plain' },
]
const PRESETS = ['#2563eb', '#0f766e', '#7c3aed', '#be123c', '#1f2937', '#c2410c']
const FONTS: [string, string][] = [
  ['Inter, system-ui, sans-serif', 'Inter'],
  ['Roboto, Arial, sans-serif', 'Roboto'],
  ['Lato, Arial, sans-serif', 'Lato'],
  ['Arial, Helvetica, sans-serif', 'Arial'],
]

export default function App() {
  const { data, settings, setData, setSettings, loadSample, reset } = useCV()
  const [step, setStep] = useState(0)
  const [view, setView] = useState<'edit' | 'preview'>('edit')
  const [toast, setToast] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(0.8)
  const score = completeness(data)

  // Fit the A4 page (794px wide) into the preview panel
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setZoom(Math.min(1, (el.clientWidth - 24) / 794)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const say = (m: string) => {
    setToast(m)
    window.setTimeout(() => setToast(''), 2500)
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'cv-data.json'
    a.click()
    URL.revokeObjectURL(a.href)
    say('Data exported')
  }

  const importJson = async (f: File | undefined) => {
    if (!f) return
    try {
      const parsed = JSON.parse(await f.text()) as Partial<CVData>
      if (!parsed.personal) throw new Error('bad file')
      setData({ ...emptyData, ...parsed, personal: { ...emptyData.personal, ...parsed.personal } })
      say('Data imported')
    } catch {
      say('This file is not a valid CV data file')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const doReset = () => {
    if (window.confirm('Delete all your CV data? This cannot be undone.')) {
      reset()
      setStep(0)
      say('All data cleared')
    }
  }

  const printCv = () => {
    const prev = document.title
    document.title = `${data.personal.name || 'CV'} - CV`
    window.print()
    document.title = prev
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">CV Builder</div>
        <div className="score" title="How complete your CV is">
          <div className="bar"><div style={{ width: `${score}%` }} /></div>
          <span>{score}% complete</span>
        </div>
        <div className="actions">
          <span className="saved">✓ Saved on this device</span>
          <button onClick={() => { loadSample(); say('Demo data loaded') }}>Fill demo data</button>
          <button onClick={() => fileRef.current?.click()}>Import JSON</button>
          <button onClick={exportJson}>Export JSON</button>
          <button onClick={doReset} className="danger">Reset</button>
          <button onClick={printCv} className="primary">Download PDF</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => importJson(e.target.files?.[0])} />
        </div>
      </header>

      <div className="tabs">
        <button className={view === 'edit' ? 'on' : ''} onClick={() => setView('edit')}>Edit</button>
        <button className={view === 'preview' ? 'on' : ''} onClick={() => setView('preview')}>Preview</button>
      </div>

      <div className={`layout show-${view}`}>
        <div className="form-panel">
          <nav className="steps" aria-label="Steps">
            {STEPS.map((s, i) => (
              <button key={s} className={i === step ? 'on' : i < step ? 'done' : ''} onClick={() => setStep(i)}>{s}</button>
            ))}
          </nav>
          <Form step={step} />
          <div className="nav-row">
            <button onClick={() => setStep(step - 1)} disabled={step === 0}>Back</button>
            {step < STEPS.length - 1 ? (
              <button className="primary" onClick={() => setStep(step + 1)}>Next</button>
            ) : (
              <button className="primary" onClick={() => { setView('preview'); printCv() }}>Finish and download</button>
            )}
          </div>
        </div>

        <div className="preview-panel">
          <div className="custom">
            <div className="seg" role="group" aria-label="Template">
              {TEMPLATES.map((t) => (
                <button key={t.id} className={settings.template === t.id ? 'on' : ''} onClick={() => setSettings({ template: t.id })}>{t.label}</button>
              ))}
            </div>
            <div className="ctl">
              {PRESETS.map((c) => (
                <button key={c} className={`swatch ${settings.accent === c ? 'on' : ''}`} style={{ background: c }} aria-label={`Accent ${c}`} onClick={() => setSettings({ accent: c })} />
              ))}
              <input type="color" value={settings.accent} onChange={(e) => setSettings({ accent: e.target.value })} aria-label="Custom accent colour" />
              <select value={settings.font} onChange={(e) => setSettings({ font: e.target.value })} aria-label="Font">
                {FONTS.map(([v, l]) => <option key={l} value={v}>{l}</option>)}
              </select>
              <label className="size">
                Size
                <input type="range" min={11} max={15} step={0.5} value={settings.fontSize} onChange={(e) => setSettings({ fontSize: Number(e.target.value) })} />
              </label>
              <button onClick={() => setSettings(defaultSettings)}>Reset look</button>
            </div>
          </div>
          <div className="preview-scroll" ref={wrapRef}>
            <div className="print-area" style={{ ['--zoom' as string]: zoom }}>
              <CV data={data} settings={settings} />
            </div>
          </div>
        </div>
      </div>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
