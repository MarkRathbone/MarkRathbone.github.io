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
        <path d="M-80 38c116-49 207 28 325 5s228-58 346-13 233 45 350 2 248-26 579 17" />
        <path d="M-80 72c143-44 250 29 389 0 141-29 258-57 387-5 132 52 253 21 365-5 116-27 261-3 459 34" />
        <path d="M-80 111c127-36 239 12 353-7 113-19 218-43 339-2 120 41 258 26 391-3 133-28 282-8 517 29" />
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
