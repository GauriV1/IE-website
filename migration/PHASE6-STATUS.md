# PHASE 6 — QA + Link Integrity: COMPLETE ✅

## Summary

Successfully created comprehensive QA checking infrastructure to validate content, check links, verify assets, and identify issues before deployment.

## Files Created

### QA Scripts
- `/migration/scripts/check-links.ts` - Link validation utilities
- `/migration/scripts/qa-check.ts` - Comprehensive QA checker
- `/migration/scripts/qa-standalone.ts` - Standalone QA script

## Features

### Link Checking
- **Internal Links**: Validates links to other pages
- **Asset Links**: Checks if referenced assets exist
- **Related Links**: Validates frontmatter relatedLinks
- **Link Extraction**: Finds links in markdown and HTML
- **Context Tracking**: Records where links are found (line numbers, context)

### Content Validation
- **Empty Pages**: Detects pages with no or very little content
- **Required Fields**: Checks for missing required frontmatter fields
- **Field Validation**: Validates field values (e.g., category must be valid)
- **Summary Validation**: Ensures summaries are present and adequate

### Navigation Validation
- **Orphan Pages**: Identifies pages not referenced in navigation
- **Navigation Parsing**: Extracts slugs from navigation.json
- **Cross-Reference**: Checks if pages are discoverable

### Issue Classification
- **Severity Levels**:
  - `error`: Critical issues that must be fixed
  - `warning`: Issues that should be addressed
  - `info`: Informational issues (e.g., orphan pages)
- **Issue Types**:
  - `broken-link`: Internal link points to non-existent page
  - `missing-asset`: Referenced asset file not found
  - `empty-page`: Page has no or minimal content
  - `orphan-page`: Page not in navigation
  - `missing-field`: Required frontmatter field missing
  - `invalid-frontmatter`: Invalid field value

## Usage

### Run QA Check

```bash
# Option 1: Using npm script (checks content/ directory)
npm run qa

# Option 2: Specify directories
npx tsx migration/scripts/qa-standalone.ts content/pages public/assets

# Option 3: Check migration output
npx tsx migration/scripts/qa-standalone.ts migration/output/pages public/assets
```

The script will:
1. Load all pages from the specified directory
2. Check for empty pages
3. Validate required fields
4. Check for orphan pages
5. Validate all links
6. Check referenced assets
7. Generate `migration/output/qa-report.json`
8. Print summary to console
9. Exit with error code if issues found

## Report Format

The `qa-report.json` includes:
- Total pages analyzed
- All issues with details:
  - Type and severity
  - Page and category
  - Error message
  - Additional details (line numbers, context, etc.)
- Summary statistics:
  - Total errors, warnings, info
  - Counts by issue type
  - Broken links count
  - Missing assets count
  - Empty pages count
  - Orphan pages count

## Checks Performed

1. **Empty Pages**
   - Content length = 0 → Error
   - Content length < 50 → Warning
   - Missing or short summary → Warning

2. **Required Fields**
   - Missing: title, slug, category, audience, tags, summary → Error
   - Invalid category value → Error

3. **Orphan Pages**
   - Page not in navigation.json → Info
   - Useful for identifying pages that need to be added to nav

4. **Link Validation**
   - Internal links to non-existent pages → Error
   - Asset links to missing files → Error
   - Related links in frontmatter → Error if invalid

5. **Asset Validation**
   - Checks if referenced assets exist in assets directory
   - Supports both absolute (/assets/...) and relative paths

## Next Steps (PHASE 7)

Ready to proceed with Deployment Checklist:
1. Verify GitHub Pages build configuration
2. Test all routes in production
3. Verify search functionality
4. Test directory filters
5. Generate final migration completion report

## Notes

- QA check exits with error code (1) if errors found, (0) if passed
- Can be integrated into CI/CD pipeline
- Reports are JSON for easy parsing
- All checks are non-destructive (read-only)
- Link checking is conservative (assumes valid if uncertain)

