# Chester Beckett's Blog

Modern, fast portfolio blog built with Astro and deployed on Azure Static Web Apps.

## 🚀 Quick Start

### Development

```bash
npm install
npm run dev
```

Visit http://localhost:4321

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## 📁 Project Structure

```
astro-site/
├── public/              # Static assets
│   └── assets/         # Images, favicons
├── src/
│   ├── config.ts       # Site configuration
│   ├── content/
│   │   ├── config.ts   # Content schema
│   │   └── blog/       # Blog posts (markdown)
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── BlogPost.astro
│   └── pages/
│       ├── index.astro
│       ├── blog/
│       ├── search.astro
│       ├── about.astro
│       └── rss.xml.ts
└── scripts/            # Utility scripts
```

## ✍️ Adding Posts

Create markdown files in `src/content/blog/`:

```markdown
---
title: Your Post Title
date: 2024-12-15
categories: [Azure, Tutorial]
tags: [azure, cloud]
description: Brief description
---

Your content...
```

## 🎨 Features

- ⚡ Lightning fast with Astro
- 🎯 SEO optimized
- 📱 Fully responsive
- 🌙 Dark mode (system preference)
- 📊 Analytics (GoatCounter)
- 🔍 Search (Pagefind)
- 📝 RSS feed
- 🖼️ Image optimization

## 🌐 Deployment

Automatic deployment to Azure Static Web Apps via GitHub Actions.

- **Production**: Push to `main` branch
- **Staging**: Create Pull Request (automatic preview URL)

## 📊 Analytics

GoatCounter: https://beckett.goatcounter.com

## 🔧 Configuration

Edit `src/config.ts` to update site settings.

## 📝 License

MIT License
