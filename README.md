# Mark Rathbone — portfolio and CV as code

The website, downloadable PDF CV, machine-readable CV data, and social preview image are generated from [`cv.yaml`](./cv.yaml). Generated outputs are not stored in source control: GitHub Actions creates and deploys them on every release.

## Edit the CV

Every CV section has a named YAML block:

- `personal`, `links`, and `profile`
- `career_highlights` (career-wide website cards), `career_arc`, and `experience_intro`
- `skills`
- `experience` and `earlier_experience`
- `certifications`
- `selected_work`

Keep the indentation consistent (two spaces) and preserve the section names. Text containing a colon should be wrapped in quotes.

Experience entries may include a `logo` path beneath their dates. Store those assets in `public/company-logos/`; the website serves them directly and the PDF generator embeds them so the document remains self-contained.

## Work locally

Requires Node.js 24.21 or newer and npm 12.0.2 or newer.

```bash
npm install
npm run dev
```

Build the production site and themed PDFs:

```bash
npm run build
```

The website is written to `dist/`. Crimson, cobalt, and gold CV variants are generated temporarily in `public/`, alongside the JSON data and social card, before Vite copies them into the build. The active website theme selects the matching CV download; `mark-rathbone-cv.pdf` remains a cobalt compatibility copy. All generated outputs are ignored by Git.

Run the same validation used by CI:

```bash
npm run check
```

## Deploy

The workflow in `.github/workflows/deploy.yml` runs on pushes to `main` or `master`. It validates `cv.yaml`, generates every derived asset, builds the site, uploads the finished `dist/` directory, and deploys that artifact to Pages.

In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions** once. No `gh-pages` branch, committed build output, or deploy token is required.

## Structure

```text
cv.yaml                 Single source of truth
src/                    Portfolio UI
scripts/validate-cv.mjs YAML validation
scripts/generate-cv.mjs Print-ready PDF generator
public/                 Source images; generated assets exist here only during builds
.github/workflows/      Build and Pages deployment
```
