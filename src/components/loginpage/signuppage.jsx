import React, { useState } from 'react';
import axios from 'axios';

const SignupPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirm, setpasswordConfirm] = useState('');
  const [name, setname] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const signUpData = {
      email,
      password,
      password_confirm,
      name,
    };


    await axios.post('http://localhost:8080/signup', signUpData, {
          headers: {
            'Content-Type' : 'application/json'
          },
        })
        .then(response => {
          const {status, data } = response;
          if (status === 200) {
            alert(data.message);
            window.location.href = '/';
          }
        })
        .catch(error => {
          console.error('Error:', error);
            const { data } = error.response;
            let errorMessage = "";
            for (const [, errors] of Object.entries(data.errors)) {
              errorMessage += `${errors} `;
            }
            alert(errorMessage);
        });
      };

  return (
    <div className="wrap">
      <div className="signup">
        <h2>회원가입</h2>
        <form id="signupForm" style={{ marginTop: '20px', width: '90%' }} onSubmit={handleSubmit}>
          <div className="signup_login_id">
            <h4>이메일</h4>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" />
          </div>
          <div className="signup_login_id">
            <h4>이름</h4>
            <input type="text" value={name} onChange={(e) => setname(e.target.value)} placeholder="이름" />
          </div>
          <div className="signup_login_pw">
            <h4>비밀번호</h4>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
          </div>
          <div className="signup_login_pw">
            <h4>비밀번호 확인</h4>
            <input type="password" value={password_confirm} onChange={(e) => setpasswordConfirm(e.target.value)} placeholder="비밀번호 확인" />
          </div>
          <div className="signup_submit">
            <button id="signup_button" type="submit">회원가입</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
