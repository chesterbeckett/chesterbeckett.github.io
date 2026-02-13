# Quick Reference Guide

## Common Commands

### Development
```bash
cd astro-site
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:4321)
npm run build        # Build for production
npm run preview      # Preview production build
npm run astro        # Run Astro CLI commands
```

### Migration
```bash
node scripts/migrate-posts.js    # Migrate all Jekyll posts
cp -r assets astro-site/public/  # Copy assets (Unix/Mac)
xcopy assets astro-site\public\assets /E /I  # Copy assets (Windows)
```

### Deployment
```bash
git add .
git commit -m "Your message"
git push origin main             # Deploy to production
git push origin feature-branch   # Create staging environment
```

## File Structure

```
astro-site/
├── public/              # Static files (copied as-is)
│   ├── assets/         # Images, fonts, etc.
│   └── robots.txt
├── src/
│   ├── config.ts       # Site configuration ⚙️
│   ├── content/
│   │   ├── config.ts   # Content schema
│   │   └── blog/       # Blog posts 📝
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Base HTML
│   │   └── BlogPost.astro      # Blog post layout
│   └── pages/
│       ├── index.astro         # Homepage
│       ├── blog/
│       │   ├── index.astro     # Blog list
│       │   └── [...slug].astro # Individual posts
│       ├── about.astro
│       └── rss.xml.ts          # RSS feed
└── astro.config.mjs    # Astro configuration
```

## Adding Content

### New Blog Post

Create `src/content/blog/YYYY-MM-DD-title.md`:

```markdown
---
title: Your Title
date: 2024-12-15
categories: [Category1, Category2]
tags: [tag1, tag2, tag3]
description: SEO description (optional)
---

Your content here...
```

### Markdown Features

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
[Link text](https://example.com)

![Image alt](/assets/img/folder/image.png)

> **Tip:** This is a tip!
> **Info:** This is info!
> **Warning:** This is a warning!

- Bullet list
- Item 2

1. Numbered list
2. Item 2

`inline code`

```bash
# Code block
command here
```
```

## Configuration

### Site Settings (`src/config.ts`)

```typescript
export const SITE = {
  title: 'Your Name',
  description: 'Your description',
  author: 'Your Name',
  email: 'your@email.com',
  url: 'https://yourdomain.com',
  tagline: 'Your tagline',
  avatar: '/assets/img/avatar.png',
  timezone: 'Europe/London'
};

export const SOCIAL = {
  github: 'username',
  twitter: 'username',
  microsoftLearn: 'https://...'
};

export const ANALYTICS = {
  goatCounter: 'your-site-id'
};
```

### Astro Config (`astro.config.mjs`)

```javascript
export default defineConfig({
  site: 'https://yourdomain.com',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
});
```

## Styling

### CSS Variables

Edit in `src/layouts/BaseLayout.astro`:

```css
:root {
  --color-bg: #ffffff;
  --color-text: #24292f;
  --color-primary: #0969da;
  --color-secondary: #6e7781;
  --color-border: #d0d7de;
  --color-code-bg: #f6f8fa;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0d1117;
    --color-text: #c9d1d9;
    /* ... */
  }
}
```

## Azure Deployment

### Initial Setup

1. Create Static Web App in Azure Portal
2. Connect to GitHub repository
3. Configure:
   - App location: `/astro-site`
   - Output location: `dist`
4. Get deployment token
5. Add as GitHub secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`

### Automatic Deployments

- **Production**: Push to `main` branch
- **Staging**: Create Pull Request (automatic preview URL)

### Custom Domain

1. Azure Portal → Static Web App → Custom domains
2. Add domain: `blog.beckett.life`
3. Update DNS CNAME to Azure URL
4. Wait for SSL (5-10 minutes)

## Troubleshooting

### Build Fails

```bash
# Clear and rebuild
rm -rf node_modules dist .astro
npm install
npm run build
```

Check GitHub Actions logs for errors.

### Images Not Loading

- Ensure images are in `public/assets/`
- Paths must start with `/assets/`
- Check file names match exactly (case-sensitive)

### Styling Issues

- Check browser console for errors
- Verify CSS variables are defined
- Clear browser cache
- Test in incognito mode

### Deployment Issues

- Verify GitHub secret is set
- Check app location is `/astro-site`
- Ensure output location is `dist`
- Review GitHub Actions logs

## URLs

### Local Development
- Dev server: http://localhost:4321
- Preview: http://localhost:4321 (after build)

### Production
- Azure URL: `https://[name].azurestaticapps.net`
- Custom domain: `https://blog.beckett.life`

### Staging (PR Previews)
- Format: `https://[name]-pr-[number].azurestaticapps.net`
- Posted as comment on PR

## Important Files

| File                                          | Purpose            |
| --------------------------------------------- | ------------------ |
| `src/config.ts`                               | Site configuration |
| `src/content/config.ts`                       | Content schema     |
| `astro.config.mjs`                            | Astro settings     |
| `package.json`                                | Dependencies       |
| `.github/workflows/azure-static-web-apps.yml` | CI/CD              |

## Useful Links

- **Astro Docs**: https://docs.astro.build
- **Azure Static Web Apps**: https://learn.microsoft.com/en-us/azure/static-web-apps/
- **Your Analytics**: https://beckett.goatcounter.com
- **Azure Portal**: https://portal.azure.com

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-change

# Make changes and test
npm run dev

# Commit changes
git add .
git commit -m "Description of changes"

# Push and create PR
git push origin feature/my-change

# Automatic staging environment created!
# Test at preview URL
# Merge PR → automatic production deployment
```

## Performance Checklist

- [ ] Images optimized (WebP, compressed)
- [ ] No console errors
- [ ] Lighthouse score 95+
- [ ] Mobile responsive
- [ ] Fast page load (<2s)
- [ ] Working dark mode
- [ ] RSS feed valid
- [ ] Sitemap generated

## Cost Monitoring

### Azure Portal
1. Cost Management + Billing
2. Cost Analysis
3. Filter by resource group
4. Set budget alerts

### Expected Costs
- Free tier: $0/month
- Standard tier: $9/month (if needed)
- Your blog: $0/month (Free tier sufficient)

## Support

- **Astro Discord**: https://astro.build/chat
- **Azure Support**: Azure Portal → Help + Support
- **GitHub Issues**: Your repository issues tab

## Quick Fixes

### Clear Everything
```bash
rm -rf node_modules dist .astro
npm install
```

### Reset Git
```bash
git reset --hard origin/main
git pull
```

### Check Node Version
```bash
node --version  # Should be 18+
npm --version
```

### Update Dependencies
```bash
npm update
npm audit fix
```

## Keyboard Shortcuts (VS Code)

- `Ctrl/Cmd + P` - Quick file open
- `Ctrl/Cmd + Shift + P` - Command palette
- `Ctrl/Cmd + B` - Toggle sidebar
- `Ctrl/Cmd + J` - Toggle terminal
- `Ctrl/Cmd + Shift + F` - Search in files

## Next Steps After Setup

1. ✅ Test locally
2. ✅ Migrate all posts
3. ✅ Copy assets
4. ✅ Customize config
5. ✅ Deploy to Azure
6. ✅ Configure domain
7. ✅ Monitor costs
8. 📝 Write new content!
