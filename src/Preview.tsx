import type { CSSProperties, ReactNode } from 'react'
import type { CVData, Settings } from './types'
import { csv, lines } from './utils'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="cv-sec">
      <h3>{title}</h3>
      {children}
    </section>
  )
}

const Summary = ({ d }: { d: CVData }) =>
  d.summary.trim() ? (
    <Section title="Summary">
      <p>{d.summary}</p>
    </Section>
  ) : null

const Experience = ({ d }: { d: CVData }) =>
  d.experience.length ? (
    <Section title="Experience">
      {d.experience.map((e) => (
        <div className="cv-item" key={e.id}>
          <div className="row">
            <b>{e.role}</b>
            <span className="muted">{[e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ')}</span>
          </div>
          <div className="row muted">
            <span>{e.company}</span>
            <span>{e.location}</span>
          </div>
          {lines(e.bullets).length > 0 && (
            <ul>{lines(e.bullets).map((b, i) => <li key={i}>{b}</li>)}</ul>
          )}
        </div>
      ))}
    </Section>
  ) : null

const Projects = ({ d }: { d: CVData }) =>
  d.projects.length ? (
    <Section title="Projects">
      {d.projects.map((p) => (
        <div className="cv-item" key={p.id}>
          <div className="row">
            <b>{p.name}</b>
            <span className="muted">{p.link}</span>
          </div>
          {p.tech && <div className="muted">{p.tech}</div>}
          {p.description && <p>{p.description}</p>}
        </div>
      ))}
    </Section>
  ) : null

const Education = ({ d }: { d: CVData }) =>
  d.education.length ? (
    <Section title="Education">
      {d.education.map((e) => (
        <div className="cv-item" key={e.id}>
          <div className="row">
            <b>{[e.degree, e.field].filter(Boolean).join(' in ')}</b>
            <span className="muted">{[e.start, e.end].filter(Boolean).join(' – ')}</span>
          </div>
          <div className="row muted">
            <span>{e.school}</span>
            <span>{e.grade}</span>
          </div>
        </div>
      ))}
    </Section>
  ) : null

const Certs = ({ d }: { d: CVData }) =>
  d.certs.length ? (
    <Section title="Certifications">
      {d.certs.map((c) => (
        <div className="row" key={c.id}>
          <span><b>{c.name}</b>{c.org && <span className="muted"> · {c.org}</span>}</span>
          <span className="muted">{c.year}</span>
        </div>
      ))}
    </Section>
  ) : null

const Achievements = ({ d }: { d: CVData }) =>
  lines(d.achievements).length ? (
    <Section title="Achievements">
      <ul>{lines(d.achievements).map((a, i) => <li key={i}>{a}</li>)}</ul>
    </Section>
  ) : null

const SkillRows = ({ d }: { d: CVData }) => {
  const rows: [string, string][] = [
    ['Technical', d.skillsTech],
    ['Tools', d.skillsTools],
    ['Soft skills', d.skillsSoft],
  ]
  const filled = rows.filter(([, v]) => csv(v).length)
  return filled.length ? (
    <Section title="Skills">
      {filled.map(([k, v]) => (
        <div className="skill-row" key={k}>
          <b>{k}:</b> {csv(v).join(', ')}
        </div>
      ))}
    </Section>
  ) : null
}

const Extras = ({ d }: { d: CVData }) =>
  d.languages.trim() || d.hobbies.trim() ? (
    <Section title="Languages & Interests">
      {d.languages.trim() && <div className="skill-row"><b>Languages:</b> {d.languages}</div>}
      {d.hobbies.trim() && <div className="skill-row"><b>Interests:</b> {d.hobbies}</div>}
    </Section>
  ) : null

function contacts(d: CVData): string[] {
  const p = d.personal
  return [p.email, p.phone, p.city, p.address, p.linkedin, p.github, p.website].filter((x) => x.trim())
}

function Header({ d }: { d: CVData }) {
  return (
    <header className="cv-head">
      <h1>{d.personal.name || 'Your Name'}</h1>
      {d.personal.title && <div className="cv-title">{d.personal.title}</div>}
      <div className="cv-contact">
        {contacts(d).map((c, i) => <span key={i}>{c}</span>)}
      </div>
    </header>
  )
}

export function CV({ data, settings }: { data: CVData; settings: Settings }) {
  const style = {
    '--accent': settings.accent,
    fontFamily: settings.template === 'classic' ? 'Georgia, "Times New Roman", serif' : settings.font,
    fontSize: `${settings.fontSize}px`,
  } as CSSProperties

  if (settings.template === 'sidebar') {
    const p = data.personal
    return (
      <div className="cv-page cv-sidebar" style={style}>
        <aside>
          <h1>{p.name || 'Your Name'}</h1>
          {p.title && <div className="cv-title">{p.title}</div>}
          <h3>Contact</h3>
          {contacts(data).map((c, i) => <div className="side-line" key={i}>{c}</div>)}
          {csv(data.skillsTech + ',' + data.skillsTools).length > 0 && (
            <>
              <h3>Skills</h3>
              {csv(data.skillsTech + ',' + data.skillsTools).map((s, i) => <div className="side-line" key={i}>{s}</div>)}
            </>
          )}
          {csv(data.skillsSoft).length > 0 && (
            <>
              <h3>Soft skills</h3>
              {csv(data.skillsSoft).map((s, i) => <div className="side-line" key={i}>{s}</div>)}
            </>
          )}
          {data.languages.trim() && (<><h3>Languages</h3><div className="side-line">{data.languages}</div></>)}
          {data.hobbies.trim() && (<><h3>Interests</h3><div className="side-line">{data.hobbies}</div></>)}
        </aside>
        <main>
          <Summary d={data} />
          <Experience d={data} />
          <Projects d={data} />
          <Education d={data} />
          <Certs d={data} />
          <Achievements d={data} />
        </main>
      </div>
    )
  }

  return (
    <div className={`cv-page cv-${settings.template}`} style={style}>
      <Header d={data} />
      <Summary d={data} />
      <Experience d={data} />
      <Projects d={data} />
      <SkillRows d={data} />
      <Education d={data} />
      <Certs d={data} />
      <Achievements d={data} />
      <Extras d={data} />
    </div>
  )
}
