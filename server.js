const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// JSONパースを許可
app.use(express.json());

// プロキシエンドポイント
app.post('/proxy', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URLが必要です。" });
  }

  try {
    // リクエストをURLに送信
    const response = await axios.get(url);

    // レスポンス内容を返す
    res.json({ content: response.data });
  } catch (error) {
    console.error("Error during proxying the request:", error);
    res.status(500).json({ error: "リクエスト中にエラーが発生しました。" });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
