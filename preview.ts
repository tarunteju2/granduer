/**
 * Live site preview - captures key sections of the Grandeur website
 * Run: npx tsx preview.ts
 */

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';

const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = '/Users/tarun/Desktop/projects/grandeur/website/preview';

mkdirSync(OUTPUT_DIR, { recursive: true });

async function capture() {
  console.log('🔍 Starting Grandeur website preview...\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const screenshots: { name: string; path: string }[] = [];

  try {
    // Full homepage
    console.log('📸 Capturing homepage...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: `${OUTPUT_DIR}/01-homepage.png`,
      fullPage: true
    });
    screenshots.push({ name: 'Homepage', path: `${OUTPUT_DIR}/01-homepage.png` });

    // Scroll to sections and capture
    const sections = [
      { id: '#services', name: '02-services' },
      { id: '#process', name: '03-process' },
      { id: '#gallery', name: '04-gallery' },
      { id: '#request-staff', name: '05-staff-request' },
      { id: '#contact', name: '06-contact' },
    ];

    for (const section of sections) {
      console.log(`📸 Capturing ${section.name}...`);
      await page.goto(`${BASE_URL}/${section.id}`, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: `${OUTPUT_DIR}/${section.name}.png`,
        fullPage: false
      });
      screenshots.push({ name: section.name, path: `${OUTPUT_DIR}/${section.name}.png` });
    }

    // Mobile view
    console.log('📸 Capturing mobile view...');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    await page.screenshot({
      path: `${OUTPUT_DIR}/07-mobile-homepage.png`,
      fullPage: true
    });
    screenshots.push({ name: 'Mobile Homepage', path: `${OUTPUT_DIR}/07-mobile-homepage.png` });

  } catch (error) {
    console.error(`❌ Error: ${error}`);
  } finally {
    await browser.close();
  }

  // Summary
  console.log('\n✅ Captures saved to:', OUTPUT_DIR);
  console.log('\n📁 Files:');
  screenshots.forEach(s => console.log(`   ${s.path}`));
}

capture();
