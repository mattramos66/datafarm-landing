const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });

  const html = `<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;700&family=Georgia&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 630px;
    background: #F5F0E8;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60px 80px;
    position: relative;
    overflow: hidden;
  }
  .bg-accent {
    position: absolute;
    top: -120px;
    right: -120px;
    width: 400px;
    height: 400px;
    background: rgba(45, 80, 22, 0.06);
    border-radius: 50%;
  }
  .bg-accent-2 {
    position: absolute;
    bottom: -80px;
    left: -80px;
    width: 300px;
    height: 300px;
    background: rgba(200, 169, 110, 0.08);
    border-radius: 50%;
  }
  .top-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 6px;
    background: linear-gradient(90deg, #2D5016, #C8A96E);
  }
  .logo {
    font-family: 'Georgia', serif;
    font-size: 28px;
    color: #2D5016;
    margin-bottom: 24px;
    letter-spacing: 0.5px;
  }
  h1 {
    font-family: 'Georgia', serif;
    font-size: 64px;
    color: #1A1A1A;
    text-align: center;
    line-height: 1.15;
    margin-bottom: 24px;
    max-width: 900px;
  }
  p {
    font-size: 22px;
    color: #555;
    text-align: center;
    max-width: 700px;
    line-height: 1.5;
  }
  .badge {
    margin-top: 32px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    background: #2D5016;
    color: #F5F0E8;
    border-radius: 6px;
    font-weight: 700;
    font-size: 16px;
  }
</style>
</head>
<body>
  <div class="top-bar"></div>
  <div class="bg-accent"></div>
  <div class="bg-accent-2"></div>
  <div class="logo">Data Farm</div>
  <h1>Your data, harvest-ready for&nbsp;AI.</h1>
  <p>AI-powered data cleaning, dashboards, and natural language analytics for your CSV, PDF, and database data.</p>
  <div class="badge">Join the Waitlist →</div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.screenshot({
    path: path.join(__dirname, "images", "og.png"),
    type: "png",
  });

  await browser.close();
  console.log("OG image generated: images/og.png");
})();
