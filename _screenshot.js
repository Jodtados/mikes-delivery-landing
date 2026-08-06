const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const filePath = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');

  // 1. Mobile full page
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await mobile.goto(filePath, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await mobile.waitForTimeout(3000);
  await mobile.screenshot({ path: 'bugs/mobile_full.png', fullPage: true });

  // 2. Mobile hamburger open
  await mobile.click('#hamburger');
  await mobile.waitForTimeout(500);
  await mobile.screenshot({ path: 'bugs/mobile_menu.png' });

  // 3. Close menu, scroll to form, trigger errors
  await mobile.click('#mobileBackdrop', { force: true });
  await mobile.waitForTimeout(500);
  await mobile.evaluate(() => window.scrollTo(0, document.getElementById('apply').offsetTop - 100));
  await mobile.waitForTimeout(500);
  await mobile.fill('#email', 'invalidemail');
  await mobile.fill('#phone', '12');
  await mobile.evaluate(() => document.getElementById('phone').dispatchEvent(new Event('input')));
  await mobile.click('#submitBtn', { force: true });
  await mobile.waitForTimeout(800);
  await mobile.screenshot({ path: 'bugs/mobile_form_errors.png' });

  await browser.close();
  console.log('All screenshots saved');
})();
