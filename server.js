const express = require('express');
const cors = require('cors');
const axios = require('axios'); // 外部リクエスト用
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

  try {
    // 外部サイトにリクエストを送信
    const response = await axios.get(url);

    // 外部サイトのレスポンスをそのまま返す
    res.json({ content: response.data });
  } catch (error) {
    console.error("Error during proxying the request:", error);
    res.status(500).json({ error: "リクエスト中にエラーが発生しました。" });
  }
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
