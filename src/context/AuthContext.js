import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("authToken")
  );
  const [user, setUser] = useState(null); // 今後のためにユーザー情報も用意

  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common["Authorization"] = `Token ${authToken}`;
      localStorage.setItem("authToken", authToken);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("authToken");
    }
  }, [authToken]);

  const login = (data) => {
    setAuthToken(data.key); // dj-rest-authは'key'という名前でトークンを返します
    // setUser(data.user); // ユーザー情報の取得は次のステップで
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  const value = { user, authToken, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
