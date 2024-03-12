import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// import React, { createContext, useContext, useState } from 'react';

// const UserContext = createContext();

// export const useUser = () => useContext(UserContext);

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem('user') || null);

  useEffect(() => {
    // 로컬 스토리지에 사용자 정보가 없고, 현재 user 상태도 null인 경우 API 호출
    if (!user) {
      axios.get('http://localhost:8080/userInfo', { withCredentials: true })
        .then(response => {
          const username = response.data.message;
          const user = {name: username };
          localStorage.setItem("user", username);
          setUser(user);
        })
        .catch(error => {
          console.error('사용자 정보를 불러오는데 실패했습니다.', error);
          // 에러 처리 로직 추가
        });
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
