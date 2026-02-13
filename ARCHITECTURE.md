# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS                                    │
│                    (Global Audience)                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                   Custom Domain                                  │
│───────────────────────────────────────┐  │
│  │              Production Environment                       │  │
│  │                                                           │  │
│  │  • Astro Static Site (dist/)                            │  │
│  │  • Global CDN Distribution                              │  │
│  │  • Automatic SSL                                        │  │
│  │  • Custom Domain Routing                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Staging Environments (PR Previews)             │  │
│  │                                                           │  │
│  │  • Unique URL per Pull Request                          │  │
│  │  • Automatic deployment on PR                           │  │
│  │  • Automatic cleanup on PR close                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Deployment
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                    GitHub Actions                                │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  CI/CD Pipeline                          │  │
│  │                                                           │  │
│  │  1. Checkout code                                       │  │
│  │  2. Install dependencies (npm install)                  │  │
│  │  3. Build Astro site (npm run build)                   │  │
│  │  4. Deploy to Azure Static Web Apps                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Triggered by
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                    GitHub Repository                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Main Branch                             │  │
│  │  • Production deployments                                │  │
│  │  • Triggers on push to main                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               Feature Branches                           │  │
│  │  • Pull Request previews                                 │  │
│  │  • Triggers on PR open/update                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                Source Code                               │  │
│  │                                                           │  │
│  │  astro-site/                                            │  │
│  │  ├── src/                                               │  │
│  │  │   ├── content/blog/  (Markdown posts)               │  │
│  │  │   ├── layouts/       (Page templates)               │  │
│  │  │   └── pages/         (Routes)                       │  │
│  │  └── public/            (Static assets)                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Content Flow

```
┌─────────────────┐
│  Write Post     │
│  (Markdown)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Git Commit     │
│  & Push         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│  GitHub Actions │─────▶│  Build Process   │
│  Triggered      │      │  (Astro)         │
└─────────────────┘      └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Static Files    │
                         │  Generated       │
                         │  (HTML/CSS/JS)   │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Deploy to       │
                         │  Azure SWA       │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Live on CDN     │
                         │  (Global)        │
                         └──────────────────┘
```

## Development Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│                      Developer Workflow                           │
└──────────────────────────────────────────────────────────────────┘

Local Development:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Edit Code  │───▶│  npm run    │───▶│  Preview    │
│  (VS Code)  │    │  dev        │    │  localhost  │
└─────────────┘    └─────────────┘    └─────────────┘

Staging Deployment:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Create     │───▶│  Push to    │───▶│  Auto       │───▶│  Test on    │
│  Branch     │    │  GitHub     │    │  Deploy     │    │  Preview    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

Production Deployment:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Create     │───▶│  Review &   │───▶│  Merge to   │───▶│  Auto       │
│  PR         │    │  Test       │    │  Main       │    │  Deploy     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                            │
├─────────────────────────────────────────────────────────────────┤
│  • Astro 4.x (Static Site Generator)                           │
│  • TypeScript (Type Safety)                                     │
│  • Markdown/MDX (Content)                                       │
│  • CSS (Styling with CSS Variables)                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        Build Layer                               │
├─────────────────────────────────────────────────────────────────┤
│  • Node.js 18+ (Runtime)                                        │
│  • npm (Package Manager)                                        │
│  • Astro Compiler (Build Tool)                                 │
│  • Integrations: MDX, Sitemap, RSS                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        CI/CD Layer                               │
├─────────────────────────────────────────────────────────────────┤
│  • GitHub Actions (Automation)                                  │
│  • Azure Static Web Apps Deploy Action                         │
│  • Automatic Builds on Push/PR                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        Hosting Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  • Azure Static Web Apps (Hosting)                             │
│  • Azure CDN (Content Delivery)                                │
│  • Azure DNS (Domain Management)                               │
│  • Let's Encrypt (SSL Certificates)                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        Analytics Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  • GoatCounter (Privacy-friendly Analytics)                    │
│  • Azure Metrics (Performance Monitoring)                      │
│  • Azure Cost Management (Budget Tracking)                     │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────┐
│   Content    │
│  (Markdown)  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Astro      │
│  Compiler    │
└──────┬───────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│    HTML      │  │   Assets     │
│   Pages      │  │  (Images)    │
└──────┬───────┘  └──────┬───────┘
       │                 │
       └────────┬────────┘
                │
                ▼
       ┌──────────────┐
       │  Static Site │
       │   (dist/)    │
       └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │  Azure CDN   │
       │  (Global)    │
       └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │    Users     │
       │  (Browsers)  │
       └──────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Security Layers                           │
└─────────────────────────────────────────────────────────────────┘

Transport Security:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  HTTPS      │───▶│  TLS 1.3    │───▶│  Auto SSL   │
│  Only       │    │  Encryption │    │  Renewal    │
└─────────────┘    └─────────────┘    └─────────────┘

Access Control:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  GitHub     │───▶│  Azure      │───▶│  Deployment │
│  Auth       │    │  RBAC       │    │  Tokens     │
└─────────────┘    └─────────────┘    └─────────────┘

Content Security:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Static     │───▶│  No Server  │───▶│  No DB      │
│  Files      │    │  Side Code  │    │  Attacks    │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Cost Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                        Cost Breakdown                            │
└─────────────────────────────────────────────────────────────────┘

Free Tier (Expected):
┌──────────────────────────────────────────────────────────────┐
│  Azure Static Web Apps (Free)                    $0/month    │
│  • 100 GB bandwidth                                          │
│  • 0.5 GB storage                                           │
│  • Custom domains + SSL                                     │
│  • Staging environments                                     │
├──────────────────────────────────────────────────────────────┤
│  GitHub Actions (Public Repo)                   $0/month    │
│  • Unlimited minutes                                        │
├──────────────────────────────────────────────────────────────┤
│  Domain (Already Owned)                          $0/month    │
├──────────────────────────────────────────────────────────────┤
│  Analytics (GoatCounter)                         $0/month    │
├──────────────────────────────────────────────────────────────┤
│  TOTAL                                           $0/month    │
└──────────────────────────────────────────────────────────────┘

If Exceeded (Unlikely):
┌──────────────────────────────────────────────────────────────┐
│  Azure Static Web Apps (Standard)                $9/month    │
│  • Everything in Free tier                                  │
│  • SLA guarantee                                            │
│  • Additional bandwidth: $0.20/GB                           │
├──────────────────────────────────────────────────────────────┤
│  Expected Usage: <1 GB/month                                │
│  Expected Cost: $0-9/month                                  │
│  Budget: $120/month (plenty of headroom)                    │
└──────────────────────────────────────────────────────────────┘
```

## Performance Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Performance Optimizations                     │
└─────────────────────────────────────────────────────────────────┘

Build Time:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Astro      │───▶│  Static     │───▶│  2-3s       │
│  Compiler   │    │  Generation │    │  Build      │
└─────────────┘    └─────────────┘    └─────────────┘

Runtime:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Minimal    │───▶│  CDN        │───▶│  <1s        │
│  JavaScript │    │  Caching    │    │  Load       │
└─────────────┘    └─────────────┘    └─────────────┘

Assets:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Optimized  │───▶│  Lazy       │───▶│  Fast       │
│  Images     │    │  Loading    │    │  Rendering  │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────────┐
│                        Monitoring Stack                          │
└─────────────────────────────────────────────────────────────────┘

User Analytics:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  GoatCounter│───▶│  Page Views │───▶│  Insights   │
│  Tracking   │    │  Referrers  │    │  Dashboard  │
└─────────────┘    └─────────────┘    └─────────────┘

Performance:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Azure      │───▶│  Metrics    │───▶│  Alerts     │
│  Monitor    │    │  Dashboard  │    │  (if needed)│
└─────────────┘    └─────────────┘    └─────────────┘

Costs:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Cost       │───▶│  Budget     │───▶│  Email      │
│  Management │    │  Alerts     │    │  Alerts     │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Scalability

```
Current Capacity:
┌──────────────────────────────────────────────────────────────┐
│  • 100 GB bandwidth/month (Free tier)                        │
│  • ~1 million page views/month potential                    │
│  • Global CDN distribution                                   │
│  • Automatic scaling                                         │
└──────────────────────────────────────────────────────────────┘

Growth Path:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Free Tier  │───▶│  Standard   │───▶│  Premium    │
│  $0/month   │    │  $9/month   │    │  (if needed)│
└─────────────┘    └─────────────┘    └─────────────┘
```

## Disaster Recovery

```
Backup Strategy:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Git        │───▶│  GitHub     │───▶│  Full       │
│  Version    │    │  History    │    │  Recovery   │
│  Control    │    │  (Backup)   │    │  Possible   │
└─────────────┘    └─────────────┘    └─────────────┘

Rollback:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  DNS        │───▶│  Instant    │───▶│  Old Site   │
│  Change     │    │  Revert     │    │  Live       │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Summary

This architecture provides:
- ✅ High performance (CDN, static files)
- ✅ High availability (Azure global infrastructure)
- ✅ Low cost ($0/month expected)
- ✅ Easy deployment (automated CI/CD)
- ✅ Staging environments (PR previews)
- ✅ Security (HTTPS, static files)
- ✅ Scalability (automatic)
- ✅ Monitoring (analytics, metrics, costs)
- ✅ Disaster recovery (Git, instant rollback)
