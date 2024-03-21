import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/homePage';
import LoginPage from './components/loginpage/loginpage';
import SignupPage from './components/loginpage/signuppage';
import ProductPage from './components/productpage/product';
import ProductCreate from './components/productpage/productCreate';
import ProductDetail from './components/productpage/productDetail';
import ExcelUpload from './components/storepage/excelLoadPage';
import ExcelDataList from './components/storepage/excelList';
import StorePage from './components/storepage/storePage';
import Factoty from './components/factorypage/factoryPage'
import Users from './components/userpage/userpage';
import { UserProvider } from './UserContext';
// 다른 페이지 컴포넌트도 여기에 임포트

function App() {

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/user/signup" element={<SignupPage/>} />
          <Route path="/home" element={<HomePage/>} />
          <Route path="/product" element={<ProductPage/>} />
          <Route path="/product/detail/:productId" element={<ProductDetail/>} />
          <Route path="/store/create/excel" element={<ExcelUpload/>}/>
          <Route path="/store/read" element={<ExcelDataList/>}/>
          <Route path="/stores" element={<StorePage/>}/>
          <Route path="/factory" element={<Factoty/>}/>
          <Route path='/users' element={<Users/>}/>
          <Route path='/product/create' element={<ProductCreate/>}/>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
