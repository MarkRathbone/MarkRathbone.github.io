import assert from "node:assert/strict";
import puppeteer from "puppeteer";

// Run against a local preview with Firefox installed via Puppeteer's browser CLI.
// Frame timings are reported, not asserted: CI and headless hosts often use
// software rendering, so a fixed FPS requirement would be misleading.
const url = process.env.MOTION_CHECK_URL ?? "http://127.0.0.1:4173/";
const browsers = process.env.MOTION_CHECK_BROWSER ? [process.env.MOTION_CHECK_BROWSER] : ["firefox", "chrome"];
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

for (const name of browsers) {
  const options = {
    browser: name,
    headless: true,
    ...(name === "firefox" && process.env.FIREFOX_PATH ? { executablePath: process.env.FIREFOX_PATH } : {}),
    ...(name === "chrome" ? { args: ["--no-sandbox"] } : {}),
  };
  const browser = await puppeteer.launch(options);
  try {
    for (const [width, height] of [[1440, 900], [390, 844], [3440, 1440]]) {
      const page = await browser.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.setViewport({ width, height });
      await page.evaluateOnNewDocument(() => {
        localStorage.setItem("theme-mode", "mid");
        window.waterDraws = 0;
        const clearRect = CanvasRenderingContext2D.prototype.clearRect;
        CanvasRenderingContext2D.prototype.clearRect = function (...args) {
          if (this.canvas.classList.contains("water-motion")) window.waterDraws++;
          return clearRect.apply(this, args);
        };
      });
      await page.goto(url, { waitUntil: "networkidle0" });
      await page.waitForFunction(() => window.waterDraws > 2);
      const snapshot = await page.$eval(".water-motion", canvas => canvas.toDataURL());

      const metrics = await page.evaluate(() => new Promise(resolve => {
        const frames = [];
        const draws = window.waterDraws;
        let start, previous;
        function sample(time) {
          start ??= time;
          if (previous) frames.push(time - previous);
          previous = time;
          if (time - start < 2500) requestAnimationFrame(sample);
          else {
            frames.sort((a, b) => a - b);
            resolve({
              fps: Math.round(frames.length * 1000 / (time - start)),
              p95: +frames[Math.floor(frames.length * .95)].toFixed(1),
              waterFrames: window.waterDraws - draws,
            });
          }
        }
        requestAnimationFrame(sample);
      }));
      assert(metrics.waterFrames > 5, "The water must keep animating");
      assert.notEqual(await page.$eval(".water-motion", canvas => canvas.toDataURL()), snapshot, "The water's pixels must actually change");
      assert(await page.$eval(".water-motion", canvas => canvas.width <= 1280 && canvas.height <= 960), "Bound the water bitmap on large displays");

      const scrollFps = await page.evaluate(() => new Promise(resolve => {
        document.documentElement.style.scrollBehavior = "auto";
        const distance = document.documentElement.scrollHeight - innerHeight;
        let start, count = 0;
        function scroll(time) {
          start ??= time;
          const phase = Math.min(1, (time - start) / 1800);
          window.scrollTo(0, distance * Math.sin(phase * Math.PI));
          count++;
          if (phase < 1) requestAnimationFrame(scroll);
          else resolve(Math.round(count * 1000 / (time - start)));
        }
        requestAnimationFrame(scroll);
      }));

      if (width === 1440) {
        // Headless Firefox reports hover:none. Expose the glow just for this
        // pointer test; the production touch-device safeguard stays intact.
        await page.addStyleTag({ content: ".cursor-glow { display: block !important; }" });
        await page.mouse.move(460, 320);
        await wait(300);
        assert(await page.$eval(".cursor-glow", el => el.classList.contains("is-active") && getComputedStyle(el).opacity === "1"));
        for (const theme of ["dark", "light"]) {
          await page.click(`button[title*="${theme === "dark" ? "crimson" : "gold"}"]`);
          await wait(300);
          const draws = await page.evaluate(() => window.waterDraws);
          await wait(200);
          assert.equal(await page.evaluate(() => window.waterDraws), draws, "Stop cobalt's renderer in another theme");
          const moving = await page.evaluate(() => [...document.querySelectorAll(".theme-sun, .theme-cut, .arcana-deck")].some(el => el.getAnimations().some(animation => animation.playState === "running")));
          assert(moving, `${theme} artwork must animate in ${name}`);
        }
        await page.click('button[title*="cobalt"]');
        await wait(300);
      }

      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = "auto";
        document.getElementById("contact").scrollIntoView();
      });
      await wait(300);
      const stopped = await page.evaluate(() => window.waterDraws);
      await wait(200);
      assert.equal(await page.evaluate(() => window.waterDraws), stopped, "Off-screen water must stop drawing");
      assert(await page.$eval(".hero", el => el.dataset.motion === "paused"));
      assert(await page.$eval(".contact-orbit", el => el.getAnimations().some(animation => animation.playState === "running")), "Visible section animations must resume");
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForFunction(draws => window.waterDraws > draws + 2, {}, stopped);
      if (name === "chrome") {
        await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
        await wait(200);
        const reduced = await page.evaluate(() => window.waterDraws);
        await wait(200);
        assert.equal(await page.evaluate(() => window.waterDraws), reduced, "Respect changes to reduced motion without reloading");
      }
      assert.deepEqual(errors, [], "No browser errors");
      console.log(`${name} ${width}×${height}: ${metrics.fps} fps, p95 ${metrics.p95} ms, scrolling ${scrollFps} fps; animation and visibility checks passed`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
  // Puppeteer's live media emulation uses CDP, which Firefox doesn't support.
  // Test Firefox's actual media preference in a separate native browser profile.
  if (name === "firefox") {
    const reducedBrowser = await puppeteer.launch({ ...options, extraPrefsFirefox: { "ui.prefersReducedMotion": 1 } });
    try {
      const page = await reducedBrowser.newPage();
      await page.evaluateOnNewDocument(() => localStorage.setItem("theme-mode", "mid"));
      await page.goto(url, { waitUntil: "networkidle0" });
      assert(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches));
      const before = await page.$eval(".water-motion", canvas => canvas.toDataURL());
      await wait(300);
      assert.equal(await page.$eval(".water-motion", canvas => canvas.toDataURL()), before, "Reduced-motion water must be static");
      assert(await page.$eval(".cursor-glow", el => getComputedStyle(el).display === "none"));
      console.log("firefox: native reduced-motion preference passed");
    } finally { await reducedBrowser.close(); }
  }
}
