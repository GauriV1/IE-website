# Division of Inclusive Excellence Digital Handbook

A wireframe prototype web application for Whitman College's Division of Inclusive Excellence, built with Next.js, TypeScript, and Tailwind CSS. This application provides the structure and layouts for a digital handbook with no backend or real data - all content structure is ready for integration with real content.

## About

This digital handbook serves as a comprehensive resource portal for Whitman College's Division of Inclusive Excellence, providing access to policies, procedures, resources, and support services in an organized, accessible format.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React 18**

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage with Division of Inclusive Excellence branding
│   ├── tasks/             # Tasks & Services pages
│   ├── policies/          # Policies & Resources pages
│   ├── teams/             # Departments & Teams pages
│   ├── tools/             # Tools & Applications pages
│   ├── news/              # News & Announcements pages
│   ├── directory/         # Directory pages
│   ├── search/            # Search results page
│   ├── layout.tsx         # Root layout with Header/Footer
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── Header.tsx        # Site header with Whitman branding
│   ├── Footer.tsx        # Site footer with Whitman College info
│   ├── SearchBar.tsx     # Global search input
│   ├── Card.tsx          # Card component
│   ├── Breadcrumbs.tsx  # Breadcrumb navigation
│   ├── FilterChips.tsx   # Filter chip buttons
│   └── Tabs.tsx          # Tab navigation
├── lib/
│   └── mockData.ts       # Data structure templates (ready for real content)
└── public/
    └── images/           # Place images here (hero image, etc.)
```

## Routes

### Core Pages

- `/` - Homepage with Division of Inclusive Excellence branding and quick access cards
- `/tasks` - Tasks & Services overview
- `/tasks/[slug]` - Individual task detail page (How-To Guide template)
- `/policies` - Policies & Resources library
- `/policies/[slug]` - Individual policy detail page
- `/teams` - Departments & Teams directory
- `/teams/[slug]` - Individual team detail page
- `/tools` - Tools & Applications listing
- `/tools/[slug]` - Individual tool detail page
- `/news` - News & Announcements listing
- `/news/[slug]` - Individual news article page
- `/directory` - Directory with search and filters
- `/directory/[id]` - Individual person detail page
- `/search` - Global search results page (query param: `?q=...`)

## Design & Branding

The application uses Whitman College's color scheme and design principles:

- **Primary Colors**: 
  - Navy Blue (#003366) - Primary text and headers
  - Blue (#0066CC) - Links and accents
  - Light Blue (#E6F2FF) - Backgrounds and highlights
  - Gold (#D4AF37) - Accent color (available for future use)

- **Design Principles**:
  - Clean, academic aesthetic matching Whitman College's website
  - Professional typography
  - Generous whitespace for readability
  - Accessible color contrast
  - Mobile-responsive design

## Adding Images

To add the hero image mentioned in the requirements:

1. Place your image file in `/public/images/` (e.g., `hero-image.jpg`)
2. Update `/app/page.tsx` to uncomment the Image component and update the path
3. The image will display in the hero section on the homepage

## Data Structure

The application is structured to easily integrate with real content. Data structures are defined in `/lib/mockData.ts` with TypeScript interfaces:

- **Tasks**: Step-by-step guides with categories, steps, related policies
- **Policies**: Policy documents with key bullets, sections, related tasks
- **Teams**: Department information with contacts and related resources
- **Tools**: Application listings with descriptions and types
- **News**: News items with dates and content
- **People**: Directory entries with contact information

## Features

### Navigation
- Fixed header with Whitman College branding
- Primary navigation menu
- Global search functionality
- Mobile-responsive hamburger menu
- Breadcrumb navigation on detail pages

### Search
- Global search bar in header
- Dedicated search page with tabs (All, People, Policies, How-To, Tools)
- Search functionality ready for integration with real data

### Filtering
- Category filters on Policies page
- Type filters on Tools page
- Department filters on Directory page
- URL-based filter state (shareable URLs)

### Page Templates
- **Task Template**: Title, summary, step-by-step guide, related forms/policies, contacts
- **Policy Template**: Title, key bullets, sections, related tasks/forms
- **Team Template**: Mission, contacts, related tasks/policies/tools
- **Tool Template**: Description, "Open tool" button
- **News Template**: Title, date, excerpt, full content
- **Person Template**: Name, role, department, contact info

## Future Integration

This prototype is designed to be easily wired to real content:

- Replace data structures with API calls or database queries
- Add authentication/authorization if needed
- Connect to Whitman College's backend services
- Replace placeholder content with actual Division of Inclusive Excellence content
- Add form submission handling
- Implement real search indexing

## Notes

- This is a wireframe prototype - no authentication or database required
- All data structures are defined but contain placeholder/mock data
- Search and filtering are ready for integration with real data sources
- Design matches Whitman College's website aesthetic
- Perfect for prototyping, user testing, and content planning

## Contact

For questions about Whitman College's Division of Inclusive Excellence, visit:
- [Whitman College Website](https://www.whitman.edu/)
- [Inclusive Excellence at Whitman](https://www.whitman.edu/about/inclusive-excellence)

---

© {new Date().getFullYear()} Whitman College. All rights reserved.
