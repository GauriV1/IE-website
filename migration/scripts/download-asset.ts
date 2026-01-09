// Asset downloader utility

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { URL } from 'url';

interface DownloadResult {
  success: boolean;
  localPath?: string;
  originalUrl: string;
  error?: string;
  size?: number;
}

/**
 * Download an asset from a URL and save it locally
 */
export async function downloadAsset(
  url: string,
  outputDir: string,
  basePath: string = '/assets'
): Promise<DownloadResult> {
  try {
    // Validate URL
    const parsedUrl = new URL(url);
    
    // Determine file type and extension
    const extension = getFileExtension(url, parsedUrl.pathname);
    const fileName = generateFileName(url, extension);
    const localPath = path.join(outputDir, fileName);
    
    // Skip if file already exists
    if (fs.existsSync(localPath)) {
      return {
        success: true,
        localPath: path.join(basePath, fileName),
        originalUrl: url,
        size: fs.statSync(localPath).size,
      };
    }
    
    // Download the file
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000, // 30 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ContentMigration/1.0)',
      },
    });
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write file
    fs.writeFileSync(localPath, Buffer.from(response.data));
    
    return {
      success: true,
      localPath: path.join(basePath, fileName),
      originalUrl: url,
      size: response.data.length,
    };
  } catch (error: any) {
    return {
      success: false,
      originalUrl: url,
      error: error.message || 'Unknown error',
    };
  }
}

/**
 * Get file extension from URL or path
 */
function getFileExtension(url: string, pathname: string): string {
  // Try to get extension from URL path
  const pathExt = path.extname(pathname).toLowerCase();
  if (pathExt && pathExt.length > 1) {
    return pathExt;
  }
  
  // Try to get from URL query params or hash
  const urlLower = url.toLowerCase();
  if (urlLower.includes('.jpg') || urlLower.includes('.jpeg')) return '.jpg';
  if (urlLower.includes('.png')) return '.png';
  if (urlLower.includes('.gif')) return '.gif';
  if (urlLower.includes('.webp')) return '.webp';
  if (urlLower.includes('.svg')) return '.svg';
  if (urlLower.includes('.pdf')) return '.pdf';
  if (urlLower.includes('.doc')) return '.doc';
  if (urlLower.includes('.docx')) return '.docx';
  if (urlLower.includes('.xls')) return '.xls';
  if (urlLower.includes('.xlsx')) return '.xlsx';
  
  // Default to .jpg for images, .pdf for others
  if (urlLower.includes('image') || urlLower.includes('img') || urlLower.includes('photo')) {
    return '.jpg';
  }
  
  return '.pdf';
}

/**
 * Generate a safe filename from URL
 */
function generateFileName(url: string, extension: string): string {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    
    // Extract filename from path
    let baseName = path.basename(pathname, path.extname(pathname));
    
    // If no filename in path, use domain + path hash
    if (!baseName || baseName === '/') {
      const hash = createHash(url);
      baseName = hash.substring(0, 16);
    }
    
    // Sanitize filename
    baseName = baseName
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
    
    // Limit length
    if (baseName.length > 50) {
      baseName = baseName.substring(0, 50);
    }
    
    return `${baseName}${extension}`;
  } catch {
    // Fallback: use hash of URL
    const hash = createHash(url);
    return `${hash.substring(0, 16)}${extension}`;
  }
}

/**
 * Create a simple hash from string
 */
function createHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Determine if URL is an image
 */
export function isImageUrl(url: string): boolean {
  const urlLower = url.toLowerCase();
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
  return imageExtensions.some(ext => urlLower.includes(ext)) || 
         urlLower.includes('image') || 
         urlLower.includes('img') ||
         urlLower.includes('photo');
}

/**
 * Determine if URL is a document/file
 */
export function isFileUrl(url: string): boolean {
  const urlLower = url.toLowerCase();
  const fileExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip'];
  return fileExtensions.some(ext => urlLower.includes(ext));
}

