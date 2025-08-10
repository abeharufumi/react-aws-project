import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // AuthContextをインポート

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // login関数をContextから取得

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    axios
      .post("http://127.0.0.1:8000/api/auth/login/", {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log("ログイン成功:", response.data);
        // ログイン成功後、受け取ったトークンをContextに保存
        login(response.data);
        // ホームページにリダイレクト
        navigate("/");
      })
      .catch((err) => {
        console.error("ログインエラー:", err.response?.data);
        setError("メールアドレスまたはパスワードが正しくありません。");
      });
  };

  return (
    <div>
      <h1>ログイン</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>メールアドレス:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>パスワード:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
}

export default LoginPage;
