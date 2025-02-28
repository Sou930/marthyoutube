const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer-core');
const app = express();
const PORT = process.env.PORT || 10000;

// CORS設定：リクエスト元を許可
app.use(cors({
  origin: 'https://stream-cooing-metal.glitch.me',
}));

app.use(express.json());

// プロキシエンドポイント
app.post('/proxy', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URLが必要です。" });
  }

  let formattedUrl = url;
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = 'https://' + formattedUrl;
  }

  try {
    const executablePath = process.env.CHROME_BIN || '/usr/bin/chromium-browser';

    // Puppeteerの起動
    const browser = await puppeteer.launch({
      executablePath: executablePath,
      headless: 'new',  // 新しいヘッドレスモードを使用
    });

    const page = await browser.newPage();
    await page.goto(formattedUrl, { waitUntil: 'domcontentloaded' });

    const html = await page.content();

    const imageUrls = await page.evaluate(() => {
      const urls = [];
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        if (img.src) {
          urls.push(img.src);
        }
      });
      return urls;
    });

    await browser.close();

    res.json({ content: html, imageUrls: imageUrls });
  } catch (error) {
    console.error("Error during proxying the request:", error);
    res.status(500).json({ error: `リクエスト中にエラーが発生しました。詳細: ${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
