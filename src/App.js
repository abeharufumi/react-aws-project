import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import { useAuth } from "./context/AuthContext"; // useAuthをインポート
import "./App.css";

function App() {
  const { authToken, logout } = useAuth(); // authTokenとlogoutをContextから取得

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">ホーム</Link>
            </li>
            {authToken ? (
              // --- ログインしている時の表示 ---
              <li>
                <button onClick={logout}>ログアウト</button>
              </li>
            ) : (
              // --- ログインしていない時の表示 ---
              <>
                <li>
                  <Link to="/login">ログイン</Link>
                </li>
                <li>
                  <Link to="/signup">サインアップ</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <header className="App-header">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
