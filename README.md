# TruInfos Global

> Digital Marketing and Multi-Domain Data Solutions for B2B Growth

A Node.js/Express website built with EJS templating, serving a full B2B marketing and data-services brand.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 4 |
| Templating | EJS |
| Validation | express-validator |
| Styles | Vanilla CSS (custom design tokens) |
| Dev server | nodemon |

---

## Project Structure

```
truinfos-global/
├── server.js                  # Express app, routes, industry data
├── package.json
├── public/
│   ├── styles.css             # Global stylesheet with CSS custom properties
│   └── site.js                # Mobile nav toggle + dropdown JS
└── views/
    ├── partials/
    │   ├── head.ejs           # <meta>, fonts, CSS link
    │   ├── nav.ejs            # Sticky header with dropdown navigation
    │   └── footer.ejs         # Footer with server-rendered copyright year
    ├── index.ejs              # Home page
    ├── about.ejs              # About Us
    ├── services.ejs           # Services
    ├── case-studies.ejs       # Case Studies
    ├── contact.ejs            # Contact (with validated POST form)
    ├── industry.ejs           # Shared Industry Wise Data List template
    └── 404.ejs                # Custom 404 page
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run (development)

```bash
npm run dev
```

Server starts at **http://localhost:3000** with auto-reload via nodemon.

### Run (production)

```bash
npm start
```

---

## Pages & Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About Us |
| `/services` | Services |
| `/case-studies` | Case Studies |
| `/contact` | Contact (GET + POST) |
| `/industry/health-beauty` | Health & Beauty Industry Email Lists |
| `/industry/it` | IT Industry Email List |
| `/industry/manufacturing` | Manufacturing Industry Email List |
| `/industry/banking-finance` | Banking & Finance Email List |
| `/industry/construction` | Construction Industry Email List |
| `/industry/international-mailing` | International Mailing List |
| `*` | 404 Not Found |

---

## Industry Wise Data List

Industry pages are data-driven. All content (headlines, highlights, data fields, stats) is defined in the `INDUSTRIES` object inside `server.js`. To add a new industry:

1. Add a new key to `INDUSTRIES` in `server.js`
2. Add the corresponding menu item to `views/partials/nav.ejs`

No new view file is needed — `views/industry.ejs` is the shared template.

---

## Contact Form

The `/contact` POST route uses `express-validator` to:

- Validate required fields (name, company, email, message)
- Return `HTTP 400` with inline field errors on failure
- Return `HTTP 200` with a success message on valid submission
- Preserve form values on failed submissions

To connect a real email provider or CRM, replace the `console.log` in the contact POST handler in `server.js`.

---

## Restore Point

A Git tag marks the stable baseline after initial build and typography optimisation:

```bash
# View the restore point
git show v1.0-restore-point

# Restore to it
git checkout v1.0-restore-point
```

---

## Git Workflow

```bash
# Check status
git status

# Commit changes
git add -A
git commit -m "your message"

# Tag a new restore point
git tag v1.x-description
```
