import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // useAuthをインポート
import { useStripe } from "@stripe/react-stripe-js";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const { authToken } = useAuth();
  const stripe = useStripe(); // ← 2. stripeフックを呼び出す

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

  const handleUpdateSubmit = (id) => {
    axios
      .put(`http://127.0.0.1:8000/api/posts/${id}/`, { text: editingText })
      .then((response) => {
        setEditingPostId(null);
        setEditingText("");
        fetchPosts();
      })
      .catch((error) => {
        console.error("更新中にエラーが発生しました！", error);
      });
  };

  // --- ↓↓↓ 購読ボタンが押された時の関数を追記 ↓↓↓ ---
  const handleSubscribe = async () => {
    try {
      // 1. バックエンドにリクエストを送り、Checkout Session IDを取得
      const response = await axios.post(
        "http://127.0.0.1:8000/api/payments/create-checkout-session/"
      );
      const { id: sessionId } = response.data;

      // 2. 取得したIDを使って、Stripeの決済ページにリダイレクト
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error("Stripeリダイレクトエラー:", error);
      }
    } catch (error) {
      console.error("購読処理エラー:", error);
    }
  };

  return (
    <div>
      <h1>投稿一覧 (from Django API)</h1>
      {authToken && (
        <>
          <div>
            <h2>クリエイターを購読する</h2>
            <button onClick={handleSubscribe}>月額500円で購読</button>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="新しい投稿"
            />
            <button type="submit">投稿</button>
          </form>
        </>
      )}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {editingPostId === post.id ? (
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
              <div>
                {post.text}
                {authToken && (
                  <>
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
                  </>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
