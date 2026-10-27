import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight, ArrowUpRight, Download, Gamepad2, Layers, Timer, ListOrdered, Shuffle, Zap, Swords,
  PenLine, Boxes, CalendarCheck, RotateCcw, ChevronDown, Linkedin, Instagram, Globe,
} from 'lucide-react'
import {
  siteIndex, resources, geo, practice, currentAffairs, gameSubjects, gameModes,
  why, faqs, footerCols,
} from '../content'
import { R } from '../routes'
import { Mark } from './Logo'

function Head({ no, kicker, title, text, id }: { no: string; kicker: string; title: string; text?: string; id: string }) {
  return (
    <header className="sec-head reveal">
      <p className="kicker">
        <span>{no}</span> {kicker}
      </p>
      <h2 id={id}>{title}</h2>
      {text && <p className="sec-lede">{text}</p>}
    </header>
  )
}

/* 1. What's on the site (a map, not a personalised dashboard) */
export function SiteIndex() {
  return (
    <section className="section" aria-labelledby="index-title">
      <div className="wrap">
        <Head
          id="index-title"
          no="01"
          kicker="Where to begin"
          title="Everything currently on the site, in one index"
          text="This is a map of what exists today, not a personal dashboard. Each line opens its own page."
        />
        <ol className="index reveal">
          {siteIndex.map((i) => (
            <li key={i.no}>
              <a href={i.href}>
                <span className="index-no">{i.no}</span>
                <span className="index-title">{i.title}</span>
                <span className="index-text">{i.text}</span>
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* 2. Study resources */
export function Resources() {
  return (
    <section className="section section-tint" id="resources" aria-labelledby="res-title">
      <div className="wrap split">
        <div className="split-lead reveal">
          <p className="kicker"><span>02</span> Study resources</p>
          <h2 id="res-title">Reading material, grouped the way the exam is</h2>
          <p className="sec-lede">{resources.lead.text}</p>
          <a className="btn btn-primary" href={resources.lead.href}>
            {resources.lead.label} <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
        <ul className="rows reveal" aria-label="Study resources">
          {resources.list.map((l) => (
            <li key={l.href}>
              <a href={l.href}>
                <span className="rows-main">
                  <strong>{l.label}</strong>
                  <span>{l.note}</span>
                </span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* BEGINNER_ROADMAP_SHOWCASE_V1 */
/* Beginner roadmap workbook showcase */
export function BeginnerRoadmap() {
  const sheets = [
    { no: "01", title: "Start Here", text: "Understand the exam and build your first study routine." },
    { no: "02", title: "All Subjects", text: "Polity, History, Geography, Economy, Environment, CSAT, Mains and more." },
    { no: "03", title: "12-Week Starter", text: "A guided foundation plan with weekly goals and revision checkpoints." },
    { no: "04", title: "Weekly Routine", text: "Balance learning, practice, current affairs and revision." },
    { no: "05", title: "Daily Tracker", text: "Record topics, practice questions, mistakes and revision dates." },
    { no: "06", title: "Answer Writing", text: "Plan and review Mains answers with a repeatable structure." },
    { no: "07", title: "Resources & Rules", text: "Choose reliable materials and avoid resource overload." },
    { no: "08", title: "Optional Decision", text: "Compare optional subjects thoughtfully before deciding." },
  ]

  return (
    <section className="section roadmap-showcase" id="beginner-roadmap" aria-labelledby="roadmap-title">
      <div className="wrap">
        <div className="roadmap-heading reveal">
          <p className="kicker"><span>04</span> Start with a plan</p>
          <h2 id="roadmap-title">Your first step into UPSC preparation.</h2>
          <p className="sec-lede">
            Not sure what to study first? Explore this beginner-friendly workbook for a subject-wise
            roadmap, a 12-week foundation plan, weekly routines and progress trackers.
          </p>
        </div>

        <div className="roadmap-panel reveal">
          <div className="roadmap-panel-top">
            <div>
              <span className="roadmap-file-tag">FREE STUDY PLANNER · EXCEL WORKBOOK</span>
              <h3>UPSC Gurukul Beginner Roadmap</h3>
              <p>One workbook to help you understand what to study, how to practise and how to track your progress.</p>
            </div>
            <div className="roadmap-sheet-count" aria-label="Eight worksheets">
              <strong>08</strong>
              <span>worksheets</span>
            </div>
          </div>

          <div className="roadmap-sheet-grid">
            {sheets.map((sheet) => (
              <article className="roadmap-sheet" key={sheet.no}>
                <span className="roadmap-sheet-no">{sheet.no}</span>
                <div>
                  <h4>{sheet.title}</h4>
                  <p>{sheet.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="roadmap-subjects" aria-label="Subjects included">
            <span>Polity</span><span>History</span><span>Geography</span>
            <span>Economy</span><span>Environment</span><span>Science &amp; Tech</span>
            <span>CSAT</span><span>Essay</span><span>Ethics</span><span>Optional</span>
            <span>Current Affairs</span><span>Interview</span>
          </div>

          <div className="roadmap-actions">
            <a className="btn btn-primary"
               href="/downloads/UPSC_Gurukul_Beginner_All_Subjects_Roadmap.xlsx"
               download="UPSC_Gurukul_Beginner_All_Subjects_Roadmap.xlsx">
              <Download size={18} aria-hidden="true" /> Download Excel roadmap
            </a>
            <a className="btn btn-ghost" href="https://upscgurukul.online/" target="_blank" rel="noreferrer">
              Visit UPSC Gurukul <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <p className="roadmap-note">Beginner-friendly guide · Editable checklist · Study planning and revision</p>
        </div>
      </div>
    </section>
  )
}
const brandRunnerItems = [
  { image: "/runner-icons/home.svg", title: "UPSC Gurukul", sub: "Home", href: "https://upscgurukul.online/" },
  { image: "/runner-icons/notes.svg", title: "Study Notes", sub: "Subject-wise", href: "/notes.html" },
  { image: "/runner-icons/tests.svg", title: "Test Series", sub: "Prelims & Mains", href: "/testseries.html" },
  { image: "/runner-icons/mock-tests.svg", title: "Mock Tests", sub: "Timed practice", href: "/UPSChubmock.html" },
  { image: "/runner-icons/current-affairs.svg", title: "Current Affairs", sub: "Daily updates", href: "/newsupdate.html" },
  { image: "/runner-icons/geography.svg", title: "Geography & Maps", sub: "World & India", href: "/geography/index.html" },
  { image: "/runner-icons/games.svg", title: "Learning Games", sub: "Learn by playing", href: "/games/index.html" },
  { image: "/runner-icons/video.svg", title: "Video Hub", sub: "Watch & learn", href: "https://www.youtube.com/" },
  { image: "/runner-icons/writing.svg", title: "Answer Writing", sub: "Mains practice", href: "/AnswerWriting/answerwriting.html" },
  { image: "/runner-icons/downloads.svg", title: "Downloads", sub: "PDF library", href: "/download.html" },
  { image: "/runner-icons/app.svg", title: "UPSC Gurukul App", sub: "App resources", href: "/download.html" },
]

export function BrandRunner() {
  const trackRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frame = 0
    let lastTime = 0
    let paused = false
    const speed = 42


    const animate = (time: number) => {
      if (!lastTime) lastTime = time
      const delta = Math.min((time - lastTime) / 1000, 0.05)
      lastTime = time

      if (!paused && track.scrollWidth > 0) {
        const loopWidth = track.scrollWidth / 2
        if (loopWidth > 0) {
          positionRef.current = (positionRef.current + speed * delta) % loopWidth
          track.style.transform = `translate3d(${-positionRef.current}px, 0, 0)`
        }
      }

      frame = window.requestAnimationFrame(animate)
    }

    const pause = () => { paused = true }
    const resume = () => { paused = false }

    track.addEventListener('mouseenter', pause)
    track.addEventListener('mouseleave', resume)
    track.addEventListener('focusin', pause)
    track.addEventListener('focusout', resume)

    frame = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(frame)
      track.removeEventListener('mouseenter', pause)
      track.removeEventListener('mouseleave', resume)
      track.removeEventListener('focusin', pause)
      track.removeEventListener('focusout', resume)
    }
  }, [])

  const items = [...brandRunnerItems, ...brandRunnerItems]

  return (
    <section className="brand-runner" aria-label="Explore UPSC Gurukul resources">
      <div className="brand-runner-heading">
        <span className="brand-runner-eyebrow">EXPLORE EVERYTHING ON</span>
        <h2>UPSC <span>Gurukul</span></h2>
        <p>Notes · Test Series · Current Affairs · Maps · Games · Videos · and more</p>
      </div>

      <div className="brand-runner-window">
        <div className="brand-runner-track" ref={trackRef}>
          {items.map((item, index) => (
            <a
              className="brand-runner-card"
              href={item.href}
              key={`${item.title}-${index}`}
              target={item.href.startsWith('https://') ? '_blank' : undefined}
              rel={item.href.startsWith('https://') ? 'noreferrer' : undefined}
              aria-label={`${item.title}: ${item.sub}`}
            >
              <span className="brand-runner-icon"><img src={item.image} alt="" loading="eager" /></span>
              <strong>{item.title}</strong>
              <span className="brand-runner-subtitle">{item.sub}</span>
              <span className="brand-runner-underline" />
            </a>
          ))}
        </div>
      </div>

      <div className="brand-runner-footer">
        <span>✦ QUALITY RESOURCES <small>Curated for UPSC</small></span>
        <span>◎ PRACTICE TESTS <small>Track your progress</small></span>
        <span>↗ LEARN SMARTLY <small>Structured pathways</small></span>
        <span>♧ TRUSTED & FREE <small>For every aspirant</small></span>
      </div>
    </section>
  )
}
/* 3. Geography & maps */
export function Geography() {
  return (
    <section className="section section-navy" id="geography" aria-labelledby="geo-title">
      <div className="wrap geo-grid">
        <div className="geo-subjects-visual reveal">
          <img
            src="/images/upsc-all-subjects.webp"
            alt="UPSC Gurukul subjects: Polity, History, Geography, Economy, Environment, Science and Technology"
            className="upsc-subjects-illustration"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="geo-copy reveal">
          <p className="kicker kicker-light"><span>03</span> Geography &amp; Maps</p>
          <h2 id="geo-title">Read a chapter. Mark the map. Take the test.</h2>
          <p className="sec-lede">
            Geography is the clearest place to see reading and practice working together. Notes are organised by
            book and chapter, the map page asks you to place real locations, and the daily test series turns a
            topic into MCQs.
          </p>
          <ul className="rows rows-light">
            {geo.links.map((l) => (
              <li key={l.href}>
                <a href={l.href}>
                  <span className="rows-main">
                    <strong>{l.label}</strong>
                    <span>{l.note}</span>
                  </span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <p className="map-line">
            <span>Map practice covers</span> {geo.continents.join(' · ')}
          </p>
        </div>
      </div>
    </section>
  )
}

/* 4. Tests & practice */
export function Practice() {
  return (
    <section className="section" id="practice" aria-labelledby="prac-title">
      <div className="wrap">
        <Head
          id="prac-title"
          no="04"
          kicker="Tests & practice"
          title="Check what you have learned, a little every day"
          text="Five practice routes that exist today. Open the page to see exactly what is currently live in each."
        />
        <ol className="practice reveal">
          {practice.map((p, i) => (
            <li key={p.title}>
              <span className="practice-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
              <a className="btn btn-ghost" href={p.href}>
                {p.cta} <ArrowRight size={16} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* 5. Current affairs */
export function CurrentAffairs() {
  return (
    <section className="section section-tint" id="current-affairs" aria-labelledby="ca-title">
      <div className="wrap split split-reverse">
        <ul className="rows rows-big reveal" aria-label="Current affairs">
          {currentAffairs.map((l) => (
            <li key={l.href}>
              <a href={l.href}>
                <span className="rows-main">
                  <strong>{l.label}</strong>
                  <span>{l.note}</span>
                </span>
                <ArrowUpRight size={20} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
        <div className="split-lead reveal">
          <p className="kicker"><span>05</span> Current affairs</p>
          <h2 id="ca-title">Keep up with the news, then test your recall</h2>
          <p className="sec-lede">
            Open the magazine archive or the daily newspaper page for reading, and use the current-affairs test
            to see how much you remember. Each page shows its own dates, so you can judge how recent the
            material is.
          </p>
        </div>
      </div>
    </section>
  )
}

/* 6. Learning games */
const modeIcons = [Zap, Timer, Swords, PenLine, Boxes, Shuffle, ListOrdered, Layers, Gamepad2, RotateCcw, CalendarCheck]

export function Games() {
  return (
    <section className="section" id="games" aria-labelledby="games-title">
      <div className="wrap">
        <div className="games-top">
          <Head
            id="games-title"
            no="06"
            kicker="Learning games"
            title="Chapter-wise practice that feels lighter than a test"
            text="Pick a subject and a chapter, play a short game, read the explanation for each answer, then replay only your mistakes. No sign-up, and progress stays in your browser."
          />
          <div className="games-cta reveal">
            <a className="btn btn-primary" href={R.games}>
              Play now <ArrowRight size={18} aria-hidden="true" />
            </a>
            <p className="fineprint">Starter questions are still being reviewed. Check key facts against the source.</p>
          </div>
        </div>
        <p className="subjects reveal" aria-label="Subjects">
          {gameSubjects.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </p>
        <ul className="modes reveal">
          {gameModes.map((m, i) => {
            const Icon = modeIcons[i % modeIcons.length]
            return (
              <li key={m.title}>
                <Icon size={20} aria-hidden="true" />
                <div>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* 7. App tour */
export function AppTour() {
  const [active, setActive] = useState(0)
  const slides = [
    { title: 'Home dashboard', tag: 'YOUR STUDY DESK', heading: 'Learn today.', accent: 'Lead tomorrow.', desc: 'Your UPSC preparation, in one place.', tiles: [['§','Polity'],['⌂','History'],['◎','Geography'],['₹','Economy']], task: 'Daily practice', detail: 'Current affairs · 10 questions', button: 'Start learning' },
    { title: 'Study notes', tag: 'STUDY LIBRARY', heading: 'Build strong', accent: 'foundations.', desc: 'Chapter-wise resources for every aspirant.', tiles: [['01','NCERT'],['02','Polity'],['03','History'],['04','Science']], task: 'Continue reading', detail: 'Indian Constitution · Chapter 02', button: 'Open notes' },
    { title: 'Test series', tag: 'PRACTICE ARENA', heading: 'Practise with', accent: 'a purpose.', desc: 'Prepare for Prelims, Mains and CSAT.', tiles: [['01','Prelims'],['02','Mains'],['03','CSAT'],['04','Revision']], task: 'Full length test', detail: 'General Studies · Timed practice', button: 'Begin test' },
    { title: 'Current affairs', tag: 'DAILY BRIEF', heading: 'Know what', accent: 'matters.', desc: 'Connect daily news with the syllabus.', tiles: [['N','National'],['W','World'],['E','Economy'],['S','Science']], task: 'Today’s briefing', detail: 'News analysis · Daily edition', button: 'Read briefing' },
    { title: 'Geography & maps', tag: 'MAP PRACTICE', heading: 'Explore the', accent: 'whole world.', desc: 'Indian and world geography practice.', tiles: [['IN','India'],['AF','Africa'],['AS','Asia'],['SA','Americas']], task: 'Map challenge', detail: 'Locate important places', button: 'Start challenge' },
    { title: 'Learning games', tag: 'LEARN & PLAY', heading: 'Revise through', accent: 'discovery.', desc: 'Make learning active and memorable.', tiles: [['§','Polity'],['⌛','History'],['◎','Maps'],['✦','Quiz']], task: 'Daily brain teaser', detail: 'Quick knowledge challenge', button: 'Play now' },
    { title: 'Answer writing', tag: 'MAINS PRACTICE', heading: 'Think clearly.', accent: 'Write better.', desc: 'Build structured and relevant answers.', tiles: [['I','GS I'],['II','GS II'],['III','GS III'],['IV','GS IV']], task: 'Today’s answer', detail: 'Governance and society', button: 'Start writing' },
    { title: 'Progress tracker', tag: 'YOUR JOURNEY', heading: 'Small steps.', accent: 'Real progress.', desc: 'Build consistency one session at a time.', tiles: [['✓','Done'],['↻','Revise'],['◎','Accuracy'],['★','Goals']], task: 'Your next milestone', detail: 'Keep your preparation moving', button: 'Continue' }
  ]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive(current => (current + 1) % slides.length)
    }, 3200)
    return () => window.clearInterval(timer)
  }, [slides.length])

  const goTo = (index: number) => setActive((index + slides.length) % slides.length)

  return (
    <section
      className="section section-navy gurukul-cylinder"
      id="app-tour"
      aria-labelledby="app-tour-title"
    >
      <div className="wrap gurukul-cylinder-layout">
        <div className="gurukul-cylinder-copy">
          <span className="eyebrow">UPSC GURUKUL APP</span>
          <h2 id="app-tour-title">Take your study resources onto your <em>phone.</em></h2>
          <p>Explore subject-wise notes, practice tests, current affairs, maps and revision tools in one learning space.</p>
          <div className="gurukul-cylinder-steps">
            <div><b>01</b><span>Learn with organised subject resources.</span></div>
            <div><b>02</b><span>Practise through tests and daily questions.</span></div>
            <div><b>03</b><span>Review concepts and track your progress.</span></div>
          </div>
          <a className="btn btn-primary" href="/download.html">Explore app downloads <span aria-hidden="true">↗</span></a>
          <p className="gurukul-cylinder-note">Illustrative demo screens. Your actual app screenshots can replace these later.</p>
        </div>

        <div className="gurukul-cylinder-showcase">
          <div className="gurukul-cylinder-stage" aria-label="Automatically rotating app screen showcase">
            <div className="gurukul-cylinder-ring" style={{ '--slide-count': slides.length, '--active-angle': `${active * (360 / slides.length)}deg` } as React.CSSProperties}>
              {slides.map((slide, index) => (
                <div
                  className="gurukul-cylinder-card"
                  key={slide.title}
                  style={{ '--card-angle': `${index * (360 / slides.length)}deg` } as React.CSSProperties}
                  aria-hidden="true"
                >
                  <div className="gurukul-cylinder-phone">
                    <div className="gurukul-cylinder-screen">
                      <div className="gurukul-cylinder-status"><span>9:30</span><span>● ◔ ▰</span></div>
                      <div className="gurukul-cylinder-brand"><span>G</span><b>UPSC Gurukul</b><small>✦</small></div>
                      <div className="gurukul-cylinder-tag">{slide.tag}</div>
                      <div className="gurukul-cylinder-hero">
                        <strong>{slide.heading}</strong><em>{slide.accent}</em><small>{slide.desc}</small>
                        <span className="gurukul-cylinder-orbit">✦</span>
                      </div>
                      <div className="gurukul-cylinder-tiles">
                        {slide.tiles.map(([symbol, label]) => <div key={label}><b>{symbol}</b><small>{label}</small></div>)}
                      </div>
                      <div className="gurukul-cylinder-task-label">{slide.title}</div>
                      <div className="gurukul-cylinder-task"><span>✦</span><div><b>{slide.task}</b><small>{slide.detail}</small></div></div>
                      <div className="gurukul-cylinder-action">{slide.button}<b>↗</b></div>
                      <div className="gurukul-cylinder-nav"><span>⌂<small>Home</small></span><span>▣<small>Tests</small></span><span>▤<small>Notes</small></span><span>♙<small>Profile</small></span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="gurukul-cylinder-floor" aria-hidden="true"></div>
          </div>

          <div className="gurukul-cylinder-controls">
            <button type="button" onClick={() => goTo(active - 1)} aria-label="Previous screenshot">← Previous</button>
            <div className="gurukul-cylinder-dots" aria-label="Choose active screenshot">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  className={active === index ? 'is-active' : ''}
                  onClick={() => goTo(index)}
                  aria-label={`Show ${slide.title}`}
                  aria-pressed={active === index}
                />
              ))}
            </div>
            <button type="button" onClick={() => goTo(active + 1)} aria-label="Next screenshot">Next →</button>
          </div>
          <p className="gurukul-cylinder-caption" aria-live="polite">{String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')} · {slides[active].title}</p>
        </div>
      </div>
    </section>
  )
}

export function Why() {
  return (
    <section className="section" aria-labelledby="why-title">
      <div className="wrap">
        <Head
          id="why-title"
          no="08"
          kicker="Why UPSC Gurukul"
          title="Built around how an aspirant actually studies"
        />
        <ol className="why reveal">
          {why.map((w, i) => (
            <li key={w.title}>
              <span className="why-no" aria-hidden="true">{i + 1}</span>
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* 9. FAQ */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="section section-tint" id="faq" aria-labelledby="faq-title">
      <div className="wrap split">
        <div className="split-lead reveal">
          <p className="kicker"><span>09</span> Questions</p>
          <h2 id="faq-title">Straight answers</h2>
          <p className="sec-lede">
            What the site is, what it is not, and where your data goes. Cannot find yours?{' '}
            <a className="text-link" href={R.contact}>Contact us</a>.
          </p>
        </div>
        <div className="faq reveal">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div className={`faq-item${isOpen ? ' is-open' : ''}`} key={f.q}>
                <h3>
                  <button
                    type="button"
                    id={`faq-btn-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{f.q}</span>
                    <ChevronDown size={20} aria-hidden="true" />
                  </button>
                </h3>
                <div className="faq-panel" id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-btn-${i}`}>
                  <div>
                    <p>{f.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* 10. Final CTA + footer */
export function FinalCta() {
  return (
    <section className="final final-founder" aria-labelledby="final-title">
      <div className="wrap final-row final-founder-row">
        <div className="final-founder-copy">
          <p className="final-founder-kicker">A VISION BY PRATYUSH SWAIN</p>
          <h2 id="final-title">Better tools. Clearer preparation. A stronger purpose.</h2>
          <p>
            UPSC Gurukul brings learning resources, practice and technology
            together — helping aspirants spend less time searching and more
            time preparing.
          </p>

          <div className="final-actions">
            <a className="btn btn-gold" href={R.notes}>
              Start Learning <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="link-quiet link-light" href={R.games}>
              Or play a game <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>

          <nav className="final-founder-socials" aria-label="Connect with the founder">
            <a
              href="https://pratyushswain.in/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Pratyush Swain's portfolio"
            >
              <Globe size={15} aria-hidden="true" />
              <span>Portfolio</span>
            </a>
            <a
              href="https://www.linkedin.com/in/pratyushswain-upschub/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect with Pratyush Swain on LinkedIn"
            >
              <Linkedin size={15} aria-hidden="true" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://www.instagram.com/pratyush_swain01/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Pratyush Swain on Instagram"
            >
              <Instagram size={15} aria-hidden="true" />
              <span>Instagram</span>
            </a>
          </nav>
        </div>

        <div className="final-founder-portrait-wrap">
          <div className="final-founder-photo-frame">
            <img
              className="final-founder-photo"
              src="/images/founder-pratyush.png"
              alt="Pratyush Swain, founder of UPSC Gurukul"
              loading="lazy"
              width="480"
              height="600"
            />
          </div>
          <div className="final-founder-caption">
            <span className="final-founder-caption-label">FOUNDER</span>
            <span className="final-founder-name">Pratyush Swain</span>
            <span className="final-founder-platform">UPSC GURUKUL</span>
          </div>
        
          <div className="final-founder-real-stamp" aria-label="UPSC Gurukul founder stamp">
          <img
            src="/images/stamp.jpg"
            alt="Official UPSC Gurukul founder stamp"
            loading="lazy"
            width="240"
            height="240"
          />
        </div>
        </div>
              </div>
</section>
  )
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <a className="brand" href="#top" aria-label="UPSC Gurukul, back to top">
              <span className="wordmark">
                <Mark />
                <span className="wordmark-text">
                  <span className="wordmark-small">UPSC</span>
                  <span className="wordmark-big">Gurukul</span>
                </span>
              </span>
            </a>
            <p>An independent study platform for UPSC Civil Services aspirants. Not affiliated with the Union Public Service Commission.</p>
            <a
              className="bhaskar-footer-link"
              href="/founder/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Pratyush Swain's public BHASKAR profile on Startup India (opens in a new tab)"
            >
              BHASKAR · Startup India · Skill India <span aria-hidden="true">↗</span>
            </a>
          </div>
          <nav className="footer-cols" aria-label="Footer">
            {footerCols.map((c) => (
              <div key={c.title}>
                <h3>{c.title}</h3>
                <ul>
                  {c.links.map((l) => (
                    <li key={l.href + l.label}>
                      <a href={l.href}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <p>© 2026 UPSC Gurukul. All rights reserved. Founder: Pratyush Swain.</p>
          <p>
            <a href={R.privacy}>Privacy</a> · <a href={R.terms}>Terms</a> · <a href={R.dataRights}>Data rights</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
