const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio'); // HTML パーサー
const app = express();
const port = process.env.PORT || 3000;

app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // 受け取ったURLに対してHTMLコンテンツを取得
    const response = await axios.get(targetUrl);
    const htmlContent = response.data;

    // cheerioを使ってHTMLを解析
    const $ = cheerio.load(htmlContent);

    // 最初の画像を取得（必要に応じて画像取得を拡張）
    const imageUrl = $('img').first().attr('src');

    // 結果としてHTMLコンテンツと画像URLを返す
    res.json({
      html: htmlContent,  // HTML コンテンツそのまま返す
      image: imageUrl ? imageUrl : null  // 最初の画像URLを返す
    });
  } catch (error) {
    console.error('Error fetching the URL:', error);
    res.status(500).json({ error: 'Failed to fetch the requested URL' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
