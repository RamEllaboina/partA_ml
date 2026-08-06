// ─────────────────────────────────────────────────────────────────
// PartC.jsx  —  CBIT Faculty ERP  |  Part C: Research Contribution
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

// ── Card Wrapper ──────────────────────────────────────────────────
function ResearchCard({ id, title, icon, note, children }) {
  return (
    <div id={`card-${id}`} className={`research-card research-card--${id}`}
      style={{ background: THEME.cardBg, borderRadius: THEME.radiusLg, border: `1px solid ${THEME.border}`, boxShadow: THEME.shadow, padding: '20px 24px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${THEME.borderLight}` }}>
        <h3 style={{ fontFamily: THEME.fontHeading, fontSize: 17, fontWeight: 600, color: THEME.text, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>{icon}</span>{title}
        </h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {note && <span style={{ fontSize: 11, color: THEME.textLight }}>{note}</span>}
        </div>
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

const POS_OPTIONS = [
  { value: 'first', label: '1st Author' },
  { value: 'second', label: '2nd Author' },
  { value: 'third', label: '3rd/Co-Author' },
];
const INDEX_OPT = [
  { value: 'Scopus', label: 'Scopus' },
  { value: 'WoS', label: 'WoS' },
  { value: 'SCIE', label: 'SCIE' },
  { value: 'Other', label: 'Other' }
];

// ── C1.1 Conference Papers ─────────────────────────────────────────
function C11Card({ rows, setRows }) {
  const cols = [
    { key: 'title', label: 'Paper Title', placeholder: 'Title of paper' },
    { key: 'conference_name', label: 'Conference Name', placeholder: 'Conference' },
    { key: 'indexing', label: 'Indexing', type: 'select', options: INDEX_OPT },
    { key: 'author_position', label: 'Author Pos.', type: 'select', options: POS_OPTIONS },
    { key: 'year', label: 'Year', type: 'number', placeholder: 'YYYY', width: 80 },
    { key: 'proof', label: 'Proof', placeholder: 'Link/Doc' },
  ];
  return (
    <ResearchCard id="conferences" title="C.1.1 Conference Papers" icon="🎤">
      <DynTable id="conferences" columns={cols} rows={rows}
        onAdd={() => setRows(p => [...p, { id: newId(), title: '', conference_name: '', indexing: 'Scopus', author_position: 'first', year: new Date().getFullYear(), proof: '' }])}
        onUpdate={(id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
        onRemove={(id) => setRows(p => p.filter(r => r.id !== id))}
        addLabel="+ Add Conference Paper" />
    </ResearchCard>
  );
}

// ── C1.2 Journal Publications ─────────────────────────────────────
function C12Card({ rows, setRows }) {
  const QUARTILE_OPTIONS = [
    { value: 'Q1', label: 'Q1' }, { value: 'Q2', label: 'Q2' },
    { value: 'Q3', label: 'Q3' }, { value: 'Q4', label: 'Q4' }, { value: 'Other', label: 'Other' },
  ];
  const cols = [
    { key: 'title', label: 'Paper Title', placeholder: 'Title of journal paper' },
    { key: 'journal_name', label: 'Journal Name', placeholder: 'Journal' },
    { key: 'indexing', label: 'Indexing', type: 'select', options: INDEX_OPT },
    { key: 'quartile', label: 'Quartile', type: 'select', options: QUARTILE_OPTIONS, width: 80 },
    { key: 'author_position', label: 'Author Pos.', type: 'select', options: POS_OPTIONS, width: 110 },
    { key: 'year', label: 'Year', type: 'number', placeholder: 'YYYY', width: 80 },
    { key: 'proof', label: 'Proof', placeholder: 'Link/Doc', width: 90 },
  ];
  return (
    <ResearchCard id="journals" title="C.1.2 Journal Publications" icon="📄">
      <DynTable id="journals" columns={cols} rows={rows}
        onAdd={() => setRows(p => [...p, { id: newId(), title: '', journal_name: '', indexing: 'Scopus', quartile: 'Q1', author_position: 'first', year: new Date().getFullYear(), proof: '' }])}
        onUpdate={(id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
        onRemove={(id) => setRows(p => p.filter(r => r.id !== id))}
        addLabel="+ Add Journal Paper" />
    </ResearchCard>
  );
}

// ── C1.3 Citations ────────────────────────────────────────────────
function C13Card({ rows, setRows }) {
  const cols = [
    { key: 'year', label: 'Year', type: 'number', placeholder: 'YYYY' },
    { key: 'q1_count', label: 'Q1 Citations', type: 'number' },
    { key: 'other_count', label: 'Other Citations', type: 'number' },
    { key: 'source', label: 'Source', placeholder: 'e.g. Scopus, Google Scholar' },
  ];
  return (
    <ResearchCard id="citations" title="C.1.3 Citations" icon="📊">
      <DynTable id="citations" columns={cols} rows={rows}
        onAdd={() => setRows(p => [...p, { id: newId(), year: new Date().getFullYear(), q1_count: 0, other_count: 0, source: 'Scopus' }])}
        onUpdate={(id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
        onRemove={(id) => setRows(p => p.filter(r => r.id !== id))}
        addLabel="+ Add Citation Entry" />
    </ResearchCard>
  );
}

// ── C1.4 Book Chapters ────────────────────────────────────────────
function C14Card({ rows, setRows }) {
  const cols = [
    { key: 'chapter_title', label: 'Chapter Title', placeholder: 'Chapter title' },
    { key: 'book_title', label: 'Book Title', placeholder: 'Book title' },
    { key: 'indexing', label: 'Indexing', type: 'select', options: INDEX_OPT },
    { key: 'author_position', label: 'Author Pos.', type: 'select', options: POS_OPTIONS },
  ];
  return (
    <ResearchCard id="book_chapters" title="C.1.4 Book Chapters" icon="📗">
      <DynTable id="book_chapters" columns={cols} rows={rows}
        onAdd={() => setRows(p => [...p, { id: newId(), chapter_title: '', book_title: '', indexing: 'Scopus', author_position: 'first' }])}
        onUpdate={(id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
        onRemove={(id) => setRows(p => p.filter(r => r.id !== id))}
        addLabel="+ Add Book Chapter" />
    </ResearchCard>
  );
}

// ── C1.5 Textbooks ────────────────────────────────────────────────
function C15Card({ rows, setRows }) {
  const cols = [
    { key: 'book_title', label: 'Book Title', placeholder: 'Book title' },
    { key: 'isbn', label: 'ISBN', placeholder: 'e.g., 978-...' },
    { key: 'author_position', label: 'Author Pos.', type: 'select', options: POS_OPTIONS },
  ];
  return (
    <ResearchCard id="textbooks" title="C.1.5 Textbooks / Edited Books" icon="📘">
      <DynTable id="textbooks" columns={cols} rows={rows}
        onAdd={() => setRows(p => [...p, { id: newId(), book_title: '', isbn: '', author_position: 'first' }])}
        onUpdate={(id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
        onRemove={(id) => setRows(p => p.filter(r => r.id !== id))}
        addLabel="+ Add Textbook" />
    </ResearchCard>
  );
}

// ── C2.1 Funded Research Projects ─────────────────────────────────
function C21Card({ rows, setRows }) {
  const ROLE_OPT = [{ value: 'PI', label: 'PI' }, { value: 'Co-PI', label: 'Co-PI' }, { value: 'Other', label: 'Other' }];
  const cols = [
    { key: 'title', label: 'Project Title', placeholder: 'Project title' },
    { key: 'funding_amount', label: 'Funding (₹)', type: 'number', placeholder: 'Amount' },
    { key: 'role', label: 'Role', type: 'select', options: ROLE_OPT },
    { key: 'status', label: 'Status', placeholder: 'Ongoing/Completed' },
    { key: 'duration', label: 'Duration', placeholder: 'e.g. 2 Years' },
    { key: 'proof', label: 'Proof', placeholder: 'Link/Doc' },
  ];
  return (
    <ResearchCard id="research_projects" title="C.2.1 Funded Research Projects" icon="🔭">
      <DynTable id="research_projects" columns={cols} rows={rows}
        onAdd={() => setRows(p => [...p, { id: newId(), title: '', funding_amount: 0, role: 'PI', status: '', duration: '', proof: '' }])}
        onUpdate={(id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
        onRemove={(id) => setRows(p => p.filter(r => r.id !== id))}
        addLabel="+ Add Research Project" />
    </ResearchCard>
  );
}

// ── C2.2 Research Outcomes ────────────────────────────────────────
function C22Card({ rows, setRows }) {
  const OUTCOME_OPT = [
    { value: 'Paper Publication', label: 'Paper Publication' },
    { value: 'Product Developed', label: 'Product Developed' },
    { value: 'Patent', label: 'Patent' },
  ];
  const ROLE_OPT = [{ value: 'PI', label: 'PI' }, { value: 'Co-PI', label: 'Co-PI' }, { value: 'Participant', label: 'Participant' }];
  const cols = [
    { key: 'project_title', label: 'Project Title', placeholder: 'Project Title' },
    { key: 'outcome_type', label: 'Outcome Type', type: 'select', options: OUTCOME_OPT },
    { key: 'role', label: 'Role', type: 'select', options: ROLE_OPT },
    { key: 'proof', label: 'Proof', placeholder: 'Link/Doc' },
  ];
  return (
    <ResearchCard id="project_outcomes" title="C.2.2 Research Outcomes" icon="🎯">
      <DynTable id="project_outcomes" columns={cols} rows={rows}
        onAdd={() => setRows(p => [...p, { id: newId(), project_title: '', outcome_type: 'Paper Publication', role: 'PI', proof: '' }])}
        onUpdate={(id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
        onRemove={(id) => setRows(p => p.filter(r => r.id !== id))}
        addLabel="+ Add Research Outcome" />
    </ResearchCard>
  );
}

// ── C3 Products & Patents ─────────────────────────────────────────
function C3Card({ data, setSection }) {
  const TYPE_OPT = [{ value: 'Software', label: 'Software' }, { value: 'Hardware', label: 'Hardware' }, { value: 'Model', label: 'Model' }];
  const STATUS_OPT = [{ value: 'Granted', label: 'Granted' }, { value: 'Published', label: 'Published' }, { value: 'Filed', label: 'Filed' }];

  const prodCols = [
    { key: 'product_name', label: 'Product Name', placeholder: 'Name' },
    { key: 'type', label: 'Type', type: 'select', options: TYPE_OPT },
    { key: 'description', label: 'Description', placeholder: 'Brief details' },
    { key: 'proof', label: 'Proof', placeholder: 'Link/Doc' },
  ];
  const patentCols = [
    { key: 'title', label: 'Patent Title', placeholder: 'Title' },
    { key: 'status', label: 'Status', type: 'select', options: STATUS_OPT },
    { key: 'patent_number', label: 'Patent Number', placeholder: 'Number' },
    { key: 'proof', label: 'Proof', placeholder: 'Link/Doc' },
  ];
  const revCols = [
    { key: 'title', label: 'Patent/IP Title', placeholder: 'Title' },
    { key: 'amount', label: 'Revenue Generated (₹)', type: 'number', placeholder: 'Amount' },
    { key: 'year', label: 'Year', type: 'number', placeholder: 'YYYY' },
    { key: 'proof', label: 'Proof', placeholder: 'Link/Doc' },
  ];
  const startupCols = [
    { key: 'startup_name', label: 'Startup Name', placeholder: 'Name' },
    { key: 'investment', label: 'Investment (₹)', type: 'number', placeholder: 'Amount' },
    { key: 'role', label: 'Role', placeholder: 'Founder/Advisor' },
    { key: 'proof', label: 'Proof', placeholder: 'Link/Doc' },
  ];

  return (
    <>
      <ResearchCard id="products" title="C.3.1 Products Developed" icon="⚙️">
        <DynTable id="products" columns={prodCols} rows={data.products || []}
          onAdd={() => setSection('products', p => [...(p||[]), { id: newId(), product_name: '', type: 'Software', description: '', proof: '' }])}
          onUpdate={(id, k, v) => setSection('products', p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
          onRemove={(id) => setSection('products', p => p.filter(r => r.id !== id))} addLabel="+ Add Product" />
      </ResearchCard>
      
      <ResearchCard id="patents" title="C.3.2 Patents" icon="📜">
        <DynTable id="patents" columns={patentCols} rows={data.patents || []}
          onAdd={() => setSection('patents', p => [...(p||[]), { id: newId(), title: '', status: 'Granted', patent_number: '', proof: '' }])}
          onUpdate={(id, k, v) => setSection('patents', p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
          onRemove={(id) => setSection('patents', p => p.filter(r => r.id !== id))} addLabel="+ Add Patent" />
      </ResearchCard>

      <ResearchCard id="patent_revenue" title="C.3.3 Patent Revenue" icon="💰">
        <DynTable id="patent_revenue" columns={revCols} rows={data.patent_revenue || []}
          onAdd={() => setSection('patent_revenue', p => [...(p||[]), { id: newId(), title: '', amount: 0, year: new Date().getFullYear(), proof: '' }])}
          onUpdate={(id, k, v) => setSection('patent_revenue', p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
          onRemove={(id) => setSection('patent_revenue', p => p.filter(r => r.id !== id))} addLabel="+ Add Revenue" />
      </ResearchCard>

      <ResearchCard id="startups" title="C.3.4 Startups & Investments" icon="🚀">
        <DynTable id="startups" columns={startupCols} rows={data.startups || []}
          onAdd={() => setSection('startups', p => [...(p||[]), { id: newId(), startup_name: '', investment: 0, role: '', proof: '' }])}
          onUpdate={(id, k, v) => setSection('startups', p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
          onRemove={(id) => setSection('startups', p => p.filter(r => r.id !== id))} addLabel="+ Add Startup" />
      </ResearchCard>
    </>
  );
}

// ── C4 Consultancy ────────────────────────────────────────────────
function C4Card({ rows, setRows }) {
  const TYPE_OPT = [{ value: 'Consultancy', label: 'Consultancy' }, { value: 'Corporate Training', label: 'Corporate Training' }, { value: 'Grant', label: 'Grant' }];
  const cols = [
    { key: 'activity_type', label: 'Activity Type', type: 'select', options: TYPE_OPT },
    { key: 'description', label: 'Description', placeholder: 'Project details' },
    { key: 'amount', label: 'Amount (₹)', type: 'number', placeholder: 'Value' },
    { key: 'year', label: 'Year', type: 'number', placeholder: 'YYYY' },
    { key: 'proof', label: 'Proof', placeholder: 'Link/Doc' },
  ];
  return (
    <ResearchCard id="consultancy" title="C.4 Consultancy / Corporate Training" icon="💼">
      <DynTable id="consultancy" columns={cols} rows={rows}
        onAdd={() => setRows(p => [...p, { id: newId(), activity_type: 'Consultancy', description: '', amount: 0, year: new Date().getFullYear(), proof: '' }])}
        onUpdate={(id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
        onRemove={(id) => setRows(p => p.filter(r => r.id !== id))}
        addLabel="+ Add Consultancy Activity" />
    </ResearchCard>
  );
}

// ── C5 PhD Supervision ────────────────────────────────────────────
function C5Card({ rows, setRows }) {
  const STATUS_OPT = [{ value: 'Awarded', label: 'Awarded' }, { value: 'Supervising', label: 'Supervising' }];
  const cols = [
    { key: 'scholar_name', label: 'Scholar Name', placeholder: 'Name of scholar' },
    { key: 'status', label: 'Status', type: 'select', options: STATUS_OPT },
    { key: 'year', label: 'Year', type: 'number', placeholder: 'YYYY' },
    { key: 'proof', label: 'Proof', placeholder: 'Link/Doc' },
  ];
  return (
    <ResearchCard id="phd_supervision" title="C.5 PhD Supervisorship" icon="🎓">
      <DynTable id="phd_supervision" columns={cols} rows={rows}
        onAdd={() => setRows(p => [...p, { id: newId(), scholar_name: '', status: 'Supervising', year: new Date().getFullYear(), proof: '' }])}
        onUpdate={(id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
        onRemove={(id) => setRows(p => p.filter(r => r.id !== id))}
        addLabel="+ Add PhD Scholar" />
    </ResearchCard>
  );
}

// ── C6 Student Projects ───────────────────────────────────────────
function C6Card({ rows, setRows }) {
  const cols = [
    { key: 'title', label: 'Project Title', placeholder: 'Title of project' },
    { key: 'students', label: 'No. of Students', type: 'number' },
    { key: 'department', label: 'Department', placeholder: 'Dept.' },
    { key: 'status', label: 'Status', placeholder: 'Ongoing/Completed' },
    { key: 'year', label: 'Year', type: 'number', placeholder: 'YYYY' },
    { key: 'proof', label: 'Proof', placeholder: 'Link/Doc' },
  ];
  return (
    <ResearchCard id="student_projects" title="C.6 Student Projects Guided" icon="🧪">
      <DynTable id="student_projects" columns={cols} rows={rows}
        onAdd={() => setRows(p => [...p, { id: newId(), title: '', students: 1, department: '', status: '', year: new Date().getFullYear(), proof: '' }])}
        onUpdate={(id, k, v) => setRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))}
        onRemove={(id) => setRows(p => p.filter(r => r.id !== id))}
        addLabel="+ Add Student Project" />
    </ResearchCard>
  );
}

// ════════════════════════════════════════════════════════════════
// PartC — Main Component
// ════════════════════════════════════════════════════════════════
const TABS = [
  { key: 'c1', label: 'C.1 Publications' },
  { key: 'c2', label: 'C.2 Projects' },
  { key: 'c3', label: 'C.3 Products & Patents' },
  { key: 'c4', label: 'C.4 Consultancy' },
  { key: 'c5', label: 'C.5 PhD Supervision' },
  { key: 'c6', label: 'C.6 Student Projects' },
];

export default function PartC({ user, navigate, formData, updateSection }) {
  const [tab,     setTab]     = useState('c1');
  const [data,    setData]    = useState(formData?.partC || {});
  const [saved,   setSaved]   = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  const setSection = (key, val) => setData(p => ({ ...p, [key]: typeof val === 'function' ? val(p[key] || []) : val }));

  const handleSave = () => {
    updateSection('partC', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const S = {
    page:  { minHeight: '100vh', background: THEME.bg, fontFamily: THEME.fontBody, opacity: visible ? 1 : 0, transition: 'opacity 0.35s' },
    body:  { maxWidth: 1040, margin: '0 auto', padding: '32px 28px 60px' },
    topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    title: { fontFamily: THEME.fontHeading, fontSize: 30, fontWeight: 600, color: THEME.primary },
    tabs:  { display: 'flex', flexWrap: 'wrap', gap: 4, background: THEME.cardBg, border: `1px solid ${THEME.border}`, borderRadius: THEME.radiusLg, padding: 4, marginBottom: 20 },
    tabBtn: (a) => ({ flex: 1, minWidth: '130px', padding: '9px 4px', borderRadius: THEME.radius, border: 'none', background: a ? THEME.primary : 'transparent', color: a ? '#fff' : THEME.textMuted, fontSize: 13, fontWeight: a ? 600 : 400, cursor: 'pointer', fontFamily: THEME.fontBody, transition: 'all 0.15s' }),
    saveRow: { display: 'flex', justifyContent: 'flex-end', gap: 12, alignItems: 'center', marginTop: 16 },
    saveBtn: { background: `linear-gradient(135deg, ${THEME.primaryMid}, ${THEME.primaryDark})`, color: '#fff', border: 'none', borderRadius: THEME.radius, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: THEME.fontBody, boxShadow: THEME.shadow },
    savedBadge: { background: THEME.successBg, border: `1px solid ${THEME.successBorder}`, color: THEME.success, borderRadius: THEME.radius, padding: '8px 14px', fontSize: 13, fontWeight: 600, display: saved ? 'flex' : 'none', alignItems: 'center', gap: 5 },
  };

  return (
    <div id="part-c-page" className="part-c-page" style={S.page}>
      <TopBar user={user} navigate={navigate} currentPage="partC" title="Part C – Research Contribution" />
      <div id="part-c-body" style={S.body}>
        <div id="part-c-top-row" style={S.topRow}>
          <div>
            <h2 id="part-c-title" style={S.title}>Part C</h2>
            <p style={{ fontSize: 14, color: THEME.textMuted, marginTop: 2 }}>Research Contribution Data Entry</p>
          </div>
        </div>

        <div id="part-c-tabs" className="part-c-tabs" role="tablist" style={S.tabs}>
          {TABS.map(t => (
            <button key={t.key} id={`tab-c-${t.key}`} className={`tab-btn tab-btn--${t.key}`}
              role="tab" aria-selected={tab === t.key} style={S.tabBtn(tab === t.key)} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        <div id="part-c-content" className="tab-content">
          {tab === 'c1' && <>
            <C11Card rows={data.conferences || []} setRows={r => setSection('conferences', r)} />
            <C12Card rows={data.journals || []} setRows={r => setSection('journals', r)} />
            <C13Card rows={data.citations || []} setRows={r => setSection('citations', r)} />
            <C14Card rows={data.book_chapters || []} setRows={r => setSection('book_chapters', r)} />
            <C15Card rows={data.textbooks || []} setRows={r => setSection('textbooks', r)} />
          </>}
          {tab === 'c2' && <>
            <C21Card rows={data.research_projects || []} setRows={r => setSection('research_projects', r)} />
            <C22Card rows={data.project_outcomes || []} setRows={r => setSection('project_outcomes', r)} />
          </>}
          {tab === 'c3' && <C3Card data={data} setSection={setSection} />}
          {tab === 'c4' && <C4Card rows={data.consultancy || []} setRows={r => setSection('consultancy', r)} />}
          {tab === 'c5' && <C5Card rows={data.phd_supervision || []} setRows={r => setSection('phd_supervision', r)} />}
          {tab === 'c6' && <C6Card rows={data.student_projects || []} setRows={r => setSection('student_projects', r)} />}
        </div>

        <div id="part-c-save-row" style={S.saveRow}>
          <div id="part-c-saved-badge" style={S.savedBadge}>✅ Saved successfully</div>
          <button id="part-c-save-btn" style={S.saveBtn} onClick={handleSave}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            Save Part C
          </button>
        </div>
      </div>
    </div>
  );
}