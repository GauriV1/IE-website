// Migration script entry point
// Run with: npx tsx migration/scripts/index.ts <path-to-squarespace-export.xml>

import { migrateContent } from './migrate';
import path from 'path';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: npx tsx migration/scripts/index.ts <path-to-squarespace-export.xml>');
    console.error('\nExample:');
    console.error('  npx tsx migration/scripts/index.ts migration/exports/squarespace-export.xml');
    process.exit(1);
  }
  
  const xmlFilePath = path.resolve(args[0]);
  const outputDir = path.join(process.cwd(), 'migration', 'output');
  
  try {
    await migrateContent(xmlFilePath, outputDir);
    console.log('✅ Migration completed successfully!');
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

main();

