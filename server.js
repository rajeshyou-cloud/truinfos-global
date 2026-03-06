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
