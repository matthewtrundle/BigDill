import { chromium } from 'playwright';

async function detailedAnalysis() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const baseUrl = 'http://localhost:3007';
  console.log('=== DETAILED VISUAL ANALYSIS REPORT ===\n');
  console.log('Navigating to:', baseUrl);

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  console.log('\n=== HERO SECTION ANALYSIS ===');

  // Check hero text styling
  const heroAnalysis = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const champText = h1.querySelector('span');
    const subtitle = document.querySelector('p.font-heading');

    const h1Style = window.getComputedStyle(h1);
    const champStyle = window.getComputedStyle(champText);
    const subtitleStyle = window.getComputedStyle(subtitle);

    // Check for background images
    const section = document.querySelector('section');
    const bgImage = section.querySelector('div.absolute.inset-0 > div');
    const hasBgImage = bgImage && bgImage.querySelector('img');

    return {
      h1Text: h1.textContent.trim(),
      h1Styling: {
        color: h1Style.color,
        textShadow: h1Style.textShadow,
        filter: h1Style.filter,
        fontSize: h1Style.fontSize,
        fontWeight: h1Style.fontWeight,
      },
      championText: {
        color: champStyle.color,
        textShadow: champStyle.textShadow,
        filter: champStyle.filter,
      },
      subtitle: {
        text: subtitle.textContent.substring(0, 100),
        color: subtitleStyle.color,
        textShadow: subtitleStyle.textShadow,
      },
      backgroundImage: {
        present: !!hasBgImage,
        imageElement: hasBgImage ? 'Found' : 'Not found',
      }
    };
  });

  console.log('Hero Title:', heroAnalysis.h1Text);
  console.log('Title Color:', heroAnalysis.h1Styling.color);
  console.log('Title Text Shadow:', heroAnalysis.h1Styling.textShadow);
  console.log('Title Filter:', heroAnalysis.h1Styling.filter);
  console.log('\nChampion Text Color:', heroAnalysis.championText.color);
  console.log('Champion Text Shadow:', heroAnalysis.championText.textShadow);
  console.log('\nSubtitle Color:', heroAnalysis.subtitle.color);
  console.log('Subtitle Text Shadow:', heroAnalysis.subtitle.textShadow);
  console.log('\nBackground Image Present:', heroAnalysis.backgroundImage.present);

  console.log('\n=== FEATURES SECTION (WHY BIG DILL) ANALYSIS ===');

  // Scroll to features section
  await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('h2')).find(
      el => el.textContent.includes('WHY BIG DILL')
    )?.closest('section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  });
  await page.waitForTimeout(1000);

  const featuresAnalysis = await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('h2')).find(
      el => el.textContent.includes('WHY BIG DILL')
    )?.closest('section');

    if (!section) return { found: false };

    const bgDiv = section.querySelector('div[style*="backgroundImage"]');
    const overlayDiv = section.querySelector('.bg-cream-200\\/85');
    const sectionStyle = window.getComputedStyle(section);

    return {
      found: true,
      hasParallaxBg: !!bgDiv,
      backgroundStyle: bgDiv ? bgDiv.style.cssText : null,
      hasOverlay: !!overlayDiv,
      overlayClass: overlayDiv ? overlayDiv.className : null,
      backgroundColor: sectionStyle.backgroundColor,
    };
  });

  console.log('Features Section Found:', featuresAnalysis.found);
  console.log('Parallax Background Present:', featuresAnalysis.hasParallaxBg);
  console.log('Background Style:', featuresAnalysis.backgroundStyle);
  console.log('Has Overlay:', featuresAnalysis.hasOverlay);
  console.log('Overlay Classes:', featuresAnalysis.overlayClass);

  console.log('\n=== SIZE GUIDE SECTION ANALYSIS ===');

  // Scroll to size guide
  await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('h2')).find(
      el => el.textContent.includes('FIND YOUR PERFECT FIT')
    )?.closest('section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  });
  await page.waitForTimeout(1000);

  const sizeGuideAnalysis = await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('h2')).find(
      el => el.textContent.includes('FIND YOUR PERFECT FIT')
    )?.closest('section');

    if (!section) return { found: false };

    const bgDiv = section.querySelector('div[style*="backgroundImage"]');
    const overlayDiv = section.querySelector('.bg-white\\/95');

    return {
      found: true,
      hasBackgroundImage: !!bgDiv,
      backgroundStyle: bgDiv ? bgDiv.style.cssText : null,
      hasOverlay: !!overlayDiv,
      overlayClass: overlayDiv ? overlayDiv.className : null,
    };
  });

  console.log('Size Guide Section Found:', sizeGuideAnalysis.found);
  console.log('Background Image Present:', sizeGuideAnalysis.hasBackgroundImage);
  console.log('Background Style:', sizeGuideAnalysis.backgroundStyle);
  console.log('Has Overlay:', sizeGuideAnalysis.hasOverlay);

  console.log('\n=== FINAL CTA SECTION ANALYSIS ===');

  // Scroll to CTA
  await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('h2')).find(
      el => el.textContent.includes('READY TO CROWN')
    )?.closest('section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  });
  await page.waitForTimeout(1000);

  const ctaAnalysis = await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('h2')).find(
      el => el.textContent.includes('READY TO CROWN')
    )?.closest('section');

    if (!section) return { found: false };

    const bgDiv = section.querySelector('div[style*="backgroundImage"]');
    const goldOverlay = section.querySelector('.bg-gradient-to-r');
    const h2 = section.querySelector('h2');
    const h2Style = window.getComputedStyle(h2);
    const p = section.querySelector('p');
    const pStyle = window.getComputedStyle(p);

    return {
      found: true,
      hasParallaxBg: !!bgDiv,
      backgroundStyle: bgDiv ? bgDiv.style.cssText : null,
      hasGoldGradient: !!goldOverlay,
      goldGradientClass: goldOverlay ? goldOverlay.className : null,
      headingColor: h2Style.color,
      textColor: pStyle.color,
    };
  });

  console.log('Final CTA Section Found:', ctaAnalysis.found);
  console.log('Parallax Background Present:', ctaAnalysis.hasParallaxBg);
  console.log('Background Style:', ctaAnalysis.backgroundStyle);
  console.log('Gold Gradient Present:', ctaAnalysis.hasGoldGradient);
  console.log('Heading Text Color:', ctaAnalysis.headingColor);
  console.log('Body Text Color:', ctaAnalysis.textColor);

  console.log('\n=== PARALLAX EFFECT CHECK ===');

  // Check if bg-fixed class is applied
  const parallaxCheck = await page.evaluate(() => {
    const parallaxSections = Array.from(document.querySelectorAll('[class*="bg-fixed"]'));
    return {
      count: parallaxSections.length,
      sections: parallaxSections.map(s => {
        const heading = s.closest('section')?.querySelector('h2')?.textContent || 'Unknown';
        return {
          heading,
          hasBackgroundAttachmentFixed: window.getComputedStyle(s).backgroundAttachment === 'fixed',
        };
      }),
    };
  });

  console.log('Parallax Sections Found:', parallaxCheck.count);
  parallaxCheck.sections.forEach((section, i) => {
    console.log(`Section ${i + 1}:`, section.heading);
    console.log('  Background Attachment Fixed:', section.hasBackgroundAttachmentFixed);
  });

  console.log('\n=== TEXT CONTRAST & READABILITY ===');

  // Check color contrast ratios
  const contrastCheck = await page.evaluate(() => {
    function getLuminance(rgb) {
      const [r, g, b] = rgb.match(/\d+/g).map(Number);
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    function getContrast(rgb1, rgb2) {
      const l1 = getLuminance(rgb1);
      const l2 = getLuminance(rgb2);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    const h1 = document.querySelector('h1');
    const h1Style = window.getComputedStyle(h1);

    // Get background color behind h1 (approximate)
    const section = h1.closest('section');
    const sectionStyle = window.getComputedStyle(section);

    return {
      heroTitleColor: h1Style.color,
      heroBackgroundApprox: 'rgb(100, 100, 100)', // Approximation due to overlay
      hasTextShadow: h1Style.textShadow !== 'none',
      textShadow: h1Style.textShadow,
    };
  });

  console.log('Hero Title Color:', contrastCheck.heroTitleColor);
  console.log('Has Text Shadow:', contrastCheck.hasTextShadow);
  console.log('Text Shadow Value:', contrastCheck.textShadow);

  await browser.close();
  console.log('\n=== END OF DETAILED ANALYSIS ===');
}

detailedAnalysis().catch(console.error);
