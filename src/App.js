import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/homePage';
import LoginPage from './components/loginpage/loginpage';
import SignupPage from './components/loginpage/signuppage';
import ProductPage from './components/productpage/product';
import ProductCreate from './components/productpage/productCreate';
import ProductDetail from './components/productpage/productDetail';
import StoreList from './components/storepage/storeList';
import StorePage from './components/storepage/storePage';
import Factoty from './components/factorypage/factoryPage';
import FactoryList from './components/factorypage/factoryList';
import FactoryExcelUpload from './components/factorypage/factoyExcelUpload';
import StoreExcelUpload from './components/storepage/storeExcelUpload';
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
          <Route path="/store/create" element={<StoreExcelUpload/>}/>
          <Route path="/store/read" element={<StoreList/>}/>
          <Route path="/stores" element={<StorePage/>}/>
          <Route path="/factory" element={<Factoty/>}/>
          <Route path="/factory/create" element={<FactoryExcelUpload/>}/>
          <Route path="/factory/read" element={<FactoryList/>}/>
          <Route path='/users' element={<Users/>}/>
          <Route path='/product/create' element={<ProductCreate/>}/>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
