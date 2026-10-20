const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  const webpBuffer = fs.readFileSync('public/l.webp');
  const webpBase64 = webpBuffer.toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head><style>body { margin: 0; background: #000; }</style></head>
      <body>
        <img id="img" src="data:image/webp;base64,${webpBase64}" />
        <canvas id="cvs"></canvas>
      </body>
    </html>
  `);

  await page.waitForSelector('#img');

  const { pngBase64, icoBase64 } = await page.evaluate(async () => {
    const img = document.getElementById('img');
    await img.decode();

    // 1. Full size PNG
    const cvs = document.getElementById('cvs');
    cvs.width = img.naturalWidth;
    cvs.height = img.naturalHeight;
    const ctx = cvs.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const png = cvs.toDataURL('image/png').split(',')[1];

    // 2. 64x64 favicon
    const favCvs = document.createElement('canvas');
    favCvs.width = 64;
    favCvs.height = 64;
    const favCtx = favCvs.getContext('2d');
    favCtx.drawImage(img, 0, 0, 64, 64);
    const favPng = favCvs.toDataURL('image/png').split(',')[1];

    return { pngBase64: png, icoBase64: favPng };
  });

  fs.writeFileSync('public/l.png', Buffer.from(pngBase64, 'base64'));
  fs.writeFileSync('public/favicon.png', Buffer.from(icoBase64, 'base64'));
  console.log('✅ Generated public/l.png (size:', fs.statSync('public/l.png').size, 'bytes)');
  console.log('✅ Generated public/favicon.png (size:', fs.statSync('public/favicon.png').size, 'bytes)');

  await browser.close();
}

main().catch((err) => {
  console.error('Asset generation error:', err);
  process.exit(1);
});
