// migrate-questions.js
// Run with: node scripts/migrate-questions.js
// Converts questions.json and state-questions.json to multilingual format

const fs = require('fs');
const path = require('path');

const LANGS = ['de', 'en', 'tr', 'ar', 'ru'];
const files = [
  { in: path.join(__dirname, '../public/data/questions.json'), out: path.join(__dirname, '../public/data/questions.multilingual.json') },
  { in: path.join(__dirname, '../public/data/state-questions.json'), out: path.join(__dirname, '../public/data/state-questions.multilingual.json') }
];

function migrateQuestion(q) {
  // If already migrated, skip
  if (q.translations) return q;
  const de = {
    question: q.question || '',
    answers: q.answers || [],
    explanation: q.explanation || ''
  };
  const translations = {};
  LANGS.forEach(lang => {
    translations[lang] = lang === 'de' ? de : {
      question: '',
      answers: Array.isArray(de.answers) ? de.answers.map(() => '') : [],
      explanation: ''
    };
  });
  return {
    translations,
    answerIndex: q.answerIndex,
    ...(q.image ? { image: q.image } : {})
  };
}

function migrateFile(inPath, outPath) {
  const data = JSON.parse(fs.readFileSync(inPath, 'utf8'));
  let migrated;
  if (Array.isArray(data)) {
    migrated = data.map(migrateQuestion);
  } else {
    // state-questions.json: { state: [questions] }
    migrated = {};
    for (const state in data) {
      migrated[state] = data[state].map(migrateQuestion);
    }
  }
  fs.writeFileSync(outPath, JSON.stringify(migrated, null, 2), 'utf8');
  console.log(`Migrated: ${inPath} -> ${outPath}`);
}

files.forEach(f => migrateFile(f.in, f.out));
