import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCookies } from "react-cookie";
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    const [cookies, setCookie] = useCookies(['Authorization']);
    const [user, setUser] = useState(null);

    useEffect(() => {

        const token = Cookies.get('Authorization');
        console.log('Token: ', token);
        console.log('Token cookies: ', cookies);

        if (token) {
            const decoded = jwtDecode(token);
            setUser({
            id: decoded.id,
            name: decoded.name,
            role: decoded.role,
            exp: new Date(decoded.exp * 1000),
                });
            }
        }, 
    []);

  // 로그인 함수
  const login = (userInfo) => {
    setUser(userInfo);
    // 로그인 로직 구현
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    // 로그아웃 로직 구현
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
