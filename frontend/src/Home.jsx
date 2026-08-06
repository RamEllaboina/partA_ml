// ─────────────────────────────────────────────────────────────────
// Home.jsx  —  CBIT Faculty ERP  |  Dashboard & Navigation Hub
// ─────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { THEME } from './Theme';

// ── Nav items ────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'partA',  label: 'Part A',  desc: 'Faculty Information',               icon: '👤', color: '#5B4FCF' },
  { id: 'partB',  label: 'Part B',  desc: 'Teaching, Learning & Evaluation',   icon: '📚', color: '#0369A1' },
  { id: 'partC',  label: 'Part C',  desc: 'Research Contribution',             icon: '🔬', color: '#047857' },
  { id: 'partD',  label: 'Part D',  desc: 'Extension & Professional Dev.',     icon: '🏅', color: '#B45309' },
  { id: 'partE',  label: 'Part E',  desc: 'Additional Information',            icon: '📝', color: '#9333EA' },
];

// ── Top Bar (shared) ─────────────────────────────────────────────
export function TopBar({ user, navigate, currentPage = 'home', title = '' }) {
  const S = {
    bar: {
      position: 'sticky', top: 0, zIndex: 100,
      background: THEME.cardBg,
      borderBottom: `1px solid ${THEME.border}`,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      height: 60,
      fontFamily: THEME.fontBody,
    },
    left: { display: 'flex', alignItems: 'center', gap: 12 },
    brand: {
      fontFamily: THEME.fontHeading,
      fontSize: 20,
      fontWeight: 600,
      color: THEME.primary,
      cursor: 'pointer',
      letterSpacing: '0.3px',
    },
    sep:   { color: THEME.border, fontSize: 20, userSelect: 'none' },
    pageTitle: { fontSize: 15, fontWeight: 500, color: THEME.text },
    right: { display: 'flex', alignItems: 'center', gap: 12 },
    userChip: {
      display: 'flex', alignItems: 'center', gap: 8,
      background: THEME.primaryLight,
      border: `1px solid ${THEME.border}`,
      borderRadius: 20,
      padding: '4px 12px 4px 8px',
    },
    avatar: {
      width: 28, height: 28, borderRadius: '50%',
      background: THEME.primary,
      color: '#fff',
      fontSize: 12, fontWeight: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    userName: { fontSize: 13, fontWeight: 500, color: THEME.text },
    logoutBtn: {
      background: 'none', border: `1px solid ${THEME.border}`,
      borderRadius: THEME.radius,
      padding: '5px 12px',
      fontSize: 12, fontWeight: 600,
      color: THEME.textMuted,
      cursor: 'pointer',
      fontFamily: THEME.fontBody,
      transition: 'all 0.15s',
    },
    homeBtn: {
      background: THEME.primaryLight,
      border: `1px solid ${THEME.border}`,
      borderRadius: THEME.radius,
      padding: '5px 12px',
      fontSize: 12, fontWeight: 600,
      color: THEME.primary,
      cursor: 'pointer',
      fontFamily: THEME.fontBody,
      display: 'flex', alignItems: 'center', gap: 4,
    },
  };

  const initials = (user?.name || 'FA').split(' ').map(w => w[0]).slice(0, 2).join('');

  return (
    <nav id="top-bar" className="top-bar" style={S.bar}>
      <div id="topbar-left" style={S.left}>
        <span id="topbar-brand" style={S.brand} onClick={() => navigate('home')}>Performance Appraisal System</span>
        {title && <><span style={S.sep}>›</span><span id="topbar-page-title" style={S.pageTitle}>{title}</span></>}
      </div>
      <div id="topbar-right" style={S.right}>
        <div id="topbar-user-chip" className="topbar-user-chip" style={S.userChip}>
          <div id="topbar-avatar" style={S.avatar}>{initials}</div>
          <span id="topbar-user-name" style={S.userName}>{user?.name || 'Faculty'}</span>
        </div>
        {currentPage !== 'home' && (
          <button id="topbar-home-btn" style={S.homeBtn} onClick={() => navigate('home')}>
            🏠 Home
          </button>
        )}
        <button
          id="topbar-logout-btn"
          style={S.logoutBtn}
          onClick={() => navigate('login')}
          onMouseEnter={e => { e.currentTarget.style.color = THEME.error; e.currentTarget.style.borderColor = THEME.errorBorder; }}
          onMouseLeave={e => { e.currentTarget.style.color = THEME.textMuted; e.currentTarget.style.borderColor = THEME.border; }}
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}

// ── Home Component ────────────────────────────────────────────────
export default function Home({ user, navigate }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  const S = {
    page: {
      minHeight: '100vh',
      background: THEME.bg,
      fontFamily: THEME.fontBody,
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(10px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
    },
    body: { maxWidth: 1100, margin: '0 auto', padding: '32px 28px 60px' },

    // Welcome
    welcome: {
      background: `linear-gradient(135deg, ${THEME.primaryMid} 0%, ${THEME.primaryDark} 100%)`,
      borderRadius: THEME.radiusXl,
      padding: '32px 36px',
      marginBottom: 28,
      position: 'relative',
      overflow: 'hidden',
      color: '#fff',
    },
    welcomeDecor: {
      position: 'absolute', right: -40, top: -40,
      width: 220, height: 220,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.06)',
    },
    welcomeDecor2: {
      position: 'absolute', right: 60, bottom: -60,
      width: 160, height: 160,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.04)',
    },
    welcomeName: {
      fontFamily: THEME.fontHeading,
      fontSize: 28,
      fontWeight: 600,
      marginBottom: 4,
    },
    welcomeMeta: { fontSize: 14, color: 'rgba(255,255,255,0.72)', marginBottom: 16 },
    welcomeYear: {
      display: 'inline-block',
      background: 'rgba(255,255,255,0.15)',
      border: '1px solid rgba(255,255,255,0.25)',
      borderRadius: 20,
      padding: '4px 14px',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.5px',
    },

    // Section label
    sectionLabel: {
      fontSize: 11,
      fontWeight: 700,
      color: THEME.textMuted,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      marginBottom: 14,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    labelLine: { flex: 1, height: 1, background: THEME.border },

    // Nav cards container (Flexbox for centering)
    navGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center', 
      gap: 20,
      marginBottom: 28,
    },
    navCard: (color) => ({
      background: THEME.cardBg,
      border: `1px solid ${THEME.border}`,
      borderRadius: THEME.radiusLg,
      padding: '24px 20px', 
      minHeight: '130px',
      flex: '1 1 240px', // Base width reduced to 240px
      maxWidth: '280px', // Max width reduced to 280px
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      boxShadow: THEME.shadow,
      transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.15s',
      textAlign: 'center',
    }),
    navIcon: { fontSize: 34, marginBottom: 12 },
    navLabel: { fontFamily: THEME.fontHeading, fontSize: 18, fontWeight: 600, color: THEME.text, marginBottom: 6 },
    navDesc:  { fontSize: 12, color: THEME.textMuted, lineHeight: 1.4 },
  };

  return (
    <div id="home-page" className="home-page" style={S.page}>
      <TopBar user={user} navigate={navigate} currentPage="home" />

      <div id="home-body" style={S.body}>

        {/* ── Welcome Banner ── */}
        <div id="home-welcome-banner" className="home-welcome-banner" style={S.welcome}>
          <div style={S.welcomeDecor} /><div style={S.welcomeDecor2} />
          <div style={{ position: 'relative' }}>
            <p id="welcome-name" style={S.welcomeName}>Welcome, {user?.name || 'Faculty'}</p>
            <p id="welcome-meta" style={S.welcomeMeta}>
              {user?.dept} &nbsp;·&nbsp; {user?.designation} &nbsp;·&nbsp; ID: {user?.employeeId}
            </p>
            <span id="welcome-year" style={S.welcomeYear}>Academic Year 2025–26</span>
          </div>
        </div>

        {/* ── Navigate to Sections ── */}
        <p id="section-nav-label" style={S.sectionLabel}>
          Appraisal Sections
          <span style={S.labelLine} />
        </p>
        <div id="nav-cards-grid" className="nav-cards-grid" style={S.navGrid}>
          {NAV_ITEMS.map(item => (
            <div
              key={item.id}
              id={`nav-card-${item.id}`}
              className={`nav-card nav-card--${item.id}`}
              style={S.navCard(item.color)}
              onClick={() => navigate(item.id)}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = THEME.shadowMd;
                el.style.borderColor = item.color;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.transform = 'none';
                el.style.boxShadow = THEME.shadow;
                el.style.borderColor = THEME.border;
              }}
            >
              <div id={`nav-icon-${item.id}`} style={S.navIcon}>{item.icon}</div>
              <div id={`nav-label-${item.id}`} style={S.navLabel}>{item.label}</div>
              <div id={`nav-desc-${item.id}`}  style={S.navDesc}>{item.desc}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}