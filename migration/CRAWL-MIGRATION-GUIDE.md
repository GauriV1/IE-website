# Crawl-Based Migration Guide

This migration uses Playwright to crawl the live Squarespace site and extract content.

## Migration Process

### PHASE A & B: Crawl Site
```bash
npm run migrate:crawl
```
- Discovers URLs via sitemap or link crawling
- Handles password gate ("division")
- Extracts HTML content from each page
- Saves raw HTML to `migration/raw/`

### PHASE C: Convert to Markdown
```bash
npm run migrate:convert
```
- Converts HTML to Markdown using Turndown
- Generates frontmatter with metadata
- Saves markdown files to `content/pages/`
- Creates migration map

### PHASE D: Download Assets
```bash
npm run migrate:download-assets
```
- Extracts image URLs from markdown
- Downloads images to `public/assets/migrated/`
- Rewrites image URLs in markdown files

### PHASE E: Setup Navigation
```bash
npm run migrate:setup-nav
```
- Creates `content/navigation.json` based on migrated pages
- Groups pages by category

### PHASE F: Verify
```bash
npm run migrate:verify
```
- Generates QA report
- Checks for issues
- Verifies search functionality

## Run All Phases

```bash
npm run migrate:all
```

This runs all phases sequentially.

## Expected Output

After migration completes:

- `migration/raw/*.html` - Raw HTML snapshots
- `migration/exports/url-list.json` - Discovered URLs
- `migration/exports/crawled-pages.json` - Crawled pages metadata
- `migration/exports/migration-map.json` - URL to slug mapping
- `migration/exports/assets-report.json` - Asset download report
- `migration/exports/qa-report.json` - QA verification report
- `content/pages/*/*.md` - Migrated markdown pages
- `public/assets/migrated/*` - Downloaded images
- `content/navigation.json` - Updated navigation

## Notes

- Crawling respects rate limits (400ms delay between pages)
- Password is handled automatically
- Content extraction focuses on main content area
- Images are downloaded and localized
- Navigation is auto-generated from categories

## Troubleshooting

If crawl fails:
- Check internet connection
- Verify password is still "division"
- Check if site structure changed
- Review error messages in console

If conversion fails:
- Check that `migration/raw/` contains HTML files
- Verify HTML files are not empty
- Check console for specific errors

If assets fail:
- Some external images may not be accessible
- Check `migration/exports/assets-report.json` for failures
- Manually download failed assets if needed

