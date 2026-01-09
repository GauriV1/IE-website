# Copy-Only Migration Guide

This migration performs a **COPY-ONLY** migration from Squarespace to Next.js. It preserves all content exactly as-is without rewriting, summarizing, reorganizing, or deduplication.

## Requirements

- **SOURCE**: https://cyan-tangerine-w282.squarespace.com/
- **PASSWORD**: division
- **OUTPUT**: `content/pages/<slug>.md` with minimal frontmatter

## Migration Phases

### PHASE 0: Fix Server-Only Issues ✅
- All modules using `fs` must have `import "server-only";`
- Pages importing loaders must NOT be client components
- **Status**: ✅ Complete

### PHASE 1: Discover URLs
```bash
npm run migrate:discover
```
- Tries `/sitemap.xml` and `/robots.txt` first
- Falls back to crawling from homepage if sitemap not found
- Normalizes URLs (removes query params, deduplicates)
- **Output**: `migration/exports/url-list.json`

### PHASE 2: Crawl Pages
```bash
npm run migrate:crawl-new
```
- Uses Playwright to visit each URL
- Handles password gate ("division") once and reuses session
- Saves rendered HTML to `migration/raw/html/<slug>.html`
- Saves metadata to `migration/raw/meta/<slug>.json`
- Rate limit: 400ms between pages
- **Output**: HTML snapshots and metadata

### PHASE 3: Extract & Convert
```bash
npm run migrate:extract
```
- Reads HTML files from `migration/raw/html/`
- **Skips error pages** (detects "We couldn't find the page you were looking for")
- Extracts main content:
  - Prefers `<main>` element
  - Else picks container with highest text density
  - Excludes header/nav/footer
- Converts HTML to Markdown using Turndown (preserves headings, lists, links, tables)
- **Minimal cleaning**: Only whitespace and empty lines
- **Minimal frontmatter**:
  ```yaml
  ---
  title: "<page title>"
  slug: "<slug>"
  sourceUrl: "<original url>"
  ---
  ```
- **Output**: 
  - `content/pages/<slug>.md` - Markdown files
  - `migration/exports/migration-map.json` - URL to slug mapping
  - `migration/exports/bad-pages.json` - Skipped pages (errors)

### PHASE 4: Download Assets
```bash
npm run migrate:assets-new
```
- Parses markdown files for image URLs
- Downloads images to `public/assets/migrated/`
- Rewrites markdown image references to `/assets/migrated/<filename>`
- **Output**: 
  - `public/assets/migrated/*` - Downloaded images
  - `migration/exports/assets-report.json` - Download report

## Run All Phases

```bash
npm run migrate:copy-only
```

This runs all phases sequentially:
1. Discover URLs
2. Crawl pages
3. Extract & convert
4. Download assets

## Output Structure

```
content/
  pages/
    <slug>.md          # Migrated markdown files (minimal frontmatter)

public/
  assets/
    migrated/          # Downloaded images

migration/
  raw/
    html/              # HTML snapshots
    meta/              # Page metadata
  exports/
    url-list.json      # Discovered URLs
    migration-map.json # URL → slug mapping
    bad-pages.json     # Skipped error pages
    assets-report.json # Asset download report
    crawl-summary.json # Crawl statistics
```

## Key Features

- ✅ **COPY-ONLY**: No rewriting, summarizing, or reorganizing
- ✅ **Minimal Frontmatter**: Only title, slug, sourceUrl
- ✅ **Error Page Detection**: Automatically skips 404/error pages
- ✅ **Main Content Extraction**: Focuses on page content, excludes nav/footer
- ✅ **Image Localization**: Downloads and rewrites all image references
- ✅ **Password Gate Handling**: Automatically handles Squarespace password protection
- ✅ **Rate Limiting**: Respects server with delays between requests

## Verification

After migration, check:
- `migration/exports/crawl-summary.json` - Crawl statistics
- `migration/exports/bad-pages.json` - Any skipped pages
- `migration/exports/assets-report.json` - Asset download status
- `content/pages/` - Verify markdown files are created

## Notes

- Content is preserved **exactly as-is** from Squarespace
- No categories, tags, or additional metadata are added
- Navigation structure is NOT modified
- Content is NOT deduplicated or merged
- All original formatting is preserved in Markdown

