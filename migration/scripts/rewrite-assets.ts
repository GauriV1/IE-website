// Rewrite asset URLs in markdown content to use local paths

interface AssetMapping {
  originalUrl: string;
  localPath: string;
}

/**
 * Rewrite asset URLs in markdown content
 */
export function rewriteAssetUrls(
  markdown: string,
  mappings: AssetMapping[]
): string {
  let rewritten = markdown;
  
  // Create a map for quick lookup
  const urlMap = new Map<string, string>();
  for (const mapping of mappings) {
    urlMap.set(mapping.originalUrl, mapping.localPath);
    // Also map normalized URLs (without query params)
    try {
      const url = new URL(mapping.originalUrl);
      url.search = '';
      url.hash = '';
      urlMap.set(url.toString(), mapping.localPath);
    } catch {
      // Ignore invalid URLs
    }
  }
  
  // Rewrite markdown images: ![alt](url)
  rewritten = rewritten.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, url) => {
      const localPath = findLocalPath(url, urlMap);
      if (localPath) {
        return `![${alt}](${localPath})`;
      }
      return match;
    }
  );
  
  // Rewrite markdown links that are assets: [text](url)
  rewritten = rewritten.replace(
    /\[([^\]]*)\]\(([^)]+)\)/g,
    (match, text, url) => {
      // Only rewrite if it's an asset URL
      if (isAssetUrl(url) && !url.startsWith('#')) {
        const localPath = findLocalPath(url, urlMap);
        if (localPath) {
          return `[${text}](${localPath})`;
        }
      }
      return match;
    }
  );
  
  // Rewrite HTML img tags: <img src="url" ...>
  rewritten = rewritten.replace(
    /<img([^>]+)src=["']([^"']+)["']([^>]*)>/gi,
    (match, before, url, after) => {
      const localPath = findLocalPath(url, urlMap);
      if (localPath) {
        return `<img${before}src="${localPath}"${after}>`;
      }
      return match;
    }
  );
  
  // Rewrite HTML a tags with asset links: <a href="url">...</a>
  rewritten = rewritten.replace(
    /<a([^>]+)href=["']([^"']+)["']([^>]*)>/gi,
    (match, before, url, after) => {
      if (isAssetUrl(url) && !url.startsWith('#')) {
        const localPath = findLocalPath(url, urlMap);
        if (localPath) {
          return `<a${before}href="${localPath}"${after}>`;
        }
      }
      return match;
    }
  );
  
  return rewritten;
}

/**
 * Find local path for a URL
 */
function findLocalPath(url: string, urlMap: Map<string, string>): string | null {
  // Try exact match first
  if (urlMap.has(url)) {
    return urlMap.get(url)!;
  }
  
  // Try normalized URL (without query params)
  try {
    const normalized = new URL(url);
    normalized.search = '';
    normalized.hash = '';
    if (urlMap.has(normalized.toString())) {
      return urlMap.get(normalized.toString())!;
    }
  } catch {
    // Invalid URL, skip
  }
  
  return null;
}

/**
 * Check if URL is an asset
 */
function isAssetUrl(url: string): boolean {
  if (url.startsWith('#') || url.startsWith('data:') || url.startsWith('mailto:')) {
    return false;
  }
  
  const urlLower = url.toLowerCase();
  const assetExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    '.zip', '.rar', '.tar', '.gz', '.csv', '.txt',
  ];
  
  return assetExtensions.some(ext => urlLower.includes(ext)) ||
         urlLower.includes('image') || urlLower.includes('img') ||
         urlLower.includes('photo') || urlLower.includes('picture');
}

