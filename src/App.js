import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingText, setEditingText] = useState("");

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

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/posts/", { text: newPostText })
      .then((response) => {
        setNewPostText("");
        fetchPosts();
      })
      .catch((error) => {
        console.error("投稿中にエラーが発生しました！", error);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/posts/${id}/`)
      .then((response) => {
        fetchPosts();
      })
      .catch((error) => {
        console.error("削除中にエラーが発生しました！", error);
      });
  };

  const handleEditClick = (post) => {
    setEditingPostId(post.id);
    setEditingText(post.text);
  };

  // 「保存」ボタンが押された時の処理
  const handleUpdateSubmit = (id) => {
    axios
      .put(`http://127.0.0.1:8000/api/posts/${id}/`, { text: editingText })
      .then((response) => {
        setEditingPostId(null); // 編集モードを終了
        setEditingText("");
        fetchPosts(); // 投稿一覧を再取得
      })
      .catch((error) => {
        console.error("更新中にエラーが発生しました！", error);
      });
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>投稿一覧 (from Django API)</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="新しい投稿"
          />
          <button type="submit">投稿</button>
        </form>

        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              {editingPostId === post.id ? (
                // --- ↓↓↓ 編集モードの時の表示 ↓↓↓ ---
                <div>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <button onClick={() => handleUpdateSubmit(post.id)}>
                    保存
                  </button>
                  <button onClick={() => setEditingPostId(null)}>
                    キャンセル
                  </button>
                </div>
              ) : (
                // --- ↓↓↓ 通常モードの時の表示 ↓↓↓ ---
                <div>
                  {post.text}
                  <button
                    onClick={() => handleEditClick(post)}
                    style={{ marginLeft: "10px" }}
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    削除
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
