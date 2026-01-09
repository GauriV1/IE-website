// PHASE 1: Discover URLs from Squarespace site
// Tries sitemap.xml first, then crawls from homepage

import { chromium, Browser, Page } from 'playwright';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import axios from 'axios';

const BASE_URL = 'https://cyan-tangerine-w282.squarespace.com';
const PASSWORD = 'division';
const EXPORTS_DIR = path.join(process.cwd(), 'migration', 'exports');

interface URLList {
  urls: string[];
  timestamp: string;
  source: 'sitemap' | 'crawl';
}

/**
 * Generate slug from URL
 */
function urlToSlug(url: string): string {
  try {
    const parsed = new URL(url);
    let slug = parsed.pathname
      .replace(/^\//, '')
      .replace(/\/$/, '')
      .replace(/\//g, '-')
      .toLowerCase();
    
    if (!slug) slug = 'home';
    return slug.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  } catch {
    return 'unknown';
  }
}

/**
 * Check if URL belongs to the site
 */
function isInternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === new URL(BASE_URL).hostname;
  } catch {
    return false;
  }
}

/**
 * Normalize URL (remove query params, fragments, trailing slashes)
 */
function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.search = '';
    parsed.hash = '';
    let pathname = parsed.pathname.replace(/\/$/, '') || '/';
    parsed.pathname = pathname;
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Try to fetch sitemap.xml
 */
async function trySitemap(): Promise<string[] | null> {
  console.log('📋 Trying to fetch sitemap.xml...');
  
  const sitemapUrls = [
    `${BASE_URL}/sitemap.xml`,
    `${BASE_URL}/sitemap-index.xml`,
  ];

  for (const sitemapUrl of sitemapUrls) {
    try {
      const response = await axios.get(sitemapUrl, {
        timeout: 10000,
        validateStatus: (status) => status < 500,
      });

      if (response.status === 200 && response.data) {
        console.log(`   ✅ Found sitemap at ${sitemapUrl}`);
        
        // Parse XML sitemap
        const urls: string[] = [];
        const urlMatches = response.data.match(/<loc>(.*?)<\/loc>/g);
        
        if (urlMatches) {
          for (const match of urlMatches) {
            const url = match.replace(/<\/?loc>/g, '').trim();
            if (url && isInternalUrl(url)) {
              urls.push(normalizeUrl(url));
            }
          }
        }

        if (urls.length > 0) {
          console.log(`   📄 Found ${urls.length} URLs in sitemap`);
          return [...new Set(urls)]; // Dedupe
        }
      }
    } catch (error: any) {
      console.log(`   ⚠️  Could not fetch ${sitemapUrl}: ${error.message}`);
    }
  }

  return null;
}

/**
 * Try to fetch robots.txt
 */
async function tryRobotsTxt(): Promise<string[] | null> {
  console.log('📋 Trying to fetch robots.txt...');
  
  try {
    const response = await axios.get(`${BASE_URL}/robots.txt`, {
      timeout: 10000,
      validateStatus: (status) => status < 500,
    });

    if (response.status === 200 && response.data) {
      const sitemapMatches = response.data.match(/Sitemap:\s*(.+)/gi);
      if (sitemapMatches) {
        for (const match of sitemapMatches) {
          const sitemapUrl = match.replace(/Sitemap:\s*/i, '').trim();
          console.log(`   📄 Found sitemap reference: ${sitemapUrl}`);
          const urls = await trySitemap();
          if (urls) return urls;
        }
      }
    }
  } catch (error: any) {
    console.log(`   ⚠️  Could not fetch robots.txt: ${error.message}`);
  }

  return null;
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
 * Discover URLs by crawling from homepage
 */
async function discoverByCrawl(page: Page): Promise<string[]> {
  console.log('🕷️  Crawling from homepage to discover URLs...');
  
  const urls = new Set<string>();
  
  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await handlePasswordGate(page);
    
    urls.add(normalizeUrl(BASE_URL));
    
    // Collect all links
    await page.waitForTimeout(2000);
    const links = await page.locator('a[href]').all();
    console.log(`   Found ${links.length} links on homepage`);
    
    for (const link of links) {
      try {
        const href = await link.getAttribute('href');
        if (!href) continue;
        
        // Resolve relative URLs
        let fullUrl: string;
        try {
          fullUrl = new URL(href, BASE_URL).toString();
        } catch {
          continue;
        }
        
        // Only include internal URLs
        if (isInternalUrl(fullUrl)) {
          const normalized = normalizeUrl(fullUrl);
          urls.add(normalized);
        }
      } catch (e) {
        // Skip invalid links
      }
    }
    
    console.log(`   ✅ Discovered ${urls.size} unique URLs`);
  } catch (error: any) {
    console.error(`   ❌ Error crawling homepage: ${error.message}`);
  }
  
  return Array.from(urls);
}

/**
 * Main discovery function
 */
async function discoverUrls(): Promise<string[]> {
  console.log('🔍 PHASE 1: Discovering URLs...\n');
  
  // Try sitemap first
  let urls = await trySitemap();
  let source: 'sitemap' | 'crawl' = 'sitemap';
  
  // Try robots.txt if sitemap failed
  if (!urls) {
    urls = await tryRobotsTxt();
  }
  
  // Fallback to crawling
  if (!urls || urls.length === 0) {
    console.log('   📋 No sitemap found, crawling from homepage...\n');
    source = 'crawl';
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      urls = await discoverByCrawl(page);
    } finally {
      await browser.close();
    }
  }
  
  // Ensure we have at least the homepage
  if (!urls || urls.length === 0) {
    console.log('   ⚠️  No URLs discovered, using homepage only');
    urls = [normalizeUrl(BASE_URL)];
  }
  
  // Save URL list
  if (!fs.existsSync(EXPORTS_DIR)) {
    fs.mkdirSync(EXPORTS_DIR, { recursive: true });
  }
  
  const urlList: URLList = {
    urls: urls.sort(),
    timestamp: new Date().toISOString(),
    source,
  };
  
  const outputPath = path.join(EXPORTS_DIR, 'url-list.json');
  fs.writeFileSync(outputPath, JSON.stringify(urlList, null, 2), 'utf8');
  
  console.log(`\n✅ PHASE 1 Complete: Discovered ${urls.length} URLs`);
  console.log(`   📄 Saved to: ${outputPath}`);
  console.log(`   📊 Source: ${source}\n`);
  
  return urls;
}

// Run if executed directly
if (require.main === module) {
  discoverUrls()
    .then((urls) => {
      console.log(`\n🎉 Discovery complete: ${urls.length} URLs found`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Discovery failed:', error);
      process.exit(1);
    });
}

export { discoverUrls, normalizeUrl, urlToSlug };

