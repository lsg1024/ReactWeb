import React, { useState } from 'react';
import client from '../client';
import { Link } from 'react-router-dom';
import '../../assets/login.css';
import logoPath from '../../image/kakao_logo.png';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault(); // 폼 제출 시 새로고침 방지

    localStorage.removeItem("access");
    localStorage.removeItem("user");
    
    const loginData = {
      email,
      password,
    };

    console.log("Request Data:", JSON.stringify(loginData));

    // 로그인 요청
    client.post('/login', loginData)
    .then(response => {
      console.log("response data = {}", response);
      const { status, headers } = response;
      if (status === 200) {
        alert("로그인 성공");
        const accessToken = headers['access'];
    
        localStorage.setItem("access", accessToken);
        navigate('/home');

        client.get('/userInfo', {
          headers: {
            "access" : localStorage.getItem("access")
          }
        })
        .then(response => {
          const username = response.data.message;
          const user = {name: username };
          localStorage.setItem("user", username);
          setUser(user);
          navigate('/home');
        })
      } 
    })
    .catch(error => {
      console.error('Error:', error);
      if (error.response) {
        const { status } = error.response;
        if (status === 401) { 
          alert(error.response.data.message);
        }
        else {
          alert("알 수 없는 에러")
        }
      } 
      else {
        alert('로그인 요청을 처리할 수 없습니다.');
      }
    });
  };

  const kakaoLogin= () => {
    localStorage.removeItem("access");
    localStorage.removeItem("user");
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
  }

  return (
    <div className="wrap">
      <div className="login">
        <h2>로그인</h2>
        <form onSubmit={handleLogin} style={{ marginTop: '20px', width: '90%' }}>
          <div className="signup_login_id">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" />
          </div>
          <div className="signup_login_pw">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
          </div>
          <div className="signup_submit">
            <button type="submit" id="login_button">로그인</button>
          </div>
          
        </form>
        <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' }}>
          <Link to="/user/find_email" className="login_a">아이디(이메일) 찾기</Link>
          <span style={{ margin: '0 8px', width: '1px', height: '10px', backgroundColor: '#858a8d' }}></span>
          <Link to="/user/find_password" className="login_a">비밀번호 찾기</Link>
          <span style={{ margin: '0 8px', width: '1px', height: '10px', backgroundColor: '#858a8d' }}></span>
          <Link to="/user/signup" className="login_a">회원가입</Link>
        </p>

        <div className="sign-in-modal__social-sign-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <hr className="social-sign-in__line" style={{ position: 'relative', bottom: '-8px', display: 'block', margin: '0', width: '80%', height: '1px', backgroundColor: '#f1f3f5', border: 'none' }} />
          <span className="social-sign-in__title" style={{ padding: '0 8px', marginBottom: '16px', fontSize: '12px', lineHeight: '14px', letterSpacing: '-.3px', color: '#abb0b5', zIndex: '1', backgroundColor: '#fff' }}>간편로그인</span>
          <div className="login_sns">
            <li>
            <div className="box" style={{background: '#FAE100'}}>
            <img className="login_img" onClick={kakaoLogin} src={logoPath} style={{ background: '#FAE100'}} alt="카카오 로그인" />
            </div>
            </li>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
