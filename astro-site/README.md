# Chester Beckett's Blog - Astro Version

Modern, fast portfolio blog built with Astro and deployed on Azure Static Web Apps.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

```bash
cd astro-site
npm install
npm run dev
```

Visit `http://localhost:4321`

### Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
astro-site/
├── public/              # Static assets (copied as-is)
├── src/
│   ├── config.ts        # Site configuration
│   ├── content/
│   │   ├── confiitle: Your Post Title
date: 2024-12-10
categories: [Azure, VMs]
tags: [azure, tutorial]
description: Brief description for SEO
---

Your content here...
```

## 🎨 Features

- ⚡️ Lightning fast with Astro
- 🎯 SEO optimized
- 📱 Fully responsive
- 🌙 Dark mode support (system preference)
- 📊 Analytics with GoatCounter
- 🔍 RSS feed
- 🗺️ Automatic sitemap
- 🖼️ Image optimization
- 📝 Markdown & MDX support
- 🏷️ Tags and categories
- 🔗 Social sharing

## 🌐 Deployment

### Azure Static Web Apps

This site is configured for automatic deployment to Azure Static Web Apps via GitHub Actions.

#### Setup Steps:

1. Create Azure Static Web App resource
2. Get deployment token from Azure Portal
3. Add token as GitHub secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`
4. Push to main branch - automatic deployment!

See `AZURE_DEPLOYMENT.md` for detailed instructions.

## 📊 Analytics

GoatCounter analytics is configured. Update the site ID in `src/config.ts` if needed.

## 🔧 Configuration

Edit `src/config.ts` to update:
- Site title and description
- Author information
- Social links
- Analytics settings

## 📝 License

MIT License - see LICENSE file for details
