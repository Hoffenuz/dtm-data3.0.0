import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'otm.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS regions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS universities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      short_name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      region_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('davlat', 'xususiy', 'xorijiy')),
      description TEXT,
      website TEXT,
      is_top INTEGER DEFAULT 0,
      FOREIGN KEY (region_id) REFERENCES regions(id)
    );

    CREATE TABLE IF NOT EXISTS directions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      university_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      faculty TEXT,
      education_form TEXT NOT NULL CHECK(education_form IN ('kunduzgi', 'sirtqi', 'kechki', 'masofaviy')),
      education_language TEXT NOT NULL CHECK(education_language IN ('uzbek', 'rus', 'qoraqalpoq', 'ingliz')),
      quota INTEGER DEFAULT 0,
      FOREIGN KEY (university_id) REFERENCES universities(id)
    );

    CREATE TABLE IF NOT EXISTS admission_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      direction_id INTEGER NOT NULL,
      year INTEGER NOT NULL DEFAULT 2024,
      grant_score REAL,
      contract_score REAL,
      FOREIGN KEY (direction_id) REFERENCES directions(id)
    );

    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT,
      content TEXT,
      category TEXT DEFAULT 'umumiy',
      image_url TEXT,
      published_at TEXT NOT NULL,
      is_featured INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS career_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      options TEXT NOT NULL
    );
  `);
}

export default db;
