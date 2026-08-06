// ─────────────────────────────────────────────────────────────────
// PartD.jsx  —  CBIT Faculty ERP  |  Part D: Extension Activities
// ─────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { THEME, labelStyle, newId } from './Theme';
import { TopBar } from './Home';

// ── Shared primitives ─────────────────────────────────────────────
const inp = (f = false) => ({
  width: '100%', padding: '8px 12px', borderRadius: THEME.radius,
  border: `1.5px solid ${f ? THEME.primary : THEME.border}`,
  background: '#fff', color: THEME.text, fontSize: 13,
  fontFamily: THEME.fontBody, outline: 'none', boxSizing: 'border-box',
});

const selStyle = (f) => ({
  ...inp(f), appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7'%3E%3Cpath d='M0 0l5 7 5-7z' fill='%23999'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: 30,
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

const NInput = ({ id, value, onChange, min = 0, max, placeholder = '0', style = {} }) => {
  const [f, setF] = useState(false);
  return (
    <input id={id} className={`form-input num-input num-input--${id}`}
      style={{ ...inp(f), ...style }} type="number" min={min} max={max}
      value={value === 0 ? '' : value} placeholder={placeholder}
      onChange={e => { const v = parseInt(e.target.value, 10); onChange(isNaN(v) ? 0 : (max !== undefined ? Math.min(Math.max(v, min), max) : Math.max(v, min))); }}
      onFocus={() => setF(true)} onBlur={() => setF(false)} />
  );
};

const FSel = ({ id, value, onChange, options }) => {
  const [f, setF] = useState(false);
  return (
    <select id={id} className={`form-input form-select form-select--${id}`}
      style={selStyle(f)} value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setF(true)} onBlur={() => setF(false)}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
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

// ── Dynamic Table ─────────────────────────────────────────────────
function DynTable({ id, columns, rows, onAdd, onUpdate, onRemove, addLabel = '+ Add Row' }) {
  return (
    <div id={`table-${id}`} className={`dyn-table dyn-table--${id}`}>
      {rows.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table id={`tbl-${id}`} style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead id={`thead-${id}`}>
              <tr style={{ background: THEME.bg }}>
                {columns.map(c => (
                  <th key={c.key} id={`th-${id}-${c.key}`}
                    style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, fontWeight: 700,
                      color: THEME.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px',
                      borderBottom: `2px solid ${THEME.border}`, whiteSpace: 'nowrap', width: c.width || 'auto' }}>
                    {c.label}
                  </th>
                ))}
                <th style={{ width: 36, borderBottom: `2px solid ${THEME.border}` }} />
              </tr>
            </thead>
            <tbody id={`tbody-${id}`}>
              {rows.map((row, idx) => (
                <tr key={row.id || idx} id={`tr-${id}-${idx}`} className={`trow trow--${id}`}
                  style={{ borderBottom: `1px solid ${THEME.borderLight}` }}>
                  {columns.map(c => (
                    <td key={c.key} id={`td-${id}-${idx}-${c.key}`}
                      style={{ padding: '7px 8px', verticalAlign: 'middle' }}>
                      {c.type === 'select'
                        ? <FSel id={`sel-${id}-${idx}-${c.key}`} value={row[c.key] || ''}
                            onChange={v => onUpdate(row.id, c.key, v)} options={c.options} />
                        : c.type === 'number'
                          ? <NInput id={`ni-${id}-${idx}-${c.key}`} value={row[c.key] || 0}
                              min={c.min || 0} max={c.max} placeholder={c.placeholder || '0'}
                              onChange={v => onUpdate(row.id, c.key, v)} />
                          : <FInput id={`fi-${id}-${idx}-${c.key}`} value={row[c.key] || ''}
                              onChange={v => onUpdate(row.id, c.key, v)} placeholder={c.placeholder || ''} />
                      }
                    </td>
                  ))}
                  <td style={{ padding: '7px 8px', textAlign: 'center' }}>
                    <button id={`rm-${id}-${row.id}`}
                      onClick={() => onRemove(row.id)}
                      style={{ background: THEME.errorBg, border: `1px solid ${THEME.errorBorder}`, borderRadius: THEME.radiusSm,
                        color: THEME.error, cursor: 'pointer', padding: '4px 8px', fontSize: 12 }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button id={`add-${id}`} className={`add-row-btn add-row-btn--${id}`}
        onClick={onAdd}
        style={{ marginTop: 10, background: THEME.bg, border: `1.5px dashed ${THEME.border}`,
          borderRadius: THEME.radius, padding: '8px 16px', color: THEME.primary, cursor: 'pointer',
          fontSize: 13, fontWeight: 600, fontFamily: THEME.fontBody, width: '100%', transition: 'all 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = THEME.primary; e.currentTarget.style.background = THEME.primaryLight; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = THEME.border; e.currentTarget.style.background = THEME.bg; }}
      >
        {addLabel}
      </button>
    </div>
  );
}


// ── D.1.1 Trainings Attended ──────────────────────────────────────
function D11Trainings({ rows, setRows }) {
  const TYPE_OPT = [
    { value: 'FDP', label: 'FDP' },
    { value: 'NPTEL', label: 'NPTEL Course' },
    { value: 'Internship', label: 'Internship' }
  ];
  const cols = [
    { key: 'type', label: 'Type', type: 'select', options: TYPE_OPT },
    { key: 'title', label: 'Title / Topic', placeholder: 'Training title' },
    { key: 'duration', label: 'Duration', placeholder: 'e.g. 2 Weeks' },
    { key: 'proof', label: 'Proof', placeholder: 'Link/Doc' },
  ];
  return (
    <DataCard id="trainings" title="D.1.1 Trainings Attended (FDP/NPTEL/Internships)" icon="📚">
      <DynTable id="trainings_attended" columns={cols} rows={rows}
        onAdd={() => setRows(p => [...p, { id: newId(), type: 'FDP', title: '', duration: '', proof: '' }])}
        onUpdate={(id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
        onRemove={(id) => setRows(p => p.filter(r => r.id !== id))}
        addLabel="+ Add Training" />
    </DataCard>
  );
}

// ── D.1.1 Workshops Attended ──────────────────────────────────────
function D11Workshops({ rows, setRows }) {
  const cols = [
    { key: 'title', label: 'Workshop Title', placeholder: 'Workshop title' },
    { key: 'duration', label: 'Duration', placeholder: 'e.g. 3 Days' },
    { key: 'description', label: 'Description', placeholder: 'Details' },
    { key: 'proof', label: 'Proof', placeholder: 'Link/Doc' },
  ];
  return (
    <DataCard id="workshops" title="D.1.1 Workshops Attended" icon="🛠️">
      <DynTable id="workshops" columns={cols} rows={rows}
        onAdd={() => setRows(p => [...p, { id: newId(), title: '', duration: '', description: '', proof: '' }])}
        onUpdate={(id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
        onRemove={(id) => setRows(p => p.filter(r => r.id !== id))}
        addLabel="+ Add Workshop" />
    </DataCard>
  );
}

// ── D.1.1 Certifications ──────────────────────────────────────────
function D11Certifications({ rows, setRows }) {
  const cols = [
    { key: 'title', label: 'Certification Name', placeholder: 'Certification' },
    { key: 'organization', label: 'Organization', placeholder: 'e.g. Coursera, AWS' },
    { key: 'description', label: 'Description', placeholder: 'Details' },
    { key: 'duration', label: 'Duration', placeholder: 'e.g. 40 Hrs' },
    { key: 'proof', label: 'Proof', placeholder: 'Link/Doc' },
  ];
  return (
    <DataCard id="certifications" title="D.1.1 Certifications Completed" icon="📜">
      <DynTable id="certifications" columns={cols} rows={rows}
        onAdd={() => setRows(p => [...p, { id: newId(), title: '', organization: '', description: '', duration: '', proof: '' }])}
        onUpdate={(id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
        onRemove={(id) => setRows(p => p.filter(r => r.id !== id))}
        addLabel="+ Add Certification" />
    </DataCard>
  );
}

// ── D.1.2 Training Conducted ──────────────────────────────────────
function D12Conducted({ rows, setRows }) {
  const ROLE_OPT = [{ value: 'Coordinator', label: 'Coordinator' }, { value: 'Co-coordinator', label: 'Co-coordinator' }];
  const TYPE_OPT = [{ value: 'FDP', label: 'FDP' }, { value: 'STTP', label: 'STTP' }, { value: 'Workshop', label: 'Workshop' }];
  const cols = [
    { key: 'role', label: 'Role', type: 'select', options: ROLE_OPT },
    { key: 'program_type', label: 'Program Type', type: 'select', options: TYPE_OPT },
    { key: 'duration', label: 'Duration', placeholder: 'e.g. 1 Week' },
    { key: 'count', label: 'Count / Times', type: 'number', placeholder: '1' },
    { key: 'proof', label: 'Proof', placeholder: 'Link/Doc' },
  ];
  return (
    <DataCard id="training_conducted" title="D.1.2 Training Conducted" icon="👨‍🏫">
      <DynTable id="training_conducted" columns={cols} rows={rows}
        onAdd={() => setRows(p => [...p, { id: newId(), role: 'Coordinator', program_type: 'FDP', duration: '', count: 1, proof: '' }])}
        onUpdate={(id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
        onRemove={(id) => setRows(p => p.filter(r => r.id !== id))}
        addLabel="+ Add Conducted Training" />
    </DataCard>
  );
}

// ── D.1.3 Value Added Courses ─────────────────────────────────────
function D13ValueAdded({ rows, setRows }) {
  const cols = [
    { key: 'title', label: 'Course Title', placeholder: 'Course name' },
    { key: 'duration_hours', label: 'Duration (Hrs)', type: 'number', placeholder: 'e.g. 30' },
    { key: 'count', label: 'Count / Batches', type: 'number', placeholder: '1' },
    { key: 'proof', label: 'Proof', placeholder: 'Link/Doc' },
  ];
  return (
    <DataCard id="value_added_courses" title="D.1.3 Value Added / Add-on Courses" icon="➕">
      <DynTable id="value_added_courses" columns={cols} rows={rows}
        onAdd={() => setRows(p => [...p, { id: newId(), title: '', duration_hours: 30, count: 1, proof: '' }])}
        onUpdate={(id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
        onRemove={(id) => setRows(p => p.filter(r => r.id !== id))}
        addLabel="+ Add Value Added Course" />
    </DataCard>
  );
}

// ── D.2.1 Professional Memberships ────────────────────────────────
function D21Memberships({ rows, setRows }) {
  const MEM_OPT = [{ value: 'Lifetime', label: 'Lifetime' }, { value: 'Annual', label: 'Annual' }];
  const cols = [
    { key: 'society_name', label: 'Society Name', placeholder: 'e.g. IEEE, ACM, ASME' },
    { key: 'membership_type', label: 'Membership Type', type: 'select', options: MEM_OPT },
    { key: 'count', label: 'Count / Years', type: 'number', placeholder: '1' },
    { key: 'proof', label: 'Proof', placeholder: 'Link/Doc' },
  ];
  return (
    <DataCard id="professional_memberships" title="D.2.1 Membership of Professional Societies" icon="🤝">
      <DynTable id="professional_memberships" columns={cols} rows={rows}
        onAdd={() => setRows(p => [...p, { id: newId(), society_name: '', membership_type: 'Lifetime', count: 1, proof: '' }])}
        onUpdate={(id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
        onRemove={(id) => setRows(p => p.filter(r => r.id !== id))}
        addLabel="+ Add Membership" />
    </DataCard>
  );
}

// ── D.2.2 Interactions with Outside World ─────────────────────────
function D22Interactions({ rows, setRows }) {
  const ACT_OPT = [
    { value: 'Accreditation/Governing Body', label: 'Accreditation/Governing Body' },
    { value: 'Journal Editor', label: 'Journal Editor' },
    { value: 'Project Examiner', label: 'Project Examiner' },
    { value: 'Question Paper Setting', label: 'Question Paper Setting' },
    { value: 'Resource Person/Reviewer', label: 'Resource Person/Reviewer' },
    { value: 'International Visit', label: 'International Visit' },
    { value: 'MOU Establishment', label: 'MOU Establishment' },
  ];
  const cols = [
    { key: 'activity_type', label: 'Activity Type', type: 'select', options: ACT_OPT },
    { key: 'description', label: 'Description', placeholder: 'Details of interaction' },
    { key: 'add_on', label: 'Add-on Details', placeholder: 'e.g. Q1 Journal / M.Tech' },
    { key: 'proof', label: 'Proof', placeholder: 'Link/Doc' },
  ];
  return (
    <DataCard id="interactions" title="D.2.2 Interactions with Outside World" icon="🌍">
      <DynTable id="interactions" columns={cols} rows={rows}
        onAdd={() => setRows(p => [...p, { id: newId(), activity_type: 'Resource Person/Reviewer', description: '', add_on: '', proof: '' }])}
        onUpdate={(id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
        onRemove={(id) => setRows(p => p.filter(r => r.id !== id))}
        addLabel="+ Add Interaction" />
    </DataCard>
  );
}

// ── D.2.3 Awards and Achievements ─────────────────────────────────
function D23Awards({ rows, setRows }) {
  const cols = [
    { key: 'title', label: 'Award Title', placeholder: 'e.g. Best Teacher, Gold Medal' },
    { key: 'description', label: 'Description', placeholder: 'Awarding body / context' },
    { key: 'year', label: 'Year', type: 'number', placeholder: 'YYYY' },
    { key: 'proof', label: 'Proof', placeholder: 'Link/Doc' },
  ];
  return (
    <DataCard id="awards" title="D.2.3 Awards and Achievements" icon="🏆">
      <DynTable id="awards" columns={cols} rows={rows}
        onAdd={() => setRows(p => [...p, { id: newId(), title: '', description: '', year: new Date().getFullYear(), proof: '' }])}
        onUpdate={(id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
        onRemove={(id) => setRows(p => p.filter(r => r.id !== id))}
        addLabel="+ Add Award" />
    </DataCard>
  );
}

// ── D.3 Contribution in Administration ────────────────────────────
function D3Contributions({ instData, setInstData, deptData, setDeptData }) {
  return (
    <>
      <DataCard id="inst_contribution" title="D.3.1 Contribution to Institution" icon="🏛️" note="Max 200 words">
        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={labelStyle}>Description of Contribution</label>
            <FTextArea id="inst_desc" value={instData.description || ''} 
              onChange={v => setInstData(p => ({ ...p, description: v }))} 
              placeholder="Describe your contributions at the institution level..." rows={4} />
          </div>
          <div>
            <label style={{...labelStyle, color: THEME.textMuted}}>Principal Authentication and Appraisal (Read-Only)</label>
            <FTextArea id="inst_remarks" value={instData.principal_remarks || ''} 
              onChange={() => {}} placeholder="Awaiting appraisal..." rows={2} 
              style={{ background: THEME.bg, cursor: 'not-allowed', color: THEME.textMuted }} />
          </div>
        </div>
      </DataCard>

      <DataCard id="dept_contribution" title="D.3.2 Contribution to Department" icon="🏢" note="Max 500 words">
        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={labelStyle}>Description of Contribution</label>
            <FTextArea id="dept_desc" value={deptData.description || ''} 
              onChange={v => setDeptData(p => ({ ...p, description: v }))} 
              placeholder="Describe your contributions at the departmental level..." rows={6} />
          </div>
          <div>
            <label style={{...labelStyle, color: THEME.textMuted}}>HOD Authentication and Appraisal (Read-Only)</label>
            <FTextArea id="dept_remarks" value={deptData.hod_remarks || ''} 
              onChange={() => {}} placeholder="Awaiting appraisal..." rows={2} 
              style={{ background: THEME.bg, cursor: 'not-allowed', color: THEME.textMuted }} />
          </div>
        </div>
      </DataCard>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// PartD — Main Component
// ════════════════════════════════════════════════════════════════
const TABS = [
  { key: 'd1', label: 'D.1 Professional Dev.' },
  { key: 'd2', label: 'D.2 Interactions & Awards' },
  { key: 'd3', label: 'D.3 Administration' },
];

export default function PartD({ user, navigate, formData, updateSection }) {
  const [tab,     setTab]     = useState('d1');
  const [data,    setData]    = useState(formData?.partD || {});
  const [saved,   setSaved]   = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  const setSection = (key, val) => setData(p => ({ ...p, [key]: typeof val === 'function' ? val(p[key] || (key.includes('contribution') ? {} : [])) : val }));

  const handleSave = () => {
    updateSection('partD', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const S = {
    page:  { minHeight: '100vh', background: THEME.bg, fontFamily: THEME.fontBody, opacity: visible ? 1 : 0, transition: 'opacity 0.35s' },
    body:  { maxWidth: 1040, margin: '0 auto', padding: '32px 28px 60px' },
    topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    title: { fontFamily: THEME.fontHeading, fontSize: 30, fontWeight: 600, color: THEME.primary },
    tabs:  { display: 'flex', flexWrap: 'wrap', gap: 4, background: THEME.cardBg, border: `1px solid ${THEME.border}`, borderRadius: THEME.radiusLg, padding: 4, marginBottom: 20 },
    tabBtn: (a) => ({ flex: 1, minWidth: '150px', padding: '9px 4px', borderRadius: THEME.radius, border: 'none', background: a ? THEME.primary : 'transparent', color: a ? '#fff' : THEME.textMuted, fontSize: 13, fontWeight: a ? 600 : 400, cursor: 'pointer', fontFamily: THEME.fontBody, transition: 'all 0.15s' }),
    saveRow: { display: 'flex', justifyContent: 'flex-end', gap: 12, alignItems: 'center', marginTop: 16 },
    saveBtn: { background: `linear-gradient(135deg, ${THEME.primaryMid}, ${THEME.primaryDark})`, color: '#fff', border: 'none', borderRadius: THEME.radius, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: THEME.fontBody, boxShadow: THEME.shadow },
    savedBadge: { background: THEME.successBg, border: `1px solid ${THEME.successBorder}`, color: THEME.success, borderRadius: THEME.radius, padding: '8px 14px', fontSize: 13, fontWeight: 600, display: saved ? 'flex' : 'none', alignItems: 'center', gap: 5 },
  };

  return (
    <div id="part-d-page" className="part-d-page" style={S.page}>
      <TopBar user={user} navigate={navigate} currentPage="partD" title="Part D – Extension Activities" />
      <div id="part-d-body" style={S.body}>
        <div id="part-d-top-row" style={S.topRow}>
          <div>
            <h2 id="part-d-title" style={S.title}>Part D</h2>
            <p style={{ fontSize: 14, color: THEME.textMuted, marginTop: 2 }}>Extension Activities and Professional Development</p>
          </div>
        </div>

        <div id="part-d-tabs" className="part-d-tabs" role="tablist" style={S.tabs}>
          {TABS.map(t => (
            <button key={t.key} id={`tab-d-${t.key}`} className={`tab-btn tab-btn--${t.key}`}
              role="tab" aria-selected={tab === t.key} style={S.tabBtn(tab === t.key)} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        <div id="part-d-content" className="tab-content">
          {tab === 'd1' && <>
            <D11Trainings rows={data.trainings_attended || []} setRows={r => setSection('trainings_attended', r)} />
            <D11Workshops rows={data.workshops || []} setRows={r => setSection('workshops', r)} />
            <D11Certifications rows={data.certifications || []} setRows={r => setSection('certifications', r)} />
            <D12Conducted rows={data.training_conducted || []} setRows={r => setSection('training_conducted', r)} />
            <D13ValueAdded rows={data.value_added_courses || []} setRows={r => setSection('value_added_courses', r)} />
          </>}
          
          {tab === 'd2' && <>
            <D21Memberships rows={data.professional_memberships || []} setRows={r => setSection('professional_memberships', r)} />
            <D22Interactions rows={data.interactions || []} setRows={r => setSection('interactions', r)} />
            <D23Awards rows={data.awards || []} setRows={r => setSection('awards', r)} />
          </>}

          {tab === 'd3' && (
            <D3Contributions 
              instData={data.institution_contribution || {}} 
              setInstData={v => setSection('institution_contribution', v)}
              deptData={data.department_contribution || {}} 
              setDeptData={v => setSection('department_contribution', v)}
            />
          )}
        </div>

        <div id="part-d-save-row" style={S.saveRow}>
          <div id="part-d-saved-badge" style={S.savedBadge}>✅ Saved successfully</div>
          <button id="part-d-save-btn" style={S.saveBtn} onClick={handleSave}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            Save Part D
          </button>
        </div>
      </div>
    </div>
  );
}