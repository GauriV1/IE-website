// Final migration completion report generator

import fs from 'fs';
import path from 'path';
import { getContentPages, getPeople } from '../../lib/content/loader.server';
import { verifyDeployment } from './verify-deployment';

interface MigrationStats {
  pages: {
    total: number;
    byCategory: Record<string, number>;
  };
  people: number;
  assets: {
    images: number;
    files: number;
  };
}

interface CompletionReport {
  timestamp: string;
  migration: {
    status: 'complete' | 'in-progress' | 'not-started';
    phases: {
      phase0: boolean;
      phase1: boolean;
      phase2: boolean;
      phase3: boolean;
      phase4: boolean;
      phase5: boolean;
      phase6: boolean;
      phase7: boolean;
    };
  };
  content: MigrationStats;
  deployment: {
    buildConfig: boolean;
    buildOutput: boolean;
    staticRoutes: boolean;
    contentStructure: boolean;
    assets: boolean;
  };
  recommendations: string[];
}

/**
 * Count assets
 */
function countAssets(): { images: number; files: number } {
  const assetsDir = path.join(process.cwd(), 'public', 'assets');
  
  if (!fs.existsSync(assetsDir)) {
    return { images: 0, files: 0 };
  }
  
  const imageDir = path.join(assetsDir, 'images');
  const fileDir = path.join(assetsDir, 'files');
  
  const images = fs.existsSync(imageDir)
    ? fs.readdirSync(imageDir).filter(f => 
        /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(f)
      ).length
    : 0;
  
  const files = fs.existsSync(fileDir)
    ? fs.readdirSync(fileDir).length
    : 0;
  
  return { images, files };
}

/**
 * Check migration phase completion
 */
function checkPhases(): { phase0: boolean; phase1: boolean; phase2: boolean; phase3: boolean; phase4: boolean; phase5: boolean; phase6: boolean; phase7: boolean } {
  const contentDir = path.join(process.cwd(), 'content');
  const migrationDir = path.join(process.cwd(), 'migration');
  
  return {
    phase0: fs.existsSync(path.join(migrationDir, 'PHASE0-ARCHITECTURE-SUMMARY.md')),
    phase1: fs.existsSync(path.join(migrationDir, 'PHASE1-STATUS.md')) && fs.existsSync(path.join(contentDir, 'pages')),
    phase2: fs.existsSync(path.join(migrationDir, 'PHASE2-STATUS.md')) && fs.existsSync(path.join(migrationDir, 'scripts', 'migrate.ts')),
    phase3: fs.existsSync(path.join(migrationDir, 'PHASE3-STATUS.md')) && fs.existsSync(path.join(migrationDir, 'scripts', 'migrate-assets.ts')),
    phase4: fs.existsSync(path.join(migrationDir, 'PHASE4-STATUS.md')),
    phase5: fs.existsSync(path.join(migrationDir, 'PHASE5-STATUS.md')) && fs.existsSync(path.join(migrationDir, 'scripts', 'deduplicate.ts')),
    phase6: fs.existsSync(path.join(migrationDir, 'PHASE6-STATUS.md')) && fs.existsSync(path.join(migrationDir, 'scripts', 'qa-check.ts')),
    phase7: fs.existsSync(path.join(migrationDir, 'PHASE7-STATUS.md')),
  };
}

/**
 * Generate recommendations
 */
function generateRecommendations(
  stats: MigrationStats,
  phases: ReturnType<typeof checkPhases>,
  deployment: ReturnType<typeof verifyDeployment>
): string[] {
  const recommendations: string[] = [];
  
  // Check content
  if (stats.pages.total === 0) {
    recommendations.push('No content pages found. Run content migration (Phase 2).');
  }
  
  if (stats.people === 0) {
    recommendations.push('No people in directory. Add people to content/directory/people.json.');
  }
  
  // Check phases
  if (!phases.phase2) {
    recommendations.push('Content migration (Phase 2) not completed. Run: npm run migrate');
  }
  
  if (!phases.phase3) {
    recommendations.push('Asset migration (Phase 3) not completed. Run: npm run migrate:assets');
  }
  
  if (!phases.phase5) {
    recommendations.push('Deduplication (Phase 5) not completed. Run: npm run deduplicate');
  }
  
  if (!phases.phase6) {
    recommendations.push('QA checks (Phase 6) not completed. Run: npm run qa');
  }
  
  // Check deployment
  if (deployment.summary.failed > 0) {
    recommendations.push('Fix deployment configuration issues before deploying.');
  }
  
  if (deployment.summary.warnings > 0) {
    recommendations.push('Review deployment warnings.');
  }
  
  // Check build
  const outDir = path.join(process.cwd(), 'out');
  if (!fs.existsSync(outDir)) {
    recommendations.push('Build the site before deploying: npm run build');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('✅ Migration appears complete! Ready for deployment.');
  }
  
  return recommendations;
}

/**
 * Generate final completion report
 */
export function generateCompletionReport(): CompletionReport {
  console.log('📋 Generating migration completion report...\n');
  
  // Gather statistics
  const categories = ['tasks', 'policies', 'teams', 'tools', 'news'];
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
  
  let peopleCount = 0;
  try {
    const people = getPeople();
    peopleCount = people.length;
  } catch {
    // Directory might not exist yet
  }
  
  const assets = countAssets();
  
  const stats: MigrationStats = {
    pages: {
      total: totalPages,
      byCategory: pagesByCategory,
    },
    people: peopleCount,
    assets,
  };
  
  // Check phases
  const phases = checkPhases();
  const phasesComplete = Object.values(phases).filter(Boolean).length;
  const migrationStatus = phasesComplete === 8 ? 'complete' : phasesComplete > 0 ? 'in-progress' : 'not-started';
  
  // Verify deployment
  const deployment = verifyDeployment();
  
  // Generate recommendations
  const recommendations = generateRecommendations(stats, phases, deployment);
  
  const report: CompletionReport = {
    timestamp: new Date().toISOString(),
    migration: {
      status: migrationStatus,
      phases,
    },
    content: stats,
    deployment: {
      buildConfig: deployment.checks.find(c => c.name === 'Build Configuration')?.status === 'pass',
      buildOutput: deployment.checks.find(c => c.name === 'Build Output')?.status === 'pass',
      staticRoutes: deployment.checks.find(c => c.name === 'Static Routes')?.status === 'pass',
      contentStructure: deployment.checks.find(c => c.name === 'Content Structure')?.status === 'pass',
      assets: deployment.checks.find(c => c.name === 'Assets Directory')?.status === 'pass',
    },
    recommendations,
  };
  
  // Print summary
  console.log('\n📊 Migration Statistics:');
  console.log(`   Total pages: ${stats.pages.total}`);
  Object.entries(stats.pages.byCategory).forEach(([cat, count]) => {
    if (count > 0) {
      console.log(`     ${cat}: ${count}`);
    }
  });
  console.log(`   People: ${stats.people}`);
  console.log(`   Assets: ${assets.images} images, ${assets.files} files`);
  
  console.log('\n📋 Migration Status:');
  console.log(`   Status: ${migrationStatus}`);
  console.log(`   Phases complete: ${phasesComplete}/8`);
  
  console.log('\n💡 Recommendations:');
  recommendations.forEach(rec => {
    console.log(`   ${rec}`);
  });
  
  // Write report
  const outputDir = path.join(process.cwd(), 'migration', 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const reportPath = path.join(outputDir, 'migration-completion-report.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify(report, null, 2),
    'utf8'
  );
  
  console.log(`\n📄 Report saved to: ${reportPath}\n`);
  
  return report;
}

