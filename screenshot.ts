/**
 * Screenshot utility for Grandeur website
 * Usage: npx tsx screenshot.ts [url] [filename]
 *   url      - Page URL (default: http://localhost:5173/)
 *   filename - Output filename (default: screenshot-{timestamp}.png)
 *
 * Examples:
 *   npx tsx screenshot.ts                          # Homepage
 *   npx tsx screenshot.ts /#services services     # Services section
 *   npx tsx screenshot.ts http://localhost:5173/#contact contact-form
 */

import { chromium } from 'playwright';

const URL = process.argv[2] || 'http://localhost:5173/';
const filename = process.argv[3]
  ? `${process.argv[3]}.png`
  : `screenshot-${Date.now()}.png`;

// Parse URL to handle hash-only paths
const fullUrl = URL.startsWith('http')
  ? URL
  : `http://localhost:5173${URL}`;

console.log(`\n📸 Capturing: ${fullUrl}`);
console.log(`💾 Output: ${filename}\n`);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 }
});

try {
  // Wait for network to be idle
  await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });

  // Wait for any animations/transitions to settle
  await page.waitForTimeout(1500);

  await page.screenshot({
    path: filename,
    fullPage: false,
    type: 'png'
  });

  console.log(`✅ Screenshot saved: ${filename}`);
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
} finally {
  await browser.close();
}
