import { R } from './routes'

export type Link = { label: string; href: string; note?: string }

export const nav: Link[] = [
  { label: 'Resources', href: '#resources' },
  { label: 'Geography & Maps', href: '#geography' },
  { label: 'Practice', href: '#practice' },
  { label: 'Current Affairs', href: '#current-affairs' },
  { label: 'Learning Games', href: '#games' },
  { label: 'App', href: '#app' },
]

/** "What's on the site" index: a map of real destinations, not a personalised dashboard. */
export const siteIndex: { no: string; title: string; text: string; href: string }[] = [
  { no: '01', title: 'Syllabus', text: 'The UPSC syllabus page, to anchor what you study.', href: R.syllabus },
  { no: '02', title: 'Notes hub', text: 'Subject-wise notes, PYQ and GS paper shortcuts.', href: R.notes },
  { no: '03', title: 'Geography notes', text: 'NCERT Classes 8 to 11 and Majid Husain, by chapter.', href: R.geographyNotes },
  { no: '04', title: 'World map practice', text: 'Choose a continent and answer one-dot mapping questions.', href: R.mapPractice },
  { no: '05', title: 'Daily tests', text: 'Geography daily test series with an archive and filters.', href: R.geographyTests },
  { no: '06', title: 'Learning games', text: 'Chapter-wise practice in six subjects, no sign-up.', href: R.games },
  { no: '07', title: 'Study planner', text: 'A month-by-month planner and a UPSC 2028 planner.', href: R.planner },
  { no: '08', title: 'Android app', text: 'Download page with install steps and a checksum.', href: R.download },
]

export const resources: { lead: Link & { text: string }; list: Link[] } = {
  lead: {
    label: 'Open the notes hub',
    href: R.notes,
    text:
      'The notes hub gathers books and magazines, previous-year questions, Prelims and Mains GS papers and subject-wise notes (Polity, Geography, History, Economy, Environment, Science and Technology, IR) under one page.',
  },
  list: [
    { label: 'UPSC syllabus', href: R.syllabus, note: 'The reference point for everything else' },
    { label: 'GS Prelims', href: R.prelims, note: 'Paper-wise preparation resources' },
    { label: 'Mains syllabus', href: R.mains, note: 'GS Papers I to IV' },
    { label: 'CSAT', href: R.csat, note: 'Aptitude and reasoning practice material' },
    { label: 'Essay writing guide', href: R.essay, note: 'Structure and approach for the essay paper' },
    { label: 'Answer writing', href: R.answerWriting, note: 'Mains answer-writing practice page' },
    { label: 'PDF viewer', href: R.pdfViewer, note: 'Read study PDFs in the browser' },
  ],
}

export const geo = {
  books: ['NCERT Class VIII', 'NCERT Class IX', 'NCERT Class X', 'NCERT Class XI', 'Majid Husain', 'Majid Husain'],
  continents: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Australia'],
  links: [
    { label: 'Geography notes', href: R.geographyNotes, note: 'Pick a book, choose a chapter, start reading' },
    { label: 'World map practice', href: R.mapPractice, note: 'Select a continent and mark the places asked' },
    { label: 'Geography daily tests', href: R.geographyTests, note: 'MCQs across physical, Indian and world geography' },
  ] as Link[],
}

export const practice: { title: string; text: string; href: string; cta: string }[] = [
  {
    title: 'Geography daily test series',
    text: 'One topic a day in MCQ form, with a test archive, filters for topic, difficulty and status, and a performance view. Sample tests are labelled on the page.',
    href: R.geographyTests,
    cta: 'Open the series',
  },
  {
    title: 'Daily current-affairs test',
    text: 'A timed current-affairs test with a countdown, built for a short daily attempt.',
    href: R.caTest,
    cta: 'Take the test',
  },
  {
    title: 'Polity test series',
    text: 'Polity daily tests and a standalone Polity test, taken in the browser.',
    href: R.polityMock,
    cta: 'Start Polity practice',
  },
  {
    title: 'Subject-wise test series',
    text: 'A listing of tests across Polity, Current Affairs, Geography and History.',
    href: R.testSeries,
    cta: 'See the test list',
  },
  {
    title: 'Revision tools',
    text: 'A revision page for mind maps, short notes, smart cards and a revision test.',
    href: R.revision,
    cta: 'Go to revision',
  },
]

export const currentAffairs: Link[] = [
  { label: 'Weekly magazine archive', href: R.magazine, note: 'Browse weekly current-affairs issues; preview or download each one' },
  { label: 'Daily newspaper page', href: R.dailyNews, note: 'A news-summary page built for quick daily reading' },
  { label: 'Current-affairs test', href: R.caTest, note: 'Check what you retained with a timed test' },
]

export const gameSubjects = ['Indian Polity', 'Geography', 'History', 'Economy', 'Environment', 'CSAT']
export const gameModes: { title: string; text: string }[] = [
  { title: 'Quick practice', text: 'Short multiple-choice drills with an explanation after every answer.' },
  { title: 'Timed rounds', text: 'The same questions against the clock.' },
  { title: 'Boss challenge', text: 'Harder questions, three lives.' },
  { title: 'Fill in the blanks', text: 'Recall the missing term.' },
  { title: 'Sort into groups', text: 'Place concepts in the right category.' },
  { title: 'Rapid true or false', text: 'Sixty seconds of quick judgement calls.' },
  { title: 'Chronology ordering', text: 'Arrange events in sequence.' },
  { title: 'Match the pairs', text: 'Join terms to their meanings.' },
  { title: 'Memory cards', text: 'Flip and match.' },
  { title: 'Review mistakes', text: 'Replay only what you got wrong.' },
  { title: 'Daily challenge', text: 'One fresh set each day.' },
]

/** Add real screenshots later: put images in website/public/app-tour/ and list them here. */
export const appScreens: { src: string; alt: string; caption: string }[] = []

export const appSlots = [
  { caption: 'Home screen', hint: 'Add a screenshot of the app home' },
  { caption: 'Notes and reading', hint: 'Add a screenshot of a notes page' },
  { caption: 'Practice', hint: 'Add a screenshot of a test or game' },
]

export const installSteps = [
  'Open the download page on your Android phone.',
  'Tap the APK download and wait for it to finish.',
  'Open the file and, if Android asks, allow installation from your browser.',
  'Optional: compare the SHA-256 checksum shown on the download page.',
]

export const why: { title: string; text: string }[] = [
  {
    title: 'Chapter by chapter, not a pile of PDFs',
    text: 'Geography notes are organised by book and chapter, so you can see where you are in NCERT or Majid Husain and pick the next chapter without searching.',
  },
  {
    title: 'Reading sits next to practice',
    text: 'Read a topic, then test it in the daily test series, on the map page or as a game. The pages link to one another so revision does not need a new search.',
  },
  {
    title: 'Low friction to begin',
    text: 'The games need no sign-up and keep progress in your browser. Geography notes offer a guest option. You can start studying before deciding anything else.',
  },
  {
    title: 'Plain about its limits',
    text: 'UPSC Gurukul is an independent study site. Game content is starter material that you should check against the source, and the pages say so.',
  },
]

export const faqs: { q: string; a: string }[] = [
  {
    q: 'Is UPSC Gurukul an official UPSC website or a coaching institute?',
    a: 'No. It is an independent study platform for UPSC Civil Services aspirants and is not affiliated with the Union Public Service Commission. Always confirm exam dates, notifications and eligibility on the official UPSC website.',
  },
  {
    q: 'Do I need an account to start?',
    a: 'Not for the learning games, which need no sign-up. The Geography notes let you log in or continue as a guest. Other pages may work differently, and each page shows what it needs.',
  },
  {
    q: 'Where is my progress saved?',
    a: 'In the games, progress stays in your own browser. The Geography daily tests keep progress in an anonymous cloud record tied to your browser, with a copy kept on your device. Clearing browser data can remove local progress.',
  },
  {
    q: 'Which Geography books are covered?',
    a: 'The Geography notes cover NCERT Classes 8 to 11 and two Majid Husain titles from McGraw Hill, organised by chapter.',
  },
  {
    q: 'Are the game questions verified?',
    a: 'The games ship with starter content that is still being reviewed, and some chapters say that questions are being added. Treat the explanations as a study aid and check important facts against the source.',
  },
  {
    q: 'Is there an Android app?',
    a: 'Yes. The download page offers the Android APK with install steps and a SHA-256 checksum. Install only files you trust, and download from the official page.',
  },
  {
    q: 'How are privacy and cookie choices handled?',
    a: 'The site uses a consent manager for analytics and advertising choices. The Privacy Policy, Terms of Use and Data Rights pages are linked in the footer of every page.',
  },
  {
    q: 'I found a mistake. How do I report it?',
    a: 'Use the contact page. Corrections to notes, tests and game explanations are welcome.',
  },
]

export const footerCols: { title: string; links: Link[] }[] = [
  {
    title: 'Learn',
    links: [
      { label: 'Notes hub', href: R.notes },
      { label: 'Syllabus', href: R.syllabus },
      { label: 'Geography notes', href: R.geographyNotes },
      { label: 'Mains and Prelims', href: R.mains },
      { label: 'Essay guide', href: R.essay },
    ],
  },
  {
    title: 'Practice',
    links: [
      { label: 'Geography daily tests', href: R.geographyTests },
      { label: 'World map practice', href: R.mapPractice },
      { label: 'Current-affairs test', href: R.caTest },
      { label: 'Test series', href: R.testSeries },
      { label: 'Learning games', href: R.games },
    ],
  },
  {
    title: 'Plan',
    links: [
      { label: 'Study planner', href: R.planner },
      { label: 'UPSC 2028 planner', href: R.planner2028 },
      { label: 'Focus timer', href: R.focusTimer },
      { label: 'Magazine archive', href: R.magazine },
      { label: 'Android app', href: R.download },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: R.about },
      { label: 'Contact', href: R.contact },
      { label: 'Privacy policy', href: R.privacy },
      { label: 'Terms of use', href: R.terms },
      { label: 'Data rights', href: R.dataRights },
    ],
  },
]
