import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // ここに、ログインしているユーザーの情報を保存します
  const [user, setUser] = useState(null);

  // ログイン時にユーザー情報を設定する関数 (後で実装)
  const login = (userData) => {
    setUser(userData);
  };

  // ログアウト時にユーザー情報をリセットする関数 (後で実装)
  const logout = () => {
    setUser(null);
  };

  // valueとして、子コンポーネントに渡したい情報や関数を指定
  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 他のコンポーネントから簡単にContextを呼び出すためのカスタムフック
export const useAuth = () => {
  return useContext(AuthContext);
};
