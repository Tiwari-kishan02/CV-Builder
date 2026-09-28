import type { CVData } from './types'

export const sampleData: CVData = {
  personal: {
    name: 'Aarav Mehta',
    title: 'Full Stack Software Engineer',
    email: 'aarav.mehta@example.com',
    phone: '+91 98765 43210',
    city: 'Mumbai, India',
    address: '',
    linkedin: 'linkedin.com/in/aaravmehta',
    github: 'github.com/aaravmehta',
    website: 'aaravmehta.dev',
  },
  summary:
    'Software engineer with 4+ years of experience building scalable web applications with React, Node.js and AWS. Led a team of 4 to ship a payments dashboard used by 200k+ users, cutting page load time by 45%. Passionate about clean code, developer experience and mentoring.',
  experience: [
    {
      id: 'e1',
      company: 'Nimbus Technologies',
      role: 'Senior Software Engineer',
      location: 'Mumbai',
      start: 'Jun 2022',
      end: '',
      current: true,
      bullets:
        'Led a team of 4 engineers to build a real-time payments dashboard serving 200k+ users\nReduced average page load time by 45% by introducing code-splitting and caching\nDesigned CI/CD pipelines on GitHub Actions, cutting release time from 2 hours to 15 minutes',
    },
    {
      id: 'e2',
      company: 'BrightApps',
      role: 'Software Engineer',
      location: 'Pune',
      start: 'Jul 2020',
      end: 'May 2022',
      current: false,
      bullets:
        'Built 12+ REST APIs in Node.js and PostgreSQL handling 1M requests per day\nIncreased unit test coverage from 35% to 85% using Jest and React Testing Library',
    },
  ],
  education: [
    {
      id: 'ed1',
      school: 'University of Mumbai',
      degree: 'B.E.',
      field: 'Computer Engineering',
      start: '2016',
      end: '2020',
      grade: 'CGPA 8.7 / 10',
    },
  ],
  skillsTech: 'JavaScript, TypeScript, React, Node.js, Python, SQL, REST APIs',
  skillsTools: 'Git, Docker, AWS, GitHub Actions, Jira, Figma',
  skillsSoft: 'Leadership, Communication, Problem solving, Mentoring',
  projects: [
    {
      id: 'p1',
      name: 'CV Builder',
      link: 'github.com/aaravmehta/cv-builder',
      tech: 'React, TypeScript, Zustand',
      description: 'Client-side resume builder with live preview, four templates and PDF export.',
    },
  ],
  certs: [{ id: 'c1', name: 'AWS Certified Developer – Associate', org: 'Amazon Web Services', year: '2023' }],
  languages: 'English (Fluent), Hindi (Native), Marathi (Native)',
  hobbies: 'Open-source contribution, Trekking, Chess',
  achievements: 'Winner, Smart India Hackathon 2019\nSpeaker at ReactConf India 2023',
}
