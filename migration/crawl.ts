// PHASE 2: Crawl pages and save HTML snapshots
// Uses Playwright to visit each URL and save rendered HTML

import { chromium, Browser, Page } from 'playwright';
import fs from 'fs';
import path from 'path';
import { discoverUrls, urlToSlug } from './discover-urls';

const BASE_URL = 'https://cyan-tangerine-w282.squarespace.com';
const PASSWORD = 'division';
const RAW_DIR = path.join(process.cwd(), 'migration', 'raw');
const HTML_DIR = path.join(RAW_DIR, 'html');
const META_DIR = path.join(RAW_DIR, 'meta');
const EXPORTS_DIR = path.join(process.cwd(), 'migration', 'exports');

interface PageMeta {
  url: string;
  slug: string;
  title: string;
  timestamp: string;
}

/**
 * Handle password gate
 */
async function handlePasswordGate(page: Page): Promise<void> {
  await page.waitForTimeout(2000);
  
  const passwordSelectors = [
    'input[type="password"]',
    'input[name*="password" i]',
    'input[id*="password" i]',
    'input[placeholder*="password" i]',
    '.password-input input',
    '#password',
  ];
  
  for (const selector of passwordSelectors) {
    try {
      const passwordInput = await page.locator(selector).first();
      if (await passwordInput.isVisible({ timeout: 2000 })) {
        console.log('   🔐 Password gate detected, entering password...');
        await passwordInput.fill(PASSWORD);
        
        const submitSelectors = [
          'button[type="submit"]',
          'input[type="submit"]',
          'button:has-text("Submit")',
          'button:has-text("Enter")',
          'button:has-text("Continue")',
          '.submit-button',
          'form button',
        ];
        
        for (const submitSelector of submitSelectors) {
          try {
            const submitButton = await page.locator(submitSelector).first();
            if (await submitButton.isVisible({ timeout: 1000 })) {
              await submitButton.click();
              await page.waitForLoadState('networkidle', { timeout: 10000 });
              return;
            }
          } catch {}
        }
        
        // Try pressing Enter
        await passwordInput.press('Enter');
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        return;
      }
    } catch (e) {
      // Try next selector
    }
  }
}

/**
 * Load URL list from previous phase
 */
function loadUrlList(): string[] {
  const urlListPath = path.join(EXPORTS_DIR, 'url-list.json');
  
  if (!fs.existsSync(urlListPath)) {
    console.log('   ⚠️  url-list.json not found, running discovery...');
    return [];
  }
  
  const data = fs.readFileSync(urlListPath, 'utf8');
  const urlList = JSON.parse(data);
  return urlList.urls || [];
}

/**
 * Crawl a single page
 */
async function crawlPage(page: Page, url: string, index: number, total: number): Promise<PageMeta | null> {
  const slug = urlToSlug(url);
  
  console.log(`   [${index + 1}/${total}] ${url}`);
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1000); // Wait for dynamic content
    
    // Extract title
    const title = await page.title();
    
    // Get full HTML
    const html = await page.content();
    
    // Save HTML
    const htmlPath = path.join(HTML_DIR, `${slug}.html`);
    fs.writeFileSync(htmlPath, html, 'utf8');
    
    // Save metadata
    const meta: PageMeta = {
      url,
      slug,
      title,
      timestamp: new Date().toISOString(),
    };
    
    const metaPath = path.join(META_DIR, `${slug}.json`);
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8');
    
    return meta;
  } catch (error: any) {
    console.error(`      ❌ Error: ${error.message}`);
    return null;
  }
}

/**
 * Main crawl function
 */
async function crawl(): Promise<void> {
  console.log('🕷️  PHASE 2: Crawling pages and saving HTML snapshots...\n');
  
  // Ensure directories exist
  if (!fs.existsSync(HTML_DIR)) {
    fs.mkdirSync(HTML_DIR, { recursive: true });
  }
  if (!fs.existsSync(META_DIR)) {
    fs.mkdirSync(META_DIR, { recursive: true });
  }
  
  // Load URLs
  let urls = loadUrlList();
  
  if (urls.length === 0) {
    console.log('   🔍 No URLs found, running discovery...\n');
    urls = await discoverUrls();
  }
  
  if (urls.length === 0) {
    console.error('   ❌ No URLs to crawl');
    return;
  }
  
  console.log(`   📋 Found ${urls.length} URLs to crawl\n`);
  
  // Launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Handle password gate on first page
  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await handlePasswordGate(page);
    
    // Save auth state for reuse
    await context.storageState({ path: path.join(EXPORTS_DIR, 'auth-state.json') });
  } catch (error: any) {
    console.error(`   ⚠️  Error handling password gate: ${error.message}`);
  }
  
  // Crawl each URL
  const results: PageMeta[] = [];
  const rateLimitMs = 400; // 300-600ms as specified
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const meta = await crawlPage(page, url, i, urls.length);
    
    if (meta) {
      results.push(meta);
    }
    
    // Rate limit (except for last page)
    if (i < urls.length - 1) {
      await page.waitForTimeout(rateLimitMs);
    }
  }
  
  await browser.close();
  
  // Save crawl summary
  const summary = {
    total: urls.length,
    successful: results.length,
    failed: urls.length - results.length,
    timestamp: new Date().toISOString(),
  };
  
  const summaryPath = path.join(EXPORTS_DIR, 'crawl-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
  
  console.log(`\n✅ PHASE 2 Complete: Crawled ${results.length}/${urls.length} pages`);
  console.log(`   📄 HTML saved to: ${HTML_DIR}`);
  console.log(`   📊 Metadata saved to: ${META_DIR}`);
  console.log(`   📋 Summary saved to: ${summaryPath}\n`);
}

// Run if executed directly
if (require.main === module) {
  crawl()
    .then(() => {
      console.log('🎉 Crawl complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Crawl failed:', error);
      process.exit(1);
    });
}

export { crawl };

