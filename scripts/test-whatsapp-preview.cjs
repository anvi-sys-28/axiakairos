const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testWhatsAppPreview() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 480, height: 750 } });

  const webpBuffer = fs.readFileSync('public/l.webp');
  const webpBase64 = webpBuffer.toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>WhatsApp Share Preview Verification</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
          body {
            background-color: #0b141a;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
          }
          .chat-bubble {
            background-color: #005c4b;
            color: #e9edef;
            border-radius: 8px;
            max-width: 340px;
            overflow: hidden;
            box-shadow: 0 1px 0.5px rgba(11,20,26,.13);
            position: relative;
          }
          .preview-card {
            background-color: #025144;
            border-radius: 8px 8px 4px 4px;
            overflow: hidden;
            margin: 4px;
          }
          .preview-img-container {
            width: 100%;
            aspect-ratio: 1 / 1;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          .preview-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .preview-meta {
            padding: 8px 10px 10px;
          }
          .preview-title {
            font-size: 14.5px;
            font-weight: 700;
            line-height: 1.25;
            color: #ffffff;
            margin-bottom: 4px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .preview-desc {
            font-size: 12.5px;
            color: #8696a0;
            line-height: 1.35;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-bottom: 4px;
          }
          .preview-domain {
            font-size: 11.5px;
            color: #8696a0;
          }
          .chat-text {
            padding: 4px 10px 8px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .chat-link {
            color: #53bdeb;
            text-decoration: underline;
            font-size: 13.5px;
            word-break: break-all;
          }
          .chat-time {
            font-size: 11px;
            color: #8696a0;
            margin-left: 8px;
            white-space: nowrap;
          }
          .checks {
            color: #53bdeb;
            font-size: 13px;
            margin-left: 3px;
          }
          .tab-mockup {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            gap: 8px;
            background: #202124;
            color: #e8eaed;
            padding: 8px 16px;
            border-radius: 8px 8px 0 0;
            font-size: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            border: 1px solid #3c4043;
            border-bottom: none;
            width: 340px;
          }
          .tab-favicon {
            width: 16px;
            height: 16px;
            border-radius: 2px;
          }
        </style>
      </head>
      <body>
        <div class="tab-mockup">
          <img class="tab-favicon" src="data:image/webp;base64,${webpBase64}" alt="tab favicon" />
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">AXIA® KAIROS — Strategy that moves you forward.</span>
        </div>

        <div class="chat-bubble" style="margin-top: 50px;">
          <div class="preview-card">
            <div class="preview-img-container">
              <img class="preview-img" src="data:image/webp;base64,${webpBase64}" alt="AXIA KAIROS Logo" />
            </div>
            <div class="preview-meta">
              <div class="preview-title">AXIA® KAIROS — Strategy that moves you forward.</div>
              <div class="preview-desc">Axia Kairos Advisory &amp; Technology Group — Strategy that moves you forward. Cloud Platform Modernization, SAP S/4HANA Migrations, AI &amp; Managed Services.</div>
              <div class="preview-domain">axiakairos.com</div>
            </div>
          </div>
          <div class="chat-text">
            <span class="chat-link">https://axiakairos.com/</span>
            <div style="display: flex; align-items: center;">
              <span class="chat-time">9:18 am</span>
              <span class="checks">✓✓</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);

  const artifactsDir = 'C:/Users/jashw/.gemini/antigravity/brain/50c50c10-7194-40c0-9d8c-9de54d39c98a';
  await page.screenshot({ path: path.join(artifactsDir, 'whatsapp_share_preview.png') });
  console.log('📸 Captured whatsapp_share_preview.png');
  await browser.close();
}

testWhatsAppPreview().catch(console.error);
