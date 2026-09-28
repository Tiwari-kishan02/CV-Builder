import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CVData, Settings } from './types'
import { sampleData } from './sample'

export const emptyData: CVData = {
  personal: { name: '', title: '', email: '', phone: '', city: '', address: '', linkedin: '', github: '', website: '' },
  summary: '',
  experience: [],
  education: [],
  skillsTech: '',
  skillsTools: '',
  skillsSoft: '',
  projects: [],
  certs: [],
  languages: '',
  hobbies: '',
  achievements: '',
}

export const defaultSettings: Settings = {
  template: 'modern',
  accent: '#2563eb',
  font: 'Inter, system-ui, sans-serif',
  fontSize: 13,
}

interface State {
  data: CVData
  settings: Settings
  update: (fn: (d: CVData) => CVData) => void
  setData: (d: CVData) => void
  setSettings: (s: Partial<Settings>) => void
  loadSample: () => void
  reset: () => void
}

export const useCV = create<State>()(
  persist(
    (set) => ({
      data: emptyData,
      settings: defaultSettings,
      update: (fn) => set((s) => ({ data: fn(s.data) })),
      setData: (data) => set({ data }),
      setSettings: (s) => set((st) => ({ settings: { ...st.settings, ...s } })),
      loadSample: () => set({ data: sampleData }),
      reset: () => set({ data: emptyData, settings: defaultSettings }),
    }),
    { name: 'cv-builder-v1' },
  ),
)
