import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function captureScrollProgression() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const baseUrl = 'http://localhost:3007';
  const timestamp = Date.now();

  console.log('Navigating to homepage...');
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Scroll through the page and capture at intervals
  const scrollPositions = [
    { name: 'top', scroll: 0 },
    { name: 'features-start', scroll: 1200 },
    { name: 'features-middle', scroll: 1600 },
    { name: 'size-guide', scroll: 2800 },
    { name: 'cta-start', scroll: 3600 },
    { name: 'cta-middle', scroll: 3900 },
  ];

  for (const pos of scrollPositions) {
    console.log(`Scrolling to ${pos.name} (${pos.scroll}px)...`);
    await page.evaluate((scrollY) => {
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    }, pos.scroll);
    await page.waitForTimeout(500);

    await page.screenshot({
      path: join(__dirname, `scroll-${pos.name}-${timestamp}.png`),
      fullPage: false
    });
  }

  await browser.close();
  console.log('\nScroll progression screenshots saved to:', __dirname);
}

captureScrollProgression().catch(console.error);
