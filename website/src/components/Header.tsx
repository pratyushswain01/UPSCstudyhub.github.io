import { useEffect, useRef, useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { nav } from '../content'
import { R } from '../routes'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const btn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btn.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.classList.add('menu-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('menu-open')
    }
  }, [open])

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="wrap header-row">
        <a className="brand" href="#top" aria-label="UPSC Gurukul, home">
          <img className="header-logo-image" src="/images/upsc-gurukul-logo.png" alt="UPSC Gurukul" />
        </a>
        <nav className="nav-desktop" aria-label="Primary">
          {nav.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="btn btn-primary btn-sm" href={R.notes}>
            Start Learning
          </a>
          <button
            ref={btn}
            className="menu-btn"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <div id="mobile-menu" className={`mobile-menu${open ? ' is-open' : ''}`} hidden={!open}>
        <nav aria-label="Mobile">
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          ))}
        </nav>
        <a className="btn btn-primary btn-block" href={R.notes}>
          Start Learning
        </a>
      </div>
    </header>
  )
}
