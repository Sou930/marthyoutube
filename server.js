const express = require('express');
const cors = require('cors');
const axios = require('axios');
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
    // 外部サイトにリクエストを送信
    console.log("Fetching URL:", formattedUrl); // リクエストを送信するURLをログ出力
    const response = await axios.get(formattedUrl);

    // 外部サイトのレスポンスをそのまま返す
    console.log("Received response from URL"); // 成功したことをログ出力
    res.json({ content: response.data });
  } catch (error) {
    // エラーの詳細をログ出力
    console.error("Error during proxying the request:", error);
    res.status(500).json({ error: `リクエスト中にエラーが発生しました。詳細: ${error.message}` });
  }
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
