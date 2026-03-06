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

---

## Deploying to truinfos.com on Hostinger

Hostinger supports Node.js apps through its **VPS** and **Cloud Hosting** plans. This guide covers both paths.

> **Recommended plan:** Hostinger VPS (KVM 1 or higher) — gives full SSH access, Node.js control, and lets you run PM2 + Nginx.  
> **Alternative:** Hostinger Cloud Hosting with Node.js support (limited, uses built-in app runner — see Option B).

---

### Option A — Hostinger VPS (Recommended)

Full control. Runs Node.js + PM2 + Nginx, identical to a standard Linux server.

---

#### Step 1 — Purchase and access your VPS

1. Log in to **hPanel** (Hostinger control panel)
2. Go to **VPS** → select your plan → choose **Ubuntu 22.04** as the OS
3. Once provisioned, note your **server IP address**
4. Open a terminal and SSH in:

```bash
ssh root@<your-VPS-IP>
```

---

#### Step 2 — Point truinfos.com DNS to the VPS

In hPanel go to **Domains → truinfos.com → DNS / Nameservers → Manage DNS Records** and set:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `<your-VPS-IP>` | 300 |
| A | `www` | `<your-VPS-IP>` | 300 |

DNS propagation takes 5–30 minutes. You can check with:

```bash
nslookup truinfos.com
```

---

#### Step 3 — Server setup

```bash
# Update system packages
apt update && apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify
node -v   # v20.x.x
npm -v

# Install PM2 globally
npm install -g pm2

# Install Nginx
apt install -y nginx
```

---

#### Step 4 — Upload the project

**Option 1 — Git clone (recommended):**

```bash
git clone https://github.com/YOUR_USERNAME/truinfos-global.git /var/www/truinfos
cd /var/www/truinfos
npm install --omit=dev
```

**Option 2 — Upload via Hostinger File Manager or SFTP:**

1. In hPanel go to **Files → File Manager** (or use an SFTP client like FileZilla)
2. Upload all project files to `/var/www/truinfos/`
3. Then on the server:

```bash
cd /var/www/truinfos
npm install --omit=dev
```

---

#### Step 5 — Configure the environment

```bash
nano /var/www/truinfos/.env
```

```env
PORT=3000
NODE_ENV=production
```

---

#### Step 6 — Start with PM2

```bash
cd /var/www/truinfos

pm2 start server.js --name truinfos

# Persist across reboots
pm2 save
pm2 startup systemd
# Run the command PM2 outputs
```

Verify it's running:

```bash
pm2 status
pm2 logs truinfos
```

---

#### Step 7 — Configure Nginx as reverse proxy

```bash
nano /etc/nginx/sites-available/truinfos.com
```

Paste:

```nginx
server {
    listen 80;
    server_name truinfos.com www.truinfos.com;

    gzip on;
    gzip_types text/plain text/css application/javascript application/json;

    # Static assets served directly by Nginx
    location ~* \.(css|js|ico|png|jpg|svg|woff2?)$ {
        root /var/www/truinfos/public;
        expires 7d;
        add_header Cache-Control "public, immutable";
        try_files $uri @node;
    }

    # All other requests proxied to Node.js
    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location @node {
        proxy_pass http://127.0.0.1:3000;
    }
}
```

Enable and reload:

```bash
ln -s /etc/nginx/sites-available/truinfos.com /etc/nginx/sites-enabled/
nginx -t          # must print: syntax is ok
systemctl reload nginx
```

Site is now live at **http://truinfos.com**.

---

#### Step 8 — Enable free SSL via Hostinger or Let's Encrypt

**Option A — Use Hostinger's free SSL (easiest):**

1. In hPanel go to **SSL → truinfos.com**
2. Click **Install** next to the **Lifetime Free SSL**
3. Done — certificate auto-renews

**Option B — Let's Encrypt on the VPS directly:**

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d truinfos.com -d www.truinfos.com
certbot renew --dry-run   # verify auto-renewal
```

Site is now secured at **https://truinfos.com** ✓

---

#### Step 9 — Redirect www → non-www

Add this block at the top of `/etc/nginx/sites-available/truinfos.com`:

```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name www.truinfos.com;
    return 301 https://truinfos.com$request_uri;
}
```

```bash
systemctl reload nginx
```

---

#### Step 10 — Deploy updates

```bash
cd /var/www/truinfos
git pull origin master
npm install --omit=dev   # only if package.json changed
pm2 reload truinfos      # zero-downtime reload
```

---

### Option B — Hostinger Cloud / Shared Hosting (Node.js App Runner)

> Use this only if you are on a Cloud or Business Shared Hosting plan without full SSH. Limited compared to VPS but simpler to set up.

1. Log in to hPanel → **Websites → Manage → Node.js**
2. Set **Node.js version** to `20.x`
3. Set **Application entry point** to `server.js`
4. Set **Application root** to the folder where you uploaded the project (e.g. `/public_html/truinfos`)
5. Upload all files via **File Manager** or SFTP (exclude `node_modules/`)
6. In hPanel terminal or SSH run:
   ```bash
   cd ~/public_html/truinfos
   npm install --omit=dev
   ```
7. Click **Restart** in the Node.js panel
8. For the domain, go to **Domains → truinfos.com → Point to folder** → select the app root

> **Note:** On shared/cloud hosting you cannot run PM2 or configure Nginx. The hPanel Node.js runner manages the process for you. If you need PM2, custom ports, or Nginx config, upgrade to a VPS plan.

---

### Deployment Checklist

#### VPS
- [ ] DNS A records (`@` and `www`) pointing to VPS IP
- [ ] Node.js 20 LTS and PM2 installed
- [ ] App files uploaded/cloned to `/var/www/truinfos`
- [ ] `npm install --omit=dev` completed
- [ ] `.env` file created with `PORT=3000`
- [ ] PM2 running: `pm2 status` shows `truinfos` as **online**
- [ ] PM2 persisted: `pm2 save` and `pm2 startup` completed
- [ ] Nginx config in place and tested: `nginx -t` passes
- [ ] SSL certificate active (Hostinger panel or Certbot)
- [ ] Site loads at **https://truinfos.com** with no console errors
- [ ] www redirects to non-www

#### Cloud / Shared Hosting
- [ ] Node.js version set to 20.x in hPanel
- [ ] `server.js` set as entry point
- [ ] Files uploaded (no `node_modules`)
- [ ] `npm install --omit=dev` run from hPanel terminal
- [ ] App restarted from Node.js panel
- [ ] SSL enabled from hPanel → SSL
- [ ] Site loads at **https://truinfos.com**
