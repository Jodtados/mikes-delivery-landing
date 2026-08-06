const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const filePath = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
const results = [];

const viewports = [
  { name: 'small_phone', width: 320, height: 568 },
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'desktop', width: 1920, height: 1080 },
];

(async () => {
  const browser = await chromium.launch();
  const dir = 'bugs/test_' + Date.now();
  fs.mkdirSync(dir, { recursive: true });

  // ===== MOBILE TESTS (phone viewport) =====
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(filePath, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await mobile.waitForTimeout(3000);

  // Full page screenshot
  await mobile.screenshot({ path: `${dir}/mobile_full.png`, fullPage: true });
  results.push('OK: Mobile full page');

  // Hamburger open/close
  await mobile.click('#hamburger');
  await mobile.waitForTimeout(500);
  await mobile.screenshot({ path: `${dir}/mobile_menu.png` });
  const menuVisible = await mobile.isVisible('#mobileMenu.active');
  results.push(menuVisible ? 'OK: Hamburger opens' : 'FAIL: Hamburger does not open');

  // Menu links work (click Requirements, check scroll)
  await mobile.click('#mobileMenu a[href="#requirements"]');
  await mobile.waitForTimeout(500);
  const scrolledToReq = await mobile.evaluate(() => {
    const el = document.getElementById('requirements');
    return el && el.getBoundingClientRect().top < 300;
  });
  results.push(scrolledToReq ? 'OK: Requirements link scrolls' : 'FAIL: Requirements link does not scroll');
  await mobile.screenshot({ path: `${dir}/mobile_after_nav.png` });

  // Menu closed after link click
  const menuClosed = !(await mobile.isVisible('#mobileMenu.active'));
  results.push(menuClosed ? 'OK: Menu closes after link click' : 'FAIL: Menu stays open after link click');

  // Form validation - empty submit
  await mobile.evaluate(() => window.scrollTo(0, document.getElementById('apply').offsetTop - 100));
  await mobile.waitForTimeout(500);
  await mobile.click('#submitBtn');
  await mobile.waitForTimeout(800);
  await mobile.screenshot({ path: `${dir}/mobile_form_empty_errors.png` });
  const nameError = await mobile.isVisible('#fullNameError:not(.hidden)');
  results.push(nameError ? 'OK: Empty form shows errors' : 'FAIL: Empty form does not show errors');

  // Form validation - invalid email blur
  await mobile.fill('#email', 'noat');
  await mobile.click('#fullName');
  await mobile.waitForTimeout(300);
  const emailError = await mobile.isVisible('#emailError:not(.hidden)');
  results.push(emailError ? 'OK: Invalid email shows error on blur' : 'FAIL: Invalid email does not show error on blur');
  await mobile.screenshot({ path: `${dir}/mobile_email_error.png` });

  // Phone mask test
  await mobile.fill('#phone', '9169903670');
  const phoneVal = await mobile.inputValue('#phone');
  results.push(phoneVal === '(916) 990-3670' ? 'OK: Phone mask formats correctly' : `FAIL: Phone mask got "${phoneVal}"`);
  await mobile.screenshot({ path: `${dir}/mobile_phone_mask.png` });

  await mobile.close();

  // ===== DESKTOP TESTS =====
  const desktop = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await desktop.goto(filePath, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await desktop.waitForTimeout(3000);
  await desktop.screenshot({ path: `${dir}/desktop_full.png`, fullPage: true });
  results.push('OK: Desktop full page');

  // Desktop nav links visible
  const navVisible = await desktop.isVisible('.desktop-nav');
  results.push(navVisible ? 'OK: Desktop nav visible' : 'FAIL: Desktop nav hidden');

  // Desktop hamburger hidden
  const hamburgerHidden = !(await desktop.isVisible('#hamburger'));
  results.push(hamburgerHidden ? 'OK: Hamburger hidden on desktop' : 'FAIL: Hamburger visible on desktop');

  // Desktop form - fill and submit
  await desktop.evaluate(() => window.scrollTo(0, document.getElementById('apply').offsetTop - 100));
  await desktop.waitForTimeout(500);
  await desktop.fill('#fullName', 'John Smith');
  await desktop.fill('#phone', '9169903670');
  await desktop.fill('#email', 'test@example.com');
  // CDL Class dropdown
  await desktop.click('#cdlDropdown .dropdown-trigger');
  await desktop.waitForTimeout(300);
  await desktop.click('#cdlDropdown [data-value="A"]');
  // OTR Years dropdown
  await desktop.click('#otrDropdown .dropdown-trigger');
  await desktop.waitForTimeout(300);
  await desktop.click('#otrDropdown [data-value="2"]');
  await desktop.screenshot({ path: `${dir}/desktop_form_filled.png` });
  results.push('OK: Desktop form filled');

  await desktop.close();

  // ===== STATS SECTION ACROSS ALL VIEWPORTS =====
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: vp });
    await page.goto(filePath, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    const statsEl = await page.$('#stats');
    if (statsEl) await statsEl.screenshot({ path: `${dir}/stats_${vp.name}.png` });
    results.push(`OK: Stats screenshot (${vp.name})`);
    await page.close();
  }

  // ===== NO HORIZONTAL OVERFLOW =====
  const overflowCheck = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await overflowCheck.goto(filePath, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await overflowCheck.waitForTimeout(2000);
  const scrollWidth = await overflowCheck.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await overflowCheck.evaluate(() => document.documentElement.clientWidth);
  results.push(scrollWidth <= clientWidth ? 'OK: No horizontal overflow' : `FAIL: Horizontal overflow ${scrollWidth}px > ${clientWidth}px`);
  await overflowCheck.close();

  await browser.close();

  // ===== REPORT =====
  console.log('\n========== TEST RESULTS ==========');
  results.forEach(r => console.log(r));
  const passed = results.filter(r => r.startsWith('OK')).length;
  const failed = results.filter(r => r.startsWith('FAIL')).length;
  console.log(`\nTotal: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`Screenshots: ${dir}/`);
  if (failed > 0) process.exit(1);
})();
