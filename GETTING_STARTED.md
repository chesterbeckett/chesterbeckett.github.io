# Getting Started with Your New Astro Blog

Welcome! This guide will walk you through setting up and deploying your new modern blog.

## 📋 What We've Built

Your new blog includes:
- ⚡️ Astro 4.x framework (lightning fast)
- 🎨 Modern, responsive design with dark mode
- 📝 All your existing content ready to migrate
- 🚀 Azure Static Web Apps deployment setup
- 📊 Analytics integration (GoatCounter)
- 🔍 SEO optimized with RSS feed
- 🌐 Automatic staging environments for PRs

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies

```bash
cd astro-site
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Visit http://localhost:4321 to see your site!

### 3. View Sample Post

We've migrated one post as an example:
- Buffalo Wings recipe at `/blog/2024-12-10-buffalo-wings`

## 📝 Migrate Your Content

### Automatic Migration (Recommended)

We've created a migration script to convert all your Jekyll posts:

```bash
cd astro-site
node scripts/migrate-posts.js
```

This will:
- Convert all 17 posts from `_posts/` to `src/content/blog/`
- Update Jekyll-specific syntax
- Preserve all metadata (tags, categories, dates)

### Copy Assets

Your images need to be copied to the public folder:

```bash
# From project root
cp -r assets astro-site/public/
```

Or on Windows:
```cmd
xcopy assets astro-site\public\assets /E /I
```

### Manual Migration (if needed)

If you prefer to migrate posts manually:

1. Copy markdown file from `_posts/` to `astro-site/src/content/blog/`
2. Update front matter format:

**Before (Jekyll):**
```yaml
---
title: My Post
date: 2024-12-10 09:12:05 +/-TTTT
categories: [Azure, VMs]
tags: [azure, vms, tutorial]
---
```

**After (Astro):**
```yaml
---
title: My Post
date: 2024-12-10
categories: [Azure, VMs]
tags: [azure, vms, tutorial]
description: Optional description for SEO
---
```

3. Convert Jekyll-specific syntax:
   - `{: .prompt-tip }` → `> **Tip:**`
   - `{: .prompt-info }` → `> **Info:**`
   - `{: .prompt-warning }` → `> **Warning:**`

## 🎨 Customize Your Site

### Update Site Information

Edit `astro-site/src/config.ts`:

```typescript
export const SITE = {
  title: 'Your Name',
  description: 'Your description',
  author: 'Your Name',
  email: 'your@email.com',
  url: 'https://yourdomain.com',
  // ... more settings
};
```

### Customize Styling

The main styles are in:
- `src/layouts/BaseLayout.astro` - Global styles and CSS variables
- `src/layouts/BlogPost.astro` - Blog post styling
- `src/pages/index.astro` - Homepage styling

CSS variables for easy theming:
```css
:root {
  --color-bg: #ffffff;
  --color-text: #24292f;
  --color-primary: #0969da;
  --color-secondary: #6e7781;
  --color-border: #d0d7de;
  --color-code-bg: #f6f8fa;
}
```

## 🌐 Deploy to Azure

### Prerequisites

1. Azure subscription (your MPN subscription)
2. GitHub repository with your code

### Deployment Steps

Follow the detailed guide in `AZURE_DEPLOYMENT.md`, but here's the quick version:

1. **Create Azure Static Web App**
   - Go to Azure Portal
   - Create new Static Web App
   - Connect to your GitHub repo
   - Set app location: `/astro-site`
   - Set output location: `dist`

2. **Automatic Deployment**
   - Push to main branch
   - GitHub Actions automatically builds and deploys
   - Get your Azure URL (e.g., `https://happy-ocean-123.azurestaticapps.net`)

3. **Add Custom Domain**
   - In Azure Portal: Custom domains → Add
   - Update DNS CNAME: `blog.beckett.life` → your Azure URL
   - Wait for SSL certificate (automatic)

### Cost Monitoring

Expected cost: **$0/month** (Free tier)

Set up budget alerts:
1. Azure Portal → Cost Management
2. Create budget: $120/month
3. Set alerts at 50%, 80%, 100%

## 🧪 Testing

### Test Locally

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run preview
```

### Test Checklist

- [ ] All posts display correctly
- [ ] Images load properly
- [ ] Links work
- [ ] Tags and categories work
- [ ] RSS feed works (`/rss.xml`)
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Search works (if enabled)

## 🔄 Development Workflow

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/my-change
   ```

2. Make your changes

3. Test locally:
   ```bash
   npm run dev
   ```

4. Create a Pull Request

5. **Automatic staging environment created!**
   - GitHub Actions deploys to unique URL
   - Test your changes before merging
   - URL posted as PR comment

6. Merge PR → Automatic production deployment

### Adding New Posts

Create a new file in `src/content/blog/`:

```markdown
---
title: My New Post
date: 2024-12-15
categories: [Azure, Tutorial]
tags: [azure, cloud, tutorial]
description: Learn how to do something awesome
---

Your content here...

## Heading

Content with **bold** and *italic*.

![Image](/assets/img/folder/image.png)

> **Tip:** This is a helpful tip!

```bash
# Code example
az group create --name my-rg --location westeurope
```
```

## 📊 Analytics

GoatCounter is configured in `src/layouts/BaseLayout.astro`.

View your analytics at: https://beckett.goatcounter.com

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist .astro
npm install
npm run build
```

### Images Not Loading

- Ensure images are in `public/assets/img/`
- Check image paths start with `/assets/img/`
- Verify image files exist

### Styling Issues

- Check browser console for errors
- Verify CSS variables are defined
- Test in different browsers

### Deployment Issues

- Check GitHub Actions logs
- Verify Azure deployment token is set
- Ensure app location is `/astro-site`
- Check build output location is `dist`

## 📚 Learn More

### Astro Resources
- [Astro Documentation](https://docs.astro.build)
- [Astro Discord](https://astro.build/chat)
- [Astro Blog Tutorial](https://docs.astro.build/en/tutorial/0-introduction/)

### Azure Resources
- [Azure Static Web Apps Docs](https://learn.microsoft.com/en-us/azure/static-web-apps/)
- [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/)

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Test locally
3. ✅ Migrate all posts
4. ✅ Copy assets
5. ✅ Customize config
6. ✅ Deploy to Azure
7. ✅ Configure custom domain
8. ✅ Set up budget alerts
9. 🎨 Customize design (optional)
10. 📝 Write new content!

## 💡 Tips

- **Keep Jekyll site running** until migration is complete
- **Test thoroughly** in staging before production
- **Monitor costs** in Azure Cost Management
- **Backup regularly** (Git handles this!)
- **Use PR previews** to test changes safely

## 🆘 Need Help?

- Check `MIGRATION_PLAN.md` for detailed timeline
- See `AZURE_DEPLOYMENT.md` for deployment details
- Review Astro docs for framework questions
- Check Azure docs for hosting questions

## 🎉 Success!

Once deployed, you'll have:
- Modern, fast blog
- Automatic deployments
- Staging environments
- Custom domain with SSL
- Analytics tracking
- All within budget ($0-9/month)

Happy blogging! 🚀
