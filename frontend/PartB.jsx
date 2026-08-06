// ─────────────────────────────────────────────────────────────────
// PartB.jsx  —  CBIT Faculty ERP  |  Part B: Teaching, Learning & Evaluation
// Strict Data Entry Version (No Calculations)
// ─────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { THEME, labelStyle, newId } from './Theme';
import { TopBar } from './Home';

// ── Input style factories ─────────────────────────────────────────
const inp = (focused, readOnly = false) => ({
  width: '100%',
  padding: '8px 12px',
  borderRadius: THEME.radius,
  border: `1.5px solid ${readOnly ? THEME.borderLight : focused ? THEME.primary : THEME.border}`,
  background: readOnly ? THEME.bg : '#fff',
  color: THEME.text,
  fontSize: 14,
  fontFamily: THEME.fontBody,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
  cursor: readOnly ? 'not-allowed' : undefined,
});

const selInp = (f) => ({
  ...inp(f),
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7'%3E%3Cpath d='M0 0l5 7 5-7z' fill='%23999'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: 34,
});

// ── Integer-only input (for COs, counts) ─────────────────────────
function NumInput({ id, value, onChange, min = 0, max, placeholder = '0', disabled = false }) {
  const [focus, setFocus] = useState(false);
  const handle = (e) => {
    const raw = parseInt(e.target.value, 10);
    if (isNaN(raw)) { onChange(0); return; }
    const clamped = max !== undefined ? Math.min(Math.max(raw, min), max) : Math.max(raw, min);
    onChange(clamped);
  };
  return (
    <input
      id={id}
      className={`form-input num-input num-input--${id}`}
      style={inp(focus, disabled)}
      type="number"
      min={min} max={max} step={1}
      placeholder={placeholder}
      value={value ?? ''}
      onChange={handle}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      disabled={disabled}
    />
  );
}

// ── Decimal input (for Success Rate 0–100 and GPA 0–10) ──────────
function DecimalInput({ id, value, onChange, min = 0, max, placeholder = '0.00', disabled = false }) {
  const [focus, setFocus] = useState(false);
  const [raw, setRaw] = useState(value === 0 ? '' : String(value));

  useEffect(() => {
    if (!focus) setRaw(value === 0 ? '' : String(value));
  }, [value, focus]);

  const handleChange = (e) => {
    const v = e.target.value;
    if (v === '' || /^\d*\.?\d*$/.test(v)) setRaw(v);
  };

  const handleBlur = () => {
    setFocus(false);
    let num = parseFloat(raw);
    if (isNaN(num)) num = min;
    if (max !== undefined) num = Math.min(num, max);
    num = Math.max(num, min);
    num = Math.round(num * 100) / 100;
    onChange(num);
    setRaw(num === 0 ? '' : String(num));
  };

  return (
    <input
      id={id}
      className={`form-input decimal-input decimal-input--${id}`}
      style={inp(focus, disabled)}
      type="text"
      inputMode="decimal"
      placeholder={placeholder}
      value={raw}
      onChange={handleChange}
      onFocus={() => setFocus(true)}
      onBlur={handleBlur}
      disabled={disabled}
    />
  );
}

function FocusInput({ id, value, onChange, placeholder }) {
  const [focus, setFocus] = useState(false);
  return (
    <input
      id={id}
      className={`form-input form-input--${id}`}
      style={inp(focus)}
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    />
  );
}

function Field({ id, label, children, hint }) {
  return (
    <div id={`field-${id}`} className={`form-field form-field--${id}`} style={{ marginBottom: 14 }}>
      <label id={`label-${id}`} htmlFor={id} style={labelStyle}>{label}</label>
      {children}
      {hint && (
        <p id={`hint-${id}`} style={{ fontSize: 11, color: THEME.textLight, marginTop: 3 }}>{hint}</p>
      )}
    </div>
  );
}

function SectionCard({ id, title, icon, children }) {
  return (
    <div
      id={`card-${id}`}
      className={`section-card section-card--${id}`}
      style={{
        background: THEME.cardBg, borderRadius: THEME.radiusLg,
        border: `1px solid ${THEME.border}`, boxShadow: THEME.shadow,
        padding: '20px 24px', marginBottom: 16,
      }}
    >
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${THEME.borderLight}`,
      }}>
        <h3 style={{ fontFamily: THEME.fontHeading, fontSize: 17, fontWeight: 600, color: THEME.text, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>{icon}</span>{title}
        </h3>
      </div>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// CourseCard — one editable course row inside a semester block
// ════════════════════════════════════════════════════════════════
function CourseCard({ course, idx, prefix, onChange, onRemove, total }) {
  return (
    <div
      id={`course-card-${prefix}-${course.id}`}
      className={`course-card course-card--${prefix}`}
      style={{
        borderRadius: THEME.radius,
        border: `2px solid ${THEME.borderLight}`,
        background: '#fff',
        padding: '14px 16px',
        marginBottom: 10,
        position: 'relative',
      }}
    >
      {/* ── Card header row ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span
          id={`course-badge-${prefix}-${course.id}`}
          className="course-number-badge"
          style={{
            width: 24, height: 24, borderRadius: '50%',
            background: THEME.border,
            color: THEME.textMuted,
            fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {idx + 1}
        </span>

        <span style={{ fontFamily: THEME.fontBody, fontSize: 13, fontWeight: 600, color: THEME.text, flex: 1 }}>
          {course.courseTitle || `Course ${idx + 1}`}
          {course.courseCode ? ` (${course.courseCode})` : ''}
        </span>

        {/* Remove button */}
        {total > 1 && (
          <button
            id={`remove-course-${prefix}-${course.id}`}
            className="remove-course-btn"
            onClick={onRemove}
            title="Remove this course"
            style={{
              background: 'none', border: `1px solid ${THEME.errorBorder}`,
              borderRadius: THEME.radiusSm, color: THEME.error,
              fontSize: 13, cursor: 'pointer',
              padding: '2px 7px', lineHeight: 1,
              transition: 'background 0.1s',
            }}
            onMouseOver={e => e.currentTarget.style.background = THEME.errorBg}
            onMouseOut={e => e.currentTarget.style.background = 'none'}
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Fields grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
        <Field id={`${prefix}-${course.id}-title`} label="Course Title">
          <FocusInput
            id={`input-${prefix}-${course.id}-title`}
            value={course.courseTitle || ''}
            onChange={v => onChange({ ...course, courseTitle: v })}
            placeholder="e.g., Data Structures"
          />
        </Field>

        <Field id={`${prefix}-${course.id}-code`} label="Course Code">
          <FocusInput
            id={`input-${prefix}-${course.id}-code`}
            value={course.courseCode || ''}
            onChange={v => onChange({ ...course, courseCode: v })}
            placeholder="e.g., CS301"
          />
        </Field>

        <Field id={`${prefix}-${course.id}-sr`} label="Success Rate (%)" hint="0 to 100">
          <DecimalInput
            id={`input-${prefix}-${course.id}-sr`}
            value={course.successRate ?? 0}
            onChange={v => onChange({ ...course, successRate: v })}
            min={0} max={100}
            placeholder="e.g., 85.5"
          />
        </Field>

        <Field id={`${prefix}-${course.id}-gpa`} label="Average GPA (0–10)" hint="Pass students only">
          <DecimalInput
            id={`input-${prefix}-${course.id}-gpa`}
            value={course.gpa ?? 0}
            onChange={v => onChange({ ...course, gpa: v })}
            min={0} max={10}
            placeholder="e.g., 8.5"
          />
        </Field>

        <Field id={`${prefix}-${course.id}-cos`} label="COs Attained (0–5)">
          <NumInput
            id={`input-${prefix}-${course.id}-cos`}
            value={course.cos ?? 0}
            onChange={v => onChange({ ...course, cos: v })}
            min={0} max={5}
          />
        </Field>

        <Field id={`${prefix}-${course.id}-proof`} label="Proof Page No." hint="Documentary proof page reference">
          <FocusInput
            id={`input-${prefix}-${course.id}-proof`}
            value={course.proofPage || ''}
            onChange={v => onChange({ ...course, proofPage: v })}
            placeholder="e.g., 12 or 12–15"
          />
        </Field>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// SemesterBlock — Odd or Even semester with multi-course list
// ════════════════════════════════════════════════════════════════
function SemesterBlock({ label, prefix, courses, onChange }) {
  const addCourse = () => {
    onChange([
      ...courses,
      { id: newId(), courseTitle: '', courseCode: '', successRate: 0, gpa: 0, cos: 0, proofPage: '' },
    ]);
  };

  const updateCourse = (idx, updated) => {
    const next = [...courses];
    next[idx] = updated;
    onChange(next);
  };

  const removeCourse = (idx) => {
    onChange(courses.filter((_, i) => i !== idx));
  };

  return (
    <div
      id={`sem-block-${prefix}`}
      className={`semester-block semester-block--${prefix}`}
      style={{
        background: THEME.bg,
        borderRadius: THEME.radius,
        padding: '16px 18px',
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <p
          id={`sem-label-${prefix}`}
          className="semester-label"
          style={{ fontFamily: THEME.fontHeading, fontSize: 15, fontWeight: 600, color: THEME.primary, margin: 0 }}
        >
          {label}
        </p>

        <button
          id={`add-course-btn-${prefix}`}
          className={`add-course-btn add-course-btn--${prefix}`}
          onClick={addCourse}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px',
            borderRadius: THEME.radius,
            border: `1.5px solid ${THEME.primary}`,
            background: '#fff',
            color: THEME.primary,
            fontSize: 13, fontWeight: 600,
            cursor: 'pointer',
            fontFamily: THEME.fontBody,
            transition: 'background 0.15s',
          }}
          onMouseOver={e => e.currentTarget.style.background = THEME.primaryLight}
          onMouseOut={e => e.currentTarget.style.background = '#fff'}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>＋</span>
          Add Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div
          id={`sem-empty-${prefix}`}
          className="sem-empty-state"
          style={{
            textAlign: 'center', padding: '20px',
            color: THEME.textMuted, fontSize: 13,
            border: `1.5px dashed ${THEME.border}`,
            borderRadius: THEME.radius,
            background: '#fff',
          }}
        >
          No courses added yet. Click <strong>Add Course</strong> to begin.
        </div>
      ) : (
        courses.map((course, idx) => (
          <CourseCard
            key={course.id}
            course={course}
            idx={idx}
            prefix={prefix}
            total={courses.length}
            onChange={(updated) => updateCourse(idx, updated)}
            onRemove={() => removeCourse(idx)}
          />
        ))
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// B1 — Courses Taught 
// ════════════════════════════════════════════════════════════════
function B1Section({ data, onChange }) {
  const oddCourses  = data.b1OddCourses  ?? (data.b1Odd  ? [{ id: newId(), ...data.b1Odd  }] : []);
  const evenCourses = data.b1EvenCourses ?? (data.b1Even ? [{ id: newId(), ...data.b1Even }] : []);

  const setOddCourses  = (list) => onChange('b1OddCourses',  list);
  const setEvenCourses = (list) => onChange('b1EvenCourses', list);

  return (
    <SectionCard id="b1" title="B.1  Courses Taught, Success Rate & CO Attainment" icon="📖">
      <SemesterBlock label="Odd Semester" prefix="odd" courses={oddCourses} onChange={setOddCourses} />
      <SemesterBlock label="Even Semester" prefix="even" courses={evenCourses} onChange={setEvenCourses} />
    </SectionCard>
  );
}

// ════════════════════════════════════════════════════════════════
// B2 — Feedback on Teaching
// ════════════════════════════════════════════════════════════════
function B2Section({ data, onChange }) {
  const set = (k, v) => onChange('b2', { ...data.b2, [k]: v });

  return (
    <SectionCard id="b2" title="B.2  Feedback on Teaching" icon="📝">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
        <Field id="b2-odd-feedback" label="Odd Semester Feedback (%)">
          <DecimalInput id="input-b2-odd" min={0} max={100}
            value={parseFloat(data.b2?.oddFeedback) || 0}
            onChange={v => set('oddFeedback', v)} placeholder="e.g., 85.5" />
        </Field>
        <Field id="b2-even-feedback" label="Even Semester Feedback (%)">
          <DecimalInput id="input-b2-even" min={0} max={100}
            value={parseFloat(data.b2?.evenFeedback) || 0}
            onChange={v => set('evenFeedback', v)} placeholder="e.g., 88.0" />
        </Field>
      </div>
    </SectionCard>
  );
}

// ════════════════════════════════════════════════════════════════
// B3 — Pedagogical Initiatives
// ════════════════════════════════════════════════════════════════
function B3Section({ data, onChange }) {
  const b3 = data.b3 || {};
  const set = (k, v) => onChange('b3', { ...b3, [k]: v });

  const rows = [
    { key: 'ict',  label: 'B.3.1  ICT Tools Used',                              hint: 'e.g., Moodle, Kahoot, Padlet' },
    { key: 'alt',  label: 'B.3.2  Alternate Assessment / In-class Assessments', hint: 'e.g., Quizzes, Role plays, Debates' },
    { key: 'cep',  label: 'B.3.3  Complex Engineering Problems / Case Studies',  hint: 'B.Tech/M.Tech: CEP · MBA: Case Studies' },
    { key: 'proj', label: 'B.3.4  Course End Projects / Survey & Study Reports', hint: 'B.Tech/M.Tech: Projects · MBA: Reports' },
    { key: 'itm',  label: 'B.3.5  Innovative Teaching / Active Learning',        hint: 'e.g., Flipped classroom, PBL, Jigsaw' },
    { key: 'cd',   label: 'B.3.6  Content Development (individual basis)',       hint: 'Video Lectures, Lab Manual, Handouts, CIM — individual only' },
  ];

  return (
    <SectionCard id="b3" title="B.3  Pedagogical Initiatives" icon="🎨">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
        {rows.map(r => (
          <Field key={r.key} id={`b3-${r.key}`} label={r.label} hint={r.hint}>
            <FocusInput id={`input-b3-${r.key}`} 
              value={b3[r.key] || ''} onChange={v => set(r.key, v)} placeholder="Description" />
          </Field>
        ))}
      </div>

      <div id="b3-7-block" style={{ background: THEME.warningBg, border: `1px solid ${THEME.warningBorder}`, borderRadius: THEME.radius, padding: '14px 16px', marginTop: 8 }}>
        <p style={{ fontWeight: 600, color: THEME.warning, fontSize: 13, marginBottom: 4 }}>
          B.3.7  Awareness on OBE
        </p>
        <p style={{ fontSize: 12, color: THEME.textMuted, marginBottom: 10 }}>
          Describe your understanding of Outcome-Based Education. Assessed during Face-to-Face interaction.
        </p>
        <textarea
          id="input-b3-obe"
          className="form-textarea form-textarea--obe"
          rows={4}
          placeholder="Describe your awareness and implementation of OBE concepts..."
          value={b3.obeText || ''}
          onChange={e => set('obeText', e.target.value)}
          style={{ ...inp(false), resize: 'vertical', lineHeight: 1.5 }}
        />
      </div>
    </SectionCard>
  );
}

// ════════════════════════════════════════════════════════════════
// B4 — Student Mentoring
// ════════════════════════════════════════════════════════════════
function B4Section({ data, onChange }) {
  const b4 = {
    n: 0,
    meetFreq: '',
    n1: 0,
    n2: 0,
    events: 0,
    awards: 0,
    nptel: 0,
    certs: 0,
    n3: 0,
    ...(data.b4 || {}),
  };

  const n = Number(b4.n) || 0;

  const set = (key, value) => {
    onChange('b4', {
      ...b4,
      [key]: value,
    });
  };

  const FREQ_OPTIONS = [
    'Weekly',
    'Bi-Weekly',
    'Twice per Month',
    'Monthly',
    'Once per Semester',
  ];

  return (
    <SectionCard id="b4" title="B.4  Student Mentoring" icon="🧑‍🎓">

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0 24px'
      }}>

        {/* B.4.1 */}
        <Field id="b4-n" label="B.4.1  Total Students Mentored (N)">
          <NumInput
            id="input-b4-n"
            min={0}
            value={n}
            onChange={(v) => set('n', v)}
          />
        </Field>

        {/* B.4.2 */}
        <Field id="b4-freq" label="B.4.2  Frequency of Mentor-Mentee Meetings">
          <select
            id="input-b4-freq"
            value={b4.meetFreq}
            onChange={(e) => set('meetFreq', e.target.value)}
            style={selInp(false)}
          >
            <option value="">— Select Frequency —</option>
            {FREQ_OPTIONS.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>

        {/* B.4.3 */}
        <Field id="b4-n1" label="B.4.3  Students Cleared All Courses (N1)">
          <NumInput
            id="input-b4-n1"
            min={0}
            max={n || undefined}
            value={b4.n1}
            onChange={(v) => set('n1', v)}
          />
        </Field>

        {/* B.4.4 */}
        <Field id="b4-n2" label="B.4.4  Students Cleared All Courses (N2)">
          <NumInput
            id="input-b4-n2"
            min={0}
            max={n || undefined}
            value={b4.n2}
            onChange={(v) => set('n2', v)}
          />
        </Field>

        {/* B.4.5 */}
        <Field id="b4-events" label="B.4.5  Inter-Institutional Events">
          <NumInput
            id="input-b4-events"
            min={0}
            max={n || undefined}
            value={b4.events}
            onChange={(v) => set('events', v)}
          />
        </Field>

        {/* B.4.6 */}
        <Field id="b4-awards" label="B.4.6  Awards / Prizes Won">
          <NumInput
            id="input-b4-awards"
            min={0}
            max={n || undefined}
            value={b4.awards}
            onChange={(v) => set('awards', v)}
          />
        </Field>

        {/* B.4.7 */}
        <Field id="b4-nptel" label="B.4.7  NPTEL / MOOC Certificates">
          <NumInput
            id="input-b4-nptel"
            min={0}
            max={n || undefined}
            value={b4.nptel}
            onChange={(v) => set('nptel', v)}
          />
        </Field>

        {/* B.4.8 */}
        <Field id="b4-certs" label="B.4.8  Industry Certifications">
          <NumInput
            id="input-b4-certs"
            min={0}
            max={n || undefined}
            value={b4.certs}
            onChange={(v) => set('certs', v)}
          />
        </Field>

        {/* B.4.9 (Full width row) */}
        <div style={{ gridColumn: '1 / span 2' }}>
          <Field id="b4-n3" label="B.4.9  Students with Attendance ≥ 75%">
            <NumInput
              id="input-b4-n3"
              min={0}
              max={n || undefined}
              value={b4.n3}
              onChange={(v) => set('n3', v)}
            />
          </Field>
        </div>

      </div>

    </SectionCard>
  );
}

// ════════════════════════════════════════════════════════════════
// PartB — Main Component with Tabs
// ════════════════════════════════════════════════════════════════
const TABS = [
  { key: 'b1', label: 'B.1  Courses' },
  { key: 'b2', label: 'B.2  Feedback' },
  { key: 'b3', label: 'B.3  Pedagogy' },
  { key: 'b4', label: 'B.4  Mentoring' },
];

export default function PartB({ user, navigate, formData, updateSection }) {
  const [tab, setTab] = useState('b1');
  const [data, setData] = useState(formData?.partB || {});
  const [saved, setSaved] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  const onChange = (key, value) => setData(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    updateSection('partB', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const S = {
    page: {
      minHeight: '100vh', background: THEME.bg, fontFamily: THEME.fontBody,
      opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease',
    },
    body:    { maxWidth: 960, margin: '0 auto', padding: '32px 28px 60px' },
    topRow:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    title:   { fontFamily: THEME.fontHeading, fontSize: 30, fontWeight: 600, color: THEME.primary },
    tabs: {
      display: 'flex', gap: 4, background: THEME.cardBg,
      border: `1px solid ${THEME.border}`, borderRadius: THEME.radiusLg,
      padding: 4, marginBottom: 20,
    },
    tabBtn: (active) => ({
      flex: 1, padding: '9px 4px', borderRadius: THEME.radius, border: 'none',
      background: active ? THEME.primary : 'transparent',
      color: active ? '#fff' : THEME.textMuted,
      fontSize: 13, fontWeight: active ? 600 : 400,
      cursor: 'pointer', fontFamily: THEME.fontBody, transition: 'all 0.15s',
    }),
    saveRow: { display: 'flex', justifyContent: 'flex-end', gap: 12, alignItems: 'center', marginTop: 16 },
    saveBtn: {
      background: `linear-gradient(135deg, ${THEME.primaryMid}, ${THEME.primaryDark})`,
      color: '#fff', border: 'none', borderRadius: THEME.radius,
      padding: '10px 28px', fontSize: 14, fontWeight: 600,
      cursor: 'pointer', fontFamily: THEME.fontBody, boxShadow: THEME.shadow,
    },
    savedBadge: {
      background: THEME.successBg, border: `1px solid ${THEME.successBorder}`,
      color: THEME.success, borderRadius: THEME.radius,
      padding: '8px 14px', fontSize: 13, fontWeight: 600,
      display: saved ? 'flex' : 'none', alignItems: 'center', gap: 5,
    },
  };

  return (
    <div id="part-b-page" className="part-b-page" style={S.page}>
      <TopBar user={user} navigate={navigate} currentPage="partB" title="Part B – Teaching, Learning & Evaluation" />

      <div id="part-b-body" style={S.body}>
        <div id="part-b-top-row" style={S.topRow}>
          <div>
            <h2 id="part-b-title" style={S.title}>Part B</h2>
            <p style={{ fontSize: 14, color: THEME.textMuted, marginTop: 2 }}>
              Teaching, Learning and Evaluation
            </p>
          </div>
        </div>

        <div id="part-b-tabs" className="part-b-tabs" role="tablist" style={S.tabs}>
          {TABS.map(t => (
            <button
              key={t.key}
              id={`tab-${t.key}`}
              className={`tab-btn tab-btn--${t.key}`}
              role="tab"
              aria-selected={tab === t.key}
              style={S.tabBtn(tab === t.key)}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div id="part-b-tab-content" className="tab-content">
          {tab === 'b1' && <B1Section data={data} onChange={onChange} />}
          {tab === 'b2' && <B2Section data={data} onChange={onChange} />}
          {tab === 'b3' && <B3Section data={data} onChange={onChange} />}
          {tab === 'b4' && <B4Section data={data} onChange={onChange} />}
        </div>

        <div id="part-b-save-row" style={S.saveRow}>
          <div id="part-b-saved-badge" style={S.savedBadge}>✅ Saved successfully</div>
          <button
            id="part-b-save-btn"
            style={S.saveBtn}
            onClick={handleSave}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Save Part B
          </button>
        </div>
      </div>
    </div>
  );
}