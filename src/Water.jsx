import { useEffect, useRef } from "react";

// Static vectors are rasterised once and reused by the water renderer.
function svgImage(width, height, content) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${content}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const bubbles = Array.from({ length: 24 }, (_, index) => {
  const duration = 14 + Math.random() * 14;
  return {
    id: index,
    x: ((index + Math.random()) / 24) * 1440,
    radius: 1.8 + Math.random() * 6.2,
    duration,
    delay: -Math.random() * duration,
    drift: -34 + Math.random() * 68,
    opacity: .25 + Math.random() * .45,
    staticY: 60 + Math.random() * 780,
  };
});

const surfaceWaves = [
  { y: 38, amplitude: 25, wavelength: 430, duration: 13, opacity: .55, stroke: 2 },
  { y: 75, amplitude: 19, wavelength: 520, duration: 18, opacity: .42, stroke: 1.6 },
  { y: 112, amplitude: 14, wavelength: 360, duration: 11.5, opacity: .32, stroke: 1.25 },
].map((wave, index) => {
  const { wavelength, amplitude, stroke } = wave;
  const duration = wave.duration * (.86 + Math.random() * .28);
  const bobDuration = 4.5 + Math.random() * 4;
  const height = amplitude * 2 + 8;
  const middle = height / 2;
  // Matching tangents at both ends make the image and animation loop seamless.
  const path = `M0 ${middle} Q${wavelength / 4} ${middle - amplitude} ${wavelength / 2} ${middle} T${wavelength} ${middle}`;
  return {
    ...wave,
    height,
    image: svgImage(wavelength, height, `<path d="${path}" fill="none" stroke="rgba(213,250,255,.48)" stroke-width="${stroke}"/>`),
    duration,
    delay: -Math.random() * duration,
    bobDuration,
    bobDelay: -Math.random() * bobDuration,
    lift: -3 + Math.random() * 6,
    opacity: wave.opacity * (.86 + Math.random() * .24),
    direction: index === 1 ? "reverse" : Math.random() > .35 ? "normal" : "reverse",
  };
});

const rayGradient = `<defs><linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d9fbff" stop-opacity=".34"/><stop offset=".58" stop-color="#6edcff" stop-opacity=".06"/><stop offset="1" stop-color="#4bc8ff" stop-opacity="0"/></linearGradient></defs>`;
const rays = [
  { x: 105, width: 405, path: "M0 0h190L405 900H180Z" },
  { x: 410, width: 350, path: "M0 0h125L350 900H175Z" },
  { x: 730, width: 233, path: "M58 0h175l-40 900H0Z" },
  { x: 1010, width: 220, path: "M100 0h120l-34 900H0Z" },
].map(ray => ({ ...ray, image: svgImage(ray.width, 900, `${rayGradient}<path d="${ray.path}" fill="url(#ray)"/>`) }));

const surfaceImage = svgImage(1600, 114, `<defs><linearGradient id="surface" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d9fcff" stop-opacity=".52"/><stop offset="1" stop-color="#33c8ff" stop-opacity=".02"/></linearGradient></defs><path d="M0 0h1600v72c-123-33-220 27-345 5-126-23-224-65-351-29-129 37-250 8-365-15C397 5 245 88 0 51Z" fill="url(#surface)"/>`);
const causticsImage = svgImage(1600, 410, `<g fill="none" stroke="rgba(174,237,255,.16)" stroke-width="1.2"><path d="M122 142c96-34 171 37 267 3s183-41 284 1 187 30 279-7 189-39 292-3 182 25 278-5"/><path d="M56 203c88-39 169 30 260 2s178-40 268 1 178 27 270-9 181-36 277-4 190 30 309-8"/><path d="M196 285c80-26 141 18 222 0s158-27 242 5 163 18 242-8 167-29 251 0 165 19 259-8"/><path d="M327 375c63-20 116 14 184-2s131-17 200 8 128 12 195-9 139-22 212 3 133 13 205-7"/></g>`);

// Decode each vector once and keep a small raster copy for drawImage(). No SVG
// paths, gradients, or bubble geometry are rebuilt inside the animation loop.
async function cacheArtwork(image, width, height) {
  const source = new Image();
  source.src = image;
  await source.decode();
  const bitmap = document.createElement("canvas");
  bitmap.width = width;
  bitmap.height = height;
  bitmap.getContext("2d").drawImage(source, 0, 0, width, height);
  return bitmap;
}

let artwork;
function getArtwork() {
  artwork ??= Promise.all([
    Promise.all(rays.map(ray => cacheArtwork(ray.image, ray.width, 900))),
    Promise.all(surfaceWaves.map(wave => cacheArtwork(wave.image, wave.wavelength, wave.height))),
    cacheArtwork(causticsImage, 1600, 410),
    cacheArtwork(svgImage(360, 360, '<circle cx="180" cy="180" r="179" fill="none" stroke="rgba(46,156,255,.11)"/><circle cx="292" cy="68" r="9" fill="rgba(245,219,75,.012)"/><circle cx="292" cy="68" r="3.5" fill="rgba(245,219,75,.11)"/>'), 360, 360),
    cacheArtwork(svgImage(240, 240, '<circle cx="120" cy="120" r="119" fill="none" stroke="rgba(46,156,255,.11)" stroke-dasharray="4 4"/><circle cx="17" cy="177" r="9" fill="rgba(245,219,75,.012)"/><circle cx="17" cy="177" r="3.5" fill="rgba(245,219,75,.11)"/>'), 240, 240),
  ]).then(([rayImages, waveImages, caustics, ringOne, ringTwo]) => {
    const bubble = document.createElement("canvas");
    bubble.width = bubble.height = 32;
    const context = bubble.getContext("2d");
    context.beginPath();
    context.arc(16, 16, 14, 0, Math.PI * 2);
    context.fillStyle = "rgba(199,245,255,.12)";
    context.fill();
    context.strokeStyle = "rgba(217,250,255,.5)";
    context.lineWidth = 1.5;
    context.stroke();
    const glow = document.createElement("canvas");
    glow.width = glow.height = 512;
    const glowContext = glow.getContext("2d");
    const gradient = glowContext.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, "#2e9cff");
    gradient.addColorStop(.68, "rgba(46,156,255,0)");
    glowContext.fillStyle = gradient;
    glowContext.fillRect(0, 0, 512, 512);
    const comet = document.createElement("canvas");
    comet.width = 170;
    comet.height = 2;
    const cometContext = comet.getContext("2d");
    const trail = cometContext.createLinearGradient(0, 0, 170, 0);
    trail.addColorStop(0, "rgba(245,219,75,0)");
    trail.addColorStop(.4, "#f5db4b");
    trail.addColorStop(.6, "#2e9cff");
    trail.addColorStop(1, "rgba(46,156,255,0)");
    cometContext.fillStyle = trail;
    cometContext.fillRect(0, 0, 170, 2);
    return { rayImages, waveImages, caustics, bubble, ringOne, ringTwo, glow, comet };
  });
  return artwork;
}

export default function Water() {
  const water = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    const node = water.current;
    const surface = canvas.current;
    const context = surface.getContext("2d");
    if (!context) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let images;
    let disposed = false;
    let inView = false;
    let animationFrame;
    let previousTime;
    let lastDraw = 0;
    let elapsed = 0;
    let scale = 1;
    let offsetX = 0;
    let sceneWidth = 1440;
    let sceneHeight = 900;

    function draw(seconds, still = false) {
      if (!images) return;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, surface.width, surface.height);
      const pixels = surface.width / sceneWidth;
      context.setTransform(pixels, 0, 0, pixels, 0, 0);

      // Cobalt's ambience shares this renderer. Combining it with the water
      // avoids Firefox continually rebuilding overlapping animated layers.
      const glowPhase = .5 - Math.cos(seconds * Math.PI / 9) / 2;
      const glowSize = Math.min(544, sceneWidth * .48) * (1 + glowPhase * .05);
      context.globalAlpha = .075 + glowPhase * .035;
      context.drawImage(images.glow, sceneWidth * .98 - glowSize - sceneWidth * .03 * glowPhase, sceneHeight * .08 + sceneHeight * .02 * glowPhase, glowSize, glowSize);
      context.globalAlpha = 1;
      [
        { image: images.ringOne, size: Math.min(360, Math.max(180, sceneWidth * .24)), x: sceneWidth * .34, y: sceneHeight * .12, speed: 42 },
        { image: images.ringTwo, size: Math.min(240, Math.max(110, sceneWidth * .16)), x: sceneWidth * .76, y: sceneHeight * .97, speed: -31 },
      ].forEach((ring, index) => {
        const x = index ? ring.x - ring.size / 2 : ring.x + ring.size / 2;
        const y = index ? ring.y - ring.size / 2 : ring.y + ring.size / 2;
        context.save();
        context.translate(x, y);
        context.rotate(seconds / ring.speed * Math.PI * 2);
        context.drawImage(ring.image, -ring.size / 2, -ring.size / 2, ring.size, ring.size);
        context.restore();
      });
      for (let index = 0; index < 2; index++) {
        const phase = .5 - Math.cos((seconds + index * 3) * Math.PI * 2 / (index ? 16 : 13)) / 2;
        context.save();
        context.globalAlpha = .05 + phase * .17;
        context.translate(sceneWidth * (index ? .87 : .18) - 24 + phase * 52, sceneHeight * (index ? .27 : .81) + 16 - phase * 34);
        context.rotate(-18 * Math.PI / 180);
        context.drawImage(images.comet, 0, 0);
        context.restore();
      }
      context.setTransform(scale, 0, 0, scale, offsetX, 0);

      rays.forEach((ray, index) => {
        const pulse = (.5 - Math.cos((seconds + (index % 2 ? 4 : 0)) * Math.PI / 9) / 2);
        context.globalAlpha = still ? .72 : .72 - pulse * .24;
        context.drawImage(images.rayImages[index], ray.x, 0);
      });

      surfaceWaves.forEach((wave, index) => {
        const phase = ((seconds - wave.delay) % wave.duration) / wave.duration;
        const travel = (wave.direction === "reverse" ? 1 - phase : phase) * -wave.wavelength;
        const bob = wave.lift * (.5 - Math.cos((seconds - wave.bobDelay) * Math.PI / wave.bobDuration) / 2);
        context.globalAlpha = wave.opacity;
        for (let x = travel; x < 1440; x += wave.wavelength) {
          context.drawImage(images.waveImages[index], x, wave.y - wave.height / 2 + (still ? 0 : bob));
        }
      });

      const drift = .5 - Math.cos(seconds * Math.PI / 18) / 2;
      context.globalAlpha = still ? 1 : 1 - drift * .42;
      context.drawImage(images.caustics, -80 + drift * 22, drift * 12);

      bubbles.forEach(bubble => {
        const phase = ((seconds - bubble.delay) % bubble.duration) / bubble.duration;
        const diameter = bubble.radius * 2;
        context.globalAlpha = bubble.opacity;
        context.drawImage(images.bubble, bubble.x + phase * bubble.drift, still ? bubble.staticY : 980 - phase * 1060, diameter, diameter);
      });
      context.globalAlpha = 1;
    }

    function frame(time) {
      if (previousTime !== undefined) elapsed += time - previousTime;
      previousTime = time;
      // These slow background movements don't need high-refresh-rate updates.
      // Leave time for scrolling, input, and the site's foreground animations.
      if (time - lastDraw >= 1000 / 30) {
        draw(elapsed / 1000);
        lastDraw = time - ((time - lastDraw) % (1000 / 30));
      }
      animationFrame = requestAnimationFrame(frame);
    }

    function syncMotion() {
      cancelAnimationFrame(animationFrame);
      previousTime = undefined;
      if (!images || disposed) return;
      const cobalt = document.documentElement.dataset.theme === "mid";
      if (reducedMotion.matches) draw(0, true);
      else if (inView && cobalt && !document.hidden) animationFrame = requestAnimationFrame(frame);
    }

    function resize({ width, height }) {
      if (!width || !height) return;
      sceneWidth = width;
      sceneHeight = height;
      // Bound the bitmap on ultrawide/high-DPI screens. CSS still fills the hero,
      // while a single decoration can't allocate a giant graphics surface.
      const resolution = Math.min(window.devicePixelRatio || 1, 1280 / width, 960 / height);
      surface.width = Math.round(width * resolution);
      surface.height = Math.round(height * resolution);
      scale = Math.max(surface.width / 1440, surface.height / 900);
      offsetX = (surface.width - 1440 * scale) / 2;
      const artworkScale = Math.max(width / 1440, height / 900);
      node.style.setProperty("--water-scale", artworkScale);
      draw(elapsed / 1000, reducedMotion.matches);
    }

    const sizeObserver = new ResizeObserver(([entry]) => resize(entry.contentRect));
    sizeObserver.observe(node);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncMotion();
    }, { rootMargin: "100px" });
    visibilityObserver.observe(node);
    const themeObserver = new MutationObserver(syncMotion);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.addEventListener("visibilitychange", syncMotion);
    reducedMotion.addEventListener("change", syncMotion);
    getArtwork().then(result => {
      if (disposed) return;
      images = result;
      draw(0, reducedMotion.matches);
      syncMotion();
    }).catch(() => {
      // The static depth and surface remain visible if image decoding fails.
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      sizeObserver.disconnect();
      visibilityObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", syncMotion);
      reducedMotion.removeEventListener("change", syncMotion);
    };
  }, []);

  return (
    <div className="theme-water" ref={water} aria-hidden="true">
      <div className="water-depth" />
      <div className="water-plane">
        <div className="water-surface-fill" style={{ backgroundImage: `url("${surfaceImage}")` }} />
      </div>
      <canvas className="water-motion" ref={canvas} />
    </div>
  );
}
