// ─────────────────────────────────────────────────────────────────
// Login.jsx  —  CBIT Faculty ERP  |  Authentication Page
// ─────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { THEME } from './Theme';

// ── Captcha Generator ────────────────────────────────────────────
const newCaptcha = () => {
  const a = Math.floor(Math.random() * 12) + 1;
  const b = Math.floor(Math.random() * 12) + 1;
  const useAdd = Math.random() > 0.3;
  return useAdd
    ? { question: `${a} + ${b}`, answer: a + b }
    : { question: `${Math.max(a, b)} − ${Math.min(a, b)}`, answer: Math.abs(a - b) };
};

// ── Decorative background circles ───────────────────────────────
const DECORATIONS = [
  { size: 320, top: -80,  left: -100, opacity: 0.08 },
  { size: 200, top: '55%', left: -60, opacity: 0.06 },
  { size: 260, top: 10,   left: '55%', opacity: 0.05 },
  { size: 140, top: '75%', left: '65%', opacity: 0.07 },
];

// ── Login Component ──────────────────────────────────────────────
export default function Login({ onLogin }) {
  const [employeeId,   setEmployeeId]   = useState('');
  const [password,     setPassword]     = useState('');
  const [showPass,     setShowPass]     = useState(false);
  const [captcha,      setCaptcha]      = useState(newCaptcha);
  const [captchaInput, setCaptchaInput] = useState('');
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [visible,      setVisible]      = useState(false);
  const [focusField,   setFocusField]   = useState('');

  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  const refreshCaptcha = () => { setCaptcha(newCaptcha()); setCaptchaInput(''); };

  const handleSubmit = () => {
    setError('');
    if (!employeeId.trim()) { setError('Employee ID is required.'); return; }
    if (!password.trim())   { setError('Password is required.'); return; }
    if (!captchaInput.trim()) { setError('Please complete the security check.'); return; }
    if (parseInt(captchaInput) !== captcha.answer) {
      setError('Incorrect captcha answer. Please try again.');
      refreshCaptcha();
      return;
    }
    setLoading(true);
    // Simulate auth — replace with real API call
    setTimeout(() => {
      setLoading(false);
      onLogin({
        role: 'faculty',
        employeeId,
        name: 'Dr. Sample Faculty',
        dept: 'Computer Science & Engineering',
        designation: 'Associate Professor',
      });
    }, 1200);
  };

  // ── Styles ──────────────────────────────────────────────────────
  const S = {
    page: {
      display: 'flex',
      minHeight: '100vh',
      fontFamily: THEME.fontBody,
      background: THEME.bg,
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(8px)',
      transition: 'opacity 0.45s ease, transform 0.45s ease',
    },

    // ── Left branding panel ──────────────────────────────────────
    left: {
      width: '42%',
      minWidth: 320,
      background: `linear-gradient(155deg, ${THEME.primaryMid} 0%, ${THEME.primaryDark} 100%)`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '56px 40px',
      position: 'relative',
      overflow: 'hidden',
    },

    decor: (d) => ({
      position: 'absolute',
      width:  d.size,
      height: d.size,
      top:    d.top,
      left:   d.left,
      borderRadius: '50%',
      border: `1px solid rgba(255,255,255,${d.opacity * 2})`,
      background: `radial-gradient(circle, rgba(255,255,255,${d.opacity}) 0%, transparent 70%)`,
      pointerEvents: 'none',
    }),

    logoRing: {
      width: 88,
      height: 88,
      borderRadius: '50%',
      border: '2px solid rgba(255,255,255,0.35)',
      background: 'rgba(255,255,255,0.12)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      boxShadow: '0 8px 24px rgba(0,0,0,0.20)',
    },
    logoText: {
      fontFamily: THEME.fontHeading,
      fontSize: 30,
      fontWeight: 600,
      color: '#fff',
      letterSpacing: 1,
    },
    collegeName: {
      fontFamily: THEME.fontHeading,
      fontSize: 28,
      fontWeight: 600,
      color: '#fff',
      textAlign: 'center',
      lineHeight: 1.25,
      marginBottom: 10,
    },
    system: {
      fontSize: 11,
      fontWeight: 600,
      color: 'rgba(255,255,255,0.65)',
      letterSpacing: '2.5px',
      textTransform: 'uppercase',
      textAlign: 'center',
      marginBottom: 36,
    },
    divider: {
      width: 40,
      height: 2,
      background: 'rgba(255,255,255,0.25)',
      borderRadius: 2,
      marginBottom: 28,
    },
    tagline: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.60)',
      textAlign: 'center',
      lineHeight: 1.65,
      maxWidth: 280,
      fontStyle: 'italic',
    },
    est: {
      position: 'absolute',
      bottom: 28,
      fontSize: 11,
      color: 'rgba(255,255,255,0.35)',
      letterSpacing: '2px',
      textTransform: 'uppercase',
    },

    // ── Right form panel ─────────────────────────────────────────
    right: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '56px 48px',
      background: THEME.cardBg,
    },

    formWrap: {
      width: '100%',
      maxWidth: 420,
    },

    formTitle: {
      fontFamily: THEME.fontHeading,
      fontSize: 34,
      fontWeight: 600,
      color: THEME.text,
      marginBottom: 4,
      lineHeight: 1.1,
    },
    formSub: {
      fontSize: 14,
      color: THEME.textMuted,
      marginBottom: 32,
    },

    // Field
    fieldGroup: { marginBottom: 18 },
    label: {
      display: 'block',
      fontSize: 11,
      fontWeight: 600,
      color: THEME.textMuted,
      letterSpacing: '0.7px',
      textTransform: 'uppercase',
      marginBottom: 6,
    },
    input: (focused) => ({
      width: '100%',
      padding: '10px 14px',
      borderRadius: THEME.radius,
      border: `1.5px solid ${focused ? THEME.primary : THEME.border}`,
      background: THEME.bg,
      color: THEME.text,
      fontSize: 14,
      fontFamily: THEME.fontBody,
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border-color 0.15s',
    }),
    passWrap: { position: 'relative' },
    eyeBtn: {
      position: 'absolute', right: 12, top: '50%',
      transform: 'translateY(-50%)',
      background: 'none', border: 'none', cursor: 'pointer',
      fontSize: 15, color: THEME.textLight,
    },

    // Captcha row
    captchaRow: { display: 'flex', gap: 10, alignItems: 'stretch' },
    captchaBadge: {
      background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`,
      color: '#fff',
      padding: '0 16px',
      borderRadius: THEME.radius,
      fontSize: 15,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      letterSpacing: 1,
      whiteSpace: 'nowrap',
      userSelect: 'none',
      minWidth: 90,
      justifyContent: 'center',
      fontFamily: THEME.fontMono,
    },
    refreshBtn: {
      background: THEME.bg,
      border: `1.5px solid ${THEME.border}`,
      borderRadius: THEME.radius,
      padding: '0 10px',
      cursor: 'pointer',
      fontSize: 16,
      color: THEME.textMuted,
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
    },

    // Error
    errBox: {
      background: THEME.errorBg,
      border: `1px solid ${THEME.errorBorder}`,
      color: THEME.error,
      borderRadius: THEME.radius,
      padding: '9px 13px',
      fontSize: 13,
      marginBottom: 16,
      display: 'flex',
      gap: 6,
      alignItems: 'flex-start',
    },

    // Submit
    submitBtn: {
      width: '100%',
      padding: '12px',
      background: `linear-gradient(135deg, ${THEME.primaryMid} 0%, ${THEME.primaryDark} 100%)`,
      color: '#fff',
      border: 'none',
      borderRadius: THEME.radius,
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      letterSpacing: '0.2px',
      fontFamily: THEME.fontBody,
      boxShadow: THEME.shadow,
      transition: 'transform 0.12s, box-shadow 0.12s, opacity 0.12s',
      marginTop: 4,
    },

    footer: {
      textAlign: 'center',
      fontSize: 11,
      color: THEME.textLight,
      marginTop: 24,
      lineHeight: 1.6,
    },
  };

  return (
    <div id="login-page" className="login-page" style={S.page}>

      {/* ── Left Branding Panel ── */}
      <div id="login-branding-panel" className="login-branding-panel" style={S.left}>
        {DECORATIONS.map((d, i) => (
          <div key={i} id={`login-decor-${i}`} className="login-decor" style={S.decor(d)} />
        ))}

        <div className="logo-circle">
        <img
            src="/logo.png"
            alt="CBIT Logo"
            style={{
            width: "85%",
            height: "85%",
            objectFit: "contain"
            }}
        />
        </div>

        <h1 id="login-college-name" className="login-college-name" style={S.collegeName}>
          Chaitanya Bharathi<br />Institute of Technology
        </h1>

        <p id="login-system-label" className="login-system-label" style={S.system}>
          Performance Appraisal System
        </p>

        <div style={S.divider} />

        <p id="login-tagline" className="login-tagline" style={S.tagline}>
          "Empowering academic excellence through transparent evaluation and continuous growth."
        </p>

        <span id="login-est" style={S.est}>Est. 1979</span>
      </div>

      {/* ── Right Form Panel ── */}
      <div id="login-form-panel" className="login-form-panel" style={S.right}>
        <div id="login-form-card" className="login-form-card" style={S.formWrap}>

          <h2 id="login-form-title" style={S.formTitle}>Welcome Back</h2>
          <p  id="login-form-subtitle" style={S.formSub}>Sign in to your appraisal portal</p>

          {/* ── Employee ID ── */}
          <div id="field-employee-id" className="form-field-group" style={S.fieldGroup}>
            <label id="label-employee-id" htmlFor="input-employee-id" style={S.label}>
              Employee ID
            </label>
            <input
              id="input-employee-id"
              className="form-input form-input--employee-id"
              style={S.input(focusField === 'eid')}
              type="text"
              placeholder="e.g., CBIT2025001"
              value={employeeId}
              onChange={e => setEmployeeId(e.target.value)}
              onFocus={() => setFocusField('eid')}
              onBlur={() => setFocusField('')}
            />
          </div>

          {/* ── Password ── */}
          <div id="field-password" className="form-field-group" style={S.fieldGroup}>
            <label id="label-password" htmlFor="input-password" style={S.label}>Password</label>
            <div id="password-wrapper" style={S.passWrap}>
              <input
                id="input-password"
                className="form-input form-input--password"
                style={{ ...S.input(focusField === 'pass'), paddingRight: 42 }}
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusField('pass')}
                onBlur={() => setFocusField('')}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              <button
                id="toggle-password-visibility"
                className="toggle-password-btn"
                style={S.eyeBtn}
                type="button"
                onClick={() => setShowPass(s => !s)}
                tabIndex={-1}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* ── Captcha ── */}
          <div id="field-captcha" className="form-field-group" style={S.fieldGroup}>
            <label id="label-captcha" htmlFor="input-captcha" style={S.label}>
              Security Check
            </label>
            <div id="captcha-container" className="captcha-container" style={S.captchaRow}>
              <div id="captcha-question" className="captcha-question" style={S.captchaBadge}>
                {captcha.question} = ?
              </div>
              <input
                id="input-captcha"
                className="form-input form-input--captcha"
                style={{ ...S.input(focusField === 'cap'), flex: 1, minWidth: 0 }}
                type="number"
                placeholder="Answer"
                value={captchaInput}
                onChange={e => setCaptchaInput(e.target.value)}
                onFocus={() => setFocusField('cap')}
                onBlur={() => setFocusField('')}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              <button
                id="refresh-captcha-btn"
                className="refresh-captcha-btn"
                style={S.refreshBtn}
                type="button"
                onClick={refreshCaptcha}
                title="Refresh captcha"
              >🔄</button>
            </div>
          </div>

          {/* ── Error Box ── */}
          {error && (
            <div id="login-error-box" className="login-error-box" role="alert" style={S.errBox}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ── Submit ── */}
          <button
            id="login-submit-btn"
            className="login-submit-btn"
            style={{ ...S.submitBtn, opacity: loading ? 0.78 : 1 }}
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = THEME.shadowMd; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = THEME.shadow; }}
          >
            {loading ? '⏳  Signing in…' : 'Sign In'}
          </button>

          <p id="login-footer-note" style={S.footer}>
            Chaitanya Bharathi Institute of Technology © 2025–26<br />
            Academic Performance Appraisal System
          </p>
        </div>
      </div>
    </div>
  );
}