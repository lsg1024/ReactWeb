import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/homePage';
import LoginPage from './components/loginpage/loginpage';
// 다른 페이지 컴포넌트도 여기에 임포트

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage/>} />
        <Route path="/" element={<LoginPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        {/* 다른 경로와 컴포넌트 매핑 */}
      </Routes>
    </Router>
  );
}

export default App;
