export interface Personal {
  name: string
  title: string
  email: string
  phone: string
  city: string
  address: string
  linkedin: string
  github: string
  website: string
}
export interface Experience {
  id: string
  company: string
  role: string
  location: string
  start: string
  end: string
  current: boolean
  bullets: string
}
export interface Education {
  id: string
  school: string
  degree: string
  field: string
  start: string
  end: string
  grade: string
}
export interface Project {
  id: string
  name: string
  link: string
  tech: string
  description: string
}
export interface Cert {
  id: string
  name: string
  org: string
  year: string
}
export interface CVData {
  personal: Personal
  summary: string
  experience: Experience[]
  education: Education[]
  skillsTech: string
  skillsTools: string
  skillsSoft: string
  projects: Project[]
  certs: Cert[]
  languages: string
  hobbies: string
  achievements: string
}
export type TemplateId = 'modern' | 'classic' | 'sidebar' | 'ats'
export interface Settings {
  template: TemplateId
  accent: string
  font: string
  fontSize: number
}
