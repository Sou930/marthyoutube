const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.get('/proxy', async (req, res) => {
  const youtubeUrl = req.query.url;  // YouTubeのURLをクエリパラメータとして受け取る

  try {
    const response = await axios.get(youtubeUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    // YouTubeからのレスポンスをそのままクライアントに送信
    res.setHeader('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (error) {
    res.status(500).send('YouTubeのコンテンツ取得に失敗しました');
  }
});

app.listen(port, () => {
  console.log(`YouTube Proxy Service listening at http://localhost:${port}`);
});
