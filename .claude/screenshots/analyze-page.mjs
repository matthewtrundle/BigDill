import { chromium } from 'playwright';

async function analyzePage() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const consoleLogs = [];
  const networkRequests = [];
  const errors = [];

  // Capture console messages
  page.on('console', msg => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });

  // Capture network requests
  page.on('request', request => {
    networkRequests.push({
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType()
    });
  });

  page.on('response', response => {
    const request = networkRequests.find(r => r.url === response.url());
    if (request) {
      request.status = response.status();
      request.timing = response.request().timing();
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    errors.push({
      message: error.message,
      stack: error.stack
    });
  });

  const baseUrl = 'http://localhost:3007';

  console.log('=== PAGE ANALYSIS REPORT ===\n');
  console.log('Navigating to:', baseUrl);

  const startTime = Date.now();
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  const loadTime = Date.now() - startTime;

  console.log('Page loaded in:', loadTime, 'ms\n');

  // Analyze page structure
  const pageStructure = await page.evaluate(() => {
    const heroSection = document.querySelector('[class*="hero"]') ||
                       document.querySelector('section:first-of-type');
    const featuresSection = document.querySelector('.bg-green-50');
    const sizeGuideSection = Array.from(document.querySelectorAll('h2')).find(
      el => el.textContent.includes('Size Guide')
    )?.parentElement;

    const ctaSection = Array.from(document.querySelectorAll('section')).slice(-1)[0];

    return {
      hero: {
        found: !!heroSection,
        text: heroSection?.textContent.substring(0, 200),
        hasBackgroundImage: window.getComputedStyle(heroSection).backgroundImage !== 'none',
        backgroundColor: window.getComputedStyle(heroSection).backgroundColor,
      },
      features: {
        found: !!featuresSection,
        hasBackgroundImage: featuresSection ?
          window.getComputedStyle(featuresSection).backgroundImage !== 'none' : false,
        backgroundColor: featuresSection ?
          window.getComputedStyle(featuresSection).backgroundColor : null,
      },
      sizeGuide: {
        found: !!sizeGuideSection,
        hasBackgroundImage: sizeGuideSection ?
          window.getComputedStyle(sizeGuideSection).backgroundImage !== 'none' : false,
        backgroundColor: sizeGuideSection ?
          window.getComputedStyle(sizeGuideSection).backgroundColor : null,
      },
      cta: {
        found: !!ctaSection,
        hasBackgroundImage: ctaSection ?
          window.getComputedStyle(ctaSection).backgroundImage !== 'none' : false,
        backgroundColor: ctaSection ?
          window.getComputedStyle(ctaSection).backgroundColor : null,
      }
    };
  });

  console.log('=== PAGE STRUCTURE ===');
  console.log(JSON.stringify(pageStructure, null, 2));
  console.log('\n');

  console.log('=== CONSOLE MESSAGES ===');
  if (consoleLogs.length === 0) {
    console.log('No console messages');
  } else {
    consoleLogs.forEach(log => {
      console.log(`[${log.type}]`, log.text);
      if (log.location) {
        console.log(`  at ${log.location.url}:${log.location.lineNumber}:${log.location.columnNumber}`);
      }
    });
  }
  console.log('\n');

  console.log('=== PAGE ERRORS ===');
  if (errors.length === 0) {
    console.log('No JavaScript errors');
  } else {
    errors.forEach(error => {
      console.log('Error:', error.message);
      console.log(error.stack);
    });
  }
  console.log('\n');

  console.log('=== NETWORK PERFORMANCE ===');
  const failedRequests = networkRequests.filter(r => r.status >= 400);
  const slowRequests = networkRequests.filter(r => r.timing && r.timing.responseEnd > 1000);

  console.log('Total requests:', networkRequests.length);
  console.log('Failed requests:', failedRequests.length);
  if (failedRequests.length > 0) {
    failedRequests.forEach(req => {
      console.log(`  [${req.status}] ${req.url}`);
    });
  }
  console.log('Slow requests (>1s):', slowRequests.length);
  if (slowRequests.length > 0) {
    slowRequests.forEach(req => {
      console.log(`  [${req.timing.responseEnd}ms] ${req.url}`);
    });
  }
  console.log('\n');

  console.log('=== TEXT READABILITY CHECK ===');
  const textElements = await page.evaluate(() => {
    const heroTitle = document.querySelector('h1');
    const heroComputed = heroTitle ? window.getComputedStyle(heroTitle) : null;

    return {
      heroTitle: heroTitle ? {
        text: heroTitle.textContent.substring(0, 50),
        color: heroComputed.color,
        textShadow: heroComputed.textShadow,
        fontSize: heroComputed.fontSize,
        fontWeight: heroComputed.fontWeight,
      } : null
    };
  });

  console.log('Hero Title Styling:');
  console.log(JSON.stringify(textElements, null, 2));
  console.log('\n');

  await browser.close();
}

analyzePage().catch(console.error);
