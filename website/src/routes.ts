/**
 * Every destination below is an existing page in the repository root.
 * `npm run check:links` fails if any of them goes missing.
 * Paths are root-absolute because the site is served from upscgurukul.online/.
 */
export const R = {
  // Study resources
  notes: '/notes.html',
  syllabus: '/syllabusUPSC.html',
  mains: '/mains.html',
  prelims: '/GSprelims.html',
  csat: '/CSAT.html',
  essay: '/essay.html',
  answerWriting: '/AnswerWriting/answerwriting.html',
  pdfViewer: '/pdfviewer.html',
  // Geography & maps
  geographyNotes: '/geography/index.html',
  geographyTests: '/geography/daily_test/index.html',
  mapPractice: '/mapping.html',
  // Practice
  testSeries: '/testseries.html',
  polityMock: '/UPSChubmock.html',
  polityTest: '/politytest.html',
  caTest: '/catest.html',
  revision: '/revision.html',
  // Planning
  planner: '/planner.html',
  planner2028: '/UPSC2028/index.html',
  focusTimer: '/focustimer.html',
  // Current affairs
  magazine: '/magazine.html',
  dailyNews: '/newsupdate.html',
  // Games & app
  games: '/games/index.html',
  download: '/download.html',
  // Company & legal
  about: '/about.html',
  contact: '/contact.html',
  privacy: '/privacy.html',
  terms: '/terms.html',
  dataRights: '/data-rights.html',
} as const

export type RouteKey = keyof typeof R
