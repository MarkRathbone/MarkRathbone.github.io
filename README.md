# Mark Rathbone — portfolio and CV as code

The website, downloadable PDF CV, machine-readable CV data, and social preview image are generated from [`cv.yaml`](./cv.yaml). Generated outputs are not stored in source control: GitHub Actions creates, checks, and deploys them on every push to `main`.

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

Use the Node version pinned in [`.node-version`](./.node-version), with a compatible version manager, and the npm version in `package.json`'s `packageManager` field. CI reads these same values.

```bash
npm install --global "$(node -p 'require("./package.json").packageManager')"
npm ci
npm run dev
```

Install Puppeteer's pinned browsers, then build the production site and themed
PDFs. Repeat the browser installation after Puppeteer updates:

```bash
npm run install:browsers
npm run build
```

The website is written to `dist/`. Crimson, cobalt, and gold CV variants are generated temporarily in `public/`, alongside the JSON data and social card, before Vite copies them into the build. The active website theme selects the matching CV download; `mark-rathbone-cv.pdf` remains a cobalt compatibility copy. All generated outputs are ignored by Git.

Run the same validation used by CI:

```bash
npm run check
```

## Browser checks

Firefox and Chromium receive the same moving artwork. Cobalt's water and ambience
use one canvas with cached artwork, a bounded bitmap, and up to 30 background
updates per second. Other effects use CSS transforms and opacity. Off-screen
sections and hidden tabs pause their animation; reduced-motion preferences are
honoured, including changes made while the page is open.

To run the same Firefox and Chromium checks as CI:

```bash
npm run install:browsers
npm run check
npm run check:site
```

`check:site` starts a local production preview and closes it after the checks,
including when a check fails. It covers desktop, mobile, ultrawide, navigation
targets, theme-specific PDF downloads, animation, off-screen pausing, reduced
motion, and browser errors. Frame timings are diagnostic, not pass/fail thresholds,
since headless hosts can render in software.

Use `FIREFOX_PATH` for an existing Firefox installation. To test a server that is
already running, use `MOTION_CHECK_URL=http://127.0.0.1:4173/ npm run check:motion`.

## Deploy

The single workflow in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)
validates pull requests targeting `main` and pushes to `main`. It installs the
pinned browsers, validates `cv.yaml`, generates every derived asset, builds the
site, and checks the finished build in Firefox and Chromium before uploading it
for deployment.

The build job has a read-only repository token. Only the separate deployment job
has Pages write and OIDC permissions, and it deploys only from `main`, never from
a pull request. Manual runs on other branches validate without deploying. Stale
checks are cancelled; an active deployment is allowed to finish. Both jobs have
explicit 15-minute timeouts.

In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions** once. No `gh-pages` branch, committed build output, or deploy token is required.

The repository also uses these GitHub settings, which are enforced outside the workflow:

- An active `main` ruleset requires pull requests and the **Validate, build and test** check from GitHub Actions, tested against the latest base branch. No mandatory reviewer is needed for a solo-maintained portfolio. Force pushes and branch deletion are blocked.
- The **github-pages** environment allows deployments only from `main`.
- Dependabot alerts and security updates are enabled.

Make future changes on a feature branch and merge a pull request once the check passes;
direct pushes to `main` are blocked. The branch was renamed from `master` without
rewriting commit history.

Weekly Dependabot version updates are configured in [`.github/dependabot.yml`](./.github/dependabot.yml)
for SHA-pinned Actions and npm packages. npm minor/patch updates are grouped;
major updates stay separate for review. Updates are not automatically merged.
Node patch upgrades are deliberate edits to `.node-version`; npm upgrades go in
`package.json`'s `packageManager` field.

Puppeteer's dependency install script is explicitly denied in `allowScripts`.
Browsers are installed separately with `npm run install:browsers`, using the
versions pinned by the locked Puppeteer package, before PDF generation or browser
checks. This keeps dependency install hooks blocked without a version-specific
approval that can fall out of sync with Dependabot updates.

## Structure

```text
cv.yaml                 Single source of truth
src/                    Portfolio UI
scripts/validate-cv.mjs YAML validation
scripts/generate-cv.mjs Print-ready PDF generator
public/                 Source images; generated assets exist here only during builds
.github/workflows/      Build and Pages deployment
```
