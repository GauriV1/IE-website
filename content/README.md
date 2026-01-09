# Content Directory Structure

This directory contains all content for the Division of Inclusive Excellence Digital Handbook.

## Directory Structure

```
content/
├── pages/
│   ├── tasks/          # How-to guides and task instructions
│   ├── policies/       # Policies and procedures
│   ├── teams/          # Team and department information
│   ├── tools/          # Tools and applications
│   └── news/           # News and announcements
├── directory/
│   └── people.json     # Employee directory
├── navigation.json     # Site navigation structure
└── tags.json          # Tag definitions and metadata
```

## Content File Format

All content files in `pages/` are Markdown files (`.md`) with YAML frontmatter.

### Required Frontmatter Fields

- `title`: Page title
- `slug`: URL-friendly identifier (must match filename without .md)
- `category`: One of: `tasks`, `policies`, `teams`, `tools`, `news`
- `audience`: Array of: `staff`, `new-hire`, `leadership`, `external`, `all`
- `tags`: Array of tag IDs (defined in `tags.json`)
- `summary`: 2-3 line summary for listings and search

### Optional Frontmatter Fields

- `lastUpdated`: Date in YYYY-MM-DD format
- `relatedLinks`: Array of related content links
- `attachments`: Array of file attachments
- `sourceUrl`: Original Squarespace URL (for migration tracking)
- Category-specific fields (see below)

### Category-Specific Fields

#### Tasks
- `steps`: Array of step-by-step instructions
- `relatedForms`: Array of form names
- `relatedPolicies`: Array of policy slugs
- `contacts`: Array of email addresses

#### Policies
- `keyBullets`: Array of key policy points
- `sections`: Array of `{ title: string, content: string }`
- `relatedTasks`: Array of task slugs
- `relatedForms`: Array of form names

#### Teams
- `mission`: Team mission statement
- `relatedTasks`: Array of task slugs
- `relatedPolicies`: Array of policy slugs
- `relatedTools`: Array of tool slugs
- `contacts`: Array of email addresses or contact objects

#### Tools
- `type`: Tool category/type
- `url`: External URL to the tool

#### News
- `date`: Publication date (YYYY-MM-DD)
- `excerpt`: Short excerpt for listings

## Example Content File

```markdown
---
title: "Request Time Off"
slug: "request-time-off"
category: "tasks"
audience: ["staff", "new-hire"]
tags: ["hr", "time-off"]
lastUpdated: "2024-01-15"
summary: "Submit a request for vacation, sick leave, or personal time off."
relatedLinks:
  - type: "policy"
    slug: "time-off-policy"
steps:
  - "Log into the HR portal"
  - "Navigate to Time Off section"
---

# Request Time Off

[Markdown content here...]
```

## Directory (people.json)

JSON array of person objects with:
- `id`: Unique identifier
- `name`: Full name
- `role`: Job title
- `department`: Department name
- `email`: Email address
- `phone`: Phone number (optional)
- `office`: Office location (optional)
- `tags`: Array of tag IDs (optional)
- `team`: Team slug (optional)

## Navigation (navigation.json)

Defines the site navigation structure with:
- `main`: Main navigation items
- `footer`: Footer navigation items (optional)

Each navigation item has:
- `label`: Display text
- `href`: URL path
- `children`: Sub-navigation items (optional)

## Tags (tags.json)

Defines tag metadata with:
- `id`: Tag identifier (used in content frontmatter)
- `name`: Display name
- `description`: Tag description (optional)
- `category`: Associated category (optional)
- `color`: Color code for UI (optional)

