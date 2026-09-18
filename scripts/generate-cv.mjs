import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load as loadYaml } from "js-yaml";
import puppeteer from "puppeteer";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cv = loadYaml(fs.readFileSync(path.join(root, "cv.yaml"), "utf8"));
const cvThemes = {
  dark: {
    filename: "mark-rathbone-cv-crimson.pdf",
    page: "#140b0e", text: "#d0bec1", heading: "#fff1ea", accent: "#e12b46",
    highlight: "#edb92f", sidebar: "#090708", sidebarText: "#fffaf1", muted: "#a99196",
    line: "#432a30", logoLine: "#5a3b42", photo: "#090708", portraitFilter: "grayscale(.8) contrast(1.13)",
  },
  mid: {
    filename: "mark-rathbone-cv-cobalt.pdf",
    page: "#ffffff", text: "#243044", heading: "#172843", accent: "#317dce",
    highlight: "#f1d74c", sidebar: "#10213c", sidebarText: "#ffffff", muted: "#687487",
    line: "#d8dee8", logoLine: "#d9e0e9", photo: "#11203a", portraitFilter: "saturate(.75) contrast(1.05)",
  },
  light: {
    filename: "mark-rathbone-cv-gold.pdf",
    page: "#fffdf4", text: "#4e4328", heading: "#2c220c", accent: "#c48700",
    highlight: "#ffda32", sidebar: "#3b2c0a", sidebarText: "#fff9df", muted: "#786a45",
    line: "#e4d7ac", logoLine: "#e5d7a8", photo: "#3b2c0a", portraitFilter: "sepia(.12) saturate(.85) contrast(1.06)",
  },
};
const portraitPath = path.join(root, "public", cv.personal.portrait.replace(/^\//, ""));
const portrait = `data:image/jpeg;base64,${fs.readFileSync(portraitPath).toString("base64")}`;
const embeddedAssets = new Map();
const assetDataUri = (assetPath) => {
  if (!assetPath) return "";
  if (embeddedAssets.has(assetPath)) return embeddedAssets.get(assetPath);
  const filePath = path.join(root, "public", assetPath.replace(/^\//, ""));
  const mime = ({ ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp" })[path.extname(filePath).toLowerCase()];
  if (!mime || !fs.existsSync(filePath)) throw new Error(`Missing or unsupported CV asset: ${assetPath}`);
  const dataUri = `data:${mime};base64,${fs.readFileSync(filePath).toString("base64")}`;
  embeddedAssets.set(assetPath, dataUri);
  return dataUri;
};

const esc = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
}[character]));
const list = (items) => `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
const role = (item) => `<article class="role">
    <div class="role-heading">
      ${item.logo ? `<span class="role-logo"><img src="${assetDataUri(item.logo)}" alt="" /></span>` : ""}
      <div><h3>${esc(item.role)} <span>| ${esc(item.company)}, ${esc(item.location)}</span></h3>
        <p class="date">${esc(item.start)} — ${esc(item.end)}</p>
      </div>
    </div>
    <p>${esc(item.summary)}</p>
    ${list(item.highlights)}
    ${item.note ? `<p class="note">${esc(item.note)}</p>` : ""}
  </article>`;

const firstSkills = cv.skills.flatMap((group) => group.items);
const pageOneRoles = cv.experience.slice(0, 3).map((item) => role(item)).join("");
const pageTwoRoles = cv.experience.slice(3).map((item) => role(item)).join("");

const cvHtml = (theme) => `<!doctype html><html><head><meta charset="utf-8">
  <title>${esc(cv.personal.name)} — ${esc(cv.personal.role)} CV</title>
  <meta name="author" content="${esc(cv.personal.name)}">
  <meta name="subject" content="Curriculum vitae">
  <style>
  :root {
    --page: ${theme.page}; --text: ${theme.text}; --heading: ${theme.heading}; --accent: ${theme.accent};
    --highlight: ${theme.highlight}; --sidebar: ${theme.sidebar}; --sidebar-text: ${theme.sidebarText};
    --muted: ${theme.muted}; --line: ${theme.line}; --logo-line: ${theme.logoLine}; --photo: ${theme.photo};
    --portrait-filter: ${theme.portraitFilter};
  }
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; color: var(--text); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page { width: 210mm; height: 297mm; overflow: hidden; position: relative; background: var(--page); page-break-after: always; }
  .page::after { content: ""; position: absolute; z-index: 10; left: 0; right: 0; top: 0; height: 1.4mm; background: linear-gradient(90deg, var(--accent) 0 76%, var(--highlight) 76%); }
  .page:last-child { page-break-after: auto; }
  .cover { display: grid; grid-template-columns: 61mm 1fr; grid-template-rows: 54mm 1fr; }
  .photo { background: var(--photo); overflow: hidden; }
  .photo img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 31%; filter: var(--portrait-filter); }
  .intro { padding: 11mm 13mm 5mm; border-bottom: 1px solid var(--line); }
  .name { margin: 0; font-size: 27pt; line-height: .9; letter-spacing: -1.7px; color: var(--heading); }
  .name span { color: var(--accent); }
  .title { margin: 3mm 0 3mm; font-size: 10.5pt; font-weight: 700; color: var(--accent); }
  .summary { margin: 0; font-size: 7.4pt; line-height: 1.4; color: var(--text); }
  aside { padding: 9mm 7mm; background: var(--sidebar); color: var(--sidebar-text); }
  aside section { margin-bottom: 8mm; }
  h2 { margin: 0 0 3.5mm; padding-bottom: 1.8mm; border-bottom: 1.5px solid var(--accent); color: var(--heading); font-size: 9.5pt; letter-spacing: .6px; text-transform: uppercase; }
  aside h2 { color: var(--sidebar-text); border-color: var(--highlight); }
  .contact-item { margin: 0 0 3mm; font-size: 7pt; line-height: 1.35; overflow-wrap: anywhere; }
  .contact-item b { display: block; margin-bottom: .4mm; color: var(--highlight); font-size: 5.5pt; letter-spacing: .6px; text-transform: uppercase; }
  .contact-item a { color: var(--sidebar-text); text-decoration: none; }
  .contact-links { display: flex; flex-wrap: wrap; gap: 1mm 2.5mm; }
  aside ul { list-style: none; margin: 0; padding: 0; }
  aside li { position: relative; margin: 0 0 2.2mm; padding-left: 4mm; font-size: 6.8pt; line-height: 1.25; }
  aside li::before { content: "◆"; position: absolute; left: 0; color: var(--highlight); font-size: 4.5pt; }
  .experience { padding: 8mm 12mm 7mm; }
  .role { margin-bottom: 4.5mm; break-inside: avoid; }
  .role-heading { display: flex; align-items: center; gap: 2.5mm; margin-bottom: .8mm; }
  .role-logo { width: 9mm; height: 9mm; flex: 0 0 9mm; display: grid; place-items: center; overflow: hidden; border: .2mm solid var(--logo-line); background: white; }
  .role-logo img { display: block; width: 82%; height: 82%; object-fit: contain; }
  .role h3 { margin: 0; color: var(--heading); font-size: 8.5pt; line-height: 1.25; }
  .role h3 span { color: var(--accent); font-weight: 600; }
  .role .date { margin: .6mm 0 0; color: var(--muted); font-size: 6.6pt; font-weight: 700; }
  .role > p:not(.date):not(.note) { margin: 0 0 1.7mm; font-size: 6.75pt; line-height: 1.35; }
  .role ul { margin: 0; padding-left: 4mm; }
  .role li { margin-bottom: 1mm; padding-left: .6mm; font-size: 6.45pt; line-height: 1.3; }
  .role li::marker { color: var(--accent); }
  .role .note { margin: 1.2mm 0 0; color: var(--muted); font-size: 6.2pt; font-style: italic; }
  .page-two { padding: 11mm 14mm 9mm; }
  .page-two::before { content: "MR / CV"; position: absolute; top: 4mm; right: 14mm; color: var(--muted); font-size: 5.5pt; font-weight: bold; letter-spacing: 1px; }
  .page-two .experience { padding: 0; }
  .page-two .role { margin-bottom: 4mm; }
  .bottom-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 10mm; margin-top: 4mm; }
  .compact-role { margin: 0 0 3mm; }
  .compact-role strong { display: block; font-size: 7pt; }
  .compact-role span { font-size: 6.3pt; color: var(--muted); }
  .cert { display: grid; grid-template-columns: 1fr auto; gap: 1mm 4mm; padding: 1.3mm 0; border-bottom: 1px solid var(--line); font-size: 6.4pt; }
  .cert b { color: var(--heading); }
  .cert span { color: var(--muted); }
  .footer { position: absolute; left: 14mm; right: 14mm; bottom: 5mm; display: flex; justify-content: space-between; border-top: 1px solid var(--line); padding-top: 2mm; color: var(--muted); font-size: 5.5pt; }
</style></head><body>
  <section class="page cover">
    <div class="photo"><img src="${portrait}" /></div>
    <header class="intro">
      <h1 class="name">${esc(cv.personal.first_name)} <span>${esc(cv.personal.last_name)}</span></h1>
      <p class="title">${esc(cv.personal.role)}</p>
      <p class="summary">${esc(cv.profile.paragraphs[0])}</p>
    </header>
    <aside>
      <section><h2>Personal information</h2>
        <p class="contact-item"><b>Phone</b><a href="tel:${esc(cv.personal.phone.replace(/[^+\d]/g, ""))}">${esc(cv.personal.phone)}</a></p>
        <p class="contact-item"><b>Email</b><a href="mailto:${esc(cv.personal.email)}">${esc(cv.personal.email)}</a></p>
        <p class="contact-item"><b>Online</b><span class="contact-links">${cv.links.map((item) => `<a href="${esc(item.url)}">${esc(item.label)}</a>`).join("")}<a href="${esc(cv.personal.website)}">${esc(cv.personal.website.replace(/^https?:\/\//, ""))}</a></span></p>
        <p class="contact-item"><b>Location</b>${esc(cv.personal.location)}</p>
      </section>
      <section><h2>Key skills</h2>${list(firstSkills)}</section>
    </aside>
    <main class="experience"><h2>Professional experience</h2>${pageOneRoles}</main>
  </section>
  <section class="page page-two">
    <main class="experience">${pageTwoRoles}</main>
    <div class="bottom-grid">
      <section><h2>Earlier experience</h2>${cv.earlier_experience.map((item) => `<p class="compact-role"><strong>${esc(item.role)} | ${esc(item.company)}</strong><span>${esc(item.location)} · ${esc(item.start)} — ${esc(item.end)}</span></p>`).join("")}</section>
      <section><h2>Certifications</h2>${cv.certifications.map((item) => `<div class="cert"><b>${esc(item.title)}</b><span>${esc(item.date)}</span><small>${esc(item.issuer)}</small></div>`).join("")}</section>
    </div>
    <div class="footer"><span>${esc(cv.personal.email)}</span><span>${esc(cv.personal.website.replace(/^https?:\/\//, ""))}</span><span>2 / 2</span></div>
  </section>
</body></html>`;

fs.writeFileSync(path.join(root, "public", "cv-data.json"), `${JSON.stringify(cv, null, 2)}\n`);
const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
const page = await browser.newPage();
const generatedPdfs = [];
for (const [themeName, theme] of Object.entries(cvThemes)) {
  await page.setContent(cvHtml(theme), { waitUntil: "load" });
  const layoutIssues = await page.evaluate(() => {
    const issues = [];
    const intro = document.querySelector(".cover .intro");
    const summary = intro.querySelector(".summary");
    if (summary.getBoundingClientRect().bottom > intro.getBoundingClientRect().bottom - 1) {
      issues.push("page 1: profile summary exceeds its header");
    }
    const sidebar = document.querySelector(".cover aside");
    const lastSidebarSection = sidebar.querySelector("section:last-child");
    if (lastSidebarSection.getBoundingClientRect().bottom > sidebar.getBoundingClientRect().bottom - 1) {
      issues.push("page 1: contact or skills exceed the sidebar");
    }
    document.querySelectorAll(".page").forEach((sheet, pageIndex) => {
      const sheetBottom = sheet.getBoundingClientRect().bottom;
      sheet.querySelectorAll(".role, .bottom-grid").forEach((element) => {
        if (element.getBoundingClientRect().bottom > sheetBottom + 1) {
          issues.push(`page ${pageIndex + 1}: ${element.className} is clipped`);
        }
      });
    });
    const bottomGrid = document.querySelector(".page-two .bottom-grid");
    const footer = document.querySelector(".page-two .footer");
    if (bottomGrid && footer && bottomGrid.getBoundingClientRect().bottom > footer.getBoundingClientRect().top) {
      issues.push("page 2: experience/certification content overlaps the footer");
    }
    return issues;
  });
  if (layoutIssues.length) {
    throw new Error(`CV layout check failed for ${themeName}:\n${layoutIssues.join("\n")}`);
  }
  const output = path.join(root, "public", theme.filename);
  await page.pdf({ path: output, format: "A4", printBackground: true, preferCSSPageSize: true });
  generatedPdfs.push(`public/${theme.filename}`);
  if (themeName === "mid") {
    fs.copyFileSync(output, path.join(root, "public", "mark-rathbone-cv.pdf"));
  }
}

const social = await browser.newPage();
await social.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await social.setContent(`<!doctype html><style>
  * { box-sizing: border-box } body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: #071120; color: #fffdf7; font-family: Arial, sans-serif; }
  main { height: 100%; display: grid; grid-template-columns: 1.25fr .75fr; position: relative; }
  main::before { content: ""; position: absolute; inset: 0 39% 0 0; background: #125ac7; clip-path: polygon(0 0, 84% 0, 100% 100%, 0 100%); }
  .grid { position: absolute; inset: 0 39% 0 0; opacity: .14; background-image: linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px); background-size: 48px 48px; }
  .copy { z-index: 1; padding: 100px 0 70px 72px; }
  .kicker { margin: 0 0 20px; color: #f5db4b; font: bold 14px monospace; letter-spacing: 2px; text-transform: uppercase; }
  h1 { margin: 0; font-size: 102px; line-height: .8; letter-spacing: -9px; text-transform: uppercase; }
  h1 span { color: transparent; -webkit-text-stroke: 2px white; }
  .role { margin: 38px 0 0; font-size: 25px; font-weight: bold; }
  .role b { color: #f5db4b; }
  .portrait { z-index: 2; align-self: center; width: 330px; height: 430px; margin-left: -22px; object-fit: cover; object-position: 50% 31%; clip-path: polygon(10% 0,100% 0,100% 90%,90% 100%,0 100%,0 10%); filter: saturate(.75) contrast(1.05); box-shadow: 18px 18px #2e9cff; }
  .mark { position: absolute; right: 35px; top: 30px; color: #f5db4b; font: bold 16px monospace; }
</style><main><div class="grid"></div><div class="copy"><p class="kicker">Platform / DevOps / Cloud</p><h1><span>${esc(cv.personal.first_name)}</span><br>${esc(cv.personal.last_name)}</h1><p class="role">${esc(cv.personal.role)} <b>↗</b></p></div><img class="portrait" src="${portrait}"><div class="mark">MR / 01</div></main>`, { waitUntil: "load" });
await social.screenshot({ path: path.join(root, "public", "social-image.png"), type: "png" });
await browser.close();
console.log(`Generated ${generatedPdfs.join(", ")}, public/mark-rathbone-cv.pdf, and public/social-image.png`);
