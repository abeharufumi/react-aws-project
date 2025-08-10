import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  // フォームの入力値を保存するための箱
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // エラーメッセージを保存するための箱
  const [error, setError] = useState("");

  // ページ遷移を管理するためのツール
  const navigate = useNavigate();

  // フォームが送信された時の処理
  const handleSubmit = (e) => {
    e.preventDefault(); // ページの再読み込みを防ぐ
    setError(""); // 古いエラーメッセージを消す

    // パスワードが一致しない場合はエラーを表示
    if (password !== password2) {
      setError("パスワードが一致しません。");
      return;
    }

    // DjangoのサインアップAPIにPOSTリクエストを送信
    axios
      .post("http://127.0.0.1:8000/api/auth/registration/", {
        email: email,
        password1: password,
        password2: password2,
      })
      .then((response) => {
        console.log("登録成功:", response.data);
        // 登録が成功したら、ログインページに自動で移動
        alert("登録確認メールを送信しました。メールを確認してください。");
        navigate("/login");
      })
      .catch((err) => {
        console.error("登録エラー:", err.response.data);
        // Djangoから返ってきたエラーメッセージを整形して表示
        const errorData = err.response.data;
        let errorMessage = "登録に失敗しました。";
        if (errorData.email) {
          errorMessage = `メールアドレス: ${errorData.email[0]}`;
        } else if (errorData.password) {
          errorMessage = `パスワード: ${errorData.password[0]}`;
        }
        setError(errorMessage);
      });
  };

  return (
    <div>
      <h1>サインアップ</h1>
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
        <div>
          <label>パスワード (確認):</label>
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
        </div>
        <button type="submit">登録</button>
      </form>
    </div>
  );
}

export default SignupPage;
