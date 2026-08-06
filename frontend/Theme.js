// ─────────────────────────────────────────────────────────────────
// theme.js  —  CBIT Faculty ERP Design Tokens & Scoring Utilities
// ─────────────────────────────────────────────────────────────────

export const THEME = {
  // Primary
  primary:      '#7B1C1C',
  primaryDark:  '#5A1212',
  primaryMid:   '#9B2C2C',
  primaryLight: '#F9EFEF',
  primaryGlass: 'rgba(123,28,28,0.08)',

  // Accent
  gold:       '#A07800',
  goldLight:  '#FEF9E7',
  goldBorder: '#D4AF37',

  // Neutrals
  bg:          '#F5F2ED',
  cardBg:      '#FFFFFF',
  border:      '#DDD5C8',
  borderLight: '#EDE8E2',

  // Text
  text:      '#1A1A1A',
  textMuted: '#5C5C5C',
  textLight: '#9CA3AF',

  // Semantic
  success:       '#166534',
  successBg:     '#F0FDF4',
  successBorder: '#86EFAC',
  error:         '#DC2626',
  errorBg:       '#FEF2F2',
  errorBorder:   '#FCA5A5',
  warning:       '#92400E',
  warningBg:     '#FFFBEB',
  warningBorder: '#FCD34D',
  info:          '#1D4ED8',
  infoBg:        '#EFF6FF',
  infoBorder:    '#BFDBFE',

  // Shadows
  shadow:   '0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.08)',
  shadowMd: '0 4px 12px rgba(0,0,0,0.10)',
  shadowLg: '0 8px 24px rgba(0,0,0,0.14)',

  // Borders
  radius:   '8px',
  radiusSm: '4px',
  radiusLg: '12px',
  radiusXl: '20px',

  // Fonts
  fontHeading: "'Crimson Text', Georgia, serif",
  fontBody:    "'DM Sans', 'Segoe UI', sans-serif",
  fontMono:    "'JetBrains Mono', monospace",
};

// ── Inject Google Fonts (call once at app mount) ──────────────────
export const injectFonts = () => {
  if (document.getElementById('cbit-fonts')) return;
  const link = document.createElement('link');
  link.id   = 'cbit-fonts';
  link.rel  = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap';
  document.head.appendChild(link);
};

// ── Shared Input Style Factory ────────────────────────────────────
export const inputStyle = (focused = false) => ({
  width: '100%',
  padding: '9px 13px',
  borderRadius: THEME.radius,
  border: `1.5px solid ${focused ? THEME.primary : THEME.border}`,
  background: THEME.bg,
  color: THEME.text,
  fontSize: '14px',
  fontFamily: THEME.fontBody,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
});

export const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 600,
  color: THEME.textMuted,
  letterSpacing: '0.6px',
  textTransform: 'uppercase',
  marginBottom: '5px',
};

export const cardStyle = {
  background: THEME.cardBg,
  borderRadius: THEME.radiusLg,
  border: `1px solid ${THEME.border}`,
  boxShadow: THEME.shadow,
  padding: '20px 24px',
  marginBottom: '16px',
};

export const scoreChipStyle = (current, max) => {
  const pct = max > 0 ? current / max : 0;
  const bg  = pct >= 0.8 ? THEME.successBg  : pct >= 0.5 ? THEME.warningBg  : THEME.errorBg;
  const col = pct >= 0.8 ? THEME.success     : pct >= 0.5 ? THEME.warning    : THEME.error;
  const bdr = pct >= 0.8 ? THEME.successBorder : pct >= 0.5 ? THEME.warningBorder : THEME.errorBorder;
  return { background: bg, color: col, border: `1px solid ${bdr}`, borderRadius: THEME.radiusSm, padding: '3px 8px', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' };
};

// ── Scoring Utilities ─────────────────────────────────────────────

/** B1 — Course success score (per semester) */
export const calcB1Score = (successRate, gpa, cos) => {
  const sr = parseFloat(successRate) || 0;
  const g  = parseFloat(gpa)         || 0;
  const c  = parseInt(cos)           || 0;
  if (sr < 75) return { srScore: 0, gpaScore: 0, coScore: 0, total: 0 };
  const srScore  = +Math.min((sr / 100) * 10, 10).toFixed(2);
  const gpaScore = +Math.min((g / 10) * 5,   5).toFixed(2);
  const coScore  = Math.min(c, 5);
  return { srScore, gpaScore, coScore, total: +(srScore + gpaScore + coScore).toFixed(2) };
};

/** B2 — Feedback score */
export const calcB2Score = (pct) => {
  const p = parseFloat(pct) || 0;
  if (p < 75) return 0;
  return +Math.min((p / 100) * 10, 10).toFixed(2);
};

/** B3 — Pedagogical initiatives */
export const calcB3Score = (d = {}) => {
  const ict  = +Math.min((parseInt(d.ict)    || 0) * 2, 4).toFixed(1);
  const alt  = +Math.min((parseInt(d.alt)    || 0) * 2, 4).toFixed(1);
  const cep  = +Math.min((parseInt(d.cep)    || 0) * 2, 6).toFixed(1);
  const proj = +Math.min((parseInt(d.proj)   || 0) * 2, 6).toFixed(1);
  const itm  = +Math.min((parseInt(d.itm)    || 0) * 2, 6).toFixed(1);
  const cd   = +Math.min((parseInt(d.cd)     || 0) * 5, 10).toFixed(1);
  const obe  = +Math.min((parseFloat(d.obe)  || 0), 4).toFixed(1);
  return { ict, alt, cep, proj, itm, cd, obe, total: +(ict+alt+cep+proj+itm+cd+obe).toFixed(2) };
};

/** B4 — Student mentoring */
export const calcB4Score = (d = {}) => {
  const n = parseInt(d.n) || 0;
  if (n <= 0) return { s43:0, s44:0, s45:0, s46:0, s47:0, s48:0, s49:0, total:0 };
  const s43 = +Math.min(((parseInt(d.n1)     || 0) / n) * 4, 4).toFixed(2);
  const s44 = +Math.min(((parseInt(d.n2)     || 0) / n) * 4, 4).toFixed(2);
  const s45 = +Math.min((parseInt(d.events)  || 0) * 0.5, 2).toFixed(2);
  const s46 = +Math.min((parseInt(d.awards)  || 0) * 1,   2).toFixed(2);
  const s47 = +Math.min((parseInt(d.nptel)   || 0) * 0.5, 3).toFixed(2);
  const s48 = +Math.min((parseInt(d.certs)   || 0) * 0.5, 2).toFixed(2);
  const s49 = +Math.min(((parseInt(d.n3)     || 0) / n) * 3, 3).toFixed(2);
  return { s43, s44, s45, s46, s47, s48, s49, total: +(s43+s44+s45+s46+s47+s48+s49).toFixed(2) };
};

/** Conference paper points */
export const getConferencePoints = (pos) => ({ first: 5, second: 4, third: 3 }[pos] || 5);

/** Journal paper points by quartile & author position */
export const getJournalPoints = (quartile, pos) => ({
  Q1:    { first: 25, second: 20, third: 15 },
  Q2:    { first: 15, second: 12, third: 10 },
  'Q3/Q4': { first: 10, second: 8,  third: 6  },
  Other: { first: 5,  second: 0,  third: 0  },
}[quartile]?.[pos] || 0);

/** Citations (max 15) */
export const calcCitationScore = (rows = []) =>
  Math.min(rows.reduce((s, r) => s + ((r.type === 'Q1' ? 2 : 1) * (parseInt(r.count) || 0)), 0), 15);

/** Book chapter points */
export const getBookChapterPoints = (pos) => ({ first: 5, second: 3 }[pos] || 2);

/** Textbook points */
export const getTextbookPoints = (pos) => (pos === 'first' ? 10 : 3);

/** Funded project points */
export const getProjectPoints = (amount, role) => {
  const a = parseFloat(amount) || 0;
  const pi = role === 'PI';
  if (a >= 1000000) return pi ? 20 : 15;
  if (a >=  500000) return pi ? 12 : 8;
  return 5;
};

/** Consultancy points */
export const getConsultancyPoints = (amount) => {
  const a = parseFloat(amount) || 0;
  if (a <= 0)       return 0;
  if (a < 10000)    return 1;
  if (a <= 25000)   return 2;
  if (a <= 75000)   return 3;
  if (a <= 100000)  return 4;
  if (a <= 500000)  return 5;
  if (a <= 1000000) return 12;
  return 20;
};

/** Generate unique row ID */
export const newId = () => `row_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// ── Part D Scoring ────────────────────────────────────────────────

/**
 * D.1.1 Trainings Attended
 * @param {number} longFDP    — FDP/NPTEL 8-12wk / Internship ≥2wk  (2.5 pts each, max 5)
 * @param {number} shortFDP   — Sponsored FDP 1-2wk / NPTEL 4wk      (2.0 pts each, cap within 5)
 * @param {number} workshops  — Workshop <1 week                      (1 pt each, cap within 5)
 * @param {number} certs      — Certifications                        (5 pts, max 5)
 */
export const calcD11Score = (longFDP = 0, shortFDP = 0, workshops = 0, certs = 0) => {
  const trainings = Math.min(
    longFDP * 2.5 + shortFDP * 2 + workshops * 1,
    5
  );
  const certScore = Math.min(certs * 5, 5);
  return { trainings: +trainings.toFixed(2), certs: +certScore.toFixed(2), total: +(trainings + certScore).toFixed(2) };
};

/**
 * D.1.2 Trainings Conducted (max 10)
 * @param {number} longTraining   — FDP/STTP/Workshop 1-2 weeks  (5 pts each)
 * @param {number} shortTraining  — FDP/STTP/Workshop <1 week    (2.5 pts each)
 */
export const calcD12Score = (longTraining = 0, shortTraining = 0) => {
  const total = Math.min(longTraining * 5 + shortTraining * 2.5, 10);
  return +total.toFixed(2);
};

/**
 * D.1.3 Value-Added Courses (max 5)
 * @param {number} courses  — Each course min 30hrs, 5 pts each
 */
export const calcD13Score = (courses = 0) => Math.min(courses * 5, 5);

/**
 * D.2.1 Professional Society Memberships (max 5)
 * Lifetime: 1 pt/membership; Annual: 1 pt/membership (up to 5 total)
 */
export const calcD21Score = (lifetime = 0, annual = 0) =>
  Math.min(lifetime * 1 + annual * 1, 5);

/**
 * D.2.2 Interaction with Outside World (max 15)
 * Accumulates individual activity points, capped at 15
 */
export const calcD22Score = (d = {}) => {
  const pts =
    (d.accreditation  ? 10 : 0) +
    (d.editorQ1       ?  4 : 0) +
    (d.editorQ2       ?  3 : 0) +
    ((parseInt(d.projectExaminer) || 0) * 2.5) +
    (d.questionPaper  ?  5 : 0) +
    ((parseInt(d.labExaminer)     || 0) * 2) +
    ((parseInt(d.resourcePerson)  || 0) * 5) +
    (d.intlVisit      ? 10 : 0) +
    ((parseInt(d.mous)            || 0) * 5);
  return Math.min(pts, 15);
};

/**
 * D.2.3 Awards (max 10)
 * 10 pts per award
 */
export const calcD23Score = (awards = 0) => Math.min(awards * 10, 10);

/**
 * Full Part D total
 */
export const calcDTotal = (d1_1, d1_2, d1_3, d2_1, d2_2, d2_3, d3_1 = 0, d3_2 = 0) => {
  const d1 = Math.min(+(d1_1 + d1_2 + d1_3).toFixed(2), 25);
  const d2 = Math.min(+(d2_1 + d2_2 + d2_3).toFixed(2), 30);
  const d3 = Math.min(+(d3_1 + d3_2).toFixed(2), 15);
  return { d1, d2, d3, total: +(d1 + d2 + d3).toFixed(2) };
};