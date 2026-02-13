# Migration Plan: Jekyll to Astro on Azure Static Web Apps

## Overview
Migrating Chester Beckett's portfolio blog from GitHub Pages (Jekyll) to Azure Static Web Apps (Astro).

**Budget**: $120/month max (Expected: $0-9/month)
**Timeline**: 2 weeks
**Framework**: Astro 4.x

## Phase 1: Project Setup ✓

### Local Development
- [x] Create Astro project structure
- [ ] Install dependencies
- [ ] Configure Astro for blog
- [ ] Set up content collections
- [ ] Test local development

### Azure Resources Needed
1. **Azure Static Web App** (Free or Standard tier)
   - Resource Group: `rg-portfolio-prod`
   - Name: `swa-beckett-blog`
   - Region: West Europe (or closest to UK)
   - SKU: Free (upgrade to Standard $9/month if needed)

2. **GitHub Repository**
   - Keep existing repo or create new branch
   - Configure GitHub Actions

## Phase 2: Content Migration

### Posts Migration
- 17 blog posts in `_posts/`
- Format: `YYYY-MM-DD-title.md`
- Front matter compatible with Astro
- Categories and tags preserved

### Assets Migration
- Images in `assets/img/`
- Favicons
- Profile images
- All paths will be updated

### Configuration Migration
- Site metadata from `_config.yml`
- Contact info from `_data/contact.yml`
- Social links
- Analytics (GoatCounter)

## Phase 3: Azure Deployment

### Production Environment
```
Branch: main
URL: https://blog.beckett.life
Deployment: Automatic on push to main
```

### Staging Environment
```
Branch: Pull requests
URL: https://<unique-id>.azurestaticapps.net
Deployment: Automatic preview for each PR
```

### GitHub Actions Workflow
- Build on push/PR
- Deploy to Azure Static Web Apps
- Automatic preview URLs for PRs
- Production deployment from main branch

### Custom Domain Setup
1. Add custom domain in Azure Portal
2. Update DNS records (CNAME)
3. SSL certificate (automatic via Azure)

## Phase 4: Features & Polish

### Modern Features to Add
- [ ] Dark/light theme toggle (keep current behavior)
- [ ] Search functionality (Pagefind)
- [ ] RSS feed
- [ ] Sitemap
- [ ] Reading time estimates
- [ ] Table of contents
- [ ] Code syntax highlighting
- [ ] Image optimization
- [ ] Social share buttons

### Performance Targets
- Lighthouse score: 95+ across all metrics
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Image optimization with Astro's built-in tools

## Cost Breakdown

### Azure Static Web Apps Pricing
**Free Tier Includes:**
- 100 GB bandwidth/month
- 0.5 GB storage
- Custom domains + SSL
- Staging environments
- GitHub Actions integration

**Standard Tier ($9/month) Includes:**
- 100 GB bandwidth/month (additional $0.20/GB)
- 0.5 GB storage (additional $0.50/GB)
- Everything in Free tier
- SLA guarantee

**Expected Cost**: $0/month (Free tier sufficient for portfolio blog)

### Additional Costs
- Domain: Already owned (blog.beckett.life)
- GitHub: Free for public repos
- Analytics: GoatCounter (free)

**Total Expected**: $0-9/month

## Migration Checklist

### Pre-Migration
- [x] Backup current site
- [x] Document current structure
- [ ] Test Astro locally
- [ ] Migrate sample post

### Migration
- [ ] Move all posts to Astro content collections
- [ ] Update image paths
- [ ] Migrate layouts and components
- [ ] Test all links
- [ ] Verify RSS feed
- [ ] Check SEO metadata

### Post-Migration
- [ ] Set up Azure Static Web App
- [ ] Configure GitHub Actions
- [ ] Test staging environment
- [ ] Deploy to production
- [ ] Update DNS
- [ ] Verify analytics
- [ ] Monitor for 48 hours

## Rollback Plan
If issues arise:
1. GitHub Pages site remains live during migration
2. DNS can be reverted instantly
3. All content in version control
4. Can deploy old Jekyll site to Azure if needed

## Success Criteria
- [ ] All posts migrated successfully
- [ ] Images loading correctly
- [ ] Custom domain working with SSL
- [ ] Staging environment functional
- [ ] Analytics tracking
- [ ] Performance improved vs Jekyll
- [ ] Cost within budget ($0-9/month)
- [ ] No broken links
- [ ] SEO maintained/improved

## Timeline

### Week 1
- Days 1-2: Project setup and local development
- Days 3-4: Content migration
- Day 5: Azure setup and initial deployment

### Week 2
- Days 1-3: Testing and refinement
- Days 4-5: DNS cutover and monitoring
- Ongoing: Performance optimization

## Resources

### Documentation
- [Astro Docs](https://docs.astro.build)
- [Azure Static Web Apps Docs](https://learn.microsoft.com/en-us/azure/static-web-apps/)
- [GitHub Actions for Azure](https://github.com/Azure/static-web-apps-deploy)

### Support
- Astro Discord
- Azure Support (included with subscription)
- GitHub Community

## Notes
- Keep Jekyll site running until migration complete
- Test thoroughly in staging before production
- Monitor costs in Azure Cost Management
- Set up budget alerts at $10, $50, $100
