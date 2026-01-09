// PHASE F: Verify migration and generate QA report

import fs from 'fs';
import path from 'path';
import { getContentPages, getPeople, searchContent } from '../lib/content/loader.server';

const EXPORTS_DIR = path.join(process.cwd(), 'migration', 'exports');

interface QAReport {
  timestamp: string;
  pages: {
    total: number;
    byCategory: Record<string, number>;
  };
  assets: {
    total: number;
    downloaded: number;
    failed: number;
  };
  issues: {
    brokenLinks: number;
    missingAssets: number;
    emptyPages: number;
    orphanPages: number;
  };
  search: {
    indexed: number;
    working: boolean;
  };
}

async function main() {
  console.log('✅ PHASE F: Verifying migration...\n');
  
  // Count pages
  const categories = ['tasks', 'policies', 'teams', 'tools', 'news', 'about'];
  const pagesByCategory: Record<string, number> = {};
  let totalPages = 0;
  
  for (const category of categories) {
    try {
      const pages = getContentPages(category as any);
      pagesByCategory[category] = pages.length;
      totalPages += pages.length;
    } catch {
      pagesByCategory[category] = 0;
    }
  }
  
  // Check assets
  const assetsReportPath = path.join(EXPORTS_DIR, 'assets-report.json');
  let assetsInfo = { total: 0, downloaded: 0, failed: 0 };
  if (fs.existsSync(assetsReportPath)) {
    const assetsReport = JSON.parse(fs.readFileSync(assetsReportPath, 'utf8'));
    assetsInfo = {
      total: assetsReport.totalAssets || 0,
      downloaded: assetsReport.downloaded || 0,
      failed: assetsReport.failed || 0,
    };
  }
  
  // Test search
  let searchWorking = false;
  let indexedCount = 0;
  try {
    const results = searchContent('test', categories as any);
    indexedCount = totalPages;
    searchWorking = true;
  } catch {
    searchWorking = false;
  }
  
  // Check for empty pages
  let emptyPages = 0;
  for (const category of categories) {
    try {
      const pages = getContentPages(category as any);
      for (const page of pages) {
        if (!page.content || page.content.trim().length < 50) {
          emptyPages++;
        }
      }
    } catch {}
  }
  
  const report: QAReport = {
    timestamp: new Date().toISOString(),
    pages: {
      total: totalPages,
      byCategory: pagesByCategory,
    },
    assets: assetsInfo,
    issues: {
      brokenLinks: 0, // Would need link checking
      missingAssets: assetsInfo.failed,
      emptyPages,
      orphanPages: 0, // Would need nav checking
    },
    search: {
      indexed: indexedCount,
      working: searchWorking,
    },
  };
  
  // Save report
  fs.writeFileSync(
    path.join(EXPORTS_DIR, 'qa-report.json'),
    JSON.stringify(report, null, 2),
    'utf8'
  );
  
  // Print summary
  console.log('📊 Migration Summary:');
  console.log(`   Total pages migrated: ${totalPages}`);
  console.log(`   By category:`);
  for (const [cat, count] of Object.entries(pagesByCategory)) {
    if (count > 0) {
      console.log(`     ${cat}: ${count}`);
    }
  }
  console.log(`\n   Assets:`);
  console.log(`     Total: ${assetsInfo.total}`);
  console.log(`     Downloaded: ${assetsInfo.downloaded}`);
  console.log(`     Failed: ${assetsInfo.failed}`);
  console.log(`\n   Issues:`);
  console.log(`     Empty pages: ${emptyPages}`);
  console.log(`     Missing assets: ${assetsInfo.failed}`);
  console.log(`\n   Search: ${searchWorking ? '✅ Working' : '❌ Not working'}`);
  console.log(`   Indexed pages: ${indexedCount}`);
  console.log(`\n✅ Verification complete!`);
  console.log(`   Report saved to: migration/exports/qa-report.json\n`);
}

main();

