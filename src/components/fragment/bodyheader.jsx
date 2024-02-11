import React from 'react';
import { Link } from 'react-router-dom'; // React Router를 사용하는 경우

function Header() {
  return (
    <div className="header">
      <ul className="nav nav-pills pull-right">
        {/* 네비게이션 아이템이 여기에 들어갑니다. */}
      </ul>
      <Link to="/home">
        <h3 className="text-muted">PRODUCT HUB</h3>
      </Link>
    </div>
  );
}

export default Header;
