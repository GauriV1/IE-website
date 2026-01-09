// Standalone deduplication script
// Run with: npx tsx migration/scripts/deduplicate-standalone.ts [pages-directory] [--apply]

import { generateDeduplicationReport, applyDeduplication } from './deduplicate';
import path from 'path';

async function main() {
  const args = process.argv.slice(2);
  
  const pagesDir = args.find(arg => !arg.startsWith('--')) || path.join(process.cwd(), 'migration', 'output', 'pages');
  const apply = args.includes('--apply');
  const outputDir = path.join(process.cwd(), 'migration', 'output');
  
  try {
    // Generate report
    const report = generateDeduplicationReport(pagesDir, outputDir);
    
    // Apply actions if requested
    if (apply) {
      console.log('\n⚠️  Applying deduplication actions...\n');
      applyDeduplication(pagesDir, report, false);
    } else {
      console.log('\n💡 To apply deduplication actions, run with --apply flag:');
      console.log(`   npx tsx migration/scripts/deduplicate-standalone.ts ${pagesDir} --apply\n`);
    }
  } catch (error: any) {
    console.error('❌ Deduplication failed:', error.message);
    process.exit(1);
  }
}

main();

