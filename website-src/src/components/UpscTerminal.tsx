import { useEffect, useMemo, useState } from 'react'
import {
  Play, Pause, RotateCcw, SkipForward, Terminal as TerminalIcon,
  BookOpen, CheckCircle2, Circle,
  Maximize2, X, Activity, GraduationCap, Target, Clock3
} from 'lucide-react'

type Stage = 'overview' | 'prelims' | 'mains' | 'interview' | 'workflow'

type CommandLine = {
  command: string
  output: string[]
}

const recordings: Record<Stage, CommandLine[]> = {
  overview: [
    { command: 'Get-ExamOverview -Exam CSE', output: [
      '[OK] UPSC = Union Public Service Commission.',
      '[OK] CSE = Civil Services Examination.',
      '[INFO] Recruitment to IAS, IPS, Indian Foreign Service and other notified services.',
      '[INFO] Selection: Preliminary Examination -> Main Examination -> Personality Test.',
      '[INFO] Prelims is a screening stage; its marks do not count towards final merit.',
    ] },
    { command: 'Get-ExamPattern', output: [
      '[OK] Prelims: General Studies Paper I — 200 marks.',
      '[OK] Prelims: General Studies Paper II (CSAT) — 200 marks, qualifying at 33%.',
      '[OK] Mains: 9 written papers; 7 count for merit, 2 are qualifying.',
      '[OK] Written merit: 1,750 marks.',
      '[OK] Personality Test: 275 marks.',
      '[OK] Final merit total: 2,025 marks.',
    ] },
    { command: 'Get-PreparationPlan -Mode Complete', output: [
      '[PLAN] Understand syllabus and previous-year questions.',
      '[PLAN] Build foundations with NCERTs and standard resources.',
      '[PLAN] Integrate current affairs with static subjects.',
      '[PLAN] Practise MCQs, CSAT, answer writing and essay.',
      '[PLAN] Revise repeatedly and analyse mock-test mistakes.',
    ] },
  ],
  prelims: [
    { command: 'Get-Syllabus -Stage Prelims -Paper GS1', output: [
      '[200 MARKS] General Studies Paper I.',
      '[SUBJECT] Current events of national and international importance.',
      '[SUBJECT] History of India and Indian National Movement.',
      '[SUBJECT] Indian and World Geography: physical, social and economic geography.',
      '[SUBJECT] Indian Polity and Governance: Constitution, political system, Panchayati Raj, public policy and rights issues.',
      '[SUBJECT] Economic and Social Development: sustainable development, poverty, inclusion, demographics and social-sector initiatives.',
      '[SUBJECT] Environment, biodiversity and climate-change-related issues.',
      '[SUBJECT] General Science.',
      '[NOTE] Official notification does not assign a fixed marks quota to each topic.',
    ] },
    { command: 'Get-Syllabus -Stage Prelims -Paper CSAT', output: [
      '[200 MARKS] General Studies Paper II (CSAT).',
      '[QUALIFYING] Minimum 33% of the paper.',
      '[SUBJECT] Comprehension.',
      '[SUBJECT] Interpersonal skills, including communication skills.',
      '[SUBJECT] Logical reasoning and analytical ability.',
      '[SUBJECT] Decision-making and problem-solving.',
      '[SUBJECT] General mental ability.',
      '[SUBJECT] Basic numeracy and data interpretation, approximately Class X level.',
      '[RULE] Both Prelims papers must be attended as prescribed by the notification.',
      '[RULE] Prelims marks are not added to final merit.',
    ] },
    { command: 'Get-PrelimsScoringRules', output: [
      '[INFO] Paper I determines screening cut-off, subject to the official rules.',
      '[INFO] CSAT is qualifying; score at least 33%.',
      '[INFO] Objective questions carry negative marking under the notified scheme.',
      '[INFO] Use the applicable examination-year notification for exact instructions.',
    ] },
  ],
  mains: [
    { command: 'Get-Syllabus -Stage Mains -Marks', output: [
      '[QUALIFYING] Paper A: one Indian language — 300 marks.',
      '[QUALIFYING] Paper B: English — 300 marks.',
      '[MERIT] Essay — 250 marks.',
      '[MERIT] General Studies I — 250 marks.',
      '[MERIT] General Studies II — 250 marks.',
      '[MERIT] General Studies III — 250 marks.',
      '[MERIT] General Studies IV — 250 marks.',
      '[MERIT] Optional Subject Paper I — 250 marks.',
      '[MERIT] Optional Subject Paper II — 250 marks.',
      '[TOTAL] Written merit papers = 1,750 marks.',
      '[NOTE] Qualifying language-paper marks do not count towards written merit.',
    ] },
    { command: 'Get-Syllabus -Stage Mains -Paper GS1', output: [
      '[GS1] Indian culture: art forms, literature and architecture.',
      '[GS1] Modern Indian history and freedom struggle.',
      '[GS1] Post-independence consolidation and reorganisation.',
      '[GS1] World history from the eighteenth century onward.',
      '[GS1] Indian society, diversity, women, population, poverty and urbanisation.',
      '[GS1] Globalisation and social empowerment.',
      '[GS1] Physical geography of the world.',
      '[GS1] Distribution of natural resources and geophysical phenomena.',
    ] },
    { command: 'Get-Syllabus -Stage Mains -Paper GS2', output: [
      '[GS2] Indian Constitution, historical underpinnings and evolution.',
      '[GS2] Union, states, federalism, Parliament and state legislatures.',
      '[GS2] Executive, judiciary, ministries, pressure groups and representation.',
      '[GS2] Constitutional, statutory and regulatory bodies.',
      '[GS2] Government policies, welfare schemes and development processes.',
      '[GS2] Governance, transparency, accountability and e-governance.',
      '[GS2] India and its neighbourhood, bilateral and global relations.',
      '[GS2] International institutions and forums.',
    ] },
    { command: 'Get-Syllabus -Stage Mains -Paper GS3', output: [
      '[GS3] Indian economy, planning, resource mobilisation and inclusive growth.',
      '[GS3] Government budgeting, agriculture, irrigation and food management.',
      '[GS3] Food processing, land reforms, infrastructure and investment models.',
      '[GS3] Science and technology, innovation and indigenisation.',
      '[GS3] Environment, conservation, pollution and disaster management.',
      '[GS3] Internal security, cyber security, organised crime and border management.',
    ] },
    { command: 'Get-Syllabus -Stage Mains -Paper GS4', output: [
      '[GS4] Ethics and human interface.',
      '[GS4] Human values, attitude and aptitude.',
      '[GS4] Emotional intelligence and contributions of moral thinkers.',
      '[GS4] Public-service ethics, probity, accountability and transparency.',
      '[GS4] Codes of ethics, codes of conduct and citizen charters.',
      '[GS4] Case studies involving ethical dilemmas and public administration.',
    ] },
    { command: 'Get-Syllabus -Stage Mains -OtherPapers', output: [
      '[ESSAY] Multiple topics; coherent argument, relevance and structured expression.',
      '[OPTIONAL] Two papers from one optional subject selected from the notified list.',
      '[LANGUAGE] Indian-language and English qualifying papers test prescribed language skills.',
      '[ANSWER WRITING] Practise relevance, structure, examples, balance and time management.',
      '[NOTE] Consult the annual notification for complete paper instructions and exemptions.',
    ] },
  ],
  interview: [
    { command: 'Get-Syllabus -Stage PersonalityTest', output: [
      '[275 MARKS] Personality Test / Interview.',
      '[ASSESS] Suitability for public service and intellectual qualities.',
      '[ASSESS] Mental alertness, critical powers of assimilation and clear exposition.',
      '[ASSESS] Balance of judgement, variety and depth of interest.',
      '[ASSESS] Social cohesion, leadership, integrity and intellectual and moral qualities.',
      '[PREPARE] Detailed Application Form (DAF), home state, education and work history.',
      '[PREPARE] Current issues, ethical judgement and reasoned opinions.',
      '[NOTE] It is a personality assessment, not another written syllabus paper.',
    ] },
    { command: 'Get-FinalMerit', output: [
      '[CALC] Written merit: 1,750 marks.',
      '[CALC] Personality Test: 275 marks.',
      '[TOTAL] Final merit = 2,025 marks.',
      '[EXCLUDE] Prelims marks and qualifying language-paper marks are not added.',
      '[NOTICE] Eligibility, category rules and service allocation follow official rules.',
    ] },
  ],
  workflow: [
    { command: 'Start-PreparationWorkflow -Mode Sustainable', output: [
      '[01] Read the official notification and understand eligibility.',
      '[02] Print or bookmark the official syllabus; analyse previous-year questions.',
      '[03] Build NCERT and foundational subject knowledge.',
      '[04] Read current affairs and connect issues to syllabus themes.',
      '[05] Practise Prelims MCQs and qualifying CSAT consistently.',
      '[06] Prepare Mains notes, essays and timed answers in parallel.',
      '[07] Study the optional subject with a syllabus-led plan.',
      '[08] Maintain revision cycles and an error log.',
      '[09] Take timed mocks; analyse mistakes instead of tracking score alone.',
      '[10] Prepare DAF, communication and judgement for the Personality Test.',
      '[DONE] Sustainable preparation plan loaded. Progress remains yours to track.',
    ] },
  ],
}

const stageNames: { id: Stage; title: string; subtitle: string }[] = [
  { id: 'overview', title: 'UPSC overview', subtitle: 'What is CSE?' },
  { id: 'prelims', title: 'Prelims syllabus', subtitle: '400 paper marks' },
  { id: 'mains', title: 'Mains syllabus', subtitle: '1,750 merit marks' },
  { id: 'interview', title: 'Personality Test', subtitle: '275 marks' },
  { id: 'workflow', title: 'Preparation workflow', subtitle: 'Your action plan' },
]

const TASKS = [
  'Read the official CSE notification and syllabus',
  'Analyse at least 5 years of previous-year questions',
  'Build a subject-wise NCERT reading plan',
  'Set a daily current-affairs and revision routine',
  'Practise Prelims GS Paper I MCQs',
  'Practise CSAT comprehension and numeracy',
  'Write timed Mains answers every week',
  'Prepare essay outlines and practise full essays',
  'Create and revise optional-subject notes',
  'Maintain a mock-test error log',
]

const STORAGE_KEY = 'upscgurukul-terminal-v1'

type Saved = { tasks: string[]; mocks: { date: string; score: string; note: string }[] }

function readSaved(): Saved {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value) return JSON.parse(value) as Saved
  } catch { /* browser storage may be unavailable */ }
  return { tasks: [], mocks: [] }
}

export default function UpscTerminal() {
  const [stage, setStage] = useState<Stage>('overview')
  const [lineIndex, setLineIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [saved, setSaved] = useState<Saved>(() => readSaved())
  const [mockScore, setMockScore] = useState('')
  const [mockNote, setMockNote] = useState('')
  const [activePanel, setActivePanel] = useState<'syllabus' | 'tasks' | 'analytics'>('syllabus')

  const lines = useMemo(() => recordings[stage], [stage])
  const flattened = useMemo(() => lines.flatMap((entry) => [
    { text: `PS UPSC-GURUKUL> ${entry.command}`, command: true },
    ...entry.output.map((text) => ({ text, command: false })),
  ]), [lines])
  const visibleLines = flattened.slice(0, lineIndex)
  const done = saved.tasks.length
  const progress = Math.round((done / TASKS.length) * 100)

  useEffect(() => {
    if (!playing || lineIndex >= flattened.length) return
    const timer = window.setTimeout(() => setLineIndex((value) => value + 1), flattened[lineIndex]?.command ? 460 : 170)
    return () => window.clearTimeout(timer)
  }, [playing, lineIndex, flattened])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)) } catch { /* keep session usable */ }
  }, [saved])

  function chooseStage(next: Stage) {
    setStage(next)
    setLineIndex(0)
    setPlaying(true)
  }

  function toggleTask(task: string) {
    setSaved((current) => ({
      ...current,
      tasks: current.tasks.includes(task) ? current.tasks.filter((item) => item !== task) : [...current.tasks, task],
    }))
  }

  function addMock() {
    if (!mockScore.trim()) return
    setSaved((current) => ({
      ...current,
      mocks: [...current.mocks, { date: new Date().toLocaleDateString(), score: mockScore.trim(), note: mockNote.trim() }].slice(-30),
    }))
    setMockScore('')
    setMockNote('')
  }

  return (
    <section className="ugt-section wrap" id="upsc-terminal" aria-labelledby="ugt-title">
      <div className="ugt-intro">
        <span className="ugt-kicker">THE UPSC PREPARATION ENGINE</span>
        <h2 id="ugt-title">Your preparation, <em>deconstructed.</em></h2>
        <p>Explore the examination like a command-line workflow: understand the rules, inspect the syllabus, then execute a realistic preparation plan.</p>
      </div>

      <div className={`ugt-terminal ${expanded ? 'ugt-expanded' : ''}`}>
        <div className="ugt-titlebar">
          <div className="ugt-lights" aria-hidden="true"><i /><i /><i /></div>
          <TerminalIcon size={16} />
          <span>UPSC-GURUKUL · PowerShell-style session</span>
          <button className="ugt-icon-button" onClick={() => setExpanded((value) => !value)} aria-label={expanded ? 'Close full-screen terminal' : 'Expand terminal'}>
            {expanded ? <X size={17} /> : <Maximize2 size={17} />}
          </button>
        </div>

        <div className="ugt-stage-tabs" role="tablist" aria-label="Terminal recordings">
          {stageNames.map((item) => (
            <button key={item.id} role="tab" aria-selected={stage === item.id} className={stage === item.id ? 'is-active' : ''} onClick={() => chooseStage(item.id)}>
              <span>{item.title}</span><small>{item.subtitle}</small>
            </button>
          ))}
        </div>

        <div className="ugt-screen" role="log" aria-live="polite" aria-label="Simulated terminal recording">
          <div className="ugt-screen-head"><span>Windows PowerShell · Simulation</span><span>UTF-8 · READ ONLY</span></div>
          {visibleLines.map((line, index) => (
            <div key={`${stage}-${index}`} className={line.command ? 'ugt-line ugt-command' : 'ugt-line'}>
              {line.command ? <span className="ugt-prompt">PS</span> : null}{line.text.replace(/^PS /, '')}
            </div>
          ))}
          {playing && lineIndex < flattened.length ? <span className="ugt-cursor" aria-hidden="true">▋</span> : null}
          {!playing && lineIndex < flattened.length ? <span className="ugt-paused">SESSION PAUSED</span> : null}
          {lineIndex >= flattened.length ? <div className="ugt-complete">[COMPLETE] Recording finished. Replay or choose another module.</div> : null}
        </div>

        <div className="ugt-controls">
          <button className="ugt-primary-control" onClick={() => {
            if (lineIndex >= flattened.length) setLineIndex(0)
            setPlaying(true)
          }}><Play size={15} /> {lineIndex >= flattened.length ? 'Replay recording' : 'Resume'}</button>
          <button onClick={() => setPlaying((value) => !value)} disabled={lineIndex >= flattened.length}>
            {playing ? <Pause size={15} /> : <Play size={15} />}{playing ? 'Pause' : 'Play'}
          </button>
          <button onClick={() => setLineIndex(flattened.length)}><SkipForward size={15} /> Show all</button>
          <button onClick={() => { setLineIndex(0); setPlaying(true) }}><RotateCcw size={15} /> Restart</button>
          <span className="ugt-line-count">{Math.min(lineIndex, flattened.length)} / {flattened.length} lines</span>
        </div>
      </div>

      <div className="ugt-visual-tree" aria-live="polite">
        <div className="ugt-tree-heading">
          <div>
            <span className="ugt-kicker">LIVE VISUALISATION</span>
            <h3>
              {stage === 'overview' ? 'The Civil Services Examination' :
               stage === 'prelims' ? 'Prelims syllabus map' :
               stage === 'mains' ? 'Mains paper architecture' :
               stage === 'interview' ? 'The final selection stage' :
               'Your preparation pipeline'}
            </h3>
          </div>
          <span className="ugt-tree-live"><i /> BUILDING THE MAP</span>
        </div>

        <div className="ugt-tree-root">
          <span className="ugt-tree-root-icon">
            {stage === 'workflow' ? <Activity size={22} /> :
             stage === 'interview' ? <GraduationCap size={22} /> :
             <BookOpen size={22} />}
          </span>
          <strong>
            {stage === 'overview' ? 'UPSC · CSE' :
             stage === 'prelims' ? 'PRELIMS · 400 PAPER MARKS' :
             stage === 'mains' ? 'MAINS · 1,750 MERIT MARKS' :
             stage === 'interview' ? 'PERSONALITY TEST · 275 MARKS' :
             'PREPARATION ENGINE'}
          </strong>
          <small>
            {stage === 'overview' ? 'Understand the selection process' :
             stage === 'prelims' ? 'Two papers · CSAT qualifying' :
             stage === 'mains' ? 'Qualifying papers separated from merit' :
             stage === 'interview' ? 'Final merit stage' :
             'Build knowledge · Practise · Revise'}
          </small>
        </div>

        <div className="ugt-tree-trunk" aria-hidden="true" />

        {stage === 'overview' ? (
          <div className="ugt-tree-branches">
            <article className="ugt-tree-card tree-blue">
              <span className="ugt-tree-number">01</span>
              <BookOpen size={21} />
              <strong>Preliminary Exam</strong>
              <b>400 paper marks</b>
              <small>GS I + qualifying CSAT</small>
            </article>
            <article className="ugt-tree-card tree-gold">
              <span className="ugt-tree-number">02</span>
              <GraduationCap size={21} />
              <strong>Main Exam</strong>
              <b>1,750 merit marks</b>
              <small>Written papers</small>
            </article>
            <article className="ugt-tree-card tree-green">
              <span className="ugt-tree-number">03</span>
              <Target size={21} />
              <strong>Personality Test</strong>
              <b>275 marks</b>
              <small>Final merit stage</small>
            </article>
          </div>
        ) : null}

        {stage === 'prelims' ? (
          <div className="ugt-tree-groups">
            <section className="ugt-tree-group">
              <h4><BookOpen size={16} /> GS PAPER I <span>200 marks</span></h4>
              <div className="ugt-tree-leaves">
                {['Current Affairs','History & Freedom Struggle','Geography','Polity & Governance','Economy & Development','Environment & Biodiversity','General Science'].map((item, i) => (
                  <div className="ugt-tree-leaf" style={{ '--tree-delay': `${i * 70}ms` } as React.CSSProperties} key={item}>
                    <i />{item}
                  </div>
                ))}
              </div>
            </section>
            <section className="ugt-tree-group tree-group-csat">
              <h4><Target size={16} /> CSAT PAPER II <span>200 marks</span></h4>
              <div className="ugt-tree-leaves">
                {['Comprehension','Logical Reasoning','Decision Making','Numeracy','Data Interpretation'].map((item, i) => (
                  <div className="ugt-tree-leaf" style={{ '--tree-delay': `${i * 70}ms` } as React.CSSProperties} key={item}>
                    <i />{item}
                  </div>
                ))}
              </div>
              <p className="ugt-tree-note">Qualifying paper · Minimum 33%</p>
            </section>
          </div>
        ) : null}

        {stage === 'mains' ? (
          <div className="ugt-tree-groups">
            <section className="ugt-tree-group tree-group-qualifying">
              <h4><BookOpen size={16} /> QUALIFYING PAPERS <span>Not in merit total</span></h4>
              <div className="ugt-tree-leaves">
                {['Paper A · Indian Language · 300','Paper B · English · 300'].map((item, i) => (
                  <div className="ugt-tree-leaf" style={{ '--tree-delay': `${i * 90}ms` } as React.CSSProperties} key={item}>
                    <i />{item}
                  </div>
                ))}
              </div>
            </section>
            <section className="ugt-tree-group tree-group-merit">
              <h4><GraduationCap size={16} /> MERIT-COUNTING PAPERS <span>1,750 marks</span></h4>
              <div className="ugt-tree-leaves">
                {['Essay · 250','General Studies I · 250','General Studies II · 250','General Studies III · 250','General Studies IV · 250','Optional Paper I · 250','Optional Paper II · 250'].map((item, i) => (
                  <div className="ugt-tree-leaf" style={{ '--tree-delay': `${i * 65}ms` } as React.CSSProperties} key={item}>
                    <i />{item}
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {stage === 'interview' ? (
          <div className="ugt-tree-branches">
            {[
              ['Awareness','Current issues & surroundings'],
              ['Judgement','Balanced and reasoned decisions'],
              ['Communication','Clear and coherent expression'],
              ['Integrity','Public-service values'],
            ].map(([title, detail], i) => (
              <article className="ugt-tree-card tree-green" style={{ '--tree-delay': `${i * 100}ms` } as React.CSSProperties} key={title}>
                <span className="ugt-tree-number">0{i + 1}</span>
                <Target size={21} />
                <strong>{title}</strong>
                <small>{detail}</small>
              </article>
            ))}
          </div>
        ) : null}

        {stage === 'workflow' ? (
          <div className="ugt-pipeline">
            {[
              ['01','Decode','Syllabus + PYQs'],
              ['02','Build','NCERT + core subjects'],
              ['03','Connect','Current affairs'],
              ['04','Practise','MCQs + answer writing'],
              ['05','Revise','Recall + error log'],
              ['06','Assess','Mocks + improvement'],
            ].map(([number, title, detail], i) => (
              <div className="ugt-pipeline-step" style={{ '--tree-delay': `${i * 110}ms` } as React.CSSProperties} key={number}>
                <span>{number}</span><strong>{title}</strong><small>{detail}</small>
              </div>
            ))}
          </div>
        ) : null}

        <p className="ugt-tree-footnote">
          <Activity size={14} />
          Visual map for learning and planning. Official topic-wise marks allocations are not fixed.
        </p>
      </div>
      <div className="ugt-dashboard">
        <div className="ugt-dash-heading">
          <div><span className="ugt-kicker">YOUR PERSONAL STUDY CONSOLE</span><h3>Turn the syllabus into action.</h3></div>
          <span className="ugt-local-label"><Activity size={15} /> Saved in this browser</span>
        </div>

        <div className="ugt-stats">
          <div><BookOpen size={18} /><span>Tasks completed</span><strong>{done}/{TASKS.length}</strong></div>
          <div><Target size={18} /><span>Workflow progress</span><strong>{progress}%</strong></div>
          <div><GraduationCap size={18} /><span>Mock records</span><strong>{saved.mocks.length}</strong></div>
        </div>
        <div className="ugt-progress"><span style={{ width: `${progress}%` }} /></div>

        <div className="ugt-panel-tabs">
          <button className={activePanel === 'syllabus' ? 'is-active' : ''} onClick={() => setActivePanel('syllabus')}>Exam structure</button>
          <button className={activePanel === 'tasks' ? 'is-active' : ''} onClick={() => setActivePanel('tasks')}>My checklist</button>
          <button className={activePanel === 'analytics' ? 'is-active' : ''} onClick={() => setActivePanel('analytics')}>Mock analytics</button>
        </div>

        {activePanel === 'syllabus' ? (
          <div className="ugt-exam-grid">
            <article><span>SCREENING · NOT IN FINAL MERIT</span><h4>Prelims GS Paper I</h4><strong>200 marks</strong><p>Current affairs, history, geography, polity, economy, environment and general science.</p></article>
            <article><span>QUALIFYING · 33% REQUIRED</span><h4>Prelims CSAT</h4><strong>200 marks</strong><p>Comprehension, reasoning, decision-making, numeracy and data interpretation.</p></article>
            <article><span>WRITTEN · MERIT</span><h4>Mains</h4><strong>1,750 marks</strong><p>Essay, GS I–IV and two optional papers. Two language papers are qualifying and excluded from merit.</p></article>
            <article><span>FINAL MERIT</span><h4>Personality Test</h4><strong>275 marks</strong><p>Judgement, awareness, communication, integrity and suitability for public service.</p></article>
            <p className="ugt-disclaimer">Official structure summary, not a replacement for the applicable annual UPSC notification. Topic-wise marks are not fixed by the official syllabus.</p>
          </div>
        ) : null}

        {activePanel === 'tasks' ? (
          <div className="ugt-task-list">
            {TASKS.map((task) => {
              const checked = saved.tasks.includes(task)
              return <label key={task} className={checked ? 'is-done' : ''}>
                <input type="checkbox" checked={checked} onChange={() => toggleTask(task)} />
                {checked ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                <span>{task}</span>
              </label>
            })}
            <button className="ugt-reset" onClick={() => {
              if (window.confirm('Reset all preparation checklist tasks?')) setSaved((current) => ({ ...current, tasks: [] }))
            }}>Reset checklist</button>
          </div>
        ) : null}

        {activePanel === 'analytics' ? (
          <div className="ugt-analytics">
            <p>Record your mock scores and a short note about what to improve. This is a personal log, not an official UPSC score prediction.</p>
            <div className="ugt-mock-form">
              <input value={mockScore} onChange={(event) => setMockScore(event.target.value)} placeholder="Score (e.g. 86/200)" aria-label="Mock score" />
              <input value={mockNote} onChange={(event) => setMockNote(event.target.value)} placeholder="Weak areas or lessons learned" aria-label="Mock notes" />
              <button onClick={addMock}>Add result</button>
            </div>
            {saved.mocks.length === 0 ? <p className="ugt-empty">No mock results recorded yet.</p> : (
              <div className="ugt-mock-list">
                {[...saved.mocks].reverse().map((mock, index) => <article key={`${mock.date}-${index}`}><strong>{mock.score}</strong><span>{mock.date}</span>{mock.note ? <p>{mock.note}</p> : null}</article>)}
                <button className="ugt-reset" onClick={() => {
                  if (window.confirm('Delete all mock-test records?')) setSaved((current) => ({ ...current, mocks: [] }))
                }}>Clear mock history</button>
              </div>
            )}
          </div>
        ) : null}
      </div>
      <p className="ugt-footnote"><Clock3 size={14} /> Your progress is stored locally on this device and browser. Clearing browser data may erase it.</p>
    </section>
  )
}