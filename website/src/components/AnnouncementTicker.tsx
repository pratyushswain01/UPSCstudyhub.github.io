import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Bell, Pause, Play } from 'lucide-react'

const announcements = [
  { label: 'RESOURCES', message: 'Explore UPSC preparation resources', href: '#resources', tone: 'resource' },
  { label: 'GEOGRAPHY', message: 'Practise geography and map skills', href: '#geography', tone: 'geography' },
  { label: 'PRACTICE', message: 'Build consistency with practice tests', href: '#practice', tone: 'practice' },
  { label: 'CURRENT AFFAIRS', message: 'Visit the current affairs section', href: '#current-affairs', tone: 'current' },
] as const

export default function AnnouncementTicker() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const [paused, setPaused] = useState(false)

  const setPauseState = (value: boolean) => {
    pausedRef.current = value
    setPaused(value)
  }

  useEffect(() => {
    const viewport = viewportRef.current
    const group = groupRef.current
    if (!viewport || !group) return

    let animationFrame = 0
    let previousTime = 0

    const tick = (time: number) => {
      animationFrame = window.requestAnimationFrame(tick)

      if (!previousTime) {
        previousTime = time
        return
      }

      const delta = Math.min(time - previousTime, 50)
      previousTime = time

      if (pausedRef.current || document.hidden) return

      const loopWidth = group.scrollWidth
      if (loopWidth <= 0) return

      // Move right-to-left at 35 pixels per second.
      viewport.scrollLeft += (35 * delta) / 1000

      // Reset at exactly one group's width for a seamless loop.
      if (viewport.scrollLeft >= loopWidth) {
        viewport.scrollLeft -= loopWidth
      }
    }

    animationFrame = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(animationFrame)
  }, [])

  const renderItems = (duplicate = false) =>
    announcements.map((item) => (
      <a
        className={`announcement-ticker-item ${item.tone}`}
        href={item.href}
        key={`${duplicate ? 'copy-' : ''}${item.label}`}
        tabIndex={duplicate ? -1 : undefined}
        aria-hidden={duplicate || undefined}
      >
        <span className="announcement-ticker-chip">{item.label}</span>
        <span>{item.message}</span>
        <ArrowRight size={13} className="announcement-ticker-arrow" aria-hidden="true" />
      </a>
    ))

  return (
    <section
      className="announcement-ticker"
      aria-label="Explore UPSC Gurukul"
      onMouseEnter={() => setPauseState(true)}
      onMouseLeave={() => setPauseState(false)}
      onFocusCapture={() => setPauseState(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPauseState(false)
        }
      }}
    >
      <style>{`
        .announcement-ticker {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          padding: 8px max(12px, calc((100% - 1180px) / 2));
          background: #f8faf9;
          border-top: 1px solid #e7ece9;
          border-bottom: 1px solid #e7ece9;
          color: #182c25;
        }

        .announcement-ticker-label {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 0 0 auto;
          color: #34594a;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .8px;
          white-space: nowrap;
        }

        .announcement-ticker-label svg { color: #239b60; }

        .announcement-ticker-viewport {
          flex: 1 1 auto;
          min-width: 0;
          overflow-x: auto;
          overflow-y: hidden;
          overscroll-behavior-x: contain;
          scrollbar-width: thin;
          scrollbar-color: #b8c9bf transparent;
          cursor: grab;
          touch-action: pan-x;
        }

        .announcement-ticker-viewport:active { cursor: grabbing; }

        .announcement-ticker-track {
          display: flex;
          width: max-content;
          align-items: center;
          flex-wrap: nowrap;
        }

        .announcement-ticker-group {
          display: flex;
          flex: 0 0 auto;
          align-items: center;
          flex-wrap: nowrap;
          gap: 9px;
          padding-right: 9px;
        }

        .announcement-ticker-item {
          display: inline-flex;
          flex: 0 0 auto;
          align-items: center;
          gap: 7px;
          padding: 6px 9px;
          border-radius: 4px;
          color: #273a32;
          text-decoration: none;
          font-size: 12px;
          line-height: 1.4;
          white-space: nowrap;
        }

        .announcement-ticker-item:hover {
          filter: brightness(.96);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .announcement-ticker-item:focus-visible {
          outline: 2px solid #198754;
          outline-offset: 2px;
        }

        .announcement-ticker-chip {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .5px;
        }

        .announcement-ticker-item.resource { background: #f8e6d6; }
        .announcement-ticker-item.resource .announcement-ticker-chip { color: #88542c; }
        .announcement-ticker-item.geography { background: #e2f3df; }
        .announcement-ticker-item.geography .announcement-ticker-chip { color: #246a39; }
        .announcement-ticker-item.practice { background: #e4eaff; }
        .announcement-ticker-item.practice .announcement-ticker-chip { color: #354d9b; }
        .announcement-ticker-item.current { background: #fff0c8; }
        .announcement-ticker-item.current .announcement-ticker-chip { color: #805b13; }

        .announcement-ticker-arrow { color: #75867e; flex: 0 0 auto; }

        .announcement-ticker-toggle {
          display: inline-flex;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          padding: 0;
          border: 1px solid #dce5df;
          border-radius: 50%;
          background: transparent;
          color: #34594a;
          cursor: pointer;
        }

        .announcement-ticker-toggle:focus-visible {
          outline: 2px solid #198754;
          outline-offset: 2px;
        }

        @media(max-width: 640px) {
          .announcement-ticker { gap: 7px; padding: 7px 8px; }
          .announcement-ticker-label { gap: 4px; font-size: 9px; letter-spacing: .3px; }
          .announcement-ticker-item { gap: 5px; padding: 6px 7px; font-size: 11px; }
          .announcement-ticker-chip { font-size: 8px; }
          .announcement-ticker-toggle { width: 25px; height: 25px; }
        }
      `}</style>

      <div className="announcement-ticker-label">
        <Bell size={14} aria-hidden="true" />
        <span>EXPLORE</span>
      </div>

      <div
        className="announcement-ticker-viewport"
        ref={viewportRef}
        aria-label="UPSC Gurukul announcements; scroll horizontally to browse"
        onWheel={(event) => {
          if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            event.currentTarget.scrollLeft += event.deltaY
          }
        }}
      >
        <div className="announcement-ticker-track">
          <div className="announcement-ticker-group" ref={groupRef}>
            {renderItems()}
          </div>
          <div className="announcement-ticker-group" aria-hidden="true">
            {renderItems(true)}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="announcement-ticker-toggle"
        aria-label={paused ? 'Resume automatic scrolling' : 'Pause automatic scrolling'}
        title={paused ? 'Resume scrolling' : 'Pause scrolling'}
        onClick={() => setPauseState(!pausedRef.current)}
      >
        {paused
          ? <Play size={13} aria-hidden="true" />
          : <Pause size={13} aria-hidden="true" />}
      </button>
    </section>
  )
}