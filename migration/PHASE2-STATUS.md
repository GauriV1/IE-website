# PHASE 2 — Extract from Squarespace: COMPLETE ✅

## Summary

Successfully created migration infrastructure to extract content from Squarespace exports and convert them to the new content structure.

## Files Created

### Migration Scripts
- `/migration/scripts/index.ts` - Main entry point for migration
- `/migration/scripts/migrate.ts` - Migration orchestrator
- `/migration/scripts/parse-squarespace.ts` - Squarespace XML parser
- `/migration/scripts/html-to-markdown.ts` - HTML to Markdown converter

### Documentation
- `/migration/README.md` - Complete migration guide with instructions

### Directory Structure
- `/migration/exports/` - Place Squarespace export XML here
- `/migration/output/` - Generated content files (gitignored)

## Features

### XML Parsing
- Supports multiple Squarespace export formats (RSS, custom XML, WordPress-style)
- Extracts: title, URL, content, excerpt, date, category, tags
- Handles nested XML structures

### HTML to Markdown Conversion
- Uses Turndown library with GitHub Flavored Markdown support
- Preserves formatting (headings, lists, links, images)
- Custom rules for line breaks, strikethrough, etc.
- Cleans up excessive whitespace

### Content Conversion
- Automatic category detection from URL patterns, titles, and metadata
- Slug generation from URLs or titles
- Summary extraction (first 2-3 sentences)
- Date formatting (YYYY-MM-DD)
- Tag extraction and deduplication

### Migration Mapping
- Generates `migration-map.json` with old URL → new slug mappings
- Tracks migration status (success, skipped, error)
- Preserves source URLs for traceability

### Migration Report
- Summary statistics (total, migrated, skipped, errors)
- Category breakdown
- Error details for failed migrations

## Dependencies Added

- `turndown` - HTML to Markdown conversion
- `@types/turndown` - TypeScript types
- `xml2js` - XML parsing
- `tsx` - TypeScript execution (dev dependency)

## Usage

```bash
# 1. Export from Squarespace (Settings → Advanced → Import/Export)
# 2. Place export XML in migration/exports/
# 3. Run migration script:
npx tsx migration/scripts/index.ts migration/exports/squarespace-export.xml
```

## Output Structure

```
migration/output/
├── pages/
│   ├── tasks/
│   │   ├── request-time-off.md
│   │   └── ...
│   ├── policies/
│   │   └── ...
│   └── ...
├── migration-map.json    # URL mappings
└── migration-report.json # Summary report
```

## Category Detection Logic

The script automatically detects categories based on:
- **URL patterns**: `/tasks/`, `/policies/`, `/teams/`, etc.
- **Title patterns**: "How to...", "Policy...", etc.
- **Category metadata**: From Squarespace category field

Default category: `tasks` (if unable to determine)

## Next Steps (PHASE 3)

Ready to proceed with asset migration:
1. Create asset downloader script
2. Handle image URL rewriting
3. Generate asset migration report
4. Update content references to local assets

## Notes

- The migration script is designed to be run multiple times (idempotent)
- Generated files can be manually edited before copying to `content/`
- Migration mapping preserves traceability to original Squarespace URLs
- Category detection may need manual adjustment for edge cases

