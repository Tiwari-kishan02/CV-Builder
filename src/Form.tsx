import type { ReactNode } from 'react'
import { useCV } from './store'
import type { Personal } from './types'
import { isEmail, move, patch, uid } from './utils'

export const STEPS = [
  'Personal',
  'Summary',
  'Experience',
  'Education',
  'Skills',
  'Projects',
  'Certifications',
  'Extras',
] as const

const TIPS: Record<(typeof STEPS)[number], string> = {
  Personal: 'Use a professional email and add your LinkedIn or GitHub link. A photo is not needed for most jobs.',
  Summary: 'Write 2–4 lines: who you are, your strongest skills and one result with a number.',
  Experience: 'Start each line with an action verb (Built, Led, Reduced) and add numbers where you can. Put one achievement per line.',
  Education: 'Keep it short. Add CGPA or percentage if it is good. Latest education first.',
  Skills: 'Separate skills with commas. List the ones the job description asks for first.',
  Projects: 'Pick 2–3 projects that match the job. Add a link so recruiters can open them.',
  Certifications: 'Only add certifications that are relevant. Put one achievement per line.',
  Extras: 'Languages and hobbies show who you are. Keep them to one line each.',
}

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  error?: string
}

function Field({ label, value, onChange, type = 'text', placeholder, error }: FieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />
      {error && <em className="err">{error}</em>}
    </label>
  )
}

interface AreaProps {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
  placeholder?: string
  hint?: string
}

function Area({ label, value, onChange, rows = 4, placeholder, hint }: AreaProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {hint && <small>{hint}</small>}
    </label>
  )
}

interface CardProps {
  title: string
  index: number
  total: number
  onMove: (dir: -1 | 1) => void
  onRemove: () => void
  children: ReactNode
}

function Card({ title, index, total, onMove, onRemove, children }: CardProps) {
  return (
    <fieldset className="card">
      <legend>{title || `Entry ${index + 1}`}</legend>
      <div className="card-actions">
        <button type="button" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Move up">↑</button>
        <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} aria-label="Move down">↓</button>
        <button type="button" onClick={onRemove} aria-label="Remove entry" className="danger">Remove</button>
      </div>
      <div className="grid2">{children}</div>
    </fieldset>
  )
}

export function Form({ step }: { step: number }) {
  const { data, update } = useCV()
  const name = STEPS[step]
  const p = data.personal
  const setP = (k: keyof Personal) => (v: string) => update((d) => ({ ...d, personal: { ...d.personal, [k]: v } }))

  return (
    <section aria-label={name}>
      <h2>{name}</h2>
      <p className="tip">{TIPS[name]}</p>

      {name === 'Personal' && (
        <div className="grid2">
          <Field label="Full name" value={p.name} onChange={setP('name')} placeholder="Aarav Mehta" />
          <Field label="Professional title" value={p.title} onChange={setP('title')} placeholder="Software Engineer" />
          <Field label="Email" type="email" value={p.email} onChange={setP('email')} error={p.email && !isEmail(p.email) ? 'Enter a valid email, like name@example.com' : ''} />
          <Field label="Phone" value={p.phone} onChange={setP('phone')} placeholder="+91 98765 43210" />
          <Field label="City, country" value={p.city} onChange={setP('city')} placeholder="Mumbai, India" />
          <Field label="Full address (optional)" value={p.address} onChange={setP('address')} />
          <Field label="LinkedIn" value={p.linkedin} onChange={setP('linkedin')} placeholder="linkedin.com/in/yourname" />
          <Field label="GitHub" value={p.github} onChange={setP('github')} placeholder="github.com/yourname" />
          <Field label="Website / portfolio" value={p.website} onChange={setP('website')} />
        </div>
      )}

      {name === 'Summary' && (
        <Area
          label="Professional summary"
          rows={7}
          value={data.summary}
          onChange={(v) => update((d) => ({ ...d, summary: v }))}
          placeholder="Software engineer with 4+ years of experience building..."
          hint={`${data.summary.length} characters (aim for 300–500)`}
        />
      )}

      {name === 'Experience' && (
        <>
          {data.experience.map((e, i) => {
            const set = (ch: Partial<typeof e>) => update((d) => ({ ...d, experience: patch(d.experience, e.id, ch) }))
            return (
              <Card key={e.id} title={e.role ? `${e.role} – ${e.company}` : ''} index={i} total={data.experience.length}
                onMove={(dir) => update((d) => ({ ...d, experience: move(d.experience, i, dir) }))}
                onRemove={() => update((d) => ({ ...d, experience: d.experience.filter((x) => x.id !== e.id) }))}>
                <Field label="Job title" value={e.role} onChange={(v) => set({ role: v })} />
                <Field label="Company" value={e.company} onChange={(v) => set({ company: v })} />
                <Field label="Location" value={e.location} onChange={(v) => set({ location: v })} />
                <Field label="Start (e.g. Jun 2022)" value={e.start} onChange={(v) => set({ start: v })} />
                <Field label="End" value={e.current ? 'Present' : e.end} onChange={(v) => set({ end: v })} />
                <label className="check">
                  <input type="checkbox" checked={e.current} onChange={(ev) => set({ current: ev.target.checked })} />
                  I currently work here
                </label>
                <div className="span2">
                  <Area label="Achievements (one per line)" rows={5} value={e.bullets} onChange={(v) => set({ bullets: v })} placeholder={'Led a team of 4 to build...\nReduced load time by 45%...'} />
                </div>
              </Card>
            )
          })}
          <button type="button" className="add" onClick={() => update((d) => ({ ...d, experience: [...d.experience, { id: uid(), company: '', role: '', location: '', start: '', end: '', current: false, bullets: '' }] }))}>
            + Add experience
          </button>
        </>
      )}

      {name === 'Education' && (
        <>
          {data.education.map((e, i) => {
            const set = (ch: Partial<typeof e>) => update((d) => ({ ...d, education: patch(d.education, e.id, ch) }))
            return (
              <Card key={e.id} title={e.school} index={i} total={data.education.length}
                onMove={(dir) => update((d) => ({ ...d, education: move(d.education, i, dir) }))}
                onRemove={() => update((d) => ({ ...d, education: d.education.filter((x) => x.id !== e.id) }))}>
                <Field label="Institution" value={e.school} onChange={(v) => set({ school: v })} />
                <Field label="Degree" value={e.degree} onChange={(v) => set({ degree: v })} placeholder="B.Tech" />
                <Field label="Field of study" value={e.field} onChange={(v) => set({ field: v })} />
                <Field label="Grade / CGPA / %" value={e.grade} onChange={(v) => set({ grade: v })} />
                <Field label="Start year" value={e.start} onChange={(v) => set({ start: v })} />
                <Field label="End year" value={e.end} onChange={(v) => set({ end: v })} />
              </Card>
            )
          })}
          <button type="button" className="add" onClick={() => update((d) => ({ ...d, education: [...d.education, { id: uid(), school: '', degree: '', field: '', start: '', end: '', grade: '' }] }))}>
            + Add education
          </button>
        </>
      )}

      {name === 'Skills' && (
        <>
          <Area label="Technical skills (comma separated)" rows={2} value={data.skillsTech} onChange={(v) => update((d) => ({ ...d, skillsTech: v }))} placeholder="JavaScript, React, Python, SQL" />
          <Area label="Tools & platforms" rows={2} value={data.skillsTools} onChange={(v) => update((d) => ({ ...d, skillsTools: v }))} placeholder="Git, Docker, AWS" />
          <Area label="Soft skills" rows={2} value={data.skillsSoft} onChange={(v) => update((d) => ({ ...d, skillsSoft: v }))} placeholder="Leadership, Communication" />
        </>
      )}

      {name === 'Projects' && (
        <>
          {data.projects.map((pr, i) => {
            const set = (ch: Partial<typeof pr>) => update((d) => ({ ...d, projects: patch(d.projects, pr.id, ch) }))
            return (
              <Card key={pr.id} title={pr.name} index={i} total={data.projects.length}
                onMove={(dir) => update((d) => ({ ...d, projects: move(d.projects, i, dir) }))}
                onRemove={() => update((d) => ({ ...d, projects: d.projects.filter((x) => x.id !== pr.id) }))}>
                <Field label="Project name" value={pr.name} onChange={(v) => set({ name: v })} />
                <Field label="Link (GitHub / live)" value={pr.link} onChange={(v) => set({ link: v })} />
                <div className="span2"><Field label="Tech stack" value={pr.tech} onChange={(v) => set({ tech: v })} /></div>
                <div className="span2"><Area label="Description" rows={3} value={pr.description} onChange={(v) => set({ description: v })} /></div>
              </Card>
            )
          })}
          <button type="button" className="add" onClick={() => update((d) => ({ ...d, projects: [...d.projects, { id: uid(), name: '', link: '', tech: '', description: '' }] }))}>
            + Add project
          </button>
        </>
      )}

      {name === 'Certifications' && (
        <>
          {data.certs.map((c, i) => {
            const set = (ch: Partial<typeof c>) => update((d) => ({ ...d, certs: patch(d.certs, c.id, ch) }))
            return (
              <Card key={c.id} title={c.name} index={i} total={data.certs.length}
                onMove={(dir) => update((d) => ({ ...d, certs: move(d.certs, i, dir) }))}
                onRemove={() => update((d) => ({ ...d, certs: d.certs.filter((x) => x.id !== c.id) }))}>
                <Field label="Certification" value={c.name} onChange={(v) => set({ name: v })} />
                <Field label="Issued by" value={c.org} onChange={(v) => set({ org: v })} />
                <Field label="Year" value={c.year} onChange={(v) => set({ year: v })} />
              </Card>
            )
          })}
          <button type="button" className="add" onClick={() => update((d) => ({ ...d, certs: [...d.certs, { id: uid(), name: '', org: '', year: '' }] }))}>
            + Add certification
          </button>
          <Area label="Achievements & awards (one per line)" rows={3} value={data.achievements} onChange={(v) => update((d) => ({ ...d, achievements: v }))} />
        </>
      )}

      {name === 'Extras' && (
        <>
          <Field label="Languages" value={data.languages} onChange={(v) => update((d) => ({ ...d, languages: v }))} placeholder="English (Fluent), Hindi (Native)" />
          <Field label="Hobbies & interests" value={data.hobbies} onChange={(v) => update((d) => ({ ...d, hobbies: v }))} placeholder="Chess, Trekking" />
        </>
      )}
    </section>
  )
}
