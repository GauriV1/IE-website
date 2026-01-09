# PHASE 3 — Asset Migration: COMPLETE ✅

## Summary

Successfully created asset migration infrastructure to download images and files from Squarespace URLs and rewrite references to use local paths.

## Files Created

### Asset Migration Scripts
- `/migration/scripts/download-asset.ts` - Downloads assets from URLs
- `/migration/scripts/extract-assets.ts` - Extracts asset URLs from content
- `/migration/scripts/rewrite-assets.ts` - Rewrites URLs to local paths
- `/migration/scripts/migrate-assets.ts` - Asset migration orchestrator
- `/migration/scripts/migrate-assets-standalone.ts` - Standalone asset migration script

### Directory Structure
- `/public/assets/images/` - Downloaded images
- `/public/assets/files/` - Downloaded files

## Features

### Asset Extraction
- Extracts image URLs from markdown: `![alt](url)`
- Extracts file links from markdown: `[text](url)`
- Extracts HTML images: `<img src="url">`
- Extracts HTML links: `<a href="url">`
- Extracts from frontmatter attachments
- Extracts from related links (external URLs)

### Asset Download
- Downloads images to `/public/assets/images/`
- Downloads files to `/public/assets/files/`
- Handles various image formats (jpg, png, gif, webp, svg, etc.)
- Handles document formats (pdf, doc, xls, etc.)
- Skips already downloaded files (idempotent)
- 30-second timeout per download
- Generates safe filenames from URLs

### URL Rewriting
- Rewrites markdown image syntax: `![alt](url)` → `![alt](/assets/images/file.jpg)`
- Rewrites markdown links: `[text](url)` → `[text](/assets/files/file.pdf)`
- Rewrites HTML img tags
- Rewrites HTML a tags
- Preserves relative URLs and anchors
- Handles query parameters and URL normalization

### Asset Migration Report
- Total assets found
- Successfully downloaded count
- Failed downloads with error messages
- Total size downloaded
- Breakdown by type (images vs files)
- Detailed results for each asset

## Dependencies Added

- `axios` - HTTP client for downloading assets

## Usage

### Standalone Asset Migration

After content migration, run asset migration:

```bash
# Option 1: Using npm script
npm run migrate:assets

# Option 2: Direct execution
npx tsx migration/scripts/migrate-assets-standalone.ts [pages-directory]
```

The script will:
1. Scan all markdown files in the pages directory
2. Extract all asset URLs
3. Download assets to `/public/assets/`
4. Rewrite URLs in markdown files
5. Generate `migration/output/assets-report.json`

### Integration with Content Migration

Asset migration can be run separately after content migration:

```bash
# Step 1: Migrate content
npm run migrate migration/exports/squarespace-export.xml

# Step 2: Migrate assets
npm run migrate:assets migration/output/pages
```

## Asset Detection

The system detects assets by:
- File extensions (.jpg, .png, .pdf, .doc, etc.)
- URL patterns (contains "image", "img", "photo")
- External URLs with file-like extensions

## File Organization

```
public/
└── assets/
    ├── images/     # All image files
    │   ├── image-1.jpg
    │   ├── image-2.png
    │   └── ...
    └── files/      # All document/file downloads
        ├── document-1.pdf
        ├── spreadsheet-1.xlsx
        └── ...
```

## Error Handling

- Failed downloads are logged in the report
- Original URLs are preserved if download fails
- Script continues processing even if some assets fail
- Detailed error messages for debugging

## Report Format

The `assets-report.json` includes:
- Summary statistics (total, downloaded, failed, size)
- Breakdown by type (images, files, unknown)
- List of failures with error messages
- Detailed results for each asset

## Next Steps (PHASE 4)

Ready to proceed with rendering content in the new website:
1. Update pages to use content loaders
2. Implement markdown rendering
3. Update navigation from content/navigation.json
4. Enhance search functionality

## Notes

- Asset migration is idempotent (safe to run multiple times)
- Already downloaded files are skipped
- Large files may take time to download
- Some external URLs may require authentication (will fail gracefully)
- Consider running asset migration in batches for large sites

