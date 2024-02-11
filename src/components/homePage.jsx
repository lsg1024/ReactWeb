import React from 'react';
import { Link } from 'react-router-dom';
import Header from './fragment/header';
import Footer from './fragment/footer';
import BodyHeader from './fragment/bodyheader';
import '../assets/jumbotron-narrow.css';
import '../assets/style.css';

function HomePage() {
  return (
    <div className="container">
      <Header/>
      <BodyHeader />
      <div className="jumbotron">
        <h1>통합 정보 시스템</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
          <p>
            <Link to="/product" className="btn btn-lg btn-secondary">상품 관리</Link>
            <Link to="/product/create" className="btn btn-lg btn-secondary">상품 등록</Link>
          </p>
          <p>
            <Link to="/factory" className="btn btn-lg btn-secondary">공장 관리</Link>
            <Link to="/factory/create" className="btn btn-lg btn-secondary">공장 등록</Link>
          </p>
          <p>
            <Link to="/stores" className="btn btn-lg btn-secondary">가게 관리</Link>
            <Link to="/stores/create/excel" className="btn btn-lg btn-secondary">가게 등록</Link>
          </p>
          <p>
            <Link to="/user" className="btn btn-lg btn-secondary">사용자 관리</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
