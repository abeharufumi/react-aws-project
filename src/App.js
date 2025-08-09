import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState(""); // 新しい投稿のテキストを保存する箱

  // 投稿一覧を取得する関数
  const fetchPosts = () => {
    axios
      .get("http://127.0.0.1:8000/api/posts/")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("投稿データの取得中にエラーが発生しました！", error);
      });
  };

  // 最初に一度だけ投稿一覧を取得する
  useEffect(() => {
    fetchPosts();
  }, []);

  // フォームが送信された時の処理
  const handleSubmit = (e) => {
    e.preventDefault(); // フォームのデフォルトの送信動作を防ぐ
    axios
      .post("http://127.0.0.1:8000/api/posts/", { text: newPostText })
      .then((response) => {
        console.log("投稿成功:", response.data);
        setNewPostText(""); // 入力欄を空にする
        fetchPosts(); // 投稿一覧を再取得して画面を更新
      })
      .catch((error) => {
        console.error("投稿中にエラーが発生しました！", error);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>投稿一覧 (from Django API)</h1>

        {/* 新しい投稿フォーム */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="新しい投稿"
          />
          <button type="submit">投稿</button>
        </form>

        {/* 投稿一覧 */}
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
