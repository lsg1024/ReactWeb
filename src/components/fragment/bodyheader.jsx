import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {

  const [showMenu, setShowMenu] = useState(false);

  const username = localStorage?.getItem("user");

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <Link to="/home">
        <h3 className="text-muted">PRODUCT HUB</h3>
      </Link>
      <div onClick={toggleMenu} style={{position: 'relative', marginRight: '10px', marginTop: '10px', cursor: 'pointer'}}>
        사용자: {username}
        {showMenu && (
          <div style={{position: 'absolute', width: '200px', height: '80px', backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '10px', right: 0, alignItems: 'center', display: 'flex', justifyContent: 'space-between'}}>
            {/* <Link to="/change-password" className="menu-item">비밀번호 변경</Link> */}
            <button className='div-header-btn' type="submit">로그아웃</button>
          </div>
        )}
      </div>      
    </div>
  );
}

export default Header;
