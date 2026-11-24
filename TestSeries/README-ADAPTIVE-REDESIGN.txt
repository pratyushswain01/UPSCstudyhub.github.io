UPSC GURUKUL — ADAPTIVE NEUTRAL UI

This package adds a shared responsive visual layer to the supplied TestSeries HTML pages.
Design decisions:
- iPhone: compact native-feeling bottom navigation (existing dashboard footer nav is retained)
- iPad: persistent sidebar and split-view content
- Desktop: persistent sidebar and expanded content area
- Appearance: neutral system light/dark, with existing explicit .dark toggles retained

IMPORTANT
This is a visual-system integration pass over the supplied source files, not a rewrite of Firebase, authentication, Razorpay, exam evaluation, timers, or backend code. Test all page flows in a staging deployment before publishing. Some legacy pages have different markup and need page-by-page functional QA and potential follow-up layout work.

The original ZIP contained historic .bak files. They are excluded from the redesign package.
The original production base URL is removed from HTML to prevent local relative URLs from resolving against GitHub Pages. Existing scripts and service worker files are retained.
