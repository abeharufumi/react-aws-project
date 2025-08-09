import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Django APIのURLにリクエストを送る
    axios
      .get("http://127.0.0.1:8000/api/posts/")
      .then((response) => {
        // 成功したら、受け取ったデータをpostsに保存
        setPosts(response.data);
      })
      .catch((error) => {
        // エラーが発生したら、コンソールに表示
        console.error("投稿データの取得中にエラーが発生しました！", error);
      });
  }, []); // 空の配列[]は、この処理が最初に一度だけ実行されることを意味します

  return (
    <div className="App">
      <header className="App-header">
        <h1>投稿一覧</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.text}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
