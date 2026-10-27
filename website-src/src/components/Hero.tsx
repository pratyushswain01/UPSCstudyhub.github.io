import { useEffect, useState } from 'react'
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { R } from '../routes'

const rotatingPhrases = [
  'IAS officer',
  'IPS officer',
  'IFS officer',
  'IRS officer',
  'civil servant',
  'nation builder',
  'change maker',
  'public servant',
  'future leader',
  'guardian of justice',
  'voice of the people',
  'agent of change',
]

export default function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0)

  const [showScrollCue, setShowScrollCue] = useState(false)
  useEffect(() => {
    const timer = window.setInterval(() => {
      setPhraseIndex((current) => (current + 1) % rotatingPhrases.length)
    }, 2500)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    let timer: number | undefined

    const clearCueTimer = () => {
      if (timer !== undefined) {
        window.clearTimeout(timer)
        timer = undefined
      }
    }

    const scheduleCue = () => {
      clearCueTimer()
      setShowScrollCue(false)

      // Only show after the visitor has returned to the top
      // and stopped scrolling for 3.5 seconds.
      if (window.scrollY <= 10) {
        timer = window.setTimeout(() => {
          if (window.scrollY <= 10) {
            setShowScrollCue(true)
          }
        }, 3500)
      }
    }

    const handleScroll = () => {
      // Hide immediately while scrolling; restart the delay
      // only when the viewport is back at the top.
      clearCueTimer()
      setShowScrollCue(false)

      if (window.scrollY <= 10) {
        timer = window.setTimeout(() => {
          if (window.scrollY <= 10) {
            setShowScrollCue(true)
          }
        }, 3500)
      }
    }

    scheduleCue()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearCueTimer()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  const currentPhrase = rotatingPhrases[phraseIndex]

  return (
    <section
      className="hero hero-reimagined hero-compact"
      id="top"
      aria-labelledby="hero-title"
    >
      <div className="wrap hero-compact-inner">

        <h1 id="hero-title" className="hero-compact-title">
          Your personal guide
          <br />
          to every{' '}
          <span
            className="hero-compact-highlight"
            key={currentPhrase}
            aria-live="polite"
            aria-atomic="true"
          >
            {currentPhrase}
          </span>
        </h1>

        <p className="hero-compact-description">
          One destination for UPSC preparation, geography, practice tests
          and current affairs. Learn consistently. Prepare with purpose.
        </p>

        <div className="hero-compact-actions">
          <a className="hero-compact-button hero-compact-primary" href={R.notes}>
            Explore resources <ArrowRight size={18} aria-hidden="true" />
          </a>
          <a
            className="hero-compact-button hero-compact-secondary"
            href={R.geographyNotes}
          >
            Begin with Geography <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>

                        <div className="hero-bhaskar-strip">
  <style>{`
    .hero-bhaskar-strip {
      width: 100%;
      max-width: 100%;
      margin: 12px auto 0;
      padding: 8px 12px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      gap: 16px;
      box-sizing: border-box;
      background: rgba(7, 35, 27, .42);
      overflow: hidden;
    }
    .hero-bhaskar-kicker {
      flex: 0 0 auto;
      color: #c6b47a;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1.5px;
      white-space: nowrap;
    }
    .hero-bhaskar-id-block {
      display: inline-flex;
      flex: 0 1 auto;
      flex-direction: row;
      align-items: baseline;
      gap: 6px;
      white-space: nowrap;
      pointer-events: none;
    }
    .hero-bhaskar-wordmark {
      color: #fff;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: .35px;
      line-height: 1;
      white-space: nowrap;
    }
    .hero-bhaskar-id {
      color: #d7ddda;
      font-size: 8px;
      font-weight: 500;
      letter-spacing: .1px;
      white-space: nowrap;
    }
    .hero-startup-link {
      display: inline-flex;
      flex: 0 0 auto;
      align-items: center;
      text-decoration: none;
      line-height: 0;
    }
    .hero-startup-logo {
      display: block;
      width: 86px;
      height: 28px;
      object-fit: contain;
      background: #fff;
      padding: 3px 5px;
      border-radius: 3px;
      box-sizing: border-box;
    }
    @media(max-width:480px) {
      .hero-bhaskar-strip { gap: 9px; padding: 8px 4px; }
      .hero-bhaskar-kicker { font-size: 8px; letter-spacing: 1px; }
      .hero-bhaskar-id-block { gap: 4px; }
      .hero-bhaskar-wordmark { font-size: 11px; }
      .hero-bhaskar-id { font-size: 7px; }
      .hero-startup-logo { width: 70px; height: 25px; }
    }
  `}</style>

  <span className="hero-bhaskar-kicker">BACKED BY</span>

  <div className="hero-bhaskar-id-block" aria-label="BHASKAR ID IN-1026-9561VP">
    <span className="hero-bhaskar-wordmark">BHASKAR</span>
    <span className="hero-bhaskar-id">IN-1026-9561VP</span>
  </div>

  <a
    className="hero-startup-link"
    href="https://www.startupindia.gov.in/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Visit Startup India"
  >
    <img
      className="hero-startup-logo"
      src="/images/startup-india-logo.png"
      alt="Startup India"
      width="86"
      height="28"
    />
  </a>
</div>
<div className="hero-compact-proof" aria-label="Available resources">
          <span><CheckCircle2 size={15} aria-hidden="true" /> Study notes</span>
          <i aria-hidden="true" />
          <span>Geography & maps</span>
          <i aria-hidden="true" />
          <span>Practice tests</span>
          <i aria-hidden="true" />
          <span>Current affairs</span>
        </div>

        {showScrollCue && (
<button
          type="button"
          className="scroll-cue hero-compact-scroll"
          aria-label="Scroll to the next section"
          onClick={() => {
            document.getElementById('top')?.nextElementSibling?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }}
        >
          <span className="scroll-cue-mouse" aria-hidden="true">
            <span className="scroll-cue-wheel" />
          </span>
          <span className="scroll-cue-chevron" aria-hidden="true" />
        </button>
      )}
      </div>
    </section>
  )
}