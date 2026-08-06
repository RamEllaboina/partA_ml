// ─────────────────────────────────────────────────────────────────
// PartE.jsx  —  CBIT Faculty ERP  |  Part E: Additional Information
// ─────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { THEME, labelStyle } from './Theme';
import { TopBar } from './Home';

// ── Shared primitives ─────────────────────────────────────────────
const inp = (f = false) => ({
  width: '100%', padding: '8px 12px', borderRadius: THEME.radius,
  border: `1.5px solid ${f ? THEME.primary : THEME.border}`,
  background: '#fff', color: THEME.text, fontSize: 13,
  fontFamily: THEME.fontBody, outline: 'none', boxSizing: 'border-box',
});

const FInput = ({ id, value, onChange, placeholder, style = {} }) => {
  const [f, setF] = useState(false);
  return (
    <input id={id} className={`form-input form-input--${id}`}
      style={{ ...inp(f), ...style }} type="text" value={value}
      onChange={e => onChange(e.target.value)} placeholder={placeholder}
      onFocus={() => setF(true)} onBlur={() => setF(false)} />
  );
};

const FTextArea = ({ id, value, onChange, placeholder, rows = 4, style = {} }) => {
  const [f, setF] = useState(false);
  return (
    <textarea id={id} className={`form-input form-textarea--${id}`}
      style={{ ...inp(f), resize: 'vertical', ...style }} rows={rows} value={value}
      onChange={e => onChange(e.target.value)} placeholder={placeholder}
      onFocus={() => setF(true)} onBlur={() => setF(false)} />
  );
};

// ── Card Wrapper ──────────────────────────────────────────────────
function DataCard({ id, title, icon, note, children }) {
  return (
    <div id={`card-${id}`} className={`data-card data-card--${id}`}
      style={{ background: THEME.cardBg, borderRadius: THEME.radiusLg, border: `1px solid ${THEME.border}`, boxShadow: THEME.shadow, padding: '20px 24px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${THEME.borderLight}` }}>
        <h3 style={{ fontFamily: THEME.fontHeading, fontSize: 17, fontWeight: 600, color: THEME.text, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>{icon}</span>{title}
        </h3>
        {note && <div style={{ fontSize: 12, color: THEME.textLight }}>{note}</div>}
      </div>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PartE — Main Component
// ════════════════════════════════════════════════════════════════
export default function PartE({ user, navigate, formData, updateSection }) {
  // data corresponds to the additional_info json object in the schema
  const [data,    setData]    = useState(formData?.partE?.additional_info || { description: '', document: '' });
  const [saved,   setSaved]   = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  const handleSave = () => {
    updateSection('partE', { additional_info: data });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const S = {
    page:  { minHeight: '100vh', background: THEME.bg, fontFamily: THEME.fontBody, opacity: visible ? 1 : 0, transition: 'opacity 0.35s' },
    body:  { maxWidth: 1040, margin: '0 auto', padding: '32px 28px 60px' },
    topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    title: { fontFamily: THEME.fontHeading, fontSize: 30, fontWeight: 600, color: THEME.primary },
    saveRow: { display: 'flex', justifyContent: 'flex-end', gap: 12, alignItems: 'center', marginTop: 16 },
    saveBtn: { background: `linear-gradient(135deg, ${THEME.primaryMid}, ${THEME.primaryDark})`, color: '#fff', border: 'none', borderRadius: THEME.radius, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: THEME.fontBody, boxShadow: THEME.shadow },
    savedBadge: { background: THEME.successBg, border: `1px solid ${THEME.successBorder}`, color: THEME.success, borderRadius: THEME.radius, padding: '8px 14px', fontSize: 13, fontWeight: 600, display: saved ? 'flex' : 'none', alignItems: 'center', gap: 5 },
  };

  return (
    <div id="part-e-page" className="part-e-page" style={S.page}>
      <TopBar user={user} navigate={navigate} currentPage="partE" title="Part E – Additional Information" />
      <div id="part-e-body" style={S.body}>
        <div id="part-e-top-row" style={S.topRow}>
          <div>
            <h2 id="part-e-title" style={S.title}>Part E</h2>
            <p style={{ fontSize: 14, color: THEME.textMuted, marginTop: 2 }}>Additional Information (Optional)</p>
          </div>
        </div>

        <div id="part-e-content">
          <DataCard id="additional_info" title="E.1 Additional Details & Documents" icon="📝">
            <div style={{ display: 'grid', gap: 20 }}>
              <div>
                <label style={labelStyle}>Description of Additional Information</label>
                <FTextArea 
                  id="desc_input" 
                  value={data.description || ''} 
                  onChange={v => setData(p => ({ ...p, description: v }))} 
                  placeholder="Provide any additional relevant information..." 
                  rows={6} 
                />
              </div>
              
              <div>
                <label style={labelStyle}>Upload PDF / Document Proof Link</label>
                <FInput 
                  id="doc_input" 
                  value={data.document || ''} 
                  onChange={v => setData(p => ({ ...p, document: v }))} 
                  placeholder="Link to PDF document or file name" 
                />
              </div>
            </div>
          </DataCard>
        </div>

        <div id="part-e-save-row" style={S.saveRow}>
          <div id="part-e-saved-badge" style={S.savedBadge}>✅ Saved successfully</div>
          <button id="part-e-save-btn" style={S.saveBtn} onClick={handleSave}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            Save Part E
          </button>
        </div>
      </div>
    </div>
  );
}