# Content Migration Guide

This directory contains scripts and tools for migrating content from Squarespace to the new content structure.

## Directory Structure

```
migration/
├── scripts/              # Migration scripts
│   ├── index.ts         # Main entry point
│   ├── migrate.ts       # Migration orchestrator
│   ├── parse-squarespace.ts  # Squarespace XML parser
│   └── html-to-markdown.ts   # HTML to Markdown converter
├── exports/             # Place Squarespace export XML here
├── output/              # Generated content files (gitignored)
│   ├── pages/          # Generated markdown files
│   ├── migration-map.json  # URL mapping (old → new)
│   └── migration-report.json # Migration summary
└── README.md           # This file
```

## Step 1: Export from Squarespace

1. Log into your Squarespace admin panel
2. Navigate to **Settings → Advanced → Import/Export**
3. Click **Export**
4. Select **Export** (not Import)
5. Click **Download** to get the XML file
6. Save the file as `squarespace-export.xml` in `migration/exports/`

**Note**: If Squarespace doesn't provide a direct export, you may need to:
- Use a third-party tool to export the site
- Manually copy content (see manual migration section below)

## Step 2: Run Migration Script

```bash
# Install dependencies (if not already installed)
npm install

# Run migration script
npx tsx migration/scripts/index.ts migration/exports/squarespace-export.xml
```

The script will:
1. Parse the Squarespace XML export
2. Convert HTML content to Markdown
3. Extract metadata (title, URL, category, tags)
4. Generate frontmatter for each page
5. Write markdown files to `migration/output/pages/`
6. Create a migration mapping file (`migration-map.json`)
7. Generate a migration report (`migration-report.json`)

## Step 3: Review Generated Content

1. Check `migration/output/migration-report.json` for summary
2. Review `migration/output/migration-map.json` for URL mappings
3. Inspect generated markdown files in `migration/output/pages/`
4. Manually review and edit content as needed:
   - Fix category assignments
   - Add missing tags
   - Improve summaries
   - Add related links
   - Fix formatting issues

## Step 4: Migrate Assets (Images and Files)

After content migration, download and migrate assets:

```bash
# Option 1: Using npm script
npm run migrate:assets

# Option 2: Direct execution
npx tsx migration/scripts/migrate-assets-standalone.ts migration/output/pages
```

This will:
- Extract all image and file URLs from markdown content
- Download assets to `/public/assets/images/` and `/public/assets/files/`
- Rewrite URLs in markdown to use local paths
- Generate `migration/output/assets-report.json` with results

**Note**: Some external URLs may require authentication or may be inaccessible. Check the assets report for failures.

## Step 5: Copy Content to Main Directory

Once you've reviewed and edited the generated content:

```bash
# Copy generated pages to content directory
cp -r migration/output/pages/* content/pages/

# Assets are already in public/assets/ so no need to copy them
# Or manually copy specific categories
cp -r migration/output/pages/tasks/* content/pages/tasks/
cp -r migration/output/pages/policies/* content/pages/policies/
# etc.
```

## Manual Migration (Alternative)

If you cannot export from Squarespace, you can manually create content files:

1. Visit each page on the old Squarespace site
2. Copy the content
3. Create a new markdown file in the appropriate `content/pages/` directory
4. Add frontmatter following the schema in `content/README.md`
5. Convert HTML to Markdown (you can use the `htmlToMarkdown` function or an online tool)

## Category Detection

The migration script attempts to automatically detect content categories based on:
- URL patterns (e.g., `/tasks/`, `/policies/`)
- Page titles (e.g., "How to...", "Policy...")
- Category/tag metadata

You may need to manually adjust categories after migration.

## Troubleshooting

### XML Parse Errors

If the XML structure is different than expected:
1. Open `migration/scripts/parse-squarespace.ts`
2. Inspect the XML structure of your export
3. Adjust the parsing logic to match your XML format

### Missing Content

Some content may not migrate correctly:
- Check the migration report for errors
- Review skipped pages
- Manually migrate problematic pages

### Formatting Issues

Markdown conversion may not be perfect:
- Review generated markdown files
- Fix formatting manually
- Adjust HTML-to-Markdown rules in `html-to-markdown.ts` if needed

## Next Steps

After migration:
1. Review all migrated content
2. Update navigation.json if needed
3. Add missing tags to tags.json
4. Test content loading with the new structure
5. Update pages to use content loaders instead of mockData

