# CV Builder

A free, privacy-first resume builder. Fill in a step-by-step form, watch your CV update live, and download a clean A4 PDF. Everything runs in your browser. No data is sent to any server.

## Features

- 8-step form: personal info, summary, experience, education, skills, projects, certifications, extras
- Live A4 preview (Edit / Preview tabs on mobile)
- 4 templates: Modern, Classic, Sidebar, ATS plain
- Accent colour, font and font size controls
- Reorder and remove entries, empty sections hide automatically
- Completeness score and writing tips for each step
- Autosave to localStorage, JSON import and export, demo data
- Download as PDF (browser print, selectable text)

## Tech stack

React 18, TypeScript, Vite, Zustand

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Download as PDF

Click **Download PDF**, choose **Save as PDF** as the destination, set margins to **None** and turn **Background graphics** on (needed for the Sidebar template colours).

## Deploy to GitHub Pages

1. Push this repo to GitHub (branch `main`).
2. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The included workflow builds and publishes the site on every push.

## Folder structure

```
src/
  App.tsx       layout, toolbar, import/export
  Form.tsx      all form steps
  Preview.tsx   the 4 CV templates
  store.ts      Zustand store with localStorage persistence
  sample.ts     demo data
  styles.css    app and CV styles
```

## License

MIT
