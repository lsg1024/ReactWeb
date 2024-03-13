import React, {useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './fragment/header';
import Footer from './fragment/footer';
import client from './client';
import { useNavigate } from 'react-router-dom';
import BodyHeader from './fragment/bodyheader';
import '../assets/jumbotron-narrow.css';
import '../assets/style.css';
import { useUser } from '../UserContext';

const HomePage = () => {

  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {

    const accessFromHeader = localStorage.getItem('access');

    if (accessFromHeader === null) {
      client.post('/reissue')
      .then(response => {
        const {status, headers} = response;
        if (status === 200) {
          const accessToken = headers['access'];
          localStorage.setItem("access", accessToken);
          client.get('/userInfo', {
            headers: {
              'access': localStorage.getItem("access")
            }
          })
          .then(response => {
            const username = response.data.message;
            const user = {name: username };
            localStorage.setItem("user", username);
            setUser(user);
          })
        }
      })
      .catch(() => {
        navigate("/")
      })
    }
    
  });

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
            <Link to="/store/create/excel" className="btn btn-lg btn-secondary">가게 등록</Link>
          </p>
          <p>
            <Link to="/users" className="btn btn-lg btn-secondary">사용자 관리</Link>
          </p>
        </div>
      </div> 
      <Footer />
    </div>
  );
}

export default HomePage;
