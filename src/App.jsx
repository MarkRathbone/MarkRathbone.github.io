import { useEffect, useRef, useState } from "react";

const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>;
const Download = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 20h14" /></svg>;
const External = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5M19 5l-9 9M18 13v6H5V6h6" /></svg>;

function SectionTitle({ index, eyebrow, children }) {
  return (
    <div className="section-title reveal">
      <span className="section-number">{index}</span>
      <div><p>{eyebrow}</p><h2>{children}</h2></div>
      <span className="section-line" />
    </div>
  );
}

function App({ cv }) {
  const [alternate, setAlternate] = useState(false);
  const cursorGlow = useRef(null);
  const scrollProgress = useRef(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("palette") === "alternate";
    setAlternate(saved);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.palette = alternate ? "alternate" : "default";
    window.localStorage.setItem("palette", alternate ? "alternate" : "default");
  }, [alternate]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let animationFrame;
    const updateProgress = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const available = document.documentElement.scrollHeight - window.innerHeight;
        const progress = available > 0 ? window.scrollY / available : 0;
        if (scrollProgress.current) scrollProgress.current.style.transform = `scaleX(${progress})`;
      });
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const firefox = navigator.userAgent.includes("Firefox");
    if (reducedMotion || firefox || !cursorGlow.current) return undefined;

    const glow = cursorGlow.current;
    let animationFrame;
    let pointerX = window.innerWidth * 0.7;
    let pointerY = window.innerHeight * 0.35;
    const render = () => {
      glow.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
      animationFrame = undefined;
    };
    const move = (event) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      glow.classList.add("is-active");
      if (!animationFrame) animationFrame = requestAnimationFrame(render);
    };
    const leave = () => glow.classList.remove("is-active");

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div className="site-shell">
      <div className="scroll-progress" ref={scrollProgress} aria-hidden="true" />
      <div className="cursor-glow" ref={cursorGlow} aria-hidden="true" />
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="topbar">
        <a className="monogram" href="#top" aria-label="Mark Rathbone, home">MR<span>.</span></a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#experience">Timeline</a>
          <a href="#skills">Skills</a>
        </nav>
        <div className="nav-actions">
          <button className="palette-button" onClick={() => setAlternate((value) => !value)} aria-label="Shift colour palette" aria-pressed={alternate}>
            <span className="palette-swatches" aria-hidden="true"><i /><i /></span>
            <span className="palette-name">Palette: {alternate ? "Crimson" : "Cobalt"}</span>
          </button>
          <a className="mini-cv" href="/mark-rathbone-cv.pdf" download>CV <Download /></a>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-ambient" aria-hidden="true">
            <span className="ambient-glow" />
            <i className="ambient-shard ambient-shard-one" />
            <i className="ambient-shard ambient-shard-two" />
            <i className="ambient-shard ambient-shard-three" />
          </div>
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-copy reveal is-visible">
            <div className="status"><i /> Available for the next challenge <span>UK · REMOTE</span></div>
            <p className="hero-kicker">Cloud systems / Platform engineering</p>
            <h1><span>{cv.personal.first_name}</span><br />{cv.personal.last_name}</h1>
            <p className="hero-intro">{cv.profile.short}</p>
            <div className="hero-actions">
              <a className="primary-button" href="#work">Explore my work <Arrow /></a>
              <a className="text-link" href={`mailto:${cv.personal.email}`}>Start a conversation <span>↗</span></a>
            </div>
          </div>

          <div className="hero-visual reveal is-visible">
            <div className="portrait-frame">
              <div className="portrait-label">ENG / 01</div>
              <img src={cv.personal.portrait} alt={`Portrait of ${cv.personal.name}`} />
              <div className="portrait-slice" aria-hidden="true" />
            </div>
            <div className="stat-card stat-card-top"><span>CORE</span><strong>AWS + K8s</strong></div>
            <div className="stat-card stat-card-bottom"><span>BUILD</span><strong>Go / Python / IaC</strong></div>
            <div className="orbit" aria-hidden="true">PLATFORM · RELIABILITY · SYSTEMS ·</div>
          </div>

          <div className="scroll-cue"><span>Explore</span><i /></div>
        </section>

        <section className="manifesto section-pad">
          <p className="vertical-word" aria-hidden="true">PROFILE</p>
          <div className="manifesto-mark reveal">“</div>
          <div className="manifesto-copy reveal">
            <p className="eyebrow">Profile</p>
            <h2>Calm systems.<br /><em>Confident teams.</em></h2>
            {cv.profile.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="manifesto-meta reveal">
            <span>Based in</span><strong>{cv.personal.location}</strong>
            <span>Focus</span><strong>Cloud-native infrastructure</strong>
            <span>Approach</span><strong>Pragmatic by default</strong>
          </div>
        </section>

        <section className="work section-pad" id="work">
          <SectionTitle index="01" eyebrow="Selected operations">Systems I’ve helped ship</SectionTitle>
          <div className="work-grid">
            {cv.selected_work.map((item, index) => (
              <article className={`work-card reveal work-card-${index + 1}`} key={item.number}>
                <div className="work-number">CASE / {item.number}</div>
                <div className="work-symbol" aria-hidden="true">{index === 0 ? "⌘" : index === 1 ? "↯" : "◈"}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <ul>{item.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section className="experience section-pad" id="experience">
          <SectionTitle index="02" eyebrow="Experience">The route so far</SectionTitle>
          <div className="timeline">
            {cv.experience.map((role, index) => (
              <article className="timeline-entry reveal" key={`${role.company}-${role.role}`}>
                <div className="timeline-index">{String(index + 1).padStart(2, "0")}</div>
                <div className="timeline-date"><span>{role.start}</span><i />{role.end}</div>
                <div className="timeline-copy">
                  <div className="timeline-heading">
                    {role.logo && <span className="company-logo"><img src={role.logo} alt={`${role.company} logo`} /></span>}
                    <div>
                      <p className="company">{role.company} · {role.location}</p>
                      <h3>{role.role}</h3>
                    </div>
                  </div>
                  <p>{role.summary}</p>
                  <details>
                    <summary>Role details <span>+</span></summary>
                    <ul>{role.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
                    {role.note && <p className="role-note">{role.note}</p>}
                  </details>
                </div>
              </article>
            ))}
          </div>
          <div className="earlier reveal">
            <p>Earlier experience</p>
            {cv.earlier_experience.map((role) => (
              <div key={role.company}><strong>{role.role}</strong><span>{role.company}</span><small>{role.start} — {role.end}</small></div>
            ))}
          </div>
        </section>

        <section className="skills section-pad" id="skills">
          <SectionTitle index="03" eyebrow="Capabilities">Tools of the trade</SectionTitle>
          <div className="skill-layout">
            <div className="skill-groups">
              {cv.skills.map((group, index) => (
                <div className="skill-group reveal" key={group.group}>
                  <span>0{index + 1}</span><h3>{group.group}</h3>
                  <ul>{group.items.map((skill) => <li key={skill}>{skill}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className="cert-panel reveal">
              <p className="eyebrow">Credentials</p>
              <h3>Certifications</h3>
              <div className="cert-list">
                {cv.certifications.map((cert) => (
                  <div key={cert.title}><i /> <span><strong>{cert.title}</strong><small>{cert.issuer} · {cert.date}</small></span></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="contact section-pad" id="contact">
          <p className="contact-code">GET_IN_TOUCH</p>
          <h2 className="reveal">Let’s build something<br /><em>worth operating.</em></h2>
          <a className="contact-email reveal" href={`mailto:${cv.personal.email}`}>{cv.personal.email}<Arrow /></a>
          <div className="contact-links">
            {cv.links.map((link) => <a href={link.url} target="_blank" rel="noreferrer" key={link.label}>{link.label}<External /></a>)}
            <a href="/mark-rathbone-cv.pdf" download>Download CV<Download /></a>
          </div>
          <div className="contact-slash" aria-hidden="true" />
        </section>
      </main>

      <footer>
        <a className="monogram" href="#top">MR<span>.</span></a>
        <p>Designed as code. Deployed with intent.</p>
        <p>© {new Date().getFullYear()} {cv.personal.name}</p>
      </footer>
    </div>
  );
}

export default App;
