# PHASE 5 — Redundancy Cleanup: COMPLETE ✅

## Summary

Successfully created deduplication infrastructure to detect and handle duplicate or highly similar content pages, reducing redundancy in the migrated content.

## Files Created

### Deduplication Scripts
- `/migration/scripts/detect-duplicates.ts` - Similarity detection utilities
- `/migration/scripts/deduplicate.ts` - Deduplication orchestrator
- `/migration/scripts/deduplicate-standalone.ts` - Standalone deduplication script

## Features

### Similarity Detection
- **Title Similarity**: Compares page titles using string similarity algorithm
- **Content Similarity**: Compares summaries and content excerpts
- **Combined Similarity**: Weighted combination (60% title, 40% content)
- **Title Pattern Detection**: Identifies common patterns (e.g., "Policy" vs "Policy Name", "How to X" vs "X")

### Duplicate Grouping
- Groups pages with similarity >= 0.8 (high similarity)
- Identifies canonical page (prefer more content or better slug)
- Categorizes duplicates for appropriate action

### Deduplication Actions

1. **Merge** (similarity >= 0.9)
   - Combines duplicate content into canonical page
   - Adds duplicate content as a section
   - Adds to related links
   - Deletes duplicate files

2. **Redirect** (similarity >= 0.85)
   - Creates redirect pages pointing to canonical
   - Updates canonical with related links
   - Preserves duplicate pages as redirects

3. **Consolidate** (similarity 0.6-0.85)
   - Adds duplicates to canonical's related links
   - Keeps pages separate but linked
   - Useful for related but distinct content

### Detection Methods

- **High Similarity Detection**: Finds near-duplicates (>= 0.8 similarity)
- **Medium Similarity Detection**: Finds similar content (0.6-0.8 similarity)
- **Title Pattern Detection**: Identifies similar titles with common patterns
- **Cross-Category Analysis**: Analyzes within categories (can be extended)

## Dependencies Added

- `string-similarity` - String similarity calculation (Dice coefficient)

## Usage

### Generate Deduplication Report

```bash
# Option 1: Using npm script
npm run deduplicate migration/output/pages

# Option 2: Direct execution
npx tsx migration/scripts/deduplicate-standalone.ts migration/output/pages
```

This will:
1. Analyze all pages for duplicates
2. Generate `migration/output/deduplication-report.json`
3. Print summary to console
4. Show recommended actions (dry run)

### Apply Deduplication Actions

```bash
# Apply actions (modifies files)
npm run deduplicate migration/output/pages --apply

# Or directly
npx tsx migration/scripts/deduplicate-standalone.ts migration/output/pages --apply
```

## Report Format

The `deduplication-report.json` includes:
- Total pages analyzed
- Number of duplicate groups found
- Detailed actions for each group:
  - Type (merge, redirect, consolidate)
  - Canonical page
  - Duplicate pages
  - Similarity score
  - Reason/recommendation
- Summary statistics

## Similarity Thresholds

- **>= 0.9**: Very high similarity → Merge
- **>= 0.85**: High similarity → Redirect
- **0.6-0.85**: Medium similarity → Consolidate
- **< 0.6**: Low similarity → Keep separate

## Next Steps (PHASE 6)

Ready to proceed with QA and Link Integrity:
1. Create link checking script
2. Check for broken internal links
3. Verify missing assets
4. Identify empty pages
5. Find orphan pages (not in nav)
6. Generate QA report

## Notes

- Deduplication is safe to run multiple times (idempotent)
- Default mode is dry-run (use --apply to modify files)
- Similarity thresholds can be adjusted in the code
- Actions preserve source URLs for traceability
- Related links are automatically updated

