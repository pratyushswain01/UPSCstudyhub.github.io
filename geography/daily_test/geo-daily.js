
/* =========================================================
   CENTRAL CONFIGURATION
   ========================================================= */
const CONFIG = {
  homeUrl: "/",
  testPageUrl: "./test-page.html",   // â† set to your actual test page filename
  timezone: "Asia/Kolkata",
  canonical: "https://upscgurukul.online/geography.html",

  /* -------------------------------------------------------
     FIREBASE CONFIG â€” REPLACE WITH YOUR PROJECT VALUES
     1. Go to Firebase Console â†’ Project Settings â†’ General
     2. Under "Your apps" copy the firebaseConfig object
     3. Enable Authentication â†’ Sign-in method â†’ Anonymous
     4. Enable Realtime Database (start in test mode, then
        tighten rules â€“ example rules are in the comment below)
     ------------------------------------------------------- */
  firebase: {
    apiKey: "AIzaSyBoPtr3d8se-fcGXkzixG8OE7dFvYjPcs4",
    authDomain: "upscstudyhub-github.firebaseapp.com",
    databaseURL: "https://upscstudyhub-github-default-rtdb.firebaseio.com",
    projectId: "upscstudyhub-github",
    storageBucket: "upscstudyhub-github.firebasestorage.app",
    messagingSenderId: "451692540885",
    appId: "1:451692540885:web:b425e85128e5de97c7c35c"
  },

  /*
   * Recommended Realtime Database rules (paste in Firebase Console):
   * {
   *   "rules": {
   *     "users": {
   *       "$uid": {
   *         ".read": "$uid === auth.uid",
   *         ".write": "$uid === auth.uid"
   *       }
   *     }
   *   }
   * }
   *
   * Path used:  users/{uid}/geoAttempts/{testId}
   * Shape:      { started?: bool, completed?: bool, score?: number, total?: number, at: number }
   *
   * The existing test engine should write to the same path when a student finishes.
   * Example (to be added inside the test page):
   *
   *   firebase.database().ref(`users/${uid}/geoAttempts/${testId}`).update({
   *     completed: true,
   *     score: correctCount,
   *     total: questionCount,
   *     at: Date.now()
   *   });
   */

  tests: [
    {
      id: "geo-daily-001",
      date: "2026-10-21",
      title: "Geography Daily Test â€” Physical Geography Fundamentals",
      topic: "Physical Geography",
      category: "PHYSICAL GEOGRAPHY",
      description: "Core concepts of the Earthâ€™s structure, landforms and basic geomorphic processes. Sample configuration for demonstration.",
      difficulty: "Moderate",
      questionCount: 20,
      durationMinutes: 25,
      maxMarks: 40,
      testUrl: "./test-page.html",
      status: "available",
      sample: true
    },
    {
      id: "geo-daily-002",
      date: "2026-10-20",
      title: "Geography Daily Test â€” Geomorphology",
      topic: "Geomorphology",
      category: "PHYSICAL GEOGRAPHY",
      description: "Landform evolution, weathering, erosion and depositional systems.",
      difficulty: "Moderate",
      questionCount: 20,
      durationMinutes: 25,
      maxMarks: 40,
      testUrl: "./test-page.html",
      status: "available",
      sample: true
    },
    {
      id: "geo-daily-003",
      date: "2026-10-19",
      title: "Geography Daily Test â€” Climatology Basics",
      topic: "Climatology",
      category: "PHYSICAL GEOGRAPHY",
      description: "Atmosphere, temperature, pressure belts and wind systems.",
      difficulty: "Easy",
      questionCount: 15,
      durationMinutes: 20,
      maxMarks: 30,
      testUrl: "./test-page.html",
      status: "available",
      sample: true
    },
    {
      id: "geo-daily-004",
      date: "2026-10-18",
      title: "Geography Daily Test â€” Oceanography",
      topic: "Oceanography",
      category: "PHYSICAL GEOGRAPHY",
      description: "Ocean currents, waves, tides and marine resources.",
      difficulty: "Moderate",
      questionCount: 20,
      durationMinutes: 25,
      maxMarks: 40,
      testUrl: "./test-page.html",
      status: "available",
      sample: true
    },
    {
      id: "geo-daily-005",
      date: "2026-10-17",
      title: "Geography Daily Test â€” Indian Physiography",
      topic: "Physiography",
      category: "INDIAN GEOGRAPHY",
      description: "Himalayas, Northern Plains, Peninsular Plateau and coastal regions.",
      difficulty: "Moderate",
      questionCount: 25,
      durationMinutes: 30,
      maxMarks: 50,
      testUrl: "./test-page.html",
      status: "available",
      sample: true
    },
    {
      id: "geo-daily-006",
      date: "2026-10-16",
      title: "Geography Daily Test â€” Indian Drainage Systems",
      topic: "Rivers and Drainage",
      category: "INDIAN GEOGRAPHY",
      description: "Himalayan and Peninsular river systems, basins and interlinking.",
      difficulty: "Hard",
      questionCount: 20,
      durationMinutes: 25,
      maxMarks: 40,
      testUrl: "./test-page.html",
      status: "available",
      sample: true
    },
    {
      id: "geo-daily-007",
      date: "2026-10-15",
      title: "Geography Daily Test â€” Indian Monsoon",
      topic: "Indian Climate and Monsoon",
      category: "INDIAN GEOGRAPHY",
      description: "Mechanism, onset, withdrawal and variability of the Indian monsoon.",
      difficulty: "Hard",
      questionCount: 20,
      durationMinutes: 25,
      maxMarks: 40,
      testUrl: "./test-page.html",
      status: "available",
      sample: true
    },
    {
      id: "geo-daily-008",
      date: "2026-10-14",
      title: "Geography Daily Test â€” Soils of India",
      topic: "Soils",
      category: "INDIAN GEOGRAPHY",
      description: "Major soil types, distribution, characteristics and conservation.",
      difficulty: "Easy",
      questionCount: 15,
      durationMinutes: 20,
      maxMarks: 30,
      testUrl: "./test-page.html",
      status: "available",
      sample: true
    },
    {
      id: "geo-daily-009",
      date: "2026-10-13",
      title: "Geography Daily Test â€” Agriculture & Resources",
      topic: "Agriculture",
      category: "INDIAN GEOGRAPHY",
      description: "Cropping patterns, irrigation, mineral and energy resources overview.",
      difficulty: "Moderate",
      questionCount: 20,
      durationMinutes: 25,
      maxMarks: 40,
      testUrl: "./test-page.html",
      status: "available",
      sample: true
    },
    {
      id: "geo-daily-010",
      date: "2026-10-22",
      title: "Geography Daily Test â€” World Continents & Oceans",
      topic: "Continents and Oceans",
      category: "WORLD GEOGRAPHY",
      description: "Major landmasses, ocean basins and their strategic significance.",
      difficulty: "Easy",
      questionCount: 15,
      durationMinutes: 20,
      maxMarks: 30,
      testUrl: "./test-page.html",
      status: "upcoming",
      sample: true
    },
    {
      id: "geo-daily-011",
      date: "2026-10-23",
      title: "Geography Daily Test â€” Mountains, Rivers & Lakes",
      topic: "Mountains and Plateaus",
      category: "WORLD GEOGRAPHY",
      description: "Major mountain ranges, river systems and lakes of the world.",
      difficulty: "Moderate",
      questionCount: 20,
      durationMinutes: 25,
      maxMarks: 40,
      testUrl: "./test-page.html",
      status: "upcoming",
      sample: true
    },
    {
      id: "geo-daily-012",
      date: "2026-10-12",
      title: "Geography Daily Test â€” India Mapping",
      topic: "India Mapping",
      category: "MAPPING PRACTICE",
      description: "States, capitals, rivers, national parks and important locations.",
      difficulty: "Moderate",
      questionCount: 25,
      durationMinutes: 30,
      maxMarks: 50,
      testUrl: "./test-page.html",
      status: "available",
      sample: true
    },
    {
      id: "geo-daily-013",
      date: "2026-10-11",
      title: "Geography Daily Test â€” World Mapping",
      topic: "World Mapping",
      category: "MAPPING PRACTICE",
      description: "Countries, capitals, straits, seas and strategic locations.",
      difficulty: "Hard",
      questionCount: 20,
      durationMinutes: 25,
      maxMarks: 40,
      testUrl: "./test-page.html",
      status: "available",
      sample: true
    },
    {
      id: "geo-daily-014",
      date: "2026-10-10",
      title: "Geography Daily Test â€” Mixed Revision",
      topic: "Prelims-Oriented Mixed MCQs",
      category: "MIXED REVISION",
      description: "Integrated practice across physical, Indian and world geography.",
      difficulty: "Hard",
      questionCount: 30,
      durationMinutes: 35,
      maxMarks: 60,
      testUrl: "./test-page.html",
      status: "available",
      sample: true
    }
  ]
};

/* =========================================================
   Categories (static display)
   ========================================================= */
const CATEGORIES = [
  {
    title: "Physical Geography",
    items: ["Geomorphology", "Climatology", "Oceanography", "Earth's Interior", "Earthquakes and Volcanoes"]
  },
  {
    title: "Indian Geography",
    items: ["Physiography", "Rivers and Drainage", "Indian Climate and Monsoon", "Soils", "Agriculture", "Mineral and Energy Resources"]
  },
  {
    title: "World Geography",
    items: ["Continents and Oceans", "Mountains and Plateaus", "Rivers and Lakes", "Deserts and Grasslands", "Climate Regions"]
  },
  {
    title: "Mapping Practice",
    items: ["India Mapping", "World Mapping", "Africa Mapping", "South America Mapping", "Important Locations"]
  },
  {
    title: "Mixed Revision",
    items: ["Previous Topics", "Multiple-Chapter Practice", "Prelims-Oriented Mixed MCQs"]
  }
];

/* =========================================================
   Utilities
   ========================================================= */
const TZ = CONFIG.timezone;
const LOCAL_KEY = "ug.geo.attempts";

function todayISO() {
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
  return fmt.format(new Date());
}

function formatDateDisplay(iso) {
  const d = new Date(iso + "T12:00:00+05:30");
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: TZ });
}

function formatShortDate(iso) {
  const d = new Date(iso + "T12:00:00+05:30");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: TZ });
}

function storeGet(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) { return fallback; }
}
function storeSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
}

/* =========================================================
   Firebase layer
   ========================================================= */
let db = null;
let auth = null;
let currentUid = null;
let attemptsCache = storeGet(LOCAL_KEY, {});   // always keep a local mirror

function setSyncStatus(state, text) {
  const el = document.getElementById("syncStatus");
  if (!el) return;
  el.dataset.state = state;
  el.textContent = text;
}

function isFirebaseConfigured() {
  const f = CONFIG.firebase;
  return f && f.apiKey && f.apiKey !== "YOUR_API_KEY" && f.databaseURL && f.databaseURL.includes("firebaseio.com");
}

async function initFirebase() {
  if (!isFirebaseConfigured()) {
    setSyncStatus("error", "Firebase not configured â€” using local storage only");
    return false;
  }

  try {
    firebase.initializeApp(CONFIG.firebase);
    auth = firebase.auth();
    db = firebase.database();

    setSyncStatus("syncing", "Signing inâ€¦");

    // Anonymous auth â€“ creates a persistent UID for this browser
    const cred = await auth.signInAnonymously();
    currentUid = cred.user.uid;

    // Pull existing data from cloud and merge with local
    await pullFromCloud();

    // Listen for remote changes (e.g. when the test page writes a completion)
    db.ref(`users/${currentUid}/geoAttempts`).on("value", snap => {
      const remote = snap.val() || {};
      attemptsCache = { ...attemptsCache, ...remote };
      storeSet(LOCAL_KEY, attemptsCache);
      renderToday();
      renderGrid();
      renderPerformance();
      setSyncStatus("synced", "Synced with cloud");
    });

    setSyncStatus("synced", "Synced with cloud");
    return true;
  } catch (err) {
    console.error("Firebase init error:", err);
    setSyncStatus("error", "Cloud unavailable â€” local only");
    return false;
  }
}

async function pullFromCloud() {
  if (!db || !currentUid) return;
  try {
    const snap = await db.ref(`users/${currentUid}/geoAttempts`).once("value");
    const remote = snap.val() || {};
    // Merge: cloud wins on conflicts, but keep any purely-local entries
    attemptsCache = { ...attemptsCache, ...remote };
    storeSet(LOCAL_KEY, attemptsCache);
  } catch (e) {
    console.warn("Pull failed:", e);
  }
}

async function pushAttempt(testId, data) {
  // Always update local cache first
  attemptsCache[testId] = { ...(attemptsCache[testId] || {}), ...data, at: data.at || Date.now() };
  storeSet(LOCAL_KEY, attemptsCache);

  // Then push to Firebase if available
  if (db && currentUid) {
    try {
      await db.ref(`users/${currentUid}/geoAttempts/${testId}`).update(attemptsCache[testId]);
      setSyncStatus("synced", "Synced with cloud");
    } catch (e) {
      console.warn("Push failed:", e);
      setSyncStatus("error", "Cloud write failed â€” saved locally");
    }
  }
}

function getAttempts() {
  return attemptsCache;
}

function markStarted(id) {
  pushAttempt(id, { started: true });
}

/* Resolve effective status for a test */
function resolveStatus(test) {
  const attempts = getAttempts();
  const rec = attempts[test.id];
  if (rec && rec.completed) return "completed";

  const today = todayISO();
  if (test.status === "unavailable") return "unavailable";
  if (test.date > today) return "upcoming";
  if (test.status === "upcoming" && test.date === today) return "available";
  if (test.date < today || test.date === today) {
    return test.status === "available" ? "available" : (test.status || "available");
  }
  return test.status || "unavailable";
}

function canLaunch(test) {
  const s = resolveStatus(test);
  return (s === "available" || s === "completed") && test.testUrl;
}

/* =========================================================
   Theme
   ========================================================= */
const root = document.documentElement;
function setTheme(t) {
  root.setAttribute("data-theme", t);
  try { localStorage.setItem("ug-theme", t); } catch (e) {}
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", t === "dark" ? "#151C19" : "#F7F5EF");
  const btn = document.getElementById("themeBtn");
  if (btn) btn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
}

/* =========================================================
   Render helpers
   ========================================================= */
function el(tag, attrs, ...children) {
  const node = document.createElement(tag);
  if (attrs) {
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
      else if (v != null && v !== false) node.setAttribute(k, v === true ? "" : v);
    });
  }
  children.flat().forEach(c => {
    if (c == null || c === false) return;
    node.append(typeof c === "string" || typeof c === "number" ? document.createTextNode(c) : c);
  });
  return node;
}

function statusChip(status) {
  const map = {
    available: { label: "Available", cls: "chip--sage" },
    upcoming: { label: "Upcoming", cls: "chip--muted" },
    completed: { label: "Completed", cls: "chip--ok" },
    unavailable: { label: "Unavailable", cls: "chip--muted" }
  };
  const m = map[status] || map.unavailable;
  return el("span", { class: "chip " + m.cls }, m.label);
}

function renderToday() {
  const host = document.getElementById("todayHost");
  const today = todayISO();
  const test = CONFIG.tests.find(t => t.date === today);

  if (!test) {
    host.replaceChildren(
      el("div", { class: "today-card" },
        el("div", { class: "today-empty" },
          el("p", null, "Today's Geography test is being prepared."),
          el("p", { style: "margin-top:.6rem;font-size:.95rem" }, "Explore the available tests in the archive below.")
        )
      )
    );
    return;
  }

  const status = resolveStatus(test);
  const launchable = canLaunch(test);

  const meta = [];
  if (test.questionCount) meta.push(el("li", null, el("strong", null, String(test.questionCount)), " questions"));
  if (test.durationMinutes) meta.push(el("li", null, el("strong", null, String(test.durationMinutes)), " min"));
  if (test.maxMarks) meta.push(el("li", null, el("strong", null, String(test.maxMarks)), " marks"));
  meta.push(el("li", null, "Difficulty: ", el("strong", null, test.difficulty)));

  const actions = [];
  if (launchable) {
    actions.push(
      el("a", {
        class: "btn btn--primary",
        href: (test.testUrl || CONFIG.testPageUrl) +
          ( (test.testUrl || CONFIG.testPageUrl).includes("?") ? "&" : "?" ) +
          "test=" + encodeURIComponent(test.id), // UG_TEST_ID_LINK_PATCH
        onClick: function () { markStarted(test.id); }
      }, status === "completed" ? "Retake Today's Test" : "Start Today's Test")
    );
  } else if (status === "upcoming") {
    actions.push(el("button", { class: "btn", disabled: true, "aria-disabled": "true" }, "Available on " + formatShortDate(test.date)));
  } else {
    actions.push(el("button", { class: "btn", disabled: true, "aria-disabled": "true" }, "Coming soon"));
  }

  host.replaceChildren(
    el("article", { class: "today-card" },
      el("div", { class: "today-card__top" },
        el("div", null,
          el("p", { class: "today-card__date" }, formatDateDisplay(test.date)),
          el("h2", null, test.title),
          el("p", { class: "today-card__topic" }, test.topic)
        ),
        el("div", { style: "display:flex;flex-wrap:wrap;gap:.4rem;justify-content:flex-end" },
          statusChip(status),
          test.sample ? el("span", { class: "chip chip--sample" }, "Sample data") : null
        )
      ),
      el("p", { class: "today-card__desc" }, test.description),
      el("ul", { class: "today-meta" }, ...meta),
      el("div", { class: "today-card__actions" }, ...actions)
    )
  );
}

function getFilteredTests() {
  const q = (document.getElementById("searchInput").value || "").trim().toLowerCase();
  const topic = document.getElementById("filterTopic").value;
  const diff = document.getElementById("filterDiff").value;
  const status = document.getElementById("filterStatus").value;
  const sort = document.getElementById("sortBy").value;

  let list = CONFIG.tests.slice();

  if (q) {
    list = list.filter(t =>
      (t.title || "").toLowerCase().includes(q) ||
      (t.topic || "").toLowerCase().includes(q) ||
      (t.category || "").toLowerCase().includes(q)
    );
  }
  if (topic) list = list.filter(t => t.topic === topic || t.category === topic);
  if (diff) list = list.filter(t => t.difficulty === diff);
  if (status) list = list.filter(t => resolveStatus(t) === status);

  list.sort((a, b) => {
    if (sort === "oldest") return a.date.localeCompare(b.date) || a.id.localeCompare(b.id);
    return b.date.localeCompare(a.date) || a.id.localeCompare(b.id);
  });

  return list;
}

function renderCard(test) {
  const status = resolveStatus(test);
  const launchable = canLaunch(test);

  const meta = [];
  meta.push(statusChip(status));
  if (test.sample) meta.push(el("span", { class: "chip chip--sample" }, "Sample"));
  meta.push(el("span", { class: "chip" }, test.difficulty));
  if (test.questionCount) meta.push(el("span", { class: "chip chip--muted" }, test.questionCount + " Qs"));
  if (test.durationMinutes) meta.push(el("span", { class: "chip chip--muted" }, test.durationMinutes + " min"));

  let action;
  if (launchable) {
    action = el("a", {
      class: "btn btn--primary",
      href: (test.testUrl || CONFIG.testPageUrl) +
          ( (test.testUrl || CONFIG.testPageUrl).includes("?") ? "&" : "?" ) +
          "test=" + encodeURIComponent(test.id), // UG_TEST_ID_LINK_PATCH
      style: "min-height:38px;padding:.4rem .9rem;font-size:.85rem",
      onClick: function () { markStarted(test.id); }
    }, status === "completed" ? "Retake" : "Start Test");
  } else if (status === "upcoming") {
    action = el("button", { class: "btn", disabled: true, "aria-disabled": "true", style: "min-height:38px;padding:.4rem .9rem;font-size:.85rem" }, "Upcoming");
  } else {
    action = el("button", { class: "btn", disabled: true, "aria-disabled": "true", style: "min-height:38px;padding:.4rem .9rem;font-size:.85rem" }, "Coming soon");
  }

  const cls = ["card"];
  if (test.sample) cls.push("card--sample");
  if (status === "upcoming") cls.push("card--upcoming");
  if (status === "completed") cls.push("card--done");

  return el("article", { class: cls.join(" "), role: "listitem" },
    el("p", { class: "card__date" }, formatShortDate(test.date)),
    el("h3", null, test.title),
    el("p", { class: "card__topic" }, test.topic),
    el("div", { class: "card__meta" }, ...meta),
    el("div", { class: "card__actions" }, action)
  );
}

function renderGrid() {
  const list = getFilteredTests();
  const grid = document.getElementById("testGrid");
  const empty = document.getElementById("emptyState");
  const count = document.getElementById("resultCount");

  count.textContent = list.length + " test" + (list.length === 1 ? "" : "s");

  if (!list.length) {
    grid.replaceChildren();
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  grid.replaceChildren(...list.map(renderCard));
}

function populateTopicFilter() {
  const sel = document.getElementById("filterTopic");
  const topics = [...new Set(CONFIG.tests.map(t => t.topic).filter(Boolean))].sort();
  topics.forEach(t => {
    sel.append(el("option", { value: t }, t));
  });
}

function renderCategories() {
  const host = document.getElementById("catsGrid");
  host.replaceChildren(...CATEGORIES.map(c =>
    el("div", { class: "cat" },
      el("h3", null, c.title),
      el("ul", null, ...c.items.map(i => el("li", null, i)))
    )
  ));
}

function renderPerformance() {
  const attempts = getAttempts();
  const ids = Object.keys(attempts);
  const completed = ids.filter(id => attempts[id].completed);
  const started = ids.filter(id => attempts[id].started && !attempts[id].completed);

  const stats = document.getElementById("perfStats");
  stats.replaceChildren(
    el("div", { class: "stat" }, el("dt", null, "Tests completed"), el("dd", null, String(completed.length))),
    el("div", { class: "stat" }, el("dt", null, "Tests started"), el("dd", null, String(started.length))),
    el("div", { class: "stat" }, el("dt", null, "Total tracked"), el("dd", null, String(ids.length)))
  );

  const hist = document.getElementById("perfHistory");
  if (!ids.length) {
    hist.replaceChildren(el("p", { class: "perf__empty" }, "No attempt history yet. Start a test to begin tracking."));
    return;
  }

  const items = ids
    .map(id => {
      const t = CONFIG.tests.find(x => x.id === id);
      const rec = attempts[id];
      return { id, title: t ? t.title : id, topic: t ? t.topic : "â€”", rec };
    })
    .sort((a, b) => (b.rec.at || 0) - (a.rec.at || 0));

  hist.replaceChildren(
    el("ul", { class: "perf__list" },
      ...items.map(item => {
        let detail = item.rec.completed ? "Completed" : "Started";
        if (item.rec.completed && typeof item.rec.score === "number" && typeof item.rec.total === "number") {
          detail += ` Â· ${item.rec.score}/${item.rec.total}`;
        }
        if (item.rec.at) {
          detail += " Â· " + new Date(item.rec.at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
        }
        return el("li", null, el("strong", null, item.title), " Â· ", item.topic, " Â· ", detail);
      })
    )
  );
}

/* =========================================================
   Wiring
   ========================================================= */
function wire() {
  document.getElementById("themeBtn").addEventListener("click", () => {
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  // Mobile menu
  const side = document.getElementById("sideNav");
  const scrim = document.getElementById("scrim");
  const menuBtn = document.getElementById("menuBtn");
  function setDrawer(open) {
    side.classList.toggle("is-open", open);
    scrim.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("no-scroll", open);
  }
  menuBtn.addEventListener("click", () => setDrawer(true));
  document.getElementById("sideClose").addEventListener("click", () => setDrawer(false));
  scrim.addEventListener("click", () => setDrawer(false));
  side.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setDrawer(false)));

  // Filters
  ["searchInput", "filterTopic", "filterDiff", "filterStatus", "sortBy"].forEach(id => {
    const node = document.getElementById(id);
    node.addEventListener(id === "searchInput" ? "input" : "change", renderGrid);
  });
  document.getElementById("clearFilters").addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    document.getElementById("filterTopic").value = "";
    document.getElementById("filterDiff").value = "";
    document.getElementById("filterStatus").value = "";
    document.getElementById("sortBy").value = "newest";
    renderGrid();
  });

  // Reset history (clears both local + cloud)
  document.getElementById("resetHistory").addEventListener("click", async () => {
    if (!confirm("Clear all Geography test history? This will delete cloud data for this browser as well.")) return;

    attemptsCache = {};
    storeSet(LOCAL_KEY, {});

    if (db && currentUid) {
      try {
        await db.ref(`users/${currentUid}/geoAttempts`).remove();
        setSyncStatus("synced", "History cleared");
      } catch (e) {
        setSyncStatus("error", "Cloud clear failed â€” local cleared");
      }
    }

    renderToday();
    renderGrid();
    renderPerformance();
  });

  // Scroll header state
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        root.classList.toggle("is-scrolled", window.scrollY > 24);
        ticking = false;
      });
    }
  }, { passive: true });

  document.getElementById("year").textContent = new Date().getFullYear();
}

/* =========================================================
   Init
   ========================================================= */
async function init() {
  setTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");
  populateTopicFilter();
  renderToday();
  renderGrid();
  renderCategories();
  renderPerformance();
  wire();

  // Firebase runs after first paint so the UI is never blocked
  await initFirebase();
  // Re-render once cloud data is ready
  renderToday();
  renderGrid();
  renderPerformance();
}
init();
