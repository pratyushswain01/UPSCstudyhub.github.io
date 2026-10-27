import { useEffect } from 'react'

/** Adds `.is-in` to `.reveal` elements as they scroll into view. Content stays visible if observers are unavailable. */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    els.forEach((el) => io.observe(el))
    // Safety net: never leave content hidden.
    const t = window.setTimeout(() => els.forEach((el) => el.classList.add('is-in')), 2500)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [])
}
