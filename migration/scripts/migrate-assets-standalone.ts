// Standalone asset migration script
// Run this after content migration to download and rewrite assets

import { migrateDirectoryAssets, generateAssetReport } from './migrate-assets';
import path from 'path';

async function main() {
  const args = process.argv.slice(2);
  
  const pagesDir = args[0] || path.join(process.cwd(), 'migration', 'output', 'pages');
  const assetsDir = path.join(process.cwd(), 'public', 'assets');
  const reportPath = path.join(process.cwd(), 'migration', 'output', 'assets-report.json');
  
  console.log('🖼️  Starting asset migration...\n');
  console.log(`   Pages directory: ${pagesDir}`);
  console.log(`   Assets directory: ${assetsDir}\n`);
  
  try {
    const report = await migrateDirectoryAssets(pagesDir, assetsDir);
    
    // Generate report
    generateAssetReport(report, reportPath);
    
    console.log('\n📊 Asset Migration Summary:');
    console.log(`   Total assets found: ${report.totalAssets}`);
    console.log(`   ✅ Downloaded: ${report.downloaded}`);
    console.log(`   ❌ Failed: ${report.failed}`);
    console.log(`   ⏭️  Skipped: ${report.skipped}`);
    console.log(`   📦 Total size: ${(report.totalSize / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`\n📄 Report saved to: ${reportPath}\n`);
    
    if (report.failed > 0) {
      console.log('⚠️  Some assets failed to download. Check assets-report.json for details.\n');
    }
  } catch (error: any) {
    console.error('❌ Asset migration failed:', error.message);
    process.exit(1);
  }
}

main();

