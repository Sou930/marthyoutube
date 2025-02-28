const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS設定：Glitchからのリクエストを許可
app.use(cors({
  origin: 'https://stream-cooing-metal.glitch.me', // GlitchのURLを指定
}));

// JSONリクエストを受け取るための設定
app.use(express.json());

// プロキシエンドポイント
app.post('/proxy', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URLが必要です。" });
  }

  // URLにプロトコルが含まれていない場合、http:// を付ける
  let formattedUrl = url;
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = 'https://' + formattedUrl; // httpsをデフォルトとして設定
  }

  try {
    // Puppeteerを使ってブラウザを起動
    const browser = await puppeteer.launch({
      headless: true,  // もしくは "new"
      executablePath: process.env.CHROME_BIN || '/usr/bin/chromium-browser', // RenderやGlitchのChromiumパスを指定
    });

    const page = await browser.newPage();
    await page.goto(formattedUrl, { waitUntil: 'domcontentloaded' }); // DOMがロードされるまで待機

    // ページのHTMLを取得
    const html = await page.content();

    // 必要に応じて、画像URLなどを抽出することも可能
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

    await browser.close(); // ブラウザを閉じる

    // 結果を返す
    res.json({ content: html, imageUrls: imageUrls });

  } catch (error) {
    console.error("Error during proxying the request:", error);
    res.status(500).json({ error: `リクエスト中にエラーが発生しました。詳細: ${error.message}` });
  }
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
