CREATE TABLE IF NOT EXISTS activity_sessions (
  session_id TEXT PRIMARY KEY,
  uid TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  last_heartbeat_at INTEGER NOT NULL,
  seconds INTEGER NOT NULL DEFAULT 0,
  page_path TEXT NOT NULL DEFAULT '/',
  page_title TEXT NOT NULL DEFAULT 'UPSC Gurukul',
  ended_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_activity_sessions_uid_started ON activity_sessions(uid, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_sessions_uid_active ON activity_sessions(uid, session_id, ended_at);
CREATE TABLE IF NOT EXISTS activity_daily (
  uid TEXT NOT NULL,
  activity_date TEXT NOT NULL,
  seconds INTEGER NOT NULL DEFAULT 0,
  sessions INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(uid, activity_date)
);
CREATE INDEX IF NOT EXISTS idx_activity_daily_uid_date ON activity_daily(uid, activity_date DESC);
