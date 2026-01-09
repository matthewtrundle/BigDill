import { chromium } from 'playwright';

async function inspectDOM() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  await page.goto('http://localhost:3007', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  console.log('=== DOM STRUCTURE INSPECTION ===\n');

  // Check hero section structure
  const heroStructure = await page.evaluate(() => {
    const section = document.querySelector('section');
    const children = Array.from(section.children).map(child => ({
      tag: child.tagName,
      classes: child.className,
      hasImage: !!child.querySelector('img'),
      style: child.getAttribute('style'),
    }));

    return {
      sectionClasses: section.className,
      children,
    };
  });

  console.log('=== HERO SECTION STRUCTURE ===');
  console.log(JSON.stringify(heroStructure, null, 2));

  // Check Features section (Why Big Dill)
  await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('h2')).find(
      el => el.textContent.includes('WHY BIG DILL')
    )?.closest('section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  });
  await page.waitForTimeout(1000);

  const featuresStructure = await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('h2')).find(
      el => el.textContent.includes('WHY BIG DILL')
    )?.closest('section');

    if (!section) return { found: false };

    const children = Array.from(section.children).slice(0, 5).map(child => ({
      tag: child.tagName,
      classes: child.className,
      style: child.getAttribute('style'),
      hasStyleWithBgImage: child.getAttribute('style')?.includes('backgroundImage'),
    }));

    return {
      found: true,
      sectionClasses: section.className,
      children,
    };
  });

  console.log('\n=== FEATURES SECTION (WHY BIG DILL) STRUCTURE ===');
  console.log(JSON.stringify(featuresStructure, null, 2));

  // Check Size Guide section
  await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('h2')).find(
      el => el.textContent.includes('FIND YOUR PERFECT FIT')
    )?.closest('section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  });
  await page.waitForTimeout(1000);

  const sizeGuideStructure = await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('h2')).find(
      el => el.textContent.includes('FIND YOUR PERFECT FIT')
    )?.closest('section');

    if (!section) return { found: false };

    const children = Array.from(section.children).slice(0, 5).map(child => ({
      tag: child.tagName,
      classes: child.className,
      style: child.getAttribute('style'),
      hasStyleWithBgImage: child.getAttribute('style')?.includes('backgroundImage'),
    }));

    return {
      found: true,
      sectionClasses: section.className,
      children,
    };
  });

  console.log('\n=== SIZE GUIDE SECTION STRUCTURE ===');
  console.log(JSON.stringify(sizeGuideStructure, null, 2));

  // Check Final CTA section
  await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('h2')).find(
      el => el.textContent.includes('READY TO CROWN')
    )?.closest('section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  });
  await page.waitForTimeout(1000);

  const ctaStructure = await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('h2')).find(
      el => el.textContent.includes('READY TO CROWN')
    )?.closest('section');

    if (!section) return { found: false };

    const children = Array.from(section.children).slice(0, 8).map(child => ({
      tag: child.tagName,
      classes: child.className,
      style: child.getAttribute('style'),
      hasStyleWithBgImage: child.getAttribute('style')?.includes('backgroundImage'),
    }));

    return {
      found: true,
      sectionClasses: section.className,
      children,
    };
  });

  console.log('\n=== FINAL CTA SECTION STRUCTURE ===');
  console.log(JSON.stringify(ctaStructure, null, 2));

  // Check for drop-shadow filter on text
  const textFilters = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const h1Style = window.getComputedStyle(h1);
    const champSpan = h1.querySelector('span');
    const champStyle = window.getComputedStyle(champSpan);
    const subtitle = document.querySelector('p.font-heading');
    const subtitleStyle = window.getComputedStyle(subtitle);

    return {
      h1: {
        filter: h1Style.filter,
        webkitFilter: h1Style.webkitFilter,
        textShadow: h1Style.textShadow,
      },
      champion: {
        filter: champStyle.filter,
        webkitFilter: champStyle.webkitFilter,
        textShadow: champStyle.textShadow,
      },
      subtitle: {
        filter: subtitleStyle.filter,
        webkitFilter: subtitleStyle.webkitFilter,
        textShadow: subtitleStyle.textShadow,
      },
    };
  });

  console.log('\n=== TEXT FILTER/SHADOW DETAILS ===');
  console.log(JSON.stringify(textFilters, null, 2));

  await browser.close();
}

inspectDOM().catch(console.error);
