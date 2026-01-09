// Standalone QA script
// Run with: npx tsx migration/scripts/qa-standalone.ts [pages-directory] [assets-directory]

import { generateQAReport } from './qa-check';
import path from 'path';

async function main() {
  const args = process.argv.slice(2);
  
  const pagesDir = args[0] || path.join(process.cwd(), 'content', 'pages');
  const assetsDir = args[1] || path.join(process.cwd(), 'public', 'assets');
  const outputDir = path.join(process.cwd(), 'migration', 'output');
  
  try {
    const report = generateQAReport(pagesDir, assetsDir, outputDir);
    
    // Exit with error code if there are errors
    if (report.summary.errors > 0) {
      console.log('❌ QA check completed with errors. Please review the report.\n');
      process.exit(1);
    } else {
      console.log('✅ QA check passed!\n');
      process.exit(0);
    }
  } catch (error: any) {
    console.error('❌ QA check failed:', error.message);
    process.exit(1);
  }
}

main();

