import React from 'react';
import './login.css'; // CSS 파일 경로 확인 필요

function SignupPage() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // 폼 제출 로직
  };

  return (
    <div className="wrap">
      <div className="login">
        <h2>회원가입</h2>
        <form id="signupForm" style={{ marginTop: '20px', width: '90%' }} onSubmit={handleSubmit}>
          <div className="signup_login_id">
            <h4>이메일</h4>
            <input type="email" name="email" id="email" placeholder="이메일" />
          </div>
          <div className="signup_login_id">
            <h4>이름</h4>
            <input type="text" name="nickname" id="nickname" placeholder="이름" />
          </div>
          <div className="signup_login_pw">
            <h4>비밀번호</h4>
            <input type="password" name="password" id="password" placeholder="비밀번호" />
          </div>
          <div className="signup_login_pw">
            <h4>비밀번호 확인</h4>
            <input type="password" name="passwordConfirm" id="passwordConfirm" placeholder="비밀번호 확인" />
          </div>
          <div className="signup_submit">
            <button id="signup_button" type="button">회원가입</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
