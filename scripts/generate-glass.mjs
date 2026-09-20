import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
let browser;

try {
  // One artwork source: Chrome uses the live SVG; Firefox uses this prerendered
  // copy to avoid repeatedly painting its many transparent paths while scrolling.
  const { default: Glass } = await vite.ssrLoadModule("/src/Glass.jsx");
  const glassMarkup = renderToStaticMarkup(createElement(Glass));
  const styles = fs.readFileSync(path.join(root, "src/styles.css"), "utf8").replace(/^@import[^\n]*\n/, "");
  browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 2880, height: 1800, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><style>${styles}
    html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: transparent; }
    body::before { display: none; }
    .theme-glass { opacity: 1; animation: none; }
    .glass-glints { animation: none; }
  </style>${glassMarkup}`, { waitUntil: "load" });
  await page.screenshot({ path: path.join(root, "public", "glass-fracture.png"), omitBackground: true });
  console.log("Generated public/glass-fracture.png");
} finally {
  await browser?.close();
  await vite.close();
}
