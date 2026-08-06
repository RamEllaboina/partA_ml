// ─────────────────────────────────────────────────────────────────
// App.jsx  —  CBIT Faculty ERP  |  Root Router & Global State
// ─────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { injectFonts } from './Theme';
import Login from './Login';
import Home  from './Home';
import PartA from './PartA';
import PartB from './PartB';
import PartC from './PartC';
import PartD from './PartD';
import PartE from './PartE';

const INITIAL_FORM = {
  partA: {
    employeeId: '', name: '',
    department: '', departmentOther: '',
    designation: '', designationOther: '',
    mobile: '',
    qualification: '', qualificationOther: '',
    dateOfJoining: '', totalService: '', cbitExperience: '',
  },
  partB: {
    b1OddCourses:  [],
    b1EvenCourses: [],
    b2: { oddFeedback: 0, evenFeedback: 0 },
    b3: { ict: 0, alt: 0, cep: 0, proj: 0, itm: 0, cd: 0, obe: 0, obeText: '' },
    b4: { n: 0, meetFreq: '', n1: 0, n2: 0, events: 0, awards: 0, nptel: 0, certs: 0, n3: 0 },
  },
  partC: {
    conferences: [], journals: [], citations: [], book_chapters: [], textbooks: [],
    research_projects: [], project_outcomes: [],
    products: [], patents: [], patent_revenue: [], startups: [],
    consultancy: [],
    phd_supervision: [],
    student_projects: []
  },
  partD: {
    trainings_attended: [],
    workshops: [],
    certifications: [],
    training_conducted: [],
    value_added_courses: [],
    professional_memberships: [],
    interactions: [],
    awards: [],
    institution_contribution: {},
    department_contribution: {}
  },
  partE: {
    additional_info: { description: '', document: '' }
  }
};

export default function App() {
  const [page,     setPage]     = useState('login');
  const [user,     setUser]     = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => { injectFonts(); }, []);

  const navigate = (p) => setPage(p);

  const updateSection = (section, data) =>
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], ...data } }));

  const pageProps = { user, navigate, formData, updateSection };

  const handleLogin = (userData) => {
    setUser(userData);
    setFormData(prev => ({
      ...prev,
      partA: {
        ...prev.partA,
        employeeId:  userData.employeeId  || '',
        name:        userData.name        || '',
        department:  userData.dept        || '',
        designation: userData.designation || '',
      },
    }));
    navigate('home');
  };

  const PAGES = {
    login: <Login onLogin={handleLogin} />,
    home:  <Home  {...pageProps} />,
    partA: <PartA {...pageProps} />,
    partB: <PartB {...pageProps} />,
    partC: <PartC {...pageProps} />,
    partD: <PartD {...pageProps} />,
    partE: <PartE {...pageProps} />,
  };

  return PAGES[page] ?? PAGES.login;
}