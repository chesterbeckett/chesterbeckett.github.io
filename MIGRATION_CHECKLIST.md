# Migration Checklist

Use this checklist to track your migration progress.

## Phase 1: Local Setup ⚙️

### Initial Setup
- [ ] Review `PROJECT_SUMMARY.md`
- [ ] Review `GETTING_STARTED.md`
- [ ] Check Node.js version (18+): `node --version`
- [ ] Navigate to project: `cd astro-site`
- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm run dev`
- [ ] Visit http://localhost:4321
- [ ] Verify sample post loads correctly

### Configuration
- [ ] Update `src/config.ts` with your information
  - [ ] Site title
  - [ ] Description
  - [ ] Author name
  - [ ] Email
  - [ ] Social links
  - [ ] Analytics ID
- [ ] Review `astro.config.mjs`
- [ ] Update site URL if different

## Phase 2: Content Migration 📝

### Migrate Posts
- [ ] Run migration script: `node scripts/migrate-posts.js`
- [ ] Review migrated posts in `src/content/blog/`
- [ ] Check for any conversion issues
- [ ] Manually fix any problematic posts
- [ ] Verify all 17 posts migrated successfully

### Migrate Assets
- [ ] Copy assets folder to public:
  - Unix/Mac: `cp -r ../assets public/`
  - Windows: `xcopy ..\assets public\assets /E /I`
- [ ] Verify images in `public/assets/img/`
- [ ] Check favicon files in `public/assets/img/favicons/`
- [ ] Test design

### Features (Optional)
- [ ] Add search functionality
- [ ] Customize about page
- [ ] Add additional pages if needed
- [ ] Enhance navigation
- [ ] Add social share buttons

## Phase 4: Azure Setup ☁️

### Create Azure Resources
- [ ] Sign in to Azure Portal
- [ ] Create Resource Group: `rg-portfolio-prod`
- [ ] Create Static Web App: `swa-beckett-blog`
  - [ ] Region: West Europe
  - [ ] Plan: Free
  - [ ] Connect to GitHub
  - [ ] Set app location: `/astro-site`
  - [ ] Set output location: `dist`
- [ ] Wait for deployment to complete
- [ ] Note the Azure URL

### Configure GitHub
- [ ] Verify GitHub Actions workflow created
- [ ] Check secret `AZURE_STATIC_WEB_APPS_API_TOKEN` exists
- [ ] Review workflow file: `.github/workflows/azure-static-web-apps.yml`

### Budget Alerts
- [ ] Go to Cost Management + Billing
- [ ] Create budget: $120/month
- [ ] Set alerts:
  - [ ] 50% ($60)
  - [ ] 80% ($96)
  - [ ] 100% ($120)
- [ ] Add email notifications

## Phase 5: Initial Deployment 🚀

### Deploy to Staging
- [ ] Create feature branch: `git checkout -b migration/initial-deploy`
- [ ] Commit all changes: `git add . && git commit -m "Initial Astro migration"`
- [ ] Push branch: `git push origin migration/initial-deploy`
- [ ] Create Pull Request on GitHub
- [ ] Wait for GitHub Actions to complete
- [ ] Get staging URL from PR comment
- [ ] Test staging site thoroughly

### Staging Testing
- [ ] Visit staging URL
- [ ] Test all pages load
- [ ] Verify all posts display correctly
- [ ] Check all images load
- [ ] Test navigation
- [ ] Verify RSS feed works
- [ ] Check sitemap
- [ ] Test on mobile device
- [ ] Test in different browsers
- [ ] Verify analytics tracking
- [ ] Check console for errors

## Phase 6: Production Deployment 🎯

### Deploy to Production
- [ ] Merge Pull Request
- [ ] Wait for production deployment
- [ ] Visit Azure URL
- [ ] Verify site works on production
- [ ] Test all functionality again

### Custom Domain Setup
- [ ] In Azure Portal: Custom domains → Add
- [ ] Enter domain: `blog.beckett.life`
- [ ] Get CNAME target from Azure
- [ ] Update DNS records with domain provider:
  - [ ] Type: CNAME
  - [ ] Name: blog
  - [ ] Value: [Azure URL]
  - [ ] TTL: 3600
- [ ] Wait for DNS propagation (5-60 minutes)
- [ ] Validate domain in Azure Portal
- [ ] Wait for SSL certificate (5-10 minutes)
- [ ] Test HTTPS works: https://blog.beckett.life

## Phase 7: Final Testing ✅

### Functionality Testing
- [ ] Test all blog posts
- [ ] Verify all images load
- [ ] Check all internal links
- [ ] Test external links
- [ ] Verify RSS feed: https://blog.beckett.life/rss.xml
- [ ] Check sitemap: https://blog.beckett.life/sitemap-index.xml
- [ ] Test search (if implemented)
- [ ] Verify analytics tracking

### Performance Testing
- [ ] Run Lighthouse audit
  - [ ] Performance: 95+
  - [ ] Accessibility: 95+
  - [ ] Best Practices: 95+
  - [ ] SEO: 95+
- [ ] Test page load speed
- [ ] Check mobile performance
- [ ] Verify images optimized

### Cross-Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Chrome
- [ ] Mobile Safari

### SEO Verification
- [ ] Check meta tags
- [ ] Verify Open Graph tags
- [ ] Test Twitter Cards
- [ ] Submit sitemap to Google Search Console
- [ ] Verify robots.txt

## Phase 8: Monitoring 📊

### First 24 Hours
- [ ] Monitor Azure metrics
- [ ] Check for any errors
- [ ] Verify analytics data
- [ ] Monitor costs (should be $0)
- [ ] Check uptime

### First Week
- [ ] Review performance metrics
- [ ] Check cost analysis
- [ ] Monitor traffic
- [ ] Verify no broken links
- [ ] Check for any issues

### Ongoing
- [ ] Set up weekly cost review
- [ ] Monitor performance monthly
- [ ] Update dependencies quarterly
- [ ] Review analytics monthly

## Phase 9: Cleanup 🧹

### Old Site
- [ ] Keep Jekyll site for 1 month as backup
- [ ] Document rollback procedure
- [ ] Archive old deployment
- [ ] Update any external links

### Documentation
- [ ] Update README if needed
- [ ] Document any custom changes
- [ ] Note any issues encountered
- [ ] Share learnings

## Phase 10: Optimization 🚀

### Performance (Optional)
- [ ] Optimize images further
- [ ] Add lazy loading
- [ ] Implement caching strategies
- [ ] Minimize CSS/JS

### Features (Optional)
- [ ] Add search functionality
- [ ] Implement comments system
- [ ] Add newsletter signup
- [ ] Create related posts
- [ ] Add reading time estimates

### Content (Optional)
- [ ] Write new posts
- [ ] Update old posts
- [ ] Add more categories
- [ ] Improve SEO

## Success Criteria ✨

### Must Have
- [x] All posts migrated successfully
- [x] All images loading correctly
- [x] Custom domain working with SSL
- [x] Analytics tracking
- [x] RSS feed working
- [x] Sitemap generated
- [x] Mobile responsive
- [x] Cost within budget ($0-9/month)

### Nice to Have
- [ ] Lighthouse score 95+
- [ ] Search functionality
- [ ] Comments system
- [ ] Newsletter integration
- [ ] Social sharing

## Rollback Plan 🔄

If issues arise:
- [ ] Document the issue
- [ ] Revert DNS to old site
- [ ] Investigate problem
- [ ] Fix in staging
- [ ] Re-deploy when ready

## Notes

Use this section to track any issues, decisions, or important information:

```
Date: ___________
Issue: ___________
Resolution: ___________

Date: ___________
Decision: ___________
Reason: ___________
```

## Completion

- [ ] All checklist items completed
- [ ] Site live and working
- [ ] Monitoring in place
- [ ] Documentation updated
- [ ] Team/stakeholders notified

**Migration Completed**: ___________
**Final Cost**: $___________/month
**Performance Score**: ___________

---

## Quick Commands Reference

```bash
# Development
cd astro-site
npm install
npm run dev

# Migration
node scripts/migrate-posts.js
cp -r ../assets public/

# Build
npm run build
npm run preview

# Deploy
git add .
git commit -m "Your message"
git push origin main
```

## Support

If you get stuck:
1. Check `QUICK_REFERENCE.md`
2. Review `GETTING_STARTED.md`
3. See `AZURE_DEPLOYMENT.md`
4. Check Astro docs
5. Review Azure docs

---

**Good luck with your migration! 🚀**
