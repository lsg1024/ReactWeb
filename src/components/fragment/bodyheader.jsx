import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../UserContext';

function Header() {
  const { user } = useUser(); 

  const username = user?.name;

  return (
    <div className="header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <Link to="/home">
        <h3 className="text-muted">PRODUCT HUB</h3>
      </Link>
      <p style={{marginRight: '10px', marginTop: '10px'}}>
        사용자: {username}
      </p>
      {/* <button className='div-header-btn' type="submit">로그아웃</button> */}
    </div>
  );
}

export default Header;
