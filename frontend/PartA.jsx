// ─────────────────────────────────────────────────────────────────
// PartA.jsx  —  CBIT Faculty ERP  |  Part A: Faculty Information
// ─────────────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from 'react';
import { THEME, labelStyle, cardStyle } from './Theme';
import { TopBar } from './Home';

// ── Option Lists ──────────────────────────────────────────────────
const DEPARTMENTS = [
  "Artificial Intelligence and Data Science",
  "Bio Technology",
  "Chemical Engineering",
  "Chemistry",
  "Civil Engineering",
  "Computer Science & Engineering",
  "CSE (IOT & CSBCT)",
  "CSE(AIML) & AIML",
  "Electrical & Electronics Engineering",
  "Electronics & Communication Engineering",
  "English",
  "Information Technology",
  "MBA",
  "MCA",
  "Mathematics",
  "Mechanical Engineering",
  "Physical Education",
  "Physics",
  "Other",
];

const DESIGNATIONS = [
  'Assistant Professor',
  'Associate Professor',
  'Professor',
  'Other',
];

const QUALIFICATIONS = [
  'M.Tech',
  'M.Sc',
  'M.E',
  'MBA',
  'Ph.D',
  'M.Tech + Ph.D',
  'M.E + Ph.D',
  'M.Sc + Ph.D',
  'MBA + Ph.D',
  'Other',
];

// ── Helpers ───────────────────────────────────────────────────────
const calcService = (dateStr) => {
  if (!dateStr) return '';
  const joined = new Date(dateStr);
  const ref    = new Date('2026-07-01');
  const years  = (ref - joined) / (1000 * 60 * 60 * 24 * 365.25);
  return years > 0 ? `${years.toFixed(1)} Years` : '';
};

// ── Shared input style factories ──────────────────────────────────
const inp = (focused, readOnly = false) => ({
  width: '100%',
  padding: '9px 13px',
  borderRadius: THEME.radius,
  border: `1.5px solid ${readOnly ? THEME.borderLight : focused ? THEME.primary : THEME.border}`,
  background: readOnly ? THEME.bg : '#fff',
  color: readOnly ? THEME.textMuted : THEME.text,
  fontSize: 14,
  fontFamily: THEME.fontBody,
  outline: 'none',
  boxSizing: 'border-box',
  cursor: readOnly ? 'not-allowed' : 'text',
  transition: 'border-color 0.15s',
});

const selInp = (focused) => ({
  ...inp(focused, false),
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M0 0l6 8 6-8z' fill='%23999'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: 36,
});

// ── SelectWithOther ───────────────────────────────────────────────
// A dropdown that, when "Other" is selected, slides in a text
// input below so the user can enter a custom value.
//
// Props
//   id            base id string (prefixed internally)
//   options       string[] — list including "Other" as last entry
//   value         current dropdown selection
//   otherValue    current free-text value (used only when value==="Other")
//   onChange      (selected: string) => void
//   onOtherChange (text: string) => void
//   placeholder   text input placeholder
function SelectWithOther({
  id,
  options,
  value,
  otherValue = '',
  onChange,
  onOtherChange,
  placeholder = 'Please specify…',
}) {
  const [selFocus,  setSelFocus]  = useState(false);
  const [txtFocus,  setTxtFocus]  = useState(false);
  // animate controls CSS transition; showOther keeps DOM mounted during exit
  const [showOther, setShowOther] = useState(value === 'Other');
  const [animate,   setAnimate]   = useState(value === 'Other');
  const textRef = useRef(null);

  useEffect(() => {
    if (value === 'Other') {
      setShowOther(true);
      // small tick so the element is in the DOM before the transition fires
      const t1 = setTimeout(() => setAnimate(true), 16);
      const t2 = setTimeout(() => textRef.current?.focus(), 80);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else {
      setAnimate(false);
      const t = setTimeout(() => setShowOther(false), 240);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <div
      id={`select-with-other--${id}`}
      className={`select-with-other select-with-other--${id}`}
    >
      {/* ── Dropdown ── */}
      <select
        id={`input-${id}`}
        className={`form-input form-select form-select--${id}`}
        style={selInp(selFocus)}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setSelFocus(true)}
        onBlur={() => setSelFocus(false)}
      >
        <option value="">— Select —</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      {/* ── Animated "Other" text input ── */}
      {showOther && (
        <div
          id={`other-wrapper--${id}`}
          className={`other-input-wrapper other-input-wrapper--${id}`}
          style={{
            overflow: 'hidden',
            maxHeight: animate ? 90 : 0,
            opacity: animate ? 1 : 0,
            transform: animate ? 'translateY(0)' : 'translateY(-6px)',
            transition: 'max-height 0.23s ease, opacity 0.23s ease, transform 0.23s ease',
            marginTop: 8,
          }}
        >
          {/* pill label + text input sit on one line */}
          <div style={{ position: 'relative' }}>
            {/* "OTHER" pill pinned to the left inside the input */}
            <span
              id={`other-tag--${id}`}
              className="other-tag"
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.07em',
                color: THEME.gold,
                background: THEME.goldLight,
                border: `1px solid ${THEME.goldBorder}`,
                borderRadius: 4,
                padding: '2px 7px',
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 1,
                whiteSpace: 'nowrap',
              }}
            >
              OTHER
            </span>

            <input
              ref={textRef}
              id={`other-input--${id}`}
              className={`form-input other-text-input other-text-input--${id}`}
              type="text"
              placeholder={placeholder}
              value={otherValue}
              onChange={(e) => onOtherChange(e.target.value)}
              onFocus={() => setTxtFocus(true)}
              onBlur={() => setTxtFocus(false)}
              maxLength={120}
              style={{
                ...inp(txtFocus),
                paddingLeft: 72,          // leave room for the pill
                background: THEME.goldLight,
                borderColor: txtFocus
                  ? THEME.gold
                  : otherValue
                    ? THEME.goldBorder
                    : THEME.border,
              }}
            />
          </div>

          {/* character counter */}
          <div
            id={`other-counter--${id}`}
            className="other-char-counter"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11,
              color: THEME.textMuted,
              marginTop: 4,
              paddingLeft: 2,
            }}
          >
            <span>Type your custom {id} here</span>
            <span style={{ color: otherValue.length > 100 ? THEME.error : THEME.textLight }}>
              {otherValue.length} / 120
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────
function Field({ id, label, required, children }) {
  return (
    <div id={`field-${id}`} className={`form-field form-field--${id}`} style={{ marginBottom: 20 }}>
      <label id={`label-${id}`} htmlFor={`input-${id}`} style={labelStyle}>
        {label}
        {required && <span style={{ color: THEME.error, marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

// ── Main PartA Component ──────────────────────────────────────────
export default function PartA({ user, navigate, formData, updateSection }) {
  const [data,    setData]    = useState(formData?.partA || {});
  const [focus,   setFocus]   = useState('');
  const [saved,   setSaved]   = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  const set      = (key, value) => setData((prev) => ({ ...prev, [key]: value }));
  const setOther = (key)        => (text)  => set(`${key}Other`, text);

  const handleSave = () => {
    updateSection('partA', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const svc = calcService(data.dateOfJoining);

  // ── Styles ───────────────────────────────────────────────────────
  const S = {
    page: {
      minHeight: '100vh',
      background: THEME.bg,
      fontFamily: THEME.fontBody,
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(8px)',
      transition: 'opacity 0.35s ease, transform 0.35s ease',
    },
    body:   { maxWidth: 860, margin: '0 auto', padding: '32px 28px 60px' },
    header: {
      display: 'flex', alignItems: 'flex-start',
      justifyContent: 'space-between', marginBottom: 28,
    },
    sectionTitle: {
      fontFamily: THEME.fontHeading, fontSize: 30,
      fontWeight: 600, color: THEME.primary, lineHeight: 1.1,
    },
    sectionSub: { fontSize: 14, color: THEME.textMuted, marginTop: 4 },
    badge: {
      background: THEME.primaryLight, border: `1px solid ${THEME.border}`,
      borderRadius: THEME.radiusLg, padding: '4px 12px',
      fontSize: 12, fontWeight: 600, color: THEME.primary, marginTop: 4,
    },
    card:      { ...cardStyle },
    cardTitle: {
      fontFamily: THEME.fontHeading, fontSize: 17, fontWeight: 600,
      color: THEME.text, marginBottom: 20, paddingBottom: 12,
      borderBottom: `1px solid ${THEME.borderLight}`,
      display: 'flex', alignItems: 'center', gap: 8,
    },
    twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' },
    readonlyNote: {
      background: THEME.infoBg, border: `1px solid ${THEME.infoBorder}`,
      borderRadius: THEME.radiusSm, padding: '8px 12px', fontSize: 12,
      color: THEME.info, marginBottom: 20, display: 'flex', gap: 6,
      alignItems: 'flex-start',
    },
    saveRow: {
      display: 'flex', justifyContent: 'flex-end',
      alignItems: 'center', gap: 12, marginTop: 24,
    },
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
    <div id="part-a-page" className="part-a-page" style={S.page}>
      <TopBar
        user={user}
        navigate={navigate}
        currentPage="partA"
        title="Part A – Faculty Information"
      />

      <div id="part-a-body" style={S.body}>

        {/* ── Page header ───────────────────────────────────────── */}
        <div id="part-a-header" className="section-header" style={S.header}>
          <div>
            <h2 id="part-a-title" style={S.sectionTitle}>Part A</h2>
            <p id="part-a-subtitle" style={S.sectionSub}>
              Faculty Information — Academic Year 2025–26
            </p>
          </div>
          <span id="part-a-badge" style={S.badge}>A.1 – A.9</span>
        </div>

        {/* ═══════════════════════════════════════════════════════
            Card 1 — Identity
        ════════════════════════════════════════════════════════ */}
        <div id="card-identity" className="form-card form-card--identity" style={S.card}>
          <h3 id="card-identity-title" style={S.cardTitle}>
            <span>👤</span> Identity Details
          </h3>

         

          <div id="identity-grid" className="two-col-grid" style={S.twoCol}>

            {/* A.1 — Employee ID (read-only) */}
            <Field id="employee-id" label="A.1  Employee ID" required>
              <input
                id="input-employee-id"
                className="form-input form-input--employee-id"
                style={inp(false, true)}
                type="text"
                value={data.employeeId || ''}
                readOnly
              />
            </Field>

            {/* A.2 — Name (read-only) */}
            <Field id="faculty-name" label="A.2  Name of the Faculty" required>
              <input
                id="input-faculty-name"
                className="form-input form-input--faculty-name"
                style={inp(false, true)}
                type="text"
                value={data.name || ''}
                readOnly
              />
            </Field>

            {/* A.3 — Department (SelectWithOther) */}
            <Field id="department" label="A.3  Name of the Department" required>
              <SelectWithOther
                id="department"
                options={DEPARTMENTS}
                value={data.department || ''}
                otherValue={data.departmentOther || ''}
                onChange={(val) => set('department', val)}
                onOtherChange={setOther('department')}
                placeholder="Enter your department name…"
              />
            </Field>

            {/* A.4 — Designation (SelectWithOther) */}
            <Field id="designation" label="A.4  Designation" required>
              <SelectWithOther
                id="designation"
                options={DESIGNATIONS}
                value={data.designation || ''}
                otherValue={data.designationOther || ''}
                onChange={(val) => set('designation', val)}
                onOtherChange={setOther('designation')}
                placeholder="Enter your designation…"
              />
            </Field>

          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            Card 2 — Contact & Qualification
        ════════════════════════════════════════════════════════ */}
        <div id="card-contact" className="form-card form-card--contact" style={S.card}>
          <h3 id="card-contact-title" style={S.cardTitle}>
            <span>📋</span> Contact & Qualification
          </h3>
          <div id="contact-grid" className="two-col-grid" style={S.twoCol}>

            {/* A.5 — Mobile */}
            <Field id="mobile" label="A.5  Mobile No." required>
              <input
                id="input-mobile"
                className="form-input form-input--mobile"
                style={inp(focus === 'mobile', false)}
                type="tel"
                placeholder="e.g., 9876543210"
                value={data.mobile || ''}
                onChange={(e) => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                onFocus={() => setFocus('mobile')}
                onBlur={() => setFocus('')}
                maxLength={10}
              />
            </Field>

            {/* A.6 — Qualification (SelectWithOther) */}
            <Field id="qualification" label="A.6  Highest Qualification" required>
              <SelectWithOther
                id="qualification"
                options={QUALIFICATIONS}
                value={data.qualification || ''}
                otherValue={data.qualificationOther || ''}
                onChange={(val) => set('qualification', val)}
                onOtherChange={setOther('qualification')}
                placeholder="Enter your qualification…"
              />
            </Field>

          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            Card 3 — Service Details
        ════════════════════════════════════════════════════════ */}
        <div id="card-service" className="form-card form-card--service" style={S.card}>
          <h3 id="card-service-title" style={S.cardTitle}>
            <span>📅</span> Service Details
          </h3>
          <div id="service-grid" className="two-col-grid" style={S.twoCol}>

            {/* A.7 — Date of Joining */}
            <Field id="date-joining" label="A.7  Date of Joining (Regular)" required>
              <input
                id="input-date-joining"
                className="form-input form-input--date-joining"
                style={inp(focus === 'doj', false)}
                type="date"
                value={data.dateOfJoining || ''}
                onChange={(e) => {
                  set('dateOfJoining', e.target.value);
                  set('totalService',  calcService(e.target.value));
                }}
                onFocus={() => setFocus('doj')}
                onBlur={() => setFocus('')}
                max="2026-07-01"
              />
            </Field>

            {/* A.8 — Total Service */}
            <Field id="total-service" label="A.8  Total Service after M.Tech & Ph.D (as on 1st July 2026)">
              <input
                id="input-total-service"
                className="form-input form-input--total-service"
                style={inp(focus === 'tsvc', false)}
                type="text"
                placeholder="e.g., 12.5 Years"
                value={data.totalService || svc || ''}
                onChange={(e) => set('totalService', e.target.value)}
                onFocus={() => setFocus('tsvc')}
                onBlur={() => setFocus('')}
              />
            </Field>

            {/* A.9 — CBIT Experience */}
            <Field id="cbit-experience" label="A.9  Experience at CBIT (as on 1st July 2026)">
              <input
                id="input-cbit-experience"
                className="form-input form-input--cbit-experience"
                style={inp(focus === 'cexp', false)}
                type="text"
                placeholder="e.g., 8.5 Years"
                value={data.cbitExperience || ''}
                onChange={(e) => set('cbitExperience', e.target.value)}
                onFocus={() => setFocus('cexp')}
                onBlur={() => setFocus('')}
              />
            </Field>

          </div>

          {/* Auto-calculated service hint */}
          {svc && !data.totalService && (
            <div
              id="service-auto-hint"
              className="auto-hint"
              style={{ fontSize: 12, color: THEME.success, marginTop: -10, marginBottom: 12 }}
            >
              ✓ Auto-calculated from joining date: {svc} — you may edit above.
            </div>
          )}
        </div>

        {/* ── Save Row ──────────────────────────────────────────── */}
        <div id="part-a-save-row" className="save-row" style={S.saveRow}>
          <div id="part-a-saved-badge" style={S.savedBadge}>
            ✅ Saved successfully
          </div>
          <button
            id="part-a-save-btn"
            className="save-btn btn-primary"
            style={S.saveBtn}
            onClick={handleSave}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Save Part A
          </button>
        </div>

      </div>
    </div>
  );
}