# Deployment Checklist

Use this checklist to verify everything is ready for deployment to GitHub Pages.

## Pre-Deployment Checks

### ✅ Content Migration
- [ ] Content migrated from Squarespace (Phase 2)
  ```bash
  npm run migrate migration/exports/squarespace-export.xml
  ```
- [ ] Assets downloaded and migrated (Phase 3)
  ```bash
  npm run migrate:assets
  ```
- [ ] Content copied to `content/pages/` directory
- [ ] People directory updated in `content/directory/people.json`

### ✅ Content Quality
- [ ] Deduplication completed (Phase 5)
  ```bash
  npm run deduplicate content/pages
  ```
- [ ] QA checks passed (Phase 6)
  ```bash
  npm run qa
  ```
- [ ] All broken links fixed
- [ ] All missing assets resolved
- [ ] Empty pages filled or removed

### ✅ Build Configuration
- [ ] `next.config.mjs` configured for GitHub Pages
  - `output: "export"` ✓
  - `basePath` set correctly ✓
  - `assetPrefix` set correctly ✓
- [ ] Repository name matches `next.config.mjs` (`IE-website`)
- [ ] GitHub Pages settings configured in repository

### ✅ Build & Test
- [ ] Site builds successfully
  ```bash
  npm run build
  ```
- [ ] Build output in `out/` directory
- [ ] Test locally (if possible)
  ```bash
  npx serve out
  ```
- [ ] All routes accessible
- [ ] Search functionality works
- [ ] Directory filters work
- [ ] Images and assets load correctly

### ✅ Deployment
- [ ] GitHub Actions workflow configured (`.github/workflows/deploy.yml`)
- [ ] Repository has GitHub Pages enabled
- [ ] Main branch is set for deployment
- [ ] Verify deployment
  ```bash
  npm run verify:deployment
  ```

## Post-Deployment Verification

After deployment, verify:

- [ ] Site is accessible at `https://gauriv1.github.io/IE-website/`
- [ ] All pages load correctly
- [ ] Navigation works
- [ ] Search works
- [ ] Directory filters work
- [ ] Images and assets load
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Password protection works (if applicable)

## Generate Final Report

```bash
npm run migration:report
```

This will generate a comprehensive migration completion report with:
- Migration statistics
- Phase completion status
- Deployment verification
- Recommendations

## Troubleshooting

### Build Fails
- Check `next.config.mjs` configuration
- Verify all dependencies installed
- Check for TypeScript errors: `npm run lint`

### Pages Not Loading
- Verify `basePath` matches repository name
- Check that routes are generated in `out/` directory
- Verify static export is working

### Assets Not Loading
- Check `assetPrefix` configuration
- Verify assets are in `public/assets/`
- Check asset paths in content

### Search Not Working
- Verify content is loaded correctly
- Check browser console for errors
- Ensure client-side code is working

## Quick Commands

```bash
# Full migration workflow
npm run migrate migration/exports/squarespace-export.xml
npm run migrate:assets
npm run deduplicate content/pages --apply
npm run qa
npm run build
npm run verify:deployment
npm run migration:report
```

## Support

If you encounter issues:
1. Check the migration reports in `migration/output/`
2. Review phase status documents
3. Check GitHub Actions logs
4. Verify configuration files

