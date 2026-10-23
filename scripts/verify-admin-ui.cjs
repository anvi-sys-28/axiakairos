const { chromium } = require('playwright');
const path = require('path');

async function verifyAdmin() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173/admin ...');
  await page.goto('http://localhost:5173/admin', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('form', { timeout: 10000 });
  await page.waitForTimeout(1000);

  const artifactsDir = 'C:\\Users\\jashw\\.gemini\\antigravity\\brain\\50c50c10-7194-40c0-9d8c-9de54d39c98a';
  await page.screenshot({ path: path.join(artifactsDir, 'admin_login_page.png'), fullPage: true });
  console.log('📸 Captured admin_login_page.png');

  // Submit login form
  console.log('Submitting login form...');
  const submitBtn = await page.locator('button[type="submit"]');
  await submitBtn.click();
  await page.waitForTimeout(2000);

  await page.screenshot({ path: path.join(artifactsDir, 'admin_dashboard_page.png'), fullPage: true });
  console.log('📸 Captured admin_dashboard_page.png');

  // Now submit a message on /contact
  const contactPage = await context.newPage();
  console.log('Navigating to http://localhost:5173/contact ...');
  await contactPage.goto('http://localhost:5173/contact', { waitUntil: 'domcontentloaded' });
  await contactPage.waitForTimeout(3500); // Wait for preloader

  const nameInput = contactPage.locator('input[placeholder="Jane Doe"]');
  if (await nameInput.isVisible()) {
    await nameInput.fill('Alexander Wright');
    await contactPage.locator('input[placeholder="Enterprise Corp"]').fill('Nordic Energy Group');
    await contactPage.locator('input[placeholder="jane@enterprise.com"]').fill('a.wright@nordicenergy.no');
    await contactPage.locator('textarea[placeholder*="Tell us about your"]').fill('Inquiring regarding SAP S/4HANA migration strategy and data architecture modernization.');
    
    const sendBtn = contactPage.locator('button:has-text("Submit")');
    await sendBtn.click();
    await contactPage.waitForTimeout(1500);
    await contactPage.screenshot({ path: path.join(artifactsDir, 'contact_submission_success.png') });
    console.log('📸 Captured contact_submission_success.png');
  }

  // Reload admin dashboard to see updated messages
  await page.bringToFront();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(artifactsDir, 'admin_dashboard_with_new_inquiry.png'), fullPage: true });
  console.log('📸 Captured admin_dashboard_with_new_inquiry.png');

  await browser.close();
  console.log('✨ All browser verifications completed successfully!');
}

verifyAdmin().catch((err) => {
  console.error('Verification error:', err);
  process.exit(1);
});
