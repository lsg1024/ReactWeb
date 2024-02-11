import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/login.css';


function LoginPage() {
  return (
    <div className="wrap">
      <div className="login">
        <h2>로그인</h2>
        <form id="loginForm" style={{ marginTop: '20px', width: '90%' }} method="post">
          <div className="signup_login_id">
            <input type="email" name="login_email" id="login_email" placeholder="이메일" />
          </div>
          <div className="signup_login_pw">
            <input type="password" name="login_password" id="login_password" placeholder="비밀번호" />
          </div>
          <div className="signup_submit">
            <button id="login_button" type="button">로그인</button>
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
            <li><a style={{ background: '#FAE100' }} href="https://kauth.kakao.com/oauth/authorize?response_type=code&prompt=login&client_id=5491a6e9994ae64c2a5d4a132059656c&redirect_uri=http://localhost:8080/oauth/kakao"><img className="login_img" src="/images/kakao_logo.png" alt="카카오 로그인" /></a></li>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
