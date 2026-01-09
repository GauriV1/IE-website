// PHASE E: Setup navigation and create migration map

import fs from 'fs';
import path from 'path';
import { getContentPages } from '../lib/content/loader.server';

const EXPORTS_DIR = path.join(process.cwd(), 'migration', 'exports');
const CONTENT_DIR = path.join(process.cwd(), 'content');

/**
 * Create navigation based on discovered pages
 */
async function main() {
  console.log('🗺️  PHASE E: Setting up navigation...\n');
  
  // Load migration map
  const migrationMapPath = path.join(EXPORTS_DIR, 'migration-map.json');
  if (!fs.existsSync(migrationMapPath)) {
    console.error('❌ migration-map.json not found. Run convert-to-markdown first.');
    process.exit(1);
  }
  
  const migrationMap = JSON.parse(fs.readFileSync(migrationMapPath, 'utf8'));
  
  // Group by category
  const byCategory: Record<string, any[]> = {};
  for (const item of migrationMap) {
    if (!byCategory[item.category]) {
      byCategory[item.category] = [];
    }
    byCategory[item.category].push(item);
  }
  
  // Create navigation structure
  const navigation = {
    main: [
      { label: 'Home', href: '/' },
    ],
  };
  
  // Add category sections
  const categoryLabels: Record<string, string> = {
    'tasks': 'Tasks & Services',
    'policies': 'Policies & Resources',
    'teams': 'Teams',
    'tools': 'Tools & Applications',
    'news': 'News & Announcements',
    'about': 'About',
  };
  
  for (const [category, items] of Object.entries(byCategory)) {
    if (items.length > 0) {
      navigation.main.push({
        label: categoryLabels[category] || category,
        href: `/${category}`,
      });
    }
  }
  
  navigation.main.push({ label: 'Directory', href: '/directory' });
  navigation.main.push({ label: 'Search', href: '/search' });
  
  // Save navigation
  const navPath = path.join(CONTENT_DIR, 'navigation.json');
  fs.writeFileSync(navPath, JSON.stringify(navigation, null, 2), 'utf8');
  
  console.log('✅ Navigation created!');
  console.log(`   Categories: ${Object.keys(byCategory).length}`);
  console.log(`   Total pages: ${migrationMap.length}`);
  console.log(`   Navigation saved to: content/navigation.json\n`);
  
  // Print summary by category
  console.log('📊 Pages by category:');
  for (const [category, items] of Object.entries(byCategory)) {
    console.log(`   ${category}: ${items.length} pages`);
  }
  console.log('');
}

main();

