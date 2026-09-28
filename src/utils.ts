import type { CVData } from './types'

export const uid = (): string => Math.random().toString(36).slice(2, 10)

/** Split a textarea into non-empty trimmed lines */
export const lines = (s: string): string[] =>
  s.split('\n').map((l) => l.replace(/^[-•*]\s*/, '').trim()).filter(Boolean)

/** Split a comma separated string into trimmed items */
export const csv = (s: string): string[] =>
  s.split(',').map((x) => x.trim()).filter(Boolean)

export function patch<T extends { id: string }>(list: T[], id: string, change: Partial<T>): T[] {
  return list.map((i) => (i.id === id ? { ...i, ...change } : i))
}

export function move<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const j = index + dir
  if (j < 0 || j >= list.length) return list
  const copy = [...list]
  ;[copy[index], copy[j]] = [copy[j], copy[index]]
  return copy
}

export const isEmail = (s: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)

/** 0-100 score of how complete the CV is */
export function completeness(d: CVData): number {
  const checks = [
    d.personal.name,
    d.personal.title,
    isEmail(d.personal.email) ? 'ok' : '',
    d.personal.phone,
    d.personal.city,
    d.personal.linkedin || d.personal.github,
    d.summary.length >= 150 ? 'ok' : '',
    d.experience.length ? 'ok' : '',
    d.experience.some((e) => lines(e.bullets).length >= 2) ? 'ok' : '',
    d.education.length ? 'ok' : '',
    d.skillsTech,
    d.projects.length ? 'ok' : '',
    d.certs.length || d.achievements ? 'ok' : '',
    d.languages || d.hobbies,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}
