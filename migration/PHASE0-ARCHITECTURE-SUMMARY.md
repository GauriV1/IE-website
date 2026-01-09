# PHASE 0 — Current Architecture Summary

## Framework & Build System

- **Framework**: Next.js 14.2.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Output**: Static export (`output: "export"`) configured for GitHub Pages
- **Base Path**: `/IE-website` (production), empty (development)
- **Deployment**: GitHub Pages (static HTML export)

## Routing Structure

Uses Next.js App Router with file-based routing:

```
app/
├── page.tsx                    # Homepage (/)
├── tasks/
│   ├── page.tsx                # Tasks listing (/tasks)
│   └── [slug]/
│       └── page.tsx            # Individual task (/tasks/[slug])
├── policies/
│   ├── page.tsx                # Policies listing (/policies)
│   └── [slug]/
│       └── page.tsx            # Individual policy (/policies/[slug])
├── teams/
│   ├── page.tsx                # Teams listing (/teams)
│   └── [slug]/
│       └── page.tsx            # Individual team (/teams/[slug])
├── tools/
│   ├── page.tsx                # Tools listing (/tools)
│   └── [slug]/
│       └── page.tsx            # Individual tool (/tools/[slug])
├── news/
│   ├── page.tsx                # News listing (/news)
│   └── [slug]/
│       └── page.tsx            # Individual news item (/news/[slug])
├── directory/
│   ├── page.tsx                # Directory listing (/directory)
│   └── [id]/
│       └── page.tsx            # Individual person (/directory/[id])
└── search/
    ├── page.tsx                # Search page (/search)
    └── SearchContent.tsx       # Search component (client-side)
```

## Current Content Storage

**Location**: `/lib/mockData.ts`

**Structure**: All content is hard-coded as TypeScript interfaces and arrays:
- `Task[]` - Tasks/How-To guides
- `Policy[]` - Policies and procedures
- `Team[]` - Teams and departments
- `Tool[]` - Tools and applications
- `NewsItem[]` - News and announcements
- `Person[]` - Directory entries

**Data Flow**:
1. Content defined in `mockData.ts` as TypeScript objects
2. Pages import and filter/search this data
3. Static generation via `generateStaticParams()` for dynamic routes
4. Search is client-side with simple string matching

## Current Features

### ✅ Implemented
- Static page generation
- Dynamic routing with `[slug]` and `[id]` params
- Client-side search (simple string matching)
- Filtering by category/department
- Breadcrumbs navigation
- Related content linking (tasks ↔ policies)
- Responsive design with Tailwind CSS
- Password protection component

### ⚠️ Limitations
- Content is hard-coded in TypeScript (not content-driven)
- No markdown support
- No content versioning or lastUpdated tracking
- Search is basic (no fuzzy matching, no indexing)
- No content metadata (audience, tags, sourceUrl)
- No asset management system
- No content deduplication logic

## Proposed Content Model

### Recommended Structure

```
content/
├── pages/
│   ├── tasks/
│   │   ├── request-time-off.md
│   │   ├── submit-expense-report.md
│   │   └── ...
│   ├── policies/
│   │   ├── time-off-policy.md
│   │   ├── expense-policy.md
│   │   └── ...
│   ├── teams/
│   │   ├── human-resources.md
│   │   └── ...
│   ├── tools/
│   │   ├── hr-portal.md
│   │   └── ...
│   └── news/
│       ├── q2-all-hands-meeting.md
│       └── ...
├── directory/
│   └── people.json              # Directory entries (JSON for easier editing)
├── navigation.json               # Site navigation structure
├── tags.json                     # Tag definitions and metadata
└── config.json                   # Site-wide configuration
```

### Content Schema (Markdown Frontmatter)

Each `.md` file will use YAML frontmatter:

```yaml
---
title: "Request Time Off"
slug: "request-time-off"
category: "tasks"
audience: ["staff", "new-hire"]
tags: ["hr", "time-off", "leave"]
lastUpdated: "2024-01-15"
summary: "Submit a request for vacation, sick leave, or personal time off."
relatedLinks:
  - { type: "policy", slug: "time-off-policy" }
  - { type: "form", name: "Time Off Request Form", url: "#" }
attachments: []
sourceUrl: "https://cyan-tangerine-w282.squarespace.com/request-time-off"
---

# Request Time Off

[Markdown content here...]
```

### Migration Strategy

1. **Keep existing TypeScript interfaces** for type safety
2. **Create content loader utilities** that read from `/content` directory
3. **Maintain backward compatibility** during migration
4. **Gradually migrate** from `mockData.ts` to content files
5. **Add markdown rendering** using a library like `remark` or `react-markdown`

## Next Steps (PHASE 1)

1. Create `/content` directory structure
2. Define TypeScript types for content schema
3. Create content loader utilities
4. Set up markdown parsing
5. Migrate one category as a proof of concept

## Dependencies to Add

- `gray-matter` or `front-matter` - Parse YAML frontmatter
- `remark` + `remark-html` or `react-markdown` - Markdown rendering
- `fuse.js` (optional) - Better search with fuzzy matching
- `turndown` (for migration) - HTML to Markdown conversion

