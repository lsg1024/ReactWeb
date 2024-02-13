import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/homePage';
import LoginPage from './components/loginpage/loginpage';
import ProductPage from './components/productpage/product';
import ProductDetail from './components/productpage/productDetail';
import ExcelUpload from './components/storepage/excelLoadPage';
import ExcelDataList from './components/storepage/excelList';
// 다른 페이지 컴포넌트도 여기에 임포트

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/product" element={<ProductPage/>} />
        <Route path="/product/detail/:productId" element={<ProductDetail/>} />
        <Route path="/store/create/excel" element={<ExcelUpload/>}/>
        <Route path="/store/read" element={<ExcelDataList/>}/>
        
        {/* 다른 경로와 컴포넌트 매핑 */}
      </Routes>
    </Router>
  );
}

export default App;
