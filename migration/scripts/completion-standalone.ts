// Standalone completion report generator
// Run with: npx tsx migration/scripts/completion-standalone.ts

import { generateCompletionReport } from './generate-completion-report';

async function main() {
  try {
    const report = generateCompletionReport();
    
    if (report.migration.status === 'complete') {
      console.log('✅ Migration is complete! Ready for deployment.\n');
      process.exit(0);
    } else {
      console.log('⚠️  Migration is not yet complete. Please review recommendations.\n');
      process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ Failed to generate completion report:', error.message);
    process.exit(1);
  }
}

main();

