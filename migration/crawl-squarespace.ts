// PHASE A & B: Crawl Squarespace site and extract content
// Uses Playwright to crawl the password-protected site

import { chromium, Browser, Page } from 'playwright';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

const BASE_URL = 'https://cyan-tangerine-w282.squarespace.com';
const PASSWORD = 'division';
const OUTPUT_DIR = path.join(process.cwd(), 'migration', 'raw');
const EXPORTS_DIR = path.join(process.cwd(), 'migration', 'exports');

interface CrawledPage {
  url: string;
  title: string;
  content: string;
  slug: string;
}

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
    // Skip mailto, tel, and other non-http URLs
    if (url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('#')) {
      return false;
    }
    const parsed = new URL(url);
    return parsed.hostname === 'cyan-tangerine-w282.squarespace.com' ||
           parsed.hostname === 'www.cyan-tangerine-w282.squarespace.com';
  } catch {
    return false;
  }
}

/**
 * Normalize URL
 */
function normalizeUrl(url: string, baseUrl: string = BASE_URL): string {
  if (url.startsWith('http')) {
    return url.split('#')[0].split('?')[0];
  }
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`.split('#')[0].split('?')[0];
  }
  return `${baseUrl}/${url}`.split('#')[0].split('?')[0];
}

/**
 * PHASE A: Discover all URLs
 */
async function discoverUrls(page: Page): Promise<string[]> {
  console.log('🔍 PHASE A: Discovering URLs...\n');
  
  const urls = new Set<string>();
  
  // Try sitemap first
  try {
    console.log('   Checking for sitemap.xml...');
    const sitemapResponse = await page.goto(`${BASE_URL}/sitemap.xml`, { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    if (sitemapResponse && sitemapResponse.ok()) {
      const sitemapText = await sitemapResponse.text();
      const urlMatches = sitemapText.match(/<loc>(.*?)<\/loc>/g);
      if (urlMatches && urlMatches.length > 0) {
        urlMatches.forEach(match => {
          const url = match.replace(/<\/?loc>/g, '');
          if (isInternalUrl(url)) {
            urls.add(normalizeUrl(url));
          }
        });
        if (urls.size > 0) {
          console.log(`   ✅ Found ${urls.size} URLs from sitemap.xml\n`);
          return Array.from(urls);
        }
      }
    }
  } catch (error) {
    console.log('   ⚠️  No sitemap.xml found, will crawl via links\n');
  }
  
  // Try sitemap-index
  try {
    console.log('   Checking for sitemap-index.xml...');
    const sitemapIndexResponse = await page.goto(`${BASE_URL}/sitemap-index.xml`, { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    if (sitemapIndexResponse && sitemapIndexResponse.ok()) {
      const sitemapIndexText = await sitemapIndexResponse.text();
      const sitemapMatches = sitemapIndexText.match(/<loc>(.*?)<\/loc>/g);
      if (sitemapMatches) {
        for (const match of sitemapMatches) {
          const sitemapUrl = match.replace(/<\/?loc>/g, '');
          try {
            const sitemapResponse = await page.goto(sitemapUrl, { 
              waitUntil: 'networkidle',
              timeout: 10000 
            });
            if (sitemapResponse && sitemapResponse.ok()) {
              const sitemapText = await sitemapResponse.text();
              const urlMatches = sitemapText.match(/<loc>(.*?)<\/loc>/g);
              if (urlMatches) {
                urlMatches.forEach(urlMatch => {
                  const url = urlMatch.replace(/<\/?loc>/g, '');
                  if (isInternalUrl(url)) {
                    urls.add(normalizeUrl(url));
                  }
                });
              }
            }
          } catch (e) {
            // Skip this sitemap
          }
        }
        console.log(`   ✅ Found ${urls.size} URLs from sitemap-index.xml\n`);
        return Array.from(urls);
      }
    }
  } catch (error) {
    console.log('   ⚠️  No sitemap-index.xml found\n');
  }
  
  // Crawl via links from homepage
  console.log('   Crawling homepage for links...');
  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  } catch (error) {
    console.log('   ⚠️  Initial load timeout, trying with longer timeout...');
    await page.goto(BASE_URL, { waitUntil: 'load', timeout: 90000 });
  }
  
  // Handle password gate if present - try multiple selectors
  await page.waitForTimeout(2000); // Wait for page to load
  
  const passwordSelectors = [
    'input[type="password"]',
    'input[name*="password" i]',
    'input[id*="password" i]',
    'input[placeholder*="password" i]',
    '.password-input input',
    '#password',
  ];
  
  let passwordEntered = false;
  for (const selector of passwordSelectors) {
    try {
      const passwordInput = await page.locator(selector).first();
      if (await passwordInput.isVisible({ timeout: 2000 })) {
        console.log('   🔐 Password gate detected, entering password...');
        await passwordInput.fill(PASSWORD);
        
        // Try to find submit button
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
              passwordEntered = true;
              break;
            }
          } catch {}
        }
        
        // If no button found, try pressing Enter
        if (!passwordEntered) {
          await passwordInput.press('Enter');
          await page.waitForLoadState('networkidle', { timeout: 10000 });
          passwordEntered = true;
        }
        break;
      }
    } catch (e) {
      // Try next selector
    }
  }
  
  if (!passwordEntered) {
    console.log('   ℹ️  No password gate detected, proceeding...');
  }
  
  urls.add(BASE_URL);
  
  // Collect all links - wait a bit for dynamic content
  await page.waitForTimeout(2000);
  const links = await page.locator('a[href]').all();
  console.log(`   Found ${links.length} links on homepage`);
  
  for (const link of links) {
    try {
      const href = await link.getAttribute('href');
      if (href && href.trim()) {
        const normalized = normalizeUrl(href);
        if (isInternalUrl(normalized)) {
          urls.add(normalized);
        }
      }
    } catch (e) {
      // Skip this link
    }
  }
  
  console.log(`   Collected ${urls.size} unique internal URLs from links`);
  
  // Recursively crawl discovered pages (limit depth)
  const toCrawl = Array.from(urls);
  const crawled = new Set<string>();
  const maxDepth = 3;
  
  for (let depth = 0; depth < maxDepth && toCrawl.length > 0; depth++) {
    const currentBatch = [...toCrawl];
    toCrawl.length = 0;
    
    for (const url of currentBatch) {
      if (crawled.has(url)) continue;
      crawled.add(url);
      
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
        const newLinks = await page.locator('a[href]').all();
        
        for (const link of newLinks) {
          const href = await link.getAttribute('href');
          if (href) {
            const normalized = normalizeUrl(href);
            if (isInternalUrl(normalized) && !urls.has(normalized)) {
              urls.add(normalized);
              toCrawl.push(normalized);
            }
          }
        }
        
        // Small delay
        await page.waitForTimeout(300);
      } catch (error) {
        console.log(`   ⚠️  Failed to crawl ${url}`);
      }
    }
  }
  
  console.log(`   ✅ Found ${urls.size} URLs via link crawling\n`);
  return Array.from(urls);
}

/**
 * PHASE B: Crawl pages and extract content
 */
async function crawlPages(browser: Browser, urls: string[]): Promise<CrawledPage[]> {
  console.log('🕷️  PHASE B: Crawling pages and extracting content...\n');
  
  const pages: CrawledPage[] = [];
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Handle password gate on first page
  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  } catch (error) {
    await page.goto(BASE_URL, { waitUntil: 'load', timeout: 90000 });
  }
  await page.waitForTimeout(3000);
  
  const passwordSelectors = [
    'input[type="password"]',
    'input[name*="password" i]',
    'input[id*="password" i]',
  ];
  
  for (const selector of passwordSelectors) {
    try {
      const passwordInput = await page.locator(selector).first();
      if (await passwordInput.isVisible({ timeout: 2000 })) {
        console.log('   🔐 Entering password...');
        await passwordInput.fill(PASSWORD);
        
        const submitSelectors = [
          'button[type="submit"]',
          'input[type="submit"]',
          'button:has-text("Submit")',
          'form button',
        ];
        
        for (const submitSelector of submitSelectors) {
          try {
            const submitButton = await page.locator(submitSelector).first();
            if (await submitButton.isVisible({ timeout: 1000 })) {
              await submitButton.click();
              await page.waitForLoadState('networkidle', { timeout: 10000 });
              // Save cookies for subsequent requests
              await context.storageState({ path: path.join(EXPORTS_DIR, 'auth-state.json') });
              break;
            }
          } catch {}
        }
        break;
      }
    } catch (e) {
      // Try next selector
    }
  }
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const slug = urlToSlug(url);
    
    console.log(`   [${i + 1}/${urls.length}] Crawling: ${url}`);
    
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      
      // Wait a bit for dynamic content
      await page.waitForTimeout(500);
      
      // Extract title
      const title = await page.title();
      
      // Extract main content - try common content selectors
      let content = '';
      const contentSelectors = [
        'main',
        '[role="main"]',
        '.main-content',
        '.content',
        'article',
        '.page-content',
        '#main-content',
        '.sqs-block-content',
      ];
      
      for (const selector of contentSelectors) {
        const element = await page.locator(selector).first();
        if (await element.isVisible()) {
          content = await element.innerHTML();
          break;
        }
      }
      
      // Fallback: get body content but exclude header/nav/footer
      if (!content) {
        const body = await page.locator('body');
        const header = await page.locator('header, .header, nav, .nav').first();
        const footer = await page.locator('footer, .footer').first();
        
        let bodyHtml = await body.innerHTML();
        if (await header.isVisible()) {
          const headerHtml = await header.innerHTML();
          bodyHtml = bodyHtml.replace(headerHtml, '');
        }
        if (await footer.isVisible()) {
          const footerHtml = await footer.innerHTML();
          bodyHtml = bodyHtml.replace(footerHtml, '');
        }
        content = bodyHtml;
      }
      
      // Save raw HTML
      const htmlPath = path.join(OUTPUT_DIR, `${slug}.html`);
      fs.writeFileSync(htmlPath, content, 'utf8');
      
      pages.push({
        url,
        title,
        content,
        slug,
      });
      
      // Politeness delay
      await page.waitForTimeout(400);
      
    } catch (error: any) {
      console.log(`   ❌ Error crawling ${url}: ${error.message}`);
    }
  }
  
  await context.close();
  console.log(`\n✅ Crawled ${pages.length} pages\n`);
  return pages;
}

/**
 * Main crawl function
 */
async function main() {
  console.log('🚀 Starting Squarespace crawl migration...\n');
  
  // Ensure directories exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(EXPORTS_DIR)) {
    fs.mkdirSync(EXPORTS_DIR, { recursive: true });
  }
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // PHASE A: Discover URLs
    const urls = await discoverUrls(page);
    
    // Save URL list
    const urlList: URLList = {
      urls,
      timestamp: new Date().toISOString(),
      source: urls.length > 10 ? 'sitemap' : 'crawl',
    };
    fs.writeFileSync(
      path.join(EXPORTS_DIR, 'url-list.json'),
      JSON.stringify(urlList, null, 2),
      'utf8'
    );
    console.log(`📋 Saved ${urls.length} URLs to migration/exports/url-list.json\n`);
    
    // PHASE B: Crawl pages
    const crawledPages = await crawlPages(browser, urls);
    
    // Save crawled pages metadata
    fs.writeFileSync(
      path.join(EXPORTS_DIR, 'crawled-pages.json'),
      JSON.stringify(crawledPages.map(p => ({ url: p.url, title: p.title, slug: p.slug })), null, 2),
      'utf8'
    );
    
    console.log(`\n✅ Crawl complete!`);
    console.log(`   URLs discovered: ${urls.length}`);
    console.log(`   Pages crawled: ${crawledPages.length}`);
    console.log(`   Raw HTML saved to: migration/raw/\n`);
    
  } catch (error: any) {
    console.error('❌ Crawl failed:', error.message);
    process.exit(1);
  } finally {
    await context.close();
    await browser.close();
  }
}

main();

