import { useEffect, useRef, useState } from "react";

const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>;
const Download = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 20h14" /></svg>;
const External = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5M19 5l-9 9M18 13v6H5V6h6" /></svg>;
const Moon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.2A8.2 8.2 0 0 1 8.8 4a8.2 8.2 0 1 0 11.2 11.2Z" /></svg>;
const Sun = () => <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;
const Horizon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M3 12h4M17 12h4M5.5 6.5l2.8 2.8M15.7 14.7l2.8 2.8" /></svg>;

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
  const [activeSection, setActiveSection] = useState("");
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "mid";
    const savedMode = window.localStorage.getItem("theme-mode");
    const legacyPalette = window.localStorage.getItem("palette");
    if (["dark", "mid", "light"].includes(savedMode)) return savedMode;
    return legacyPalette === "alternate" ? "dark" : "mid";
  });
  const cursorGlow = useRef(null);
  const scrollProgress = useRef(null);
  const metrics = Object.fromEntries((cv.impact_metrics ?? []).map((metric) => [metric.key, metric]));
  const cvDownload = {
    dark: "/mark-rathbone-cv-crimson.pdf",
    mid: "/mark-rathbone-cv-cobalt.pdf",
    light: "/mark-rathbone-cv-gold.pdf",
  }[theme];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === "light" ? "light" : "dark";
    window.localStorage.setItem("theme-mode", theme);
    window.localStorage.removeItem("palette");
    const themeColours = { dark: "#10090b", mid: "#071120", light: "#f6edcf" };
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColours[theme]);
  }, [theme]);

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
        document.querySelector(".topbar")?.classList.toggle("is-scrolled", window.scrollY > 24);
        const marker = window.innerHeight * 0.35;
        const current = [...document.querySelectorAll("#work, #experience, #skills")]
          .find((section) => {
            const bounds = section.getBoundingClientRect();
            return bounds.top <= marker && bounds.bottom >= marker;
          });
        setActiveSection(current?.id ?? "");
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
          <a className={activeSection === "work" ? "is-active" : ""} aria-current={activeSection === "work" ? "page" : undefined} href="#work">Work</a>
          <a className={activeSection === "experience" ? "is-active" : ""} aria-current={activeSection === "experience" ? "page" : undefined} href="#experience">Timeline</a>
          <a className={activeSection === "skills" ? "is-active" : ""} aria-current={activeSection === "skills" ? "page" : undefined} href="#skills">Skills</a>
        </nav>
        <div className="nav-actions">
          <div className="mode-picker" role="group" aria-label="Colour mode">
            <button className={theme === "dark" ? "is-active" : ""} onClick={() => setTheme("dark")} aria-pressed={theme === "dark"} title="Use dark crimson mode"><Moon /><span>Dark</span></button>
            <button className={theme === "mid" ? "is-active" : ""} onClick={() => setTheme("mid")} aria-pressed={theme === "mid"} title="Use mid cobalt mode"><Horizon /><span>Mid</span></button>
            <button className={theme === "light" ? "is-active" : ""} onClick={() => setTheme("light")} aria-pressed={theme === "light"} title="Use light gold mode"><Sun /><span>Light</span></button>
          </div>
          <a className="mini-cv" href={cvDownload} download>CV <Download /></a>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-ambient" aria-hidden="true">
            <span className="ambient-glow" />
            <span className="ambient-ring ambient-ring-one" />
            <span className="ambient-ring ambient-ring-two" />
            <span className="ambient-comet ambient-comet-one" />
            <span className="ambient-comet ambient-comet-two" />
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
            <div className="stat-card stat-card-top"><span>PLATFORM SCALE</span><strong>{metrics.repositories?.value ?? "30–40"} REPOS</strong></div>
            <div className="stat-card stat-card-bottom"><span>ENABLEMENT</span><strong>{metrics.colleagues?.value ?? "20+"} PEOPLE</strong></div>
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

        <section className="career-arc section-pad" aria-labelledby="career-arc-title">
          <div className="career-heading reveal">
            <p className="eyebrow">Career trajectory</p>
            <h2 id="career-arc-title">Built in layers.<br /><em>Leading the whole system.</em></h2>
            <p>Each stage added a wider field of view: from operating cloud services, to building platforms, to setting the direction that helps teams and the wider business deliver safely.</p>
          </div>
          <div className="impact-grid" aria-label="Career impact">
            {cv.impact_metrics.map((metric) => (
              <article className="impact-metric reveal" key={metric.key}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
                <small>{metric.context}</small>
              </article>
            ))}
          </div>
          <div className="arc-track">
            {cv.career_arc.map((stage, index) => (
              <article className="arc-stage reveal" key={stage.period}>
                <div className="arc-node" aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span></div>
                <p>{stage.period}</p>
                <h3>{stage.title}</h3>
                <div>{stage.description}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="work section-pad" id="work">
          <div className="section-motif work-motif" aria-hidden="true">
            <span /><span /><i /><b />
          </div>
          <SectionTitle index="01" eyebrow="Selected work">Systems I’ve helped ship</SectionTitle>
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
          <div className="section-motif signal-motif" aria-hidden="true">
            <span /><i /><i /><i /><i />
          </div>
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
          <div className="section-motif skills-motif" aria-hidden="true">
            <span /><span /><i />
          </div>
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
            <a href={cvDownload} download>Download CV<Download /></a>
          </div>
          <div className="contact-orbit" aria-hidden="true"><span /><i /><i /></div>
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
