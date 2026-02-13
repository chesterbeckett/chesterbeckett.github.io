# Azure Static Web Apps Deployment Guide

Complete guide to deploying Chester Beckett's blog to Azure Static Web Apps.

## Prerequisites

- Azure subscription with MPN credits ($120/month)
- GitHub account with repository access
- Azure CLI installed (optional, can use Portal)

## Step 1: Create Azure Static Web App

### Option A: Azure Portal (Recommended)

1. Sign in to [Azure Portal](https://portal.azure.com)

2. Click "Create a resource" → Search for "Static Web App"

3. Fill in the details:
   - **Subscription**: Your MPN subscription
   - **Resource Group**: Create new `rg-portfolio-prod`
   - **Name**: `swa-beckett-blog`
   - **Plan type**: Free (or Standard if you need more features)
   - **Region**: West Europe (or closest to UK)
   - **Source**: GitHub
   - **GitHub account**: Sign in and authorize
   - **Organization**: Your GitHub username
   - **Repository**: Your blog repository
   - **Branch**: `main`
   - **Build Presets**: Custom
   - **App location**: `/astro-site`
   - **Api location**: (leave empty)
   - **Output location**: `dist`

4. Click "Review + create" → "Create"

5. Wait for deployment (2-3 minutes)

### Option B: Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create \
  --name rg-portfolio-prod \
  --location westeurope

# Create Static Web App
az staticwebapp create \
  --name swa-beckett-blog \
  --resource-group rg-portfolio-prod \
  --source https://github.com/YOUR_USERNAME/YOUR_REPO \
  --location westeurope \
  --branch main \
  --app-location "/astro-site" \
  --output-location "dist" \
  --login-with-github
```

## Step 2: Configure GitHub Secrets

After creating the Static Web App, Azure automatically:
1. Creates a GitHub Actions workflow in your repo
2. Adds the deployment token as a GitHub secret

If you need to manually add the token:

1. In Azure Portal, go to your Static Web App
2. Click "Manage deployment token"
3. Copy the token
4. In GitHub: Settings → Secrets and variables → Actions
5. Create new secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`
6. Paste the token

## Step 3: Verify Deployment

1. Push to main branch or create a PR
2. Check GitHub Actions tab for workflow run
3. Wait for build and deployment (3-5 minutes)
4. Visit the Azure-provided URL (shown in Portal)

Example URL: `https://happy-ocean-123456789.azurestaticapps.net`

## Step 4: Configure Custom Domain

### Add Custom Domain in Azure

1. In Azure Portal, go to your Static Web App
2. Click "Custom domains" in left menu
3. Click "+ Add"
4. Select "Custom domain on other DNS"
5. Enter: `blog.beckett.life`
6. Click "Next"

### Update DNS Records

You'll need to add DNS records with your domain provider:

**Option A: CNAME (Recommended)**
```
Type: CNAME
Name: blog
Value: happy-ocean-123456789.azurestaticapps.net
TTL: 3600
```

**Option B: A Record + TXT**
```
Type: A
Name: blog
Value: [IP provided by Azure]
TTL: 3600

Type: TXT
Name: _dnsauth.blog
Value: [validation code from Azure]
TTL: 3600
```

### Validate Domain

1. Wait for DNS propagation (5-60 minutes)
2. In Azure Portal, click "Validate"
3. Once validated, SSL certificate is automatically provisioned
4. Wait 5-10 minutes for SSL to be ready

## Step 5: Configure Staging Environments

Staging environments are automatic! Every pull request gets its own preview URL.

### How it works:
1. Create a PR in GitHub
2. GitHub Actions automatically deploys to a unique URL
3. URL is posted as a comment on the PR
4. Test your changes before merging
5. When PR is merged/closed, staging environment is deleted

Example staging URL: `https://happy-ocean-123456789-pr-42.azurestaticapps.net`

## Step 6: Set Up Budget Alerts

1. In Azure Portal, search for "Cost Management + Billing"
2. Click "Budgets" → "+ Add"
3. Create budget:
   - **Name**: Portfolio Blog Budget
   - **Amount**: $120
   - **Reset period**: Monthly
   - **Alerts**:
     - 50% ($60)
     - 80% ($96)
     - 100% ($120)
4. Add your email for notifications

## Step 7: Monitor and Optimize

### View Analytics

1. In Azure Portal, go to your Static Web App
2. Click "Metrics" to see:
   - Bandwidth usage
   - Request count
   - Response times

### Check Costs

1. Go to "Cost Management + Billing"
2. Click "Cost analysis"
3. Filter by resource group: `rg-portfolio-prod`

Expected cost: $0/month (Free tier)

## Troubleshooting

### Build Fails

Check GitHub Actions logs:
1. Go to GitHub repository
2. Click "Actions" tab
3. Click on failed workflow
4. Review build logs

Common issues:
- Node version mismatch (ensure 18+)
- Missing dependencies (run `npm install` locally)
- Build errors (run `npm run build` locally)

### Custom Domain Not Working

1. Verify DNS records with: `nslookup blog.beckett.life`
2. Check DNS propagation: https://dnschecker.org
3. Wait up to 48 hours for full propagation
4. Ensure CNAME points to correct Azure URL

### SSL Certificate Issues

1. SSL is automatic but takes 5-10 minutes
2. If not working after 1 hour, remove and re-add domain
3. Ensure DNS is correctly configured
4. Check Azure Portal for validation status

## Rollback Plan

If you need to rollback to Jekyll/GitHub Pages:

1. Don't delete old GitHub Pages setup yet
2. Update DNS CNAME back to: `chesterbeckett.github.io`
3. Wait for DNS propagation
4. Old site will be live again

## Cost Optimization Tips

1. **Use Free Tier**: Sufficient for most blogs
2. **Optimize Images**: Use WebP format, compress images
3. **Enable Caching**: Configured automatically
4. **Monitor Usage**: Set up alerts at $10, $50, $100
5. **Review Monthly**: Check cost analysis regularly

## Free Tier Limits

- 100 GB bandwidth/month
- 0.5 GB storage
- 2 custom domains
- Unlimited staging environments
- Free SSL certificates

If you exceed limits:
- Additional bandwidth: $0.20/GB
- Additional storage: $0.50/GB
- Or upgrade to Standard: $9/month

## Next Steps

1. ✅ Deploy to Azure
2. ✅ Configure custom domain
3. ✅ Set up budget alerts
4. 📝 Migrate remaining blog posts
5. 🎨 Customize design
6. 📊 Monitor performance
7. 🚀 Optimize and iterate

## Support Resources

- [Azure Static Web Apps Docs](https://learn.microsoft.com/en-us/azure/static-web-apps/)
- [Astro Documentation](https://docs.astro.build)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Azure Support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade)

## Useful Commands

```bash
# Check Azure CLI version
az --version

# List Static Web Apps
az staticwebapp list --output table

# Get deployment token
az staticwebapp secrets list \
  --name swa-beckett-blog \
  --resource-group rg-portfolio-prod

# View app details
az staticwebapp show \
  --name swa-beckett-blog \
  --resource-group rg-portfolio-prod

# Delete Static Web App (if needed)
az staticwebapp delete \
  --name swa-beckett-blog \
  --resource-group rg-portfolio-prod
```

## Success Checklist

- [ ] Azure Static Web App created
- [ ] GitHub Actions workflow running
- [ ] Site accessible via Azure URL
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Budget alerts set up
- [ ] Staging environments working
- [ ] Analytics tracking
- [ ] Performance optimized
- [ ] Costs monitored
