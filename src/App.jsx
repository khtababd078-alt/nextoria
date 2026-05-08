import React, { useState, createContext, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import translations from './translations';
import './mobile.css';
import { isEligible, getMajorMinScore } from './majorData';

const AppContext = createContext();

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [pageVisible, setPageVisible] = useState(true);
  const [lang, setLang] = useState('ar');

  const navigate = (page) => {
    setPageVisible(false);
    setTimeout(() => {
      setCurrentPage(page);
      setPageVisible(true);
    }, 220);
  };

  const t = (key) => translations[lang][key] || translations['ar'][key] || key;

  const contextValue = {
    darkMode,
    setDarkMode,
    currentPage,
    navigate,
    lang,
    setLang,
    t,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className={darkMode ? 'bg-dark text-white min-vh-100' : 'bg-light text-dark min-vh-100'} dir={lang === 'en' ? 'ltr' : 'rtl'} style={{ position: 'relative' }}>
        <Navbar />
        <main className="pb-5" style={{ opacity: pageVisible ? 1 : 0, transform: pageVisible ? 'translateY(0)' : 'translateY(14px)', transition: 'opacity 0.22s ease, transform 0.22s ease' }}>
          {currentPage === 'home' && <HomePage />}
          {currentPage === 'assessment' && <AssessmentPage />}
          {currentPage === 'universities' && <UniversitiesPage />}
          {currentPage === 'about' && <AboutPage />}
          {currentPage === 'contact' && <ContactPage />}
        </main>
        <Footer />
        <Chatbot />
      </div>
    </AppContext.Provider>
  );
}

function Navbar() {
  const { darkMode, setDarkMode, currentPage, navigate, lang, setLang, t } = useAppContext();
  const isEn = lang === 'en';

  const navItems = [
    { id: 'home',         label: t('nav_home'),         icon: '🏠' },
    { id: 'assessment',   label: t('nav_assessment'),   icon: '📋' },
    { id: 'universities', label: t('nav_universities'), icon: '🏛️' },
    { id: 'about',        label: t('nav_about'),        icon: '💡' },
    { id: 'contact',      label: t('nav_contact'),      icon: '✉️' },
  ];

  return (
    <nav
      className={`navbar navbar-expand-lg ${currentPage === 'home' ? 'navbar-dark' : `sticky-top shadow-sm ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-white'}`}`}
      style={currentPage === 'home' ? {
        position: 'absolute', top: 0, width: '100%', zIndex: 1030,
        background: 'linear-gradient(to bottom, rgba(6,13,31,0.72) 0%, transparent 100%)',
        boxShadow: 'none'
      } : {}}
      dir="ltr"
    >
      <div className="container-fluid px-4 d-flex align-items-center justify-content-between">

        {/* Logo — always left */}
        <a className="navbar-brand d-flex align-items-center gap-2" href="#" dir="ltr" onClick={() => navigate('home')}>
          <span className={currentPage === 'home' ? 'brand-text' : 'brand-text-dark'}>Nextoria</span>
          <img src="https://flagcdn.com/w40/jo.png" alt="Jordan" className="brand-flag" style={{ width: '40px', borderRadius: '5px' }} />
        </a>

        {/* Hamburger */}
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Center Links + Right Controls */}
        <div className={`collapse navbar-collapse${currentPage === 'home' ? ' navbar-home-collapse' : ''}`} id="navbarNav">
          {/* Links — centered */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 d-flex align-items-center gap-1">
            {navItems.map(item => (
              <li className="nav-item" key={item.id}>
                <button
                  onClick={() => navigate(item.id)}
                  className="btn btn-link d-flex align-items-center gap-1 px-3 py-2 text-decoration-none"
                  style={{
                    color: currentPage === item.id ? '#e53935' : (currentPage === 'home' ? 'rgba(255,255,255,0.85)' : (darkMode ? 'rgba(255,255,255,0.8)' : '#333')),
                    fontWeight: currentPage === item.id ? 700 : 500,
                    fontSize: '14px',
                    borderRadius: '8px',
                    background: currentPage === item.id
                      ? (currentPage === 'home' ? 'rgba(255,255,255,0.1)' : (darkMode ? 'rgba(229,57,53,0.12)' : 'rgba(229,57,53,0.08)'))
                      : 'transparent',
                    border: 'none',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (currentPage !== item.id) e.currentTarget.style.background = darkMode || currentPage === 'home' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'; }}
                  onMouseLeave={e => { if (currentPage !== item.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Controls — right */}
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className={`btn btn-sm fw-bold ${darkMode || currentPage === 'home' ? 'btn-outline-light' : 'btn-outline-secondary'}`}
              style={{ borderRadius: '8px', fontSize: '12px', padding: '4px 14px', letterSpacing: '1px' }}
            >
              {lang === 'ar' ? 'EN' : 'AR'}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`btn rounded-circle d-flex align-items-center justify-content-center ${darkMode || currentPage === 'home' ? 'btn-outline-light' : 'btn-outline-secondary'}`}
              style={{ width: '36px', height: '36px', fontSize: '14px' }}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function HomePage() {
  const { darkMode, navigate, t, lang } = useAppContext();

  const card = darkMode
    ? 'rgba(255,255,255,0.05)'
    : 'rgba(255,255,255,0.7)';
  const border = darkMode
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(187,202,225,0.5)';
  const sub = darkMode ? 'rgba(255,255,255,0.5)' : '#666';

  const stats = [
    { value: '28+',  label: t('stat_universities') },
    { value: '150+', label: t('stat_majors') },
    { value: '6',    label: t('stat_fields') },
    { value: 'AI',   label: t('stat_ai') },
  ];

  const steps = [
    { n: '01', icon: '🎓', title: t('step1_title'), desc: t('step1_desc') },
    { n: '02', icon: '📊', title: t('step2_title'), desc: t('step2_desc') },
    { n: '03', icon: '🤖', title: t('step3_title'), desc: t('step3_desc') },
    { n: '04', icon: '🏆', title: t('step4_title'), desc: t('step4_desc') },
  ];

  const fields = [
    { icon: '⚙️', label: t('field_engineering'), bg: 'linear-gradient(135deg,#681a15,#9b2c24)' },
    { icon: '🏥', label: t('field_health'),       bg: 'linear-gradient(135deg,#1a6858,#0f9b82)' },
    { icon: '🔬', label: t('field_science'),      bg: 'linear-gradient(135deg,#1a3568,#1a5ab5)' },
    { icon: '💼', label: t('field_business'),     bg: 'linear-gradient(135deg,#68521a,#b08c2e)' },
    { icon: '⚖️', label: t('field_law'),          bg: 'linear-gradient(135deg,#3d1a68,#6b35b5)' },
    { icon: '📚', label: t('field_humanities'),   bg: 'linear-gradient(135deg,#1a5868,#1a8aab)' },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <img
          src="https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="graduation"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', zIndex: 0 }}
        />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to right, rgba(6,13,31,0.95) 0%, rgba(6,13,31,0.75) 45%, rgba(6,13,31,0.15) 80%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'center' }}>
          <div dir={lang === 'en' ? 'ltr' : 'rtl'} className="hero-content-inner" style={{ width: '520px', maxWidth: '90vw', padding: '0 52px' }}>
            {lang === 'ar' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(187,202,225,0.15)', border: '1px solid rgba(187,202,225,0.3)', borderRadius: '50px', padding: '6px 18px', fontSize: '13px', color: '#bbcae1', marginBottom: '20px', backdropFilter: 'blur(8px)' }}>
                <img src="https://flagcdn.com/w20/jo.png" alt="JO" style={{ width: '18px', borderRadius: '2px' }} />
                مخصص للطلاب الأردنيين
              </span>
            )}
            <h1 style={{ fontSize: 'clamp(28px,4vw,54px)', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '20px' }}>
              {t('hero_title1')}<br />
              <span style={{ color: '#bbcae1' }}>{t('hero_title2')}</span><br />
              {t('hero_title3')}
            </h1>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.9, marginBottom: '40px', maxWidth: '400px' }}>
              {t('hero_desc')}
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('assessment')} className="btn btn-danger btn-lg px-5 py-3 rounded-3 shadow-lg" style={{ fontSize: '16px' }}>
                {t('hero_start')}
              </button>
              <button onClick={() => navigate('universities')} className="btn btn-lg px-4 py-3 rounded-3" style={{ fontSize: '15px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
                {t('hero_explore')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: darkMode ? 'rgba(255,255,255,0.03)' : '#f0f4ff', padding: '52px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '24px', textAlign: 'center' }}>
            {stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 900, color: '#681a15', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '14px', color: sub, marginTop: '6px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2.2rem)', marginBottom: '10px' }}>{t('how_title')}</h2>
            <p style={{ color: sub, fontSize: '15px' }}>{t('how_subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '20px' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ background: card, border: `1.5px solid ${border}`, borderRadius: '20px', padding: '28px 22px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '2.5rem', fontWeight: 900, color: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(104,26,21,0.06)', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '16px', marginBottom: '8px' }}>{s.title}</div>
                <div style={{ fontSize: '13.5px', color: sub, lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fields ── */}
      <section style={{ padding: '60px 0', background: darkMode ? 'rgba(255,255,255,0.02)' : '#f7f9ff' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2.2rem)', marginBottom: '10px' }}>{t('fields_title')}</h2>
            <p style={{ color: sub, fontSize: '15px' }}>{t('fields_subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '14px' }}>
            {fields.map((f, i) => (
              <div
                key={i}
                onClick={() => navigate('assessment')}
                style={{ background: f.bg, borderRadius: '18px', padding: '28px 16px', textAlign: 'center', color: '#fff', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '10px' }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '14px', lineHeight: 1.4 }}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg,#2d0a08,#681a15)', borderRadius: '24px', padding: 'clamp(36px,5vw,64px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(187,202,225,0.08)' }} />
            <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(187,202,225,0.06)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚀</div>
              <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#fff', marginBottom: '14px' }}>
                {t('cta_title')}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
                {t('cta_desc')}
              </p>
              <button onClick={() => navigate('assessment')} className="btn btn-lg px-5 py-3 rounded-3 fw-bold" style={{ background: '#fff', color: '#681a15', fontSize: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}>
                {t('cta_btn')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const API_BASE = 'https://nextoria-backend-production.up.railway.app';

function recommendField(subjects, interests, personality, lang = 'ar') {
  const n = (v, max = 200) => (parseFloat(v) || 0) / max * 100;
  const i = (k) => ((interests[k] || 3) - 1) / 4 * 100;

  const math    = n(subjects['رياضيات'], 200);
  const science = n(subjects['علوم'],    100);
  const arabic  = n(subjects['لغة عربية'],   200);
  const english = n(subjects['لغة إنجليزية'], 200);
  const chem    = n(subjects['كيمياء'],  100);
  const physics = n(subjects['فيزياء'], 100);
  const bio     = n(subjects['أحياء'],   100);

  const thinkBonus = (field) => {
    const th = personality.thinking || '';
    const analytical = th.includes('تحليلي') || th.toLowerCase().includes('analytical');
    const creative   = th.includes('إبداعي') || th.toLowerCase().includes('creative');
    const practical  = th.includes('عملي')   || th.toLowerCase().includes('practical');
    if (analytical && ['engineering','science_tech'].includes(field)) return 8;
    if (creative   && ['humanities'].includes(field))                  return 8;
    if (practical  && ['business','health'].includes(field))           return 6;
    return 0;
  };
  const socialBonus = (field) => {
    const s = personality.social_type || '';
    const withPeople = s.includes('مع الناس') || s.toLowerCase().includes('with people');
    const alone      = s.includes('بمفردي')   || s.toLowerCase().includes('alone');
    if (withPeople && ['business','law','humanities'].includes(field)) return 7;
    if (alone      && ['engineering','science_tech'].includes(field))  return 7;
    return 0;
  };

  const raw = {
    engineering:  math*0.35 + physics*0.30 + science*0.15 + i('tech')*0.20,
    health:       bio*0.30  + chem*0.25    + science*0.15  + i('health')*0.30,
    science_tech: math*0.25 + science*0.25 + chem*0.15    + physics*0.10 + i('tech')*0.15 + i('science')*0.10,
    business:     math*0.30 + english*0.20 + arabic*0.15  + i('business')*0.35,
    law:          arabic*0.40 + english*0.25 + i('social')*0.35,
    humanities:   arabic*0.35 + english*0.35 + i('arts')*0.15 + i('social')*0.15,
  };

  const en = lang === 'en';
  const fieldMeta = [
    { id: 'engineering',  label: en ? 'Engineering'             : 'الهندسي',                    icon: '⚙️',  bg: 'linear-gradient(135deg,#681a15,#9b2c24)', focus: en ? 'Math & Physics'   : 'الرياضيات والفيزياء' },
    { id: 'health',       label: en ? 'Health'                  : 'الصحي',                      icon: '🏥',  bg: 'linear-gradient(135deg,#1a6858,#0f9b82)', focus: en ? 'Biology & Chemistry' : 'الأحياء والكيمياء' },
    { id: 'science_tech', label: en ? 'Science & Tech'          : 'العلوم والتكنولوجيا',        icon: '🔬',  bg: 'linear-gradient(135deg,#1a3568,#1a5ab5)', focus: en ? 'Math & Science'   : 'الرياضيات والعلوم' },
    { id: 'business',     label: en ? 'Business'                : 'الأعمال',                    icon: '💼',  bg: 'linear-gradient(135deg,#68521a,#b08c2e)', focus: en ? 'Math & English'   : 'الرياضيات والإنجليزية' },
    { id: 'law',          label: en ? 'Law & Islamic Sciences'  : 'القانون والعلوم الشرعية',    icon: '⚖️',  bg: 'linear-gradient(135deg,#3d1a68,#6b35b5)', focus: en ? 'Arabic & English' : 'العربية والإنجليزية' },
    { id: 'humanities',   label: en ? 'Languages & Social Sci.' : 'اللغات والعلوم الاجتماعية', icon: '📚',  bg: 'linear-gradient(135deg,#1a5868,#1a8aab)', focus: en ? 'Arabic & English' : 'العربية والإنجليزية' },
  ];

  return fieldMeta
    .map(f => ({ ...f, score: Math.min(Math.round(raw[f.id] + thinkBonus(f.id) + socialBonus(f.id)), 99) }))
    .sort((a, b) => b.score - a.score);
}

function AssessmentPage() {
  const { darkMode, navigate, t, lang } = useAppContext();
  const [step, setStep] = useState(0);
  const [studentType, setStudentType] = useState(null);
  const [hoveredSide, setHoveredSide] = useState(null);

  // Tawjihi state
  const [selectedField, setSelectedField] = useState(null);
  const [gpa, setGpa] = useState('');
  const [interests, setInterests] = useState({ tech: 3, health: 3, business: 3, arts: 3 });
  const [personality, setPersonality] = useState({ thinking_style: '', personality_type: '', preferred_study: '', preferred_work: '' });
  const [mlResults, setMlResults] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState(null);

  // Grade 10 state
  const [formData, setFormData] = useState({
    subjects: { 'رياضيات': '', 'علوم': '', 'لغة عربية': '', 'لغة إنجليزية': '', 'كيمياء': '', 'فيزياء': '', 'أحياء': '', 'تربية إسلامية': '', 'تاريخ الأردن': '' },
    interests: { tech: 3, science: 3, health: 3, business: 3, arts: 3, social: 3 },
    personality: { thinking: '', social_type: '', learning: '' },
  });
  const [grade10Results, setGrade10Results] = useState(null);

  const tawjihiFields = [
    { id: 'engineering',  label: lang === 'en' ? 'Engineering'              : 'الهندسي',                   icon: '⚙️',  bg: 'linear-gradient(135deg,#681a15,#9b2c24)' },
    { id: 'health',       label: lang === 'en' ? 'Health'                   : 'الصحي',                     icon: '🏥',  bg: 'linear-gradient(135deg,#1a6858,#0f9b82)' },
    { id: 'science_tech', label: lang === 'en' ? 'Science & Tech'           : 'العلوم والتكنولوجيا',       icon: '🔬',  bg: 'linear-gradient(135deg,#1a3568,#1a5ab5)' },
    { id: 'business',     label: lang === 'en' ? 'Business'                 : 'الأعمال',                   icon: '💼',  bg: 'linear-gradient(135deg,#68521a,#b08c2e)' },
    { id: 'law',          label: lang === 'en' ? 'Law & Islamic Sciences'   : 'القانون والعلوم الشرعية',   icon: '⚖️',  bg: 'linear-gradient(135deg,#3d1a68,#6b35b5)' },
    { id: 'humanities',   label: lang === 'en' ? 'Languages & Social Sci.'  : 'اللغات والعلوم الاجتماعية', icon: '📚',  bg: 'linear-gradient(135deg,#1a5868,#1a8aab)' },
  ];

  const interestLabels = {
    tech:     { label: lang === 'en' ? 'Technology & Programming' : 'التكنولوجيا والبرمجة', icon: '💻' },
    health:   { label: lang === 'en' ? 'Health & Medicine'        : 'الصحة والطب',          icon: '🏥' },
    business: { label: lang === 'en' ? 'Business & Management'    : 'الأعمال والإدارة',     icon: '💼' },
    arts:     { label: lang === 'en' ? 'Arts & Creativity'        : 'الفنون والإبداع',      icon: '🎨' },
  };

  const subjectList = [
    { key: 'رياضيات',          label: lang === 'en' ? 'Mathematics'        : 'رياضيات',          icon: '📐', color: '#1a3568', max: 200 },
    { key: 'علوم',             label: lang === 'en' ? 'Digital Skills'     : 'مهارات رقمية',     icon: '💻', color: '#1a6858', max: 100 },
    { key: 'لغة عربية',       label: lang === 'en' ? 'Arabic Language'     : 'لغة عربية',       icon: '📖', color: '#681a15', max: 200 },
    { key: 'لغة إنجليزية',    label: lang === 'en' ? 'English Language'    : 'لغة إنجليزية',    icon: '🌍', color: '#3d1a68', max: 200 },
    { key: 'كيمياء',          label: lang === 'en' ? 'Chemistry'           : 'كيمياء',          icon: '⚗️', color: '#1a5868', max: 100 },
    { key: 'فيزياء',          label: lang === 'en' ? 'Physics'             : 'فيزياء',          icon: '⚡', color: '#68521a', max: 100 },
    { key: 'أحياء',           label: lang === 'en' ? 'Biology'             : 'أحياء',           icon: '🧬', color: '#0f6b3a', max: 100 },
    { key: 'تربية إسلامية',   label: lang === 'en' ? 'Islamic Education'   : 'التربية الإسلامية', icon: '☪️', color: '#2d6a4f', max: 100 },
    { key: 'تاريخ الأردن',    label: lang === 'en' ? 'Jordan History'      : 'تاريخ الأردن',    icon: '🏛️', color: '#6d4c41', max: 100 },
  ];

  const grade10InterestLabels = {
    tech:     { label: lang === 'en' ? 'Technology & Engineering' : 'التكنولوجيا والهندسة', icon: '⚙️' },
    science:  { label: lang === 'en' ? 'Science & Experiments'   : 'العلوم والتجارب',      icon: '🔬' },
    health:   { label: lang === 'en' ? 'Health & Medicine'       : 'الصحة والطب',          icon: '🏥' },
    business: { label: lang === 'en' ? 'Business & Economics'    : 'الأعمال والاقتصاد',    icon: '💼' },
    arts:     { label: lang === 'en' ? 'Arts & Languages'        : 'الفنون واللغات',       icon: '🎨' },
    social:   { label: lang === 'en' ? 'Social Sciences'         : 'العلوم الاجتماعية',    icon: '📚' },
  };

  const handleStudentTypeSelect = (type) => {
    setStudentType(type);
    setStep(1);
  };

  const handleSubjectChange = (subject, value) => {
    setFormData({ ...formData, subjects: { ...formData.subjects, [subject]: value } });
  };

  const handleGrade10Submit = () => {
    const results = recommendField(formData.subjects, formData.interests, formData.personality, lang);
    setGrade10Results(results);
    setStep(4);
  };

  const handleTawjihiSubmit = async () => {
    setMlLoading(true);
    setMlError(null);
    try {
      const res = await fetch(`${API_BASE}/api/ai/ml-recommend/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gpa: parseFloat(gpa),
          field:             selectedField,
          interest_tech:     interests.tech,
          interest_health:   interests.health,
          interest_business: interests.business,
          interest_arts:     interests.arts,
          thinking_style:    personality.thinking_style,
          personality_type:  personality.personality_type,
          preferred_study:   personality.preferred_study,
          preferred_work:    personality.preferred_work,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطأ في الخادم');
      setMlResults(data);
      setStep(5);
    } catch (e) {
      setMlError(e.message);
    } finally {
      setMlLoading(false);
    }
  };

  const getTotalSteps = () => studentType === 'grade10' ? 3 : 4;

  if (step === 0) {
    return (
      <div className="split-screen-wrapper" style={{ display: 'flex', height: 'calc(100vh - 70px)', minHeight: '520px', overflow: 'hidden' }} dir="ltr">

        {/* توجيهي — LEFT */}
        <div
          className="split-screen-side"
          onClick={() => handleStudentTypeSelect('tawjihi')}
          onMouseEnter={() => setHoveredSide('tawjihi')}
          onMouseLeave={() => setHoveredSide(null)}
          style={{
            flex: hoveredSide === 'tawjihi' ? '0 0 62%' : hoveredSide === 'grade10' ? '0 0 38%' : '0 0 50%',
            transition: 'flex 0.6s cubic-bezier(0.4,0,0.2,1)',
            background: 'linear-gradient(135deg, #2d0a08 0%, #4d120f 50%, #681a15 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0,
            background: hoveredSide === 'tawjihi'
              ? 'radial-gradient(circle at 50% 50%, rgba(238,90,36,0.28) 0%, transparent 65%)'
              : 'radial-gradient(circle at 30% 60%, rgba(238,90,36,0.1) 0%, transparent 60%)',
            transition: 'background 0.5s ease',
          }} />
          <div style={{ zIndex: 1, textAlign: 'center', padding: '40px 32px', color: '#fff' }}>
            <div style={{
              width: '110px', height: '110px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3.2rem', margin: '0 auto 28px',
              boxShadow: '0 12px 40px rgba(238,90,36,0.5)',
              transform: hoveredSide === 'tawjihi' ? 'scale(1.12) translateY(-6px)' : 'scale(1)',
              transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            }}>🎓</div>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 900, marginBottom: '14px', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
              {lang === 'en' ? 'Grade 11' : 'ثاني ثانوي'}
            </h2>
            <p style={{
              fontSize: '15px', color: 'rgba(255,200,200,0.85)',
              maxWidth: '260px', margin: '0 auto 36px', lineHeight: 1.9,
              opacity: hoveredSide === 'tawjihi' ? 1 : 0.6,
              transition: 'opacity 0.4s ease',
            }}>
              {lang === 'en' ? 'Discover the university major that suits your GPA and interests' : 'اكتشف التخصص الجامعي الذي يناسب معدلك واهتماماتك'}
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              border: '2px solid rgba(255,255,255,0.45)', borderRadius: '50px', padding: '12px 36px',
              fontSize: '15px', fontWeight: 700,
              background: hoveredSide === 'tawjihi' ? 'rgba(255,255,255,0.15)' : 'transparent',
              opacity: hoveredSide === 'tawjihi' ? 1 : 0.5,
              transform: hoveredSide === 'tawjihi' ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.4s ease',
            }}>
              {lang === 'en' ? 'Start Here →' : 'ابدأ هنا ←'}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="split-divider" style={{ width: '2px', flexShrink: 0, position: 'relative', zIndex: 10,
          background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.2) 70%, transparent 100%)',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '42px', height: '42px', borderRadius: '50%',
            background: 'rgba(20,20,30,0.7)', border: '2px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: 700,
            backdropFilter: 'blur(6px)',
          }}>{lang === 'en' ? 'Or' : 'أو'}</div>
        </div>

        {/* صف عاشر — RIGHT */}
        <div
          className="split-screen-side"
          onClick={() => handleStudentTypeSelect('grade10')}
          onMouseEnter={() => setHoveredSide('grade10')}
          onMouseLeave={() => setHoveredSide(null)}
          style={{
            flex: hoveredSide === 'grade10' ? '0 0 62%' : hoveredSide === 'tawjihi' ? '0 0 38%' : '0 0 50%',
            transition: 'flex 0.6s cubic-bezier(0.4,0,0.2,1)',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0,
            background: hoveredSide === 'grade10'
              ? 'radial-gradient(circle at 50% 50%, rgba(100,150,255,0.22) 0%, transparent 65%)'
              : 'radial-gradient(circle at 70% 40%, rgba(100,150,255,0.08) 0%, transparent 60%)',
            transition: 'background 0.5s ease',
          }} />
          <div style={{ zIndex: 1, textAlign: 'center', padding: '40px 32px', color: '#fff' }}>
            <div style={{
              width: '110px', height: '110px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #bbcae1 0%, #7a9fc0 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3.2rem', margin: '0 auto 28px',
              boxShadow: '0 12px 40px rgba(187,202,225,0.45)',
              transform: hoveredSide === 'grade10' ? 'scale(1.12) translateY(-6px)' : 'scale(1)',
              transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            }}>📚</div>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 900, marginBottom: '14px', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
              {lang === 'en' ? 'Grade 10' : 'أول ثانوي'}
            </h2>
            <p style={{
              fontSize: '15px', color: 'rgba(187,202,225,0.85)',
              maxWidth: '260px', margin: '0 auto 36px', lineHeight: 1.9,
              opacity: hoveredSide === 'grade10' ? 1 : 0.6,
              transition: 'opacity 0.4s ease',
            }}>
              {lang === 'en' ? 'Help me choose the right study branch for my future' : 'ساعدني في اختيار الفرع الدراسي المناسب لمستقبلي'}
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              border: '2px solid rgba(187,202,225,0.45)', borderRadius: '50px', padding: '12px 36px',
              fontSize: '15px', fontWeight: 700, color: '#bbcae1',
              background: hoveredSide === 'grade10' ? 'rgba(187,202,225,0.15)' : 'transparent',
              opacity: hoveredSide === 'grade10' ? 1 : 0.5,
              transform: hoveredSide === 'grade10' ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.4s ease',
            }}>
              {lang === 'en' ? 'Start Here →' : 'ابدأ هنا ←'}
            </div>
          </div>
        </div>

      </div>
    );
  }

  // Grade 10 results (step 4)
  if (step === 4 && studentType === 'grade10' && grade10Results) {
    const top = grade10Results[0];
    return (
      <div className="container py-5" style={{ maxWidth: '860px' }}>
        <div className="text-center mb-5">
          <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🎯</div>
          <h1 className="fw-bold mb-2" style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)' }}>
            {t('result_field_title')}
          </h1>
          <p className={darkMode ? 'text-secondary' : 'text-muted'}>
            {t('result_field_sub')}
          </p>
        </div>

        {/* Top Pick */}
        <div
          className="mb-4 p-4 rounded-4 text-white text-center"
          style={{ background: top.bg, boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{top.icon}</div>
          <h2 className="fw-bold mb-2" style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>
            الحقل {top.label}
          </h2>
          <span className="badge bg-white fw-bold px-3 py-2" style={{ fontSize: '14px', color: '#333' }}>
            {t('result_compat')} {top.score}%
          </span>
          <p style={{ marginTop: '14px', opacity: 0.85, fontSize: '14px', marginBottom: 0 }}>
            {t('result_focus')} {top.focus}
          </p>
        </div>

        {/* All Fields */}
        <h5 className="fw-bold mb-3">{t('result_all_fields')}</h5>
        <div className="d-flex flex-column gap-2 mb-5">
          {grade10Results.map((f, idx) => (
            <div key={f.id} className={`card border-0 shadow-sm ${darkMode ? 'bg-secondary text-white' : ''}`}>
              <div className="card-body py-3 px-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="badge rounded-pill"
                      style={{ background: idx === 0 ? '#681a15' : '#bbcae1', color: idx === 0 ? '#fff' : '#333', minWidth: '28px' }}
                    >{idx + 1}</span>
                    <span style={{ fontSize: '18px' }}>{f.icon}</span>
                    <span className="fw-semibold" style={{ fontSize: '15px' }}>{f.label}</span>
                  </div>
                  <span className="text-danger fw-bold">{f.score}%</span>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div className="progress-bar bg-danger" style={{ width: `${f.score}%`, transition: 'width 0.8s ease' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <button
            onClick={() => { setStep(0); setStudentType(null); setGrade10Results(null); setFormData({ subjects: { 'رياضيات': '', 'علوم': '', 'لغة عربية': '', 'لغة إنجليزية': '', 'كيمياء': '', 'فيزياء': '', 'أحياء': '' }, interests: { tech: 3, science: 3, health: 3, business: 3, arts: 3, social: 3 }, personality: { thinking: '', social_type: '', learning: '' } }); }}
            className={`btn btn-lg px-4 ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}
          >
            {t('result_retake')}
          </button>
          <button onClick={() => navigate('assessment')} className="btn btn-danger btn-lg px-5">
            {t('result_to_tawjihi')}
          </button>
        </div>
      </div>
    );
  }

  // ML Results screen (tawjihi step 5)
  if (step === 5 && studentType === 'tawjihi' && mlResults) {
    const allRecs = mlResults.recommendations || [];
    const studentGpa = parseFloat(gpa) || 0;

    // Split into eligible and ineligible based on minimum admission score
    const eligibleRecs = allRecs.filter(r => isEligible(r.major, studentGpa));
    const ineligibleRecs = allRecs.filter(r => !isEligible(r.major, studentGpa));

    // Re-rank eligible recs starting from 1
    const recs = eligibleRecs.map((r, i) => ({ ...r, displayRank: i + 1 }));
    const top = recs[0];
    const fieldLabel = tawjihiFields.find(f => f.id === selectedField)?.label || '';
    return (
      <div className="container py-5" style={{ maxWidth: '860px' }}>
        {/* Header */}
        <div className="text-center mb-5">
          <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🏆</div>
          <h1 className="fw-bold mb-2" style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)' }}>
            {t('result_majors_title')}
          </h1>
          <p className={darkMode ? 'text-secondary' : 'text-muted'}>
            {lang === 'en' ? <>Based on <strong>{fieldLabel}</strong> field and GPA <strong>{gpa}%</strong></> : <>بناءً على حقل <strong>{fieldLabel}</strong> ومعدل <strong>{gpa}%</strong></>}
          </p>
        </div>

        {/* No eligible majors warning */}
        {recs.length === 0 && (
          <div className="alert alert-danger d-flex gap-3 align-items-start mb-4 rounded-4">
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🚫</span>
            <p className="mb-0" style={{ lineHeight: 1.9, fontSize: '14px' }}>
              {lang === 'en'
                ? `Your GPA (${gpa}%) does not meet the minimum admission requirements for any major in this field. Consider exploring other fields or check parallel enrollment options.`
                : `معدلك (${gpa}%) لا يصل إلى الحد الأدنى المطلوب لأي تخصص في هذا الحقل. جرب حقلاً آخر أو اطّلع على خيارات القبول الموازي.`}
            </p>
          </div>
        )}

        {/* Top Pick */}
        {top && (
          <div
            className="mb-4 p-4 rounded-4 text-white text-center"
            style={{ background: 'linear-gradient(135deg,#681a15,#9b2c24)', boxShadow: '0 8px 32px rgba(104,26,21,0.35)' }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🥇</div>
            <h2 className="fw-bold mb-1" style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>{top.major}</h2>
            <span className="badge bg-white text-danger fw-bold px-3 py-2" style={{ fontSize: '14px' }}>
              {t('result_match')} {top.confidence}%
            </span>
          </div>
        )}

        {/* GPA Warning */}
        {mlResults.gpa_warning && (
          <div className="alert alert-warning d-flex gap-3 align-items-start mb-4 rounded-4">
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>⚠️</span>
            <p className="mb-0" style={{ lineHeight: 1.9, fontSize: '14px' }}>{mlResults.gpa_warning}</p>
          </div>
        )}

        {/* AI Explanation */}
        {mlResults.ai_explanation && (
          <div className={`card border-0 shadow-sm mb-4 ${darkMode ? 'bg-secondary text-white' : 'bg-light'}`}>
            <div className="card-body p-4">
              <div className="d-flex gap-3 align-items-start">
                <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>🤖</span>
                <p className="mb-0" style={{ lineHeight: 2, fontSize: '15px' }}>{mlResults.ai_explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Eligible Recommendations */}
        {recs.length > 0 && (
          <>
            <h5 className="fw-bold mb-3">{t('result_majors_list')}</h5>
            <div className="d-flex flex-column gap-2 mb-4">
              {recs.map(r => (
                <div
                  key={r.rank}
                  className={`card border-0 shadow-sm ${darkMode ? 'bg-secondary text-white' : ''}`}
                >
                  <div className="card-body py-3 px-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="badge rounded-pill"
                          style={{ background: r.displayRank === 1 ? '#681a15' : '#bbcae1', color: r.displayRank === 1 ? '#fff' : '#333', minWidth: '28px' }}
                        >
                          {r.displayRank}
                        </span>
                        <span className="fw-semibold" style={{ fontSize: '15px' }}>{r.major}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {getMajorMinScore(r.major) !== null && (
                          <span className={`badge ${darkMode ? 'bg-success' : 'bg-success'}`} style={{ fontSize: '11px' }}>
                            {lang === 'en' ? `Min: ${getMajorMinScore(r.major)}%` : `الحد الأدنى: ${getMajorMinScore(r.major)}%`}
                          </span>
                        )}
                        <span className="text-danger fw-bold" style={{ fontSize: '14px' }}>{r.confidence}%</span>
                      </div>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div
                        className="progress-bar bg-danger"
                        style={{ width: `${r.confidence}%`, transition: 'width 0.8s ease' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Ineligible Recommendations (below minimum) */}
        {ineligibleRecs.length > 0 && (
          <div className="mb-5">
            <h6 className="fw-bold mb-3" style={{ color: '#999' }}>
              {lang === 'en' ? 'Below minimum GPA (not eligible):' : 'تحت الحد الأدنى (لا تستوفي الشرط):'}
            </h6>
            <div className="d-flex flex-column gap-2">
              {ineligibleRecs.map(r => (
                <div
                  key={r.rank}
                  className="card border-0"
                  style={{ opacity: 0.5, background: darkMode ? 'rgba(255,255,255,0.04)' : '#f5f5f5' }}
                >
                  <div className="card-body py-2 px-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: '14px' }}>🚫</span>
                        <span className="fw-semibold" style={{ fontSize: '14px', textDecoration: 'line-through', color: '#999' }}>{r.major}</span>
                      </div>
                      <span className="badge bg-danger bg-opacity-75" style={{ fontSize: '11px' }}>
                        {lang === 'en' ? `Min: ${getMajorMinScore(r.major)}%` : `الحد الأدنى: ${getMajorMinScore(r.major)}%`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <button
            onClick={() => { setStep(0); setStudentType(null); setMlResults(null); setGpa(''); setSelectedField(null); setPersonality({ thinking_style: '', personality_type: '', preferred_study: '', preferred_work: '' }); }}
            className={`btn btn-lg px-4 ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}
          >
            {t('result_retake')}
          </button>
          <button onClick={() => navigate('universities')} className="btn btn-danger btn-lg px-5">
            {t('result_explore_unis')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className={`card border-0 shadow-lg ${darkMode ? 'bg-secondary text-white' : ''}`}>
            <div className="card-body p-4 p-md-5">

              {/* Progress Bar */}
              {step > 0 && !(step === 1 && studentType === 'tawjihi') && (
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <small className="fw-semibold">{t('step_label')} {step} {t('step_of')} {getTotalSteps()}</small>
                    <small className="fw-semibold">{Math.round((step / getTotalSteps()) * 100)}%</small>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className="progress-bar bg-danger"
                      style={{ width: `${(step / getTotalSteps()) * 100}%`, transition: 'width 0.3s' }}
                    />
                  </div>
                </div>
              )}

              {/* ── TAWJIHI STEP 1: Field Selection ── */}
              {step === 1 && studentType === 'tawjihi' && (
                <div>
                  <h3 className="fw-bold mb-2">{t('choose_field')}</h3>
                  <p className={`mb-4 ${darkMode ? 'text-light' : 'text-muted'}`}>
                    {t('choose_field_sub')}
                  </p>
                  <div className="row g-3">
                    {tawjihiFields.map(f => (
                      <div className="col-md-4" key={f.id}>
                        <div
                          onClick={() => { setSelectedField(f.id); setStep(2); }}
                          style={{
                            background: f.bg, borderRadius: '16px', padding: '28px 16px',
                            textAlign: 'center', cursor: 'pointer', color: '#fff',
                            border: selectedField === f.id ? '3px solid #fff' : '3px solid transparent',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            boxShadow: '0 4px 18px rgba(0,0,0,0.18)',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.28)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.18)'; }}
                        >
                          <div style={{ fontSize: '2.4rem', marginBottom: '10px' }}>{f.icon}</div>
                          <div style={{ fontWeight: 700, fontSize: '15px', lineHeight: 1.4 }}>{f.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TAWJIHI STEP 2: GPA ── */}
              {step === 2 && studentType === 'tawjihi' && (
                <div>
                  <h3 className="fw-bold mb-2">{t('gpa_title')}</h3>
                  <p className={`mb-5 ${darkMode ? 'text-light' : 'text-muted'}`}>
                    {t('gpa_sub')}
                  </p>
                  <div style={{ maxWidth: '360px', margin: '0 auto' }}>
                    <label className="form-label fw-semibold mb-3" style={{ fontSize: '15px' }}>{t('gpa_label')}</label>
                    <div className="input-group input-group-lg">
                      <input
                        type="number"
                        value={gpa}
                        onChange={e => setGpa(e.target.value)}
                        className={`form-control text-center fw-bold ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}
                        style={{ fontSize: '2rem', letterSpacing: '2px' }}
                        min="50" max="100" step="0.1"
                        placeholder="85.5"
                      />
                      <span className={`input-group-text fw-bold ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}>%</span>
                    </div>
                    <small className={`d-block mt-2 text-center ${darkMode ? 'text-secondary' : 'text-muted'}`}>
                      {t('gpa_hint')}
                    </small>
                  </div>
                </div>
              )}

              {/* ── TAWJIHI STEP 3: Interests ── */}
              {step === 3 && studentType === 'tawjihi' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <div style={{ width: '4px', height: '34px', borderRadius: '4px', background: 'linear-gradient(180deg,#681a15,#bbcae1)', flexShrink: 0 }} />
                    <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.45rem' }}>{t('interests_title')}</h3>
                  </div>
                  <p style={{ color: darkMode ? '#aaa' : '#888', fontSize: '13.5px', marginBottom: '32px', paddingRight: '16px' }}>
                    {t('interests_sub')}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                    {Object.entries(interestLabels).map(([key, { label, icon }]) => {
                      const val = interests[key];
                      const levelLabels = lang === 'en'
                        ? ['', 'Low', 'Light', 'Medium', 'Good', 'High']
                        : ['', 'ضعيف', 'خفيف', 'متوسط', 'جيد', 'مرتفع'];
                      return (
                        <div
                          key={key}
                          style={{
                            background: darkMode
                              ? 'linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))'
                              : 'linear-gradient(135deg,#f9faff,#f2f5ff)',
                            border: `1.5px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(187,202,225,0.6)'}`,
                            borderRadius: '18px',
                            padding: '20px 18px 18px',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <div style={{
                            position: 'absolute', top: 0, right: 0, width: `${val * 20}%`, height: '3px',
                            background: 'linear-gradient(90deg,#bbcae1,#681a15)',
                            transition: 'width 0.35s ease',
                          }} />
                          <div style={{ fontSize: '2rem', marginBottom: '6px' }}>{icon}</div>
                          <div style={{ fontWeight: 700, fontSize: '13.5px', marginBottom: '4px' }}>{label}</div>
                          <div style={{ fontSize: '11px', color: '#681a15', fontWeight: 600, marginBottom: '14px', minHeight: '16px' }}>
                            {levelLabels[val]}
                          </div>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-start' }}>
                            {[1, 2, 3, 4, 5].map(n => (
                              <button
                                key={n}
                                onClick={() => setInterests({ ...interests, [key]: n })}
                                style={{
                                  width: '34px', height: '34px', borderRadius: '10px',
                                  border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '13px',
                                  background: n <= val
                                    ? `linear-gradient(135deg,#9b2c24,#681a15)`
                                    : (darkMode ? 'rgba(255,255,255,0.08)' : '#e8ecf4'),
                                  color: n <= val ? '#fff' : (darkMode ? '#666' : '#aaa'),
                                  transform: n === val ? 'scale(1.18) translateY(-2px)' : 'scale(1)',
                                  transition: 'all 0.15s cubic-bezier(0.34,1.56,0.64,1)',
                                  boxShadow: n <= val ? '0 3px 10px rgba(104,26,21,0.45)' : 'none',
                                }}
                              >
                                {n}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── TAWJIHI STEP 4: Personality ── */}
              {step === 4 && studentType === 'tawjihi' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <div style={{ width: '4px', height: '34px', borderRadius: '4px', background: 'linear-gradient(180deg,#681a15,#bbcae1)', flexShrink: 0 }} />
                    <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.45rem' }}>{t('personality_title')}</h3>
                  </div>
                  <p style={{ color: darkMode ? '#aaa' : '#888', fontSize: '13.5px', marginBottom: '32px', paddingRight: '16px' }}>
                    {t('personality_sub')}
                  </p>

                  {[
                    {
                      key: 'thinking_style',
                      question: t('q_thinking'),
                      options: [
                        { label: t('opt_analytical'),   icon: '🔍' },
                        { label: t('opt_creative'),     icon: '🎨' },
                        { label: t('opt_practical'),    icon: '⚡' },
                        { label: t('opt_social_think'), icon: '🤝' },
                      ],
                    },
                    {
                      key: 'personality_type',
                      question: t('q_personality'),
                      options: [
                        { label: t('opt_extrovert'), icon: '👥' },
                        { label: t('opt_introvert'), icon: '🎯' },
                        { label: t('opt_between'),   icon: '⚖️' },
                      ],
                    },
                    {
                      key: 'preferred_study',
                      question: t('q_study'),
                      options: [
                        { label: t('opt_applied'),      icon: '🔧' },
                        { label: t('opt_theoretical'),  icon: '📖' },
                        { label: t('opt_mix'),          icon: '🔄' },
                      ],
                    },
                    {
                      key: 'preferred_work',
                      question: t('q_work'),
                      options: [
                        { label: t('opt_team'), icon: '👥' },
                        { label: t('opt_solo'), icon: '🎯' },
                        { label: t('opt_both'), icon: '⚖️' },
                      ],
                    },
                  ].map(({ key, question, options }, qIdx) => (
                    <div key={key} style={{ marginBottom: '28px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                        <span style={{
                          width: '26px', height: '26px', borderRadius: '8px', flexShrink: 0,
                          background: personality[key] ? 'linear-gradient(135deg,#681a15,#9b2c24)' : (darkMode ? 'rgba(255,255,255,0.12)' : '#e8ecf4'),
                          color: personality[key] ? '#fff' : (darkMode ? '#777' : '#bbb'),
                          fontSize: '11px', fontWeight: 800,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.3s',
                        }}>
                          {personality[key] ? '✓' : qIdx + 1}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: '15px' }}>{question}</span>
                      </div>

                      <div className="options-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingRight: '36px' }}>
                        {options.map(({ label, icon }) => {
                          const selected = personality[key] === label;
                          return (
                            <button
                              key={label}
                              onClick={() => setPersonality({ ...personality, [key]: label })}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                border: selected
                                  ? '2px solid #681a15'
                                  : `1.5px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(187,202,225,0.7)'}`,
                                background: selected
                                  ? 'linear-gradient(135deg,rgba(104,26,21,0.12),rgba(155,44,36,0.06))'
                                  : (darkMode ? 'rgba(255,255,255,0.04)' : '#f7f9ff'),
                                color: selected ? '#681a15' : (darkMode ? '#ccc' : '#555'),
                                borderRadius: '12px',
                                padding: '10px 18px',
                                fontSize: '14px',
                                fontWeight: selected ? 700 : 400,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: selected ? '0 4px 18px rgba(104,26,21,0.2)' : 'none',
                                transform: selected ? 'translateY(-1px)' : 'none',
                              }}
                            >
                              <span>{icon}</span>
                              <span>{label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {mlError && <div className="alert alert-danger mt-3 rounded-3">{mlError}</div>}
                </div>
              )}

              {/* ── GRADE 10 STEP 1: Subject Grades ── */}
              {step === 1 && studentType === 'grade10' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <div style={{ width: '4px', height: '34px', borderRadius: '4px', background: 'linear-gradient(180deg,#681a15,#bbcae1)', flexShrink: 0 }} />
                    <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.45rem' }}>{t('grades_title')}</h3>
                  </div>
                  <p style={{ color: darkMode ? '#aaa' : '#888', fontSize: '13.5px', marginBottom: '28px', paddingRight: '16px' }}>
                    {lang === 'en' ? 'Enter your grades — Maths/Arabic/English out of 200, others out of 100' : 'رياضيات / عربي / إنجليزي من 200 — باقي المواد من 100'}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {subjectList.map(({ key, label, icon, color, max }) => {
                      const val = parseFloat(formData.subjects[key]) || 0;
                      const pct = Math.min((val / max) * 100, 100);
                      return (
                        <div
                          key={key}
                          style={{
                            background: darkMode ? 'rgba(255,255,255,0.05)' : '#f7f9ff',
                            border: `1.5px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(187,202,225,0.5)'}`,
                            borderRadius: '16px', padding: '16px', position: 'relative', overflow: 'hidden',
                          }}
                        >
                          <div style={{ position: 'absolute', bottom: 0, right: 0, width: `${pct}%`, height: '3px', background: color, transition: 'width 0.3s', borderRadius: '0 0 16px 0' }} />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '1.4rem' }}>{icon}</span>
                            <span style={{ fontWeight: 700, fontSize: '13px' }}>{label}</span>
                            <span style={{ fontSize: '11px', color: '#999', marginRight: 'auto' }}>/{max}</span>
                          </div>
                          <input
                            type="number"
                            value={formData.subjects[key]}
                            onChange={e => handleSubjectChange(key, e.target.value)}
                            min="0" max={max} placeholder={`0 — ${max}`}
                            style={{
                              width: '100%', border: `1.5px solid ${darkMode ? 'rgba(255,255,255,0.15)' : '#dde3f0'}`,
                              borderRadius: '10px', padding: '8px 12px', fontSize: '15px', fontWeight: 700,
                              background: darkMode ? 'rgba(255,255,255,0.06)' : '#fff',
                              color: darkMode ? '#fff' : '#222', outline: 'none', textAlign: 'center',
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── GRADE 10 STEP 2: Interests ── */}
              {step === 2 && studentType === 'grade10' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <div style={{ width: '4px', height: '34px', borderRadius: '4px', background: 'linear-gradient(180deg,#681a15,#bbcae1)', flexShrink: 0 }} />
                    <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.45rem' }}>{t('interests_title')}</h3>
                  </div>
                  <p style={{ color: darkMode ? '#aaa' : '#888', fontSize: '13.5px', marginBottom: '28px', paddingRight: '16px' }}>
                    {t('interests_sub')}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                    {Object.entries(grade10InterestLabels).map(([key, { label, icon }]) => {
                      const val = formData.interests[key];
                      const levelLabels = lang === 'en'
                        ? ['', 'Low', 'Light', 'Medium', 'Good', 'High']
                        : ['', 'ضعيف', 'خفيف', 'متوسط', 'جيد', 'مرتفع'];
                      return (
                        <div key={key} style={{
                          background: darkMode ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg,#f9faff,#f2f5ff)',
                          border: `1.5px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(187,202,225,0.6)'}`,
                          borderRadius: '18px', padding: '20px 18px 18px', position: 'relative', overflow: 'hidden',
                        }}>
                          <div style={{ position: 'absolute', top: 0, right: 0, width: `${val * 20}%`, height: '3px', background: 'linear-gradient(90deg,#bbcae1,#681a15)', transition: 'width 0.35s ease' }} />
                          <div style={{ fontSize: '2rem', marginBottom: '6px' }}>{icon}</div>
                          <div style={{ fontWeight: 700, fontSize: '13.5px', marginBottom: '4px' }}>{label}</div>
                          <div style={{ fontSize: '11px', color: '#681a15', fontWeight: 600, marginBottom: '14px', minHeight: '16px' }}>{levelLabels[val]}</div>
                          <div style={{ display: 'flex', gap: '6px' }} dir="ltr">
                            {[1,2,3,4,5].map(n => (
                              <button key={n} onClick={() => setFormData({ ...formData, interests: { ...formData.interests, [key]: n } })} style={{
                                width: '34px', height: '34px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '13px',
                                background: n <= val ? 'linear-gradient(135deg,#9b2c24,#681a15)' : (darkMode ? 'rgba(255,255,255,0.08)' : '#e8ecf4'),
                                color: n <= val ? '#fff' : (darkMode ? '#666' : '#aaa'),
                                transform: n === val ? 'scale(1.18) translateY(-2px)' : 'scale(1)',
                                transition: 'all 0.15s cubic-bezier(0.34,1.56,0.64,1)',
                                boxShadow: n <= val ? '0 3px 10px rgba(104,26,21,0.45)' : 'none',
                              }}>{n}</button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── GRADE 10 STEP 3: Personality ── */}
              {step === 3 && studentType === 'grade10' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <div style={{ width: '4px', height: '34px', borderRadius: '4px', background: 'linear-gradient(180deg,#681a15,#bbcae1)', flexShrink: 0 }} />
                    <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.45rem' }}>{t('g10_personality_title')}</h3>
                  </div>
                  <p style={{ color: darkMode ? '#aaa' : '#888', fontSize: '13.5px', marginBottom: '32px', paddingRight: '16px' }}>
                    {t('g10_personality_sub')}
                  </p>
                  {[
                    {
                      key: 'thinking',
                      question: t('q_thinking_g10'),
                      options: [{ label: t('opt_analytical_g10'), icon: '🔍' }, { label: t('opt_creative_g10'), icon: '🎨' }, { label: t('opt_practical_g10'), icon: '⚡' }],
                    },
                    {
                      key: 'social_type',
                      question: t('q_work_g10'),
                      options: [{ label: t('opt_with_people'), icon: '👥' }, { label: t('opt_alone'), icon: '🎯' }, { label: t('opt_both_g10'), icon: '⚖️' }],
                    },
                    {
                      key: 'learning',
                      question: t('q_subjects'),
                      options: [{ label: t('opt_science_math'), icon: '🔢' }, { label: t('opt_lang_lit'), icon: '📝' }, { label: t('opt_both_sub'), icon: '🌐' }],
                    },
                  ].map(({ key, question, options }, qIdx) => (
                    <div key={key} style={{ marginBottom: '28px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                        <span style={{
                          width: '26px', height: '26px', borderRadius: '8px', flexShrink: 0,
                          background: formData.personality[key] ? 'linear-gradient(135deg,#681a15,#9b2c24)' : (darkMode ? 'rgba(255,255,255,0.12)' : '#e8ecf4'),
                          color: formData.personality[key] ? '#fff' : (darkMode ? '#777' : '#bbb'),
                          fontSize: '11px', fontWeight: 800,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s',
                        }}>
                          {formData.personality[key] ? '✓' : qIdx + 1}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: '15px' }}>{question}</span>
                      </div>
                      <div className="options-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingRight: '36px' }}>
                        {options.map(({ label, icon }) => {
                          const selected = formData.personality[key] === label;
                          return (
                            <button key={label} onClick={() => setFormData({ ...formData, personality: { ...formData.personality, [key]: label } })} style={{
                              display: 'flex', alignItems: 'center', gap: '8px',
                              border: selected ? '2px solid #681a15' : `1.5px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(187,202,225,0.7)'}`,
                              background: selected ? 'linear-gradient(135deg,rgba(104,26,21,0.12),rgba(155,44,36,0.06))' : (darkMode ? 'rgba(255,255,255,0.04)' : '#f7f9ff'),
                              color: selected ? '#681a15' : (darkMode ? '#ccc' : '#555'),
                              borderRadius: '12px', padding: '10px 18px', fontSize: '14px',
                              fontWeight: selected ? 700 : 400, cursor: 'pointer', transition: 'all 0.2s',
                              boxShadow: selected ? '0 4px 18px rgba(104,26,21,0.2)' : 'none',
                              transform: selected ? 'translateY(-1px)' : 'none',
                            }}>
                              <span>{icon}</span><span>{label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Navigation */}
              {step > 0 && (
                <div className="d-flex justify-content-between mt-5">
                  <button
                    onClick={() => setStep(Math.max(0, step - 1))}
                    className={`btn btn-lg px-4 ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}
                  >
                    {t('btn_prev')}
                  </button>

                  {studentType === 'tawjihi' && step < 4 && step !== 1 && (
                    <button
                      onClick={() => setStep(step + 1)}
                      disabled={step === 2 && (!gpa || parseFloat(gpa) < 50 || parseFloat(gpa) > 100)}
                      className="btn btn-danger btn-lg px-4"
                    >
                      {t('btn_next')}
                    </button>
                  )}

                  {studentType === 'tawjihi' && step === 4 && (
                    <button
                      onClick={handleTawjihiSubmit}
                      disabled={mlLoading}
                      className="btn btn-danger btn-lg px-5"
                    >
                      {mlLoading ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-2" role="status" />
                          {t('btn_analyzing')}
                        </span>
                      ) : t('btn_get_recs')}
                    </button>
                  )}

                  {studentType === 'grade10' && step < getTotalSteps() && (
                    <button onClick={() => setStep(step + 1)} className="btn btn-danger btn-lg px-4">
                      {t('btn_next')}
                    </button>
                  )}

                  {studentType === 'grade10' && step === getTotalSteps() && (
                    <button onClick={handleGrade10Submit} className="btn btn-danger btn-lg px-4">
                      احصل على التوصيات ←
                    </button>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UniversitiesPage() {
  const { darkMode, t, lang } = useAppContext();
  const isEn = lang === 'en';

  const universities = [
    // ===== حكومية =====
    { type: 'public',  ar: 'الجامعة الأردنية',                  en: 'University of Jordan',                    cityAr: 'عمّان',    cityEn: 'Amman',    website: 'https://ju.edu.jo',           image: 'https://upload.wikimedia.org/wikipedia/commons/4/42/View_of_the_University_of_Jordan_campus.jpg' },
    { type: 'public',  ar: 'جامعة العلوم والتكنولوجيا الأردنية', en: 'Jordan Univ. of Science & Technology',   cityAr: 'إربد',    cityEn: 'Irbid',    website: 'https://just.edu.jo',         image: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/JUST-main-gate.jpeg' },
    { type: 'public',  ar: 'جامعة اليرموك',                     en: 'Yarmouk University',                      cityAr: 'إربد',    cityEn: 'Irbid',    website: 'https://yu.edu.jo',           image: 'https://upload.wikimedia.org/wikipedia/commons/3/39/YUPanorama.jpg' },
    { type: 'public',  ar: 'جامعة البلقاء التطبيقية',           en: 'Al-Balqa Applied University',             cityAr: 'السلط',   cityEn: 'Al-Salt',  website: 'https://bau.edu.jo',          image: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Al-Balqa%27_Applied_University.jpg" },
    { type: 'public',  ar: 'الجامعة الهاشمية',                  en: 'Hashemite University',                    cityAr: 'الزرقاء', cityEn: 'Zarqa',    website: 'https://hu.edu.jo',           image: 'https://upload.wikimedia.org/wikipedia/commons/6/60/%D8%A7%D9%84%D8%AC%D8%A7%D9%85%D8%B9%D8%A9_%D8%A7%D9%84%D9%87%D8%A7%D8%B4%D9%85%D9%8A%D8%A9.jpg' },
    { type: 'public',  ar: 'جامعة مؤتة',                        en: "Mu'tah University",                       cityAr: 'الكرك',   cityEn: 'Karak',    website: 'https://mutah.edu.jo',        image: "https://upload.wikimedia.org/wikipedia/commons/f/f0/The_main_gate_of_Mu%27tah_University.jpg" },
    { type: 'public',  ar: 'جامعة آل البيت',                    en: 'Aal Al-Bayt University',                  cityAr: 'المفرق',  cityEn: 'Mafraq',   website: 'https://aabu.edu.jo',         image: 'https://daafoor.com/assets/template_files/images/universities/195.jpg' },
    { type: 'public',  ar: 'جامعة الحسين بن طلال',              en: 'Al-Hussein Bin Talal University',         cityAr: 'معان',    cityEn: "Ma'an",    website: 'https://ahu.edu.jo',          image: 'https://daafoor.com/assets/template_files/images/universities/209.jpg' },
    { type: 'public',  ar: 'جامعة الطفيلة التقنية',             en: 'Al-Tafila Technical University',          cityAr: 'الطفيلة', cityEn: 'Tafila',   website: 'https://ttu.edu.jo',          image: 'https://daafoor.com/assets/template_files/images/universities/200.jpg' },
    { type: 'public',  ar: 'الجامعة الألمانية الأردنية',        en: 'German Jordanian University',             cityAr: 'مادبا',   cityEn: 'Madaba',   website: 'https://gju.edu.jo',          image: 'https://upload.wikimedia.org/wikipedia/commons/3/35/GJU_Campus_in_Madaba.jpg' },
    // ===== خاصة =====
    { type: 'private', ar: 'جامعة الأميرة سمية للتكنولوجيا',    en: 'Princess Sumaya Univ. for Technology',   cityAr: 'عمّان',   cityEn: 'Amman',    website: 'https://psut.edu.jo',         image: 'https://upload.wikimedia.org/wikipedia/commons/6/63/PSUT-Image.jpg' },
    { type: 'private', ar: 'جامعة العلوم التطبيقية الخاصة',     en: 'Applied Science Private University',     cityAr: 'عمّان',   cityEn: 'Amman',    website: 'https://asu.edu.jo',          image: 'https://daafoor.com/assets/template_files/images/universities/199.jpg' },
    { type: 'private', ar: 'جامعة عمّان الأهلية',               en: 'Al-Ahliyya Amman University',            cityAr: 'عمّان',   cityEn: 'Amman',    website: 'https://ammanu.edu.jo',       image: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Al_Ahliyya_Amman_University_Gate.jpg' },
    { type: 'private', ar: 'جامعة الزيتونة الأردنية',           en: 'Al-Zaytoonah University of Jordan',      cityAr: 'عمّان',   cityEn: 'Amman',    website: 'https://zuj.edu.jo',          image: 'https://daafoor.com/assets/template_files/images/universities/196.jpg' },
    { type: 'private', ar: 'جامعة البتراء',                     en: 'University of Petra',                    cityAr: 'عمّان',   cityEn: 'Amman',    website: 'https://uop.edu.jo',          image: 'https://daafoor.com/assets/template_files/images/universities/197.jpg' },
    { type: 'private', ar: 'جامعة الشرق الأوسط',                en: 'Middle East University',                 cityAr: 'عمّان',   cityEn: 'Amman',    website: 'https://meu.edu.jo',          image: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Phoca_thumb_l_IMG_0007.jpg' },
    { type: 'private', ar: 'جامعة عمّان العربية',               en: 'Amman Arab University',                  cityAr: 'عمّان',   cityEn: 'Amman',    website: 'https://aau.edu.jo',          image: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Amman_arab_university.jpg' },
    { type: 'private', ar: 'جامعة الإسراء',                     en: 'Al-Isra University',                     cityAr: 'عمّان',   cityEn: 'Amman',    website: 'https://isra.edu.jo',         image: 'https://daafoor.com/assets/template_files/images/universities/198.jpg' },
    { type: 'private', ar: 'جامعة الزرقاء',                     en: 'University of Zarqa',                    cityAr: 'الزرقاء', cityEn: 'Zarqa',    website: 'https://zu.edu.jo',           image: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Logozu.PNG' },
    { type: 'private', ar: 'جامعة فيلادلفيا',                   en: 'Philadelphia University',                cityAr: 'جرش',     cityEn: 'Jerash',   website: 'https://philadelphia.edu.jo', image: 'https://upload.wikimedia.org/wikipedia/en/c/c0/Faculty_Of_Engineering_entrance_at_Philadelphia_University.jpg' },
    { type: 'private', ar: 'جامعة جرش',                         en: 'Jerash University',                      cityAr: 'جرش',     cityEn: 'Jerash',   website: 'https://jpu.edu.jo',          image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Jerash_University_entrance_2.JPG' },
    { type: 'private', ar: 'جامعة عجلون الوطنية',               en: 'Ajloun National University',             cityAr: 'عجلون',   cityEn: 'Ajloun',   website: 'https://anu.edu.jo',          image: 'https://daafoor.com/assets/template_files/images/universities/211.jpg' },
    { type: 'private', ar: 'جامعة إربد الأهلية',                en: 'Irbid National University',              cityAr: 'إربد',    cityEn: 'Irbid',    website: 'https://inu.edu.jo',          image: 'https://daafoor.com/assets/template_files/images/universities/202.jpg' },
    { type: 'private', ar: 'الجامعة الأمريكية في مادبا',        en: 'American University in Madaba',          cityAr: 'مادبا',   cityEn: 'Madaba',   website: 'https://aum.edu.jo',          image: 'https://daafoor.com/assets/template_files/images/universities/213.jpg' },
    { type: 'private', ar: 'جامعة جدارا',                       en: 'Jadara University',                      cityAr: 'إربد',    cityEn: 'Irbid',    website: 'https://jadara.edu.jo',       image: 'https://daafoor.com/assets/template_files/images/universities/206.jpg' },
    { type: 'private', ar: 'جامعة العقبة للتكنولوجيا',          en: 'Aqaba University of Technology',         cityAr: 'العقبة',  cityEn: 'Aqaba',    website: 'https://aut.edu.jo',          image: 'https://aqabaonline.com/wp-content/uploads/2016/03/157845_1_1450741171.jpg' },
    { type: 'private', ar: 'جامعة العقبة للعلوم الطبية',        en: 'Aqaba Univ. for Medical Sciences',       cityAr: 'العقبة',  cityEn: 'Aqaba',    website: 'https://amsu.edu.jo',         image: 'https://files.cdn-files-a.com/uploads/6970195/2000_690f170f32c74-thumbnail.jpg' },
    { type: 'private', ar: 'جامعة ابن سينا للعلوم الطبية',     en: 'Ibn Sina Univ. for Medical Sciences',    cityAr: 'عمّان',   cityEn: 'Amman',    website: 'https://isums.edu.jo',        image: 'https://isums.edu.jo/images/home_page/2.webp' },
  ].map(u => ({ ...u, name: isEn ? u.en : u.ar, city: isEn ? u.cityEn : u.cityAr }));

  const UniCard = ({ uni }) => (
    <div className="col-md-6 col-lg-4">
      <div className={`card h-100 border-0 shadow-sm overflow-hidden ${darkMode ? 'bg-secondary text-white' : ''}`}
        style={{ transition: 'transform 0.25s, box-shadow 0.25s' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.18)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
      >
        <div style={{
          height: '190px',
          background: uni.image
            ? `linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(104,26,21,0.72) 100%), url(${uni.image}) center/cover no-repeat`
            : `linear-gradient(135deg, #681a15 0%, #bbcae1 100%)`,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '12px 14px'
        }}>
          <span className={`badge align-self-start`}
            style={{ background: uni.type === 'public' ? 'rgba(29,78,216,0.85)' : 'rgba(201,168,76,0.9)', color: uni.type === 'public' ? '#fff' : '#3d2800', fontSize: '11px', backdropFilter: 'blur(4px)' }}>
            {uni.type === 'public' ? t('uni_public_badge') : t('uni_private_badge')}
          </span>
          <div>
            <h6 className="fw-bold mb-0 text-white" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.85)', fontSize: '0.95rem' }}>{uni.name}</h6>
            <small style={{ color: 'rgba(255,255,255,0.82)' }}>📍 {uni.city}</small>
          </div>
        </div>
        <div className="card-body p-3">
          <a href={uni.website} target="_blank" rel="noopener noreferrer"
            className="btn btn-danger btn-sm w-100 fw-bold">
            {t('uni_visit')}
          </a>
        </div>
      </div>
    </div>
  );

  const publicUnis  = universities.filter(u => u.type === 'public');
  const privateUnis = universities.filter(u => u.type === 'private');

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <div style={{ fontSize: '4rem' }}>🏛️</div>
        <h1 className="display-5 fw-bold mb-3">{t('unis_title')}</h1>
        <p className={darkMode ? 'text-secondary' : 'text-muted'}>{t('unis_sub')}</p>
      </div>

      <h4 className="fw-bold mb-4 pb-2" style={{ borderBottom: '3px solid #681a15' }}>{t('unis_public')}</h4>
      <div className="row g-4 mb-5">
        {publicUnis.map((uni, idx) => <UniCard key={idx} uni={uni} />)}
      </div>

      <h4 className="fw-bold mb-4 pb-2" style={{ borderBottom: '3px solid #bbcae1' }}>{t('unis_private')}</h4>
      <div className="row g-4">
        {privateUnis.map((uni, idx) => <UniCard key={idx} uni={uni} />)}
      </div>
    </div>
  );
}

function ContactPage() {
  const { darkMode, t } = useAppContext();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const FORMSPREE_ID = 'xgodybwe';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(t('form_error'));
      }
    } catch {
      setError(t('form_conn_error'));
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    { icon: '📧', label: t('contact_email_label'),    value: 'khattababdelraheem@gmail.com', ltr: true },
    { icon: '📞', label: t('contact_phone_label'),    value: '+962 780 404 027', ltr: true },
    { icon: '📍', label: t('contact_location_label'), value: t('contact_location_val') },
  ];

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <div style={{ fontSize: '4rem' }}>✉️</div>
        <h1 className="display-5 fw-bold mb-3">{t('contact_title')}</h1>
        <p className={darkMode ? 'text-secondary' : 'text-muted'}>{t('contact_sub')}</p>
      </div>

      <div className="row g-5">
        {/* Contact Info */}
        <div className="col-lg-4">
          <div className="d-flex flex-column gap-4">
            {contactInfo.map((item, idx) => (
              <div key={idx} className={`card border-0 shadow-sm p-4 ${darkMode ? 'bg-secondary text-white' : ''}`}>
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="bg-danger bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '56px', height: '56px', fontSize: '1.6rem' }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <small className={`fw-semibold d-block mb-1 ${darkMode ? 'text-light' : 'text-muted'}`}>{item.label}</small>
                    <span className="fw-bold" dir={item.ltr ? 'ltr' : undefined}>{item.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="col-lg-8">
          <div className={`card border-0 shadow-sm p-4 p-md-5 ${darkMode ? 'bg-secondary text-white' : ''}`}>
            {submitted ? (
              <div className="text-center py-4">
                <div style={{ fontSize: '4rem' }}>✅</div>
                <h4 className="fw-bold mt-3 mb-2">{t('form_success')}</h4>
                <p className={darkMode ? 'text-light' : 'text-muted'}>{t('form_success_sub')}</p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                  className="btn btn-danger mt-3"
                >
                  {t('form_send_another')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">{t('form_name')}</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t('form_name_ph')}
                      className={`form-control form-control-lg ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">{t('form_email')}</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@email.com"
                      className={`form-control form-control-lg ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">{t('form_subject')}</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={t('form_subject_ph')}
                      className={`form-control form-control-lg ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">{t('form_message')}</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t('form_message_ph')}
                      className={`form-control form-control-lg ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}
                    />
                  </div>
                  <div className="col-12">
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    <button type="submit" className="btn btn-danger btn-lg px-5" disabled={sending}>
                      {sending ? t('form_sending') : t('form_send')}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  const { darkMode, navigate, t } = useAppContext();
  const card = darkMode ? 'rgba(255,255,255,0.05)' : '#fff';
  const border = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(187,202,225,0.4)';
  const sub = darkMode ? 'rgba(255,255,255,0.5)' : '#666';

  const features = [
    { icon: '🤖', title: t('feat1_title'), desc: t('feat1_desc') },
    { icon: '🇯🇴', title: t('feat2_title'), desc: t('feat2_desc') },
    { icon: '⚡', title: t('feat3_title'), desc: t('feat3_desc') },
    { icon: '🔒', title: t('feat4_title'), desc: t('feat4_desc') },
  ];

  const stack = ['React 19', 'Python / Django', 'scikit-learn', 'Groq AI', 'Bootstrap 5', 'Vite'];

  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#2d0a08 0%,#681a15 50%,#3d1a68 100%)', padding: '80px 0', textAlign: 'center', color: '#fff' }}>
        <div className="container">
          <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>💡</div>
          <h1 style={{ fontWeight: 900, fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '16px' }}>{t('about_title')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '17px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.9 }}>
            {t('about_subtitle')}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.2rem)', marginBottom: '20px' }}>{t('why_title')}</h2>
              <p style={{ color: sub, fontSize: '16px', lineHeight: 2, marginBottom: '20px' }}>{t('why_p1')}</p>
              <p style={{ color: sub, fontSize: '16px', lineHeight: 2 }}>{t('why_p2')}</p>
            </div>
            <div className="col-lg-6">
              <div style={{ background: 'linear-gradient(135deg,#681a15,#3d1a68)', borderRadius: '24px', padding: '40px', textAlign: 'center', color: '#fff' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
                  {[
                    { v: '88%',      l: t('stat_accuracy') },
                    { v: '2 min',    l: t('stat_time') },
                    { v: '10+',      l: t('stat_unis') },
                    { v: '150+',     l: t('stat_majors_about') },
                  ].map((s, i) => (
                    <div key={i}>
                      <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#bbcae1' }}>{s.v}</div>
                      <div style={{ fontSize: '13px', opacity: 0.75, marginTop: '4px' }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 0', background: darkMode ? 'rgba(255,255,255,0.02)' : '#f7f9ff' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2.2rem)', marginBottom: '10px' }}>{t('features_title')}</h2>
            <p style={{ color: sub }}>{t('features_sub')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '20px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: card, border: `1.5px solid ${border}`, borderRadius: '20px', padding: '28px 24px' }}>
                <div style={{ fontSize: '2.4rem', marginBottom: '14px' }}>{f.icon}</div>
                <h5 style={{ fontWeight: 800, marginBottom: '10px' }}>{f.title}</h5>
                <p style={{ color: sub, fontSize: '14px', lineHeight: 1.8, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: '60px 0' }}>
        <div className="container text-center">
          <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.4rem,3vw,2rem)', marginBottom: '10px' }}>{t('tech_title')}</h2>
          <p style={{ color: sub, marginBottom: '32px' }}>{t('tech_sub')}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {stack.map((t, i) => (
              <span key={i} style={{ background: darkMode ? 'rgba(255,255,255,0.07)' : '#f0f4ff', border: `1.5px solid ${border}`, borderRadius: '50px', padding: '8px 22px', fontSize: '14px', fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Creator */}
      <section style={{ padding: '60px 0', background: darkMode ? 'rgba(255,255,255,0.02)' : '#f7f9ff' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2.2rem)' }}>{t('team_title')}</h2>
          </div>
          {/* خطاب — فوق وحده */}
          <div style={{ maxWidth: '360px', margin: '0 auto 32px' }}>
            <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: '24px', padding: '36px 28px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 18px', border: '3px solid #681a15' }}>
                <img src="/profile.jpg" alt="Khattab Abdelraheem" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h5 style={{ fontWeight: 800, marginBottom: '4px' }}>Khattab Abdelraheem</h5>
              <p style={{ color: '#681a15', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>AI Engineer & Data Scientist</p>
              <p style={{ color: sub, fontSize: '13.5px', lineHeight: 1.8, marginBottom: '18px' }}>{t('khattab_bio')}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <a href="https://www.linkedin.com/in/khattab-abdelraheem" target="_blank" rel="noopener noreferrer"
                  style={{ background: '#0077b5', borderRadius: '10px', padding: '8px 18px', fontSize: '13px', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>in LinkedIn</a>
                <a href="https://wa.me/962780404027" target="_blank" rel="noopener noreferrer"
                  style={{ background: '#25d366', borderRadius: '10px', padding: '8px 18px', fontSize: '13px', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>WhatsApp</a>
                <a href="https://www.instagram.com/khttab.4?igsh=MTc5d3FveWxuNzVwMw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer"
                  style={{ background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', borderRadius: '10px', padding: '8px 18px', fontSize: '13px', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Instagram</a>
              </div>
            </div>
          </div>

          {/* ميار وموسى — تحت بجانب بعض */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', maxWidth: '760px', margin: '0 auto' }}>
            <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: '24px', padding: '36px 28px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 18px', border: '3px solid #1a5ab5' }}>
                <img src="/mayyar.jpg" alt="Mayyar Alsoreke" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h5 style={{ fontWeight: 800, marginBottom: '4px' }}>Mayyar Alsoreke</h5>
              <p style={{ color: '#681a15', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>AI Engineer & Data Scientist</p>
              <p style={{ color: sub, fontSize: '13.5px', lineHeight: 1.8, marginBottom: '18px' }}>{t('mayyar_bio')}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <a href="https://www.linkedin.com/in/mayyar-alsoreke-107701336?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noopener noreferrer"
                  style={{ background: '#0077b5', borderRadius: '10px', padding: '8px 18px', fontSize: '13px', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>in LinkedIn</a>
                <a href="https://wa.me/96277999351" target="_blank" rel="noopener noreferrer"
                  style={{ background: '#25d366', borderRadius: '10px', padding: '8px 18px', fontSize: '13px', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>WhatsApp</a>
                <a href="https://www.instagram.com/mayyarr_962?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer"
                  style={{ background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', borderRadius: '10px', padding: '8px 18px', fontSize: '13px', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Instagram</a>
                <a href="https://www.instagram.com/mayyarr_962?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer"
                  style={{ background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', borderRadius: '10px', padding: '8px 18px', fontSize: '13px', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Instagram</a>
              </div>
            </div>
            <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: '24px', padding: '36px 28px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg,#1a6858,#0f9b82)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', margin: '0 auto 18px' }}>👨‍💻</div>
              <h5 style={{ fontWeight: 800, marginBottom: '4px' }}>Mousa Qaqish</h5>
              <p style={{ color: '#681a15', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>AI Engineer & Data Analyst</p>
              <p style={{ color: sub, fontSize: '13.5px', lineHeight: 1.8, marginBottom: '18px' }}>{t('mousa_bio')}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <a href="https://www.linkedin.com/in/mousa-kakish-50b1a3359?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer"
                  style={{ background: '#0077b5', borderRadius: '10px', padding: '8px 18px', fontSize: '13px', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>in LinkedIn</a>
                <a href="https://wa.me/962791908419" target="_blank" rel="noopener noreferrer"
                  style={{ background: '#25d366', borderRadius: '10px', padding: '8px 18px', fontSize: '13px', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg,#2d0a08,#681a15)', borderRadius: '24px', padding: 'clamp(36px,5vw,64px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(187,202,225,0.08)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#fff', marginBottom: '14px' }}>{t('about_cta_title')}</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '28px', fontSize: '16px' }}>{t('about_cta_sub')}</p>
              <button onClick={() => navigate('assessment')} className="btn btn-lg px-5 py-3 rounded-3 fw-bold" style={{ background: '#fff', color: '#681a15', fontSize: '16px' }}>
                {t('about_cta_btn')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Footer() {
  const { navigate, t, lang } = useAppContext();
  const sub = 'rgba(255,255,255,0.5)';
  const divider = 'rgba(255,255,255,0.1)';

  const pages = [
    { id: 'home',         label: t('nav_home') },
    { id: 'assessment',   label: t('nav_assessment') },
    { id: 'universities', label: t('nav_universities') },
    { id: 'about',        label: t('nav_about') },
    { id: 'contact',      label: t('nav_contact') },
  ];

  const topUnis = lang === 'en'
    ? ['University of Jordan', 'JUST', 'Yarmouk University', 'Hashemite University', "Mu'tah University"]
    : ['الجامعة الأردنية', 'جامعة العلوم والتكنولوجيا', 'جامعة اليرموك', 'الجامعة الهاشمية', 'جامعة مؤتة'];

  return (
    <footer style={{ background: '#0d0d14', color: '#fff', padding: '64px 0 0', marginTop: 'auto' }}>
      <div className="container">

        {/* Brand — وسط */}
        <div className="text-center mb-5">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '14px' }} dir="ltr">
            <span className="brand-text" style={{ fontSize: '2rem' }}>Nextoria</span>
            <img src="https://flagcdn.com/w40/jo.png" alt="Jordan" style={{ width: '34px', borderRadius: '4px' }} />
          </div>
          <p style={{ color: sub, fontSize: '14px', lineHeight: 1.9, maxWidth: '420px', margin: '0 auto' }}>
            {t('footer_desc')}
          </p>
        </div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${divider}`, marginBottom: '40px' }} />

        {/* Links Row */}
        <div className="row g-4 justify-content-center text-center mb-5">

          {/* الصفحات */}
          <div className="col-lg-3 col-md-4 col-6">
            <h6 style={{ fontWeight: 800, marginBottom: '18px', color: '#bbcae1', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('footer_pages')}</h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {pages.map(p => (
                <li key={p.id} style={{ marginBottom: '10px' }}>
                  <button onClick={() => navigate(p.id)}
                    style={{ background: 'none', border: 'none', color: sub, fontSize: '14px', cursor: 'pointer', padding: 0, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = sub}
                  >{p.label}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* جامعات */}
          <div className="col-lg-3 col-md-4 col-6">
            <h6 style={{ fontWeight: 800, marginBottom: '18px', color: '#bbcae1', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('footer_unis')}</h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {topUnis.map((u, i) => (
                <li key={i} style={{ marginBottom: '10px' }}>
                  <button onClick={() => navigate('universities')}
                    style={{ background: 'none', border: 'none', color: sub, fontSize: '14px', cursor: 'pointer', padding: 0, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = sub}
                  >{u}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* تواصل */}
          <div className="col-lg-3 col-md-4 col-12">
            <h6 style={{ fontWeight: 800, marginBottom: '18px', color: '#bbcae1', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('footer_contact')}</h6>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: sub, fontSize: '13px' }} dir="ltr">khattababdelraheem@gmail.com</span>
              <span style={{ color: sub, fontSize: '13px' }} dir="ltr">+962 780 404 027</span>
              <span style={{ color: sub, fontSize: '13px' }}>{t('contact_location_val')}</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom" style={{ borderTop: `1px solid ${divider}`, padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <small style={{ color: sub }}>{t('footer_copy')}</small>
          <small style={{ color: sub }}>{t('footer_made')}</small>
        </div>

      </div>
    </footer>
  );
}

function Chatbot() {
  const { darkMode, t, lang } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  const greeting = t('chat_greeting');
  const allMessages = messages.length === 0
    ? [{ text: greeting, isBot: true }]
    : messages;
  // Include the virtual greeting as the first assistant message so the LLM
  // always has context for short replies like "اه" or "لا"
  const chatHistory = [
    { role: 'assistant', content: greeting },
    ...messages.map(m => ({ role: m.isBot ? 'assistant' : 'user', content: m.text })),
  ];

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userText, isBot: false }]);
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/api/ai/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatHistory, { role: 'user', content: userText }],
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.reply || t('chat_error'), isBot: true }]);
    } catch {
      setMessages(prev => [...prev, { text: t('chat_conn_error'), isBot: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-danger rounded-circle shadow-lg d-flex align-items-center justify-content-center position-fixed"
          style={{ bottom: '30px', ...(lang === 'en' ? { right: '30px' } : { left: '30px' }), width: '60px', height: '60px', zIndex: 1050 }}
        >
          <span style={{ fontSize: '1.5rem' }}>💬</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`card shadow-lg position-fixed chat-window ${darkMode ? 'bg-dark text-white' : 'bg-white'}`}
          style={{
            bottom: window.innerWidth < 576 ? 0 : '30px',
            ...(window.innerWidth < 576 ? { left: 0, right: 0, borderRadius: '20px 20px 0 0' } : (lang === 'en' ? { right: '30px' } : { left: '30px' })),
            width: window.innerWidth < 576 ? '100%' : '350px',
            height: window.innerWidth < 576 ? '70vh' : '450px',
            zIndex: 1050
          }}
          dir="rtl"
        >
          {/* Header */}
          <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              
              <img 
                src="https://flagcdn.com/w20/jo.png" 
                 alt="Jordan"
                   style={{ width: '20px', marginLeft: '8px' }}
            />
              <div>
                <strong>Nashmi</strong>
                <small className="d-block" style={{ opacity: 0.8 }}>
                  {t('chat_subtitle')}
                </small>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="btn btn-sm text-white">✕</button>
          </div>

          {/* Messages */}
          <div className="card-body overflow-auto" style={{ height: '300px', overflowX: 'hidden' }}>
            {allMessages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: msg.isBot ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
                <div
                  className={`p-2 rounded-3 ${msg.isBot ? (darkMode ? 'bg-secondary' : 'bg-light') : 'bg-danger text-white'}`}
                  style={{ maxWidth: '78%', minWidth: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word', fontSize: '14px', lineHeight: '1.6' }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="mb-2 d-flex justify-content-start">
                <div className={`p-2 rounded-3 ${darkMode ? 'bg-secondary' : 'bg-light'}`} style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>
                  ●●●
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`card-footer ${darkMode ? 'bg-secondary' : ''}`}>
            <div className="input-group">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={t('chat_placeholder')}
                disabled={isTyping}
                className={`form-control ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}
                style={{ resize: 'none', overflowY: 'hidden', lineHeight: '1.5' }}
                ref={el => { if (el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 80) + 'px'; } }}
              />
              <button onClick={handleSend} disabled={isTyping} className="btn btn-danger align-self-end">{t('chat_send')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

