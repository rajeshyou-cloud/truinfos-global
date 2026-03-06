'use strict';

const express = require('express');
const path = require('path');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;

// ── View engine ───────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Static files ──────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Body parsing ──────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── Template locals ───────────────────────────────────────
app.locals.year = new Date().getFullYear();
app.locals.siteName = 'DataBuilderz';
app.locals.activeIndustry = '';  // overridden per industry route

// ── Industry data ─────────────────────────────────────────
const INDUSTRIES = {
  'health-beauty': {
    label:    'Health & Beauty Industry Email Lists',
    eyebrow:  'Health & Beauty',
    hero:     'Reach the right people across the health and beauty supply chain.',
    lead:     'Our verified Health & Beauty email lists connect you with brand managers, salon owners, spa directors, retail buyers, and wellness professionals across the US and globally.',
    highlights: [
      { title: 'Targeted Reach',        body: 'Segment by specialty — cosmetics, pharma, organic wellness, professional salon, medical aesthetics, and more.' },
      { title: 'Decision-Maker Access', body: 'Contacts verified at owner, director, and buyer level across independent retailers and large chains.' },
      { title: 'Campaign-Ready',        body: 'Deliverable via CSV or CRM-ready formats with email, phone, LinkedIn, and mailing address fields.' }
    ],
    fields: ['Full Name', 'Job Title', 'Company', 'Email Address', 'Phone Number', 'Business Type', 'Segment / Specialty', 'City / State / Country', 'LinkedIn Profile', 'Revenue Range'],
    stats:  [{ value: '1.8M+', label: 'Verified contacts' }, { value: '94%', label: 'Email deliverability' }, { value: '30+', label: 'Specialty segments' }, { value: '48hr', label: 'Delivery turnaround' }]
  },
  'it': {
    label:    'IT Industry Email List',
    eyebrow:  'Information Technology',
    hero:     'Reach IT leaders, developers, and technology buyers with precision.',
    lead:     'Our IT industry email lists cover CTOs, CIOs, IT managers, software engineers, DevOps leads, and technology procurement contacts across SaaS, enterprise, and services firms.',
    highlights: [
      { title: 'Role-Level Targeting',   body: 'Filter by seniority — C-suite, VP, Director, Manager — across hardware, software, cloud, and managed services.' },
      { title: 'Technology-Specific',    body: 'Segment by stack, platform, company size, or vertical to pinpoint the most relevant buyers for your product.' },
      { title: 'Fresh & Verified',       body: 'Data is re-validated quarterly to ensure accuracy across fast-changing technology organizations.' }
    ],
    fields: ['Full Name', 'Job Title / Role', 'Company Name', 'Email Address', 'Phone', 'Technology Stack', 'Company Size', 'Industry Vertical', 'Location', 'LinkedIn URL'],
    stats:  [{ value: '3.2M+', label: 'Verified contacts' }, { value: '96%', label: 'Email deliverability' }, { value: '50+', label: 'Technology segments' }, { value: '48hr', label: 'Delivery turnaround' }]
  },
  'manufacturing': {
    label:    'Manufacturing Industry Email List',
    eyebrow:  'Manufacturing',
    hero:     'Connect with plant managers, procurement leads, and manufacturing executives.',
    lead:     'Our manufacturing email lists cover decision-makers across industrial, automotive, aerospace, food processing, and consumer goods sectors — giving your team access to the right contacts faster.',
    highlights: [
      { title: 'Plant & Ops Contacts',      body: 'Reach floor managers, operations directors, and plant supervisors who influence purchasing and vendor selection.' },
      { title: 'Procurement & Supply Chain', body: 'Target sourcing managers, supply chain leads, and procurement officers managing vendor relationships.' },
      { title: 'Sub-Sector Precision',      body: 'Segment by manufacturing type — automotive, electronics, textiles, food & beverage, chemicals, and more.' }
    ],
    fields: ['Full Name', 'Job Title', 'Company Name', 'Email Address', 'Phone Number', 'Manufacturing Type', 'Plant Location', 'Employee Count', 'Annual Revenue', 'SIC / NAICS Code'],
    stats:  [{ value: '2.5M+', label: 'Verified contacts' }, { value: '95%', label: 'Email deliverability' }, { value: '40+', label: 'Industry sub-sectors' }, { value: '48hr', label: 'Delivery turnaround' }]
  },
  'banking-finance': {
    label:    'Banking & Finance Email List',
    eyebrow:  'Banking & Finance',
    hero:     'Reach financial decision-makers across banking, insurance, and investment sectors.',
    lead:     'Our Banking & Finance email lists include CFOs, financial advisors, bank branch managers, insurance executives, and fintech leaders — curated for precision outreach in a regulated industry.',
    highlights: [
      { title: 'Compliance-Aware Data',   body: 'Contacts sourced through compliant, opt-in channels appropriate for regulated financial marketing contexts.' },
      { title: 'Role & Firm Segmentation', body: 'Filter by institution type — retail banking, investment management, insurance, fintech startups, and credit unions.' },
      { title: 'High-Value Targeting',    body: 'Access senior contacts with budget authority, including C-suite, VPs, and regional leadership.' }
    ],
    fields: ['Full Name', 'Job Title', 'Institution Name', 'Email Address', 'Phone Number', 'Institution Type', 'AUM / Revenue Size', 'Location', 'License / Designation', 'LinkedIn Profile'],
    stats:  [{ value: '1.5M+', label: 'Verified contacts' }, { value: '97%', label: 'Email deliverability' }, { value: '20+', label: 'Financial segments' }, { value: '48hr', label: 'Delivery turnaround' }]
  },
  'construction': {
    label:    'Construction Industry Email List',
    eyebrow:  'Construction',
    hero:     'Access contractors, project managers, and construction buyers at scale.',
    lead:     'Our construction industry email lists connect you with general contractors, project managers, architects, civil engineers, and real estate developers across residential, commercial, and infrastructure sectors.',
    highlights: [
      { title: 'Project-Level Contacts',    body: 'Reach decision-makers on active builds — from contractor firms to subcontractors and suppliers.' },
      { title: 'Trade & Specialty Coverage', body: 'Segment by trade: electrical, plumbing, HVAC, structural, interior fit-out, landscaping, and more.' },
      { title: 'Regional Targeting',        body: 'Filter by metro, state, or region to match your sales territory or market expansion goals.' }
    ],
    fields: ['Full Name', 'Job Title', 'Company Name', 'Email Address', 'Phone Number', 'Trade / Specialty', 'Project Type', 'License Number', 'Location', 'Company Size'],
    stats:  [{ value: '1.2M+', label: 'Verified contacts' }, { value: '94%', label: 'Email deliverability' }, { value: '25+', label: 'Trade specialties' }, { value: '48hr', label: 'Delivery turnaround' }]
  },
  'international-mailing': {
    label:    'International Mailing List',
    eyebrow:  'International',
    hero:     'Expand your reach across global markets with verified international contacts.',
    lead:     'Our international mailing lists span 50+ countries across North America, Europe, APAC, Latin America, and the Middle East — enabling precise, cross-border outreach for B2B teams with global growth ambitions.',
    highlights: [
      { title: 'Multi-Country Coverage', body: 'Contacts verified across 50+ countries with local phone formats, addresses, and region-specific segmentation.' },
      { title: 'Industry Cross-Segment', body: 'Available by industry, role, company size, or country — for focused campaigns or broad international awareness.' },
      { title: 'Compliance Considered',  body: 'Data sourced with awareness of regional regulations including GDPR, CAN-SPAM, and CASL frameworks.' }
    ],
    fields: ['Full Name', 'Job Title', 'Company Name', 'Email Address', 'Phone (Local Format)', 'Country', 'Region / State', 'Industry', 'Company Size', 'Language Preference'],
    stats:  [{ value: '5M+', label: 'Verified contacts' }, { value: '92%', label: 'Email deliverability' }, { value: '50+', label: 'Countries covered' }, { value: '48hr', label: 'Delivery turnaround' }]
  }
};

// ── Routes ────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.render('index', {
    title: 'DataBuilderz | Digital Marketing and Multi-Domain Data Solutions',
    description: 'DataBuilderz helps B2B teams grow with digital marketing execution, verified business data, and domain-specific intelligence for better pipeline, outreach, and revenue performance.',
    activePage: 'home'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us | DataBuilderz',
    description: 'Learn how DataBuilderz helps B2B organizations combine digital marketing strategy, verified data, and disciplined execution to drive sustainable growth.',
    activePage: 'about'
  });
});

app.get('/services', (req, res) => {
  res.render('services', {
    title: 'Services | DataBuilderz',
    description: 'Explore DataBuilderz services spanning digital marketing strategy, performance campaigns, verified business data, enrichment, segmentation, and multi-domain intelligence.',
    activePage: 'services'
  });
});

app.get('/case-studies', (req, res) => {
  res.render('case-studies', {
    title: 'Case Studies | DataBuilderz',
    description: 'See how DataBuilderz helps B2B organizations improve targeting, campaign performance, and growth outcomes with digital marketing and domain-specific data solutions.',
    activePage: 'case-studies'
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact | DataBuilderz',
    description: 'Contact DataBuilderz to discuss digital marketing, B2B data services, and domain-specific intelligence solutions for your organization.',
    activePage: 'contact',
    success: false,
    errors: [],
    formData: {}
  });
});

const contactValidators = [
  body('name').trim().notEmpty().withMessage('Full name is required.'),
  body('company').trim().notEmpty().withMessage('Company name is required.'),
  body('email').trim().isEmail().normalizeEmail().withMessage('A valid email address is required.'),
  body('message').trim().notEmpty().withMessage('Project details are required.')
];

app.post('/contact', contactValidators, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render('contact', {
      title: 'Contact | DataBuilderz',
      description: 'Contact DataBuilderz to discuss digital marketing, B2B data services, and domain-specific intelligence solutions for your organization.',
      activePage: 'contact',
      success: false,
      errors: errors.array(),
      formData: req.body
    });
  }

  // Log submission — swap in an email or database integration as needed
  console.log('[contact]', {
    name:        req.body.name,
    company:     req.body.company,
    email:       req.body.email,
    service:     req.body.service,
    message:     req.body.message,
    submittedAt: new Date().toISOString()
  });

  res.render('contact', {
    title: 'Contact | DataBuilderz',
    description: 'Contact DataBuilderz to discuss digital marketing, B2B data services, and domain-specific intelligence solutions for your organization.',
    activePage: 'contact',
    success: true,
    errors: [],
    formData: {}
  });
});

// ── Industry pages ──────────────────────────────────────
app.get('/industry/:slug', (req, res) => {
  const industry = INDUSTRIES[req.params.slug];
  if (!industry) {
    return res.status(404).render('404', {
      title: '404 Not Found | DataBuilderz',
      description: 'Page not found.',
      activePage: ''
    });
  }
  res.render('industry', {
    title:          `${industry.label} | DataBuilderz`,
    description:    industry.lead,
    activePage:     'industry',
    activeIndustry: req.params.slug,
    industry
  });
});

// ── 404 ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', {
    title: '404 Not Found | DataBuilderz',
    description: 'Page not found.',
    activePage: ''
  });
});

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`DataBuilderz running at http://localhost:${PORT}`);
});
