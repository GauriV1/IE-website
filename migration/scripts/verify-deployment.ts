// Deployment verification script

import fs from 'fs';
import path from 'path';
import { getContentPages, getContentSlugs, getPeople } from '../../lib/content/loader.server';

interface DeploymentCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

interface DeploymentReport {
  timestamp: string;
  checks: DeploymentCheck[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

/**
 * Verify GitHub Pages build configuration
 */
function verifyBuildConfig(): DeploymentCheck {
  const configPath = path.join(process.cwd(), 'next.config.mjs');
  
  if (!fs.existsSync(configPath)) {
    return {
      name: 'Build Configuration',
      status: 'fail',
      message: 'next.config.mjs not found',
    };
  }
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  const checks = {
    hasExport: configContent.includes('output: "export"'),
    hasBasePath: configContent.includes('basePath'),
    hasAssetPrefix: configContent.includes('assetPrefix'),
    hasUnoptimizedImages: configContent.includes('unoptimized: true'),
  };
  
  if (checks.hasExport && checks.hasBasePath && checks.hasAssetPrefix) {
    return {
      name: 'Build Configuration',
      status: 'pass',
      message: 'GitHub Pages configuration is correct',
      details: checks,
    };
  }
  
  return {
    name: 'Build Configuration',
    status: 'fail',
    message: 'GitHub Pages configuration is incomplete',
    details: checks,
  };
}

/**
 * Verify build output directory
 */
function verifyBuildOutput(): DeploymentCheck {
  const outDir = path.join(process.cwd(), 'out');
  
  if (!fs.existsSync(outDir)) {
    return {
      name: 'Build Output',
      status: 'warning',
      message: 'Build output directory not found. Run "npm run build" first.',
    };
  }
  
  const requiredFiles = ['index.html', '404.html'];
  const missingFiles = requiredFiles.filter(file => 
    !fs.existsSync(path.join(outDir, file))
  );
  
  if (missingFiles.length > 0) {
    return {
      name: 'Build Output',
      status: 'fail',
      message: `Missing required files: ${missingFiles.join(', ')}`,
      details: { missingFiles },
    };
  }
  
  return {
    name: 'Build Output',
    status: 'pass',
    message: 'Build output directory contains required files',
    details: { outDir },
  };
}

/**
 * Verify static routes are generated
 */
function verifyStaticRoutes(): DeploymentCheck {
  const outDir = path.join(process.cwd(), 'out');
  
  if (!fs.existsSync(outDir)) {
    return {
      name: 'Static Routes',
      status: 'warning',
      message: 'Build output not found. Cannot verify static routes.',
    };
  }
  
  const categories = ['tasks', 'policies', 'teams', 'tools', 'news'];
  const missingRoutes: string[] = [];
  
  for (const category of categories) {
    const categoryDir = path.join(outDir, category);
    if (!fs.existsSync(categoryDir)) {
      missingRoutes.push(`${category}/`);
    }
    
    // Check for individual pages
    try {
      const slugs = getContentSlugs(category as any);
      for (const slug of slugs) {
        const pagePath = path.join(categoryDir, `${slug}.html`);
        if (!fs.existsSync(pagePath)) {
          missingRoutes.push(`${category}/${slug}`);
        }
      }
    } catch (error) {
      // Category might not have content yet
    }
  }
  
  if (missingRoutes.length > 0) {
    return {
      name: 'Static Routes',
      status: 'warning',
      message: `Some routes may not be generated: ${missingRoutes.slice(0, 5).join(', ')}${missingRoutes.length > 5 ? '...' : ''}`,
      details: { missingRoutes: missingRoutes.slice(0, 10) },
    };
  }
  
  return {
    name: 'Static Routes',
    status: 'pass',
    message: 'Static routes appear to be generated correctly',
  };
}

/**
 * Verify content structure
 */
function verifyContentStructure(): DeploymentCheck {
  const contentDir = path.join(process.cwd(), 'content');
  
  if (!fs.existsSync(contentDir)) {
    return {
      name: 'Content Structure',
      status: 'fail',
      message: 'Content directory not found',
    };
  }
  
  const requiredDirs = ['pages', 'directory'];
  const missingDirs = requiredDirs.filter(dir => 
    !fs.existsSync(path.join(contentDir, dir))
  );
  
  if (missingDirs.length > 0) {
    return {
      name: 'Content Structure',
      status: 'fail',
      message: `Missing required directories: ${missingDirs.join(', ')}`,
      details: { missingDirs },
    };
  }
  
  // Check for at least some content
  const categories = ['tasks', 'policies', 'teams', 'tools', 'news'];
  const contentCounts: Record<string, number> = {};
  
  for (const category of categories) {
    const categoryDir = path.join(contentDir, 'pages', category);
    if (fs.existsSync(categoryDir)) {
      const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.md'));
      contentCounts[category] = files.length;
    } else {
      contentCounts[category] = 0;
    }
  }
  
  const totalContent = Object.values(contentCounts).reduce((a, b) => a + b, 0);
  
  if (totalContent === 0) {
    return {
      name: 'Content Structure',
      status: 'warning',
      message: 'No content pages found. Migration may not be complete.',
      details: { contentCounts },
    };
  }
  
  return {
    name: 'Content Structure',
    status: 'pass',
    message: `Content structure is valid (${totalContent} pages found)`,
    details: { contentCounts },
  };
}

/**
 * Verify assets directory
 */
function verifyAssets(): DeploymentCheck {
  const assetsDir = path.join(process.cwd(), 'public', 'assets');
  
  if (!fs.existsSync(assetsDir)) {
    return {
      name: 'Assets Directory',
      status: 'warning',
      message: 'Assets directory not found. This is okay if no assets were migrated.',
    };
  }
  
  const imageDir = path.join(assetsDir, 'images');
  const fileDir = path.join(assetsDir, 'files');
  
  const hasImages = fs.existsSync(imageDir);
  const hasFiles = fs.existsSync(fileDir);
  
  if (!hasImages && !hasFiles) {
    return {
      name: 'Assets Directory',
      status: 'warning',
      message: 'Assets directory exists but is empty',
    };
  }
  
  return {
    name: 'Assets Directory',
    status: 'pass',
    message: 'Assets directory structure is valid',
    details: { hasImages, hasFiles },
  };
}

/**
 * Generate deployment verification report
 */
export function verifyDeployment(): DeploymentReport {
  const checks: DeploymentCheck[] = [];
  
  // Run all checks
  checks.push(verifyBuildConfig());
  checks.push(verifyBuildOutput());
  checks.push(verifyStaticRoutes());
  checks.push(verifyContentStructure());
  checks.push(verifyAssets());
  
  // Print results
  for (const check of checks) {
    const icon = check.status === 'pass' ? '✅' : check.status === 'fail' ? '❌' : '⚠️';
    console.log(`${icon} ${check.name}: ${check.message}`);
    if (check.details) {
      console.log(`   Details:`, check.details);
    }
  }
  
  const summary = {
    total: checks.length,
    passed: checks.filter(c => c.status === 'pass').length,
    failed: checks.filter(c => c.status === 'fail').length,
    warnings: checks.filter(c => c.status === 'warning').length,
  };
  
  const report: DeploymentReport = {
    timestamp: new Date().toISOString(),
    checks,
    summary,
  };
  
  console.log('\n📊 Summary:');
  console.log(`   ✅ Passed: ${summary.passed}`);
  console.log(`   ❌ Failed: ${summary.failed}`);
  console.log(`   ⚠️  Warnings: ${summary.warnings}\n`);
  
  return report;
}

// Standalone execution
if (require.main === module) {
  console.log('🔍 Verifying deployment configuration...\n');
  verifyDeployment();
}

