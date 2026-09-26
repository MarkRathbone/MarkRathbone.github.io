const bubbles = Array.from({ length: 24 }, (_, index) => {
  const jitter = Math.random();
  const duration = 14 + Math.random() * 14;
  return {
    id: index,
    x: ((index + jitter) / 24) * 1440,
    radius: 1.8 + Math.random() * 6.2,
    duration,
    delay: -Math.random() * duration,
    drift: -34 + Math.random() * 68,
    opacity: .25 + Math.random() * .45,
    staticY: 60 + Math.random() * 780,
  };
});

const waveBlueprints = [
  { y: 38, amplitude: 25, wavelength: 430, duration: 13, opacity: .55 },
  { y: 75, amplitude: 19, wavelength: 520, duration: 18, opacity: .42 },
  { y: 112, amplitude: 14, wavelength: 360, duration: 11.5, opacity: .32 },
];

function buildWavePath({ y, amplitude, wavelength }) {
  const start = wavelength * -2;
  const end = 1440 + wavelength * 2;
  let path = `M ${start} ${y}`;

  for (let x = start, crest = true; x < end; x += wavelength / 2, crest = !crest) {
    const midpoint = x + wavelength / 2;
    const control = x + wavelength / 4;
    const controlY = y + (crest ? -amplitude : amplitude);
    path += ` Q ${control} ${controlY} ${midpoint} ${y}`;
  }

  return path;
}

const surfaceWaves = waveBlueprints.map((wave, index) => {
  const duration = wave.duration * (.86 + Math.random() * .28);
  const bobDuration = 4.5 + Math.random() * 4;
  return {
    ...wave,
    d: buildWavePath(wave),
    duration,
    delay: -Math.random() * duration,
    bobDuration,
    bobDelay: -Math.random() * bobDuration,
    lift: -3 + Math.random() * 6,
    opacity: wave.opacity * (.86 + Math.random() * .24),
    direction: index === 1 ? "reverse" : Math.random() > .35 ? "normal" : "reverse",
  };
});

export default function Water() {
  return (
    <svg className="theme-water" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="water-depth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#39d9ff" stopOpacity=".5" />
          <stop offset=".22" stopColor="#1388ed" stopOpacity=".22" />
          <stop offset=".72" stopColor="#073d91" stopOpacity=".08" />
          <stop offset="1" stopColor="#031936" stopOpacity=".3" />
        </linearGradient>
        <linearGradient id="water-ray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9fbff" stopOpacity=".34" />
          <stop offset=".58" stopColor="#6edcff" stopOpacity=".06" />
          <stop offset="1" stopColor="#4bc8ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="water-surface" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9fcff" stopOpacity=".52" />
          <stop offset="1" stopColor="#33c8ff" stopOpacity=".02" />
        </linearGradient>
      </defs>

      <rect className="water-depth" width="1440" height="900" fill="url(#water-depth)" />

      <g className="water-rays">
        <path d="M105 0h190L510 900H285Z" />
        <path d="M410 0h125L760 900H585Z" />
        <path d="M788 0h175l-40 900H730Z" />
        <path d="M1110 0h120l-34 900H1010Z" />
      </g>

      <g className="water-surface">
        <path className="water-surface-fill" d="M-80 0h1600v72c-123-33-220 27-345 5-126-23-224-65-351-29-129 37-250 8-365-15C317 5 165 88-80 51Z" />
        {surfaceWaves.map((wave) => (
          <g
            className="water-wave-track"
            key={wave.y}
            style={{
              "--wave-delay": `${wave.delay}s`,
              "--wave-distance": `${-wave.wavelength}px`,
              "--wave-duration": `${wave.duration}s`,
              animationDirection: wave.direction,
            }}
          >
            <path
              className="water-wave"
              d={wave.d}
              style={{
                "--wave-bob-delay": `${wave.bobDelay}s`,
                "--wave-bob-duration": `${wave.bobDuration}s`,
                "--wave-lift": `${wave.lift}px`,
                "--wave-opacity": wave.opacity,
              }}
            />
          </g>
        ))}
      </g>

      <g className="water-caustics">
        <path d="M42 142c96-34 171 37 267 3s183-41 284 1 187 30 279-7 189-39 292-3 182 25 278-5" />
        <path d="M-24 203c88-39 169 30 260 2s178-40 268 1 178 27 270-9 181-36 277-4 190 30 309-8" />
        <path d="M116 285c80-26 141 18 222 0s158-27 242 5 163 18 242-8 167-29 251 0 165 19 259-8" />
        <path d="M247 375c63-20 116 14 184-2s131-17 200 8 128 12 195-9 139-22 212 3 133 13 205-7" />
      </g>

      <g className="water-bubbles">
        {bubbles.map((bubble) => (
          <circle
            className="water-bubble"
            cx={bubble.x}
            cy="0"
            r={bubble.radius}
            key={bubble.id}
            style={{
              "--bubble-delay": `${bubble.delay}s`,
              "--bubble-drift": `${bubble.drift}px`,
              "--bubble-duration": `${bubble.duration}s`,
              "--bubble-opacity": bubble.opacity,
              "--bubble-static-y": `${bubble.staticY}px`,
            }}
          />
        ))}
      </g>
    </svg>
  );
}
