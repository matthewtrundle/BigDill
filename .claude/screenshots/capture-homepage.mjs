import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function captureScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const baseUrl = 'http://localhost:3007';
  const timestamp = Date.now();

  console.log('Navigating to homepage...');
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  // Wait a moment for any animations
  await page.waitForTimeout(1000);

  // Capture hero section
  console.log('Capturing hero section...');
  await page.screenshot({
    path: join(__dirname, `hero-section-${timestamp}.png`),
    fullPage: false
  });

  // Scroll to features section
  console.log('Scrolling to features section...');
  await page.evaluate(() => {
    const featuresSection = document.querySelector('.bg-green-50');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: join(__dirname, `features-section-${timestamp}.png`),
    fullPage: false
  });

  // Scroll to size guide section
  console.log('Scrolling to size guide section...');
  await page.evaluate(() => {
    const sizeGuide = Array.from(document.querySelectorAll('h2')).find(
      el => el.textContent.includes('Size Guide')
    );
    if (sizeGuide) {
      sizeGuide.scrollIntoView({ behavior: 'smooth' });
    }
  });
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: join(__dirname, `size-guide-section-${timestamp}.png`),
    fullPage: false
  });

  // Scroll to final CTA section
  console.log('Scrolling to final CTA section...');
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: join(__dirname, `final-cta-section-${timestamp}.png`),
    fullPage: false
  });

  // Full page screenshot
  console.log('Capturing full page screenshot...');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(500);

  await page.screenshot({
    path: join(__dirname, `homepage-fullpage-${timestamp}.png`),
    fullPage: true
  });

  // Get console logs
  console.log('\nConsole messages captured during session:');

  await browser.close();
  console.log('\nScreenshots saved to:', __dirname);
  console.log('Timestamp:', timestamp);
}

captureScreenshots().catch(console.error);
