import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../UserContext';

function Header() {
  const { user } = useUser(); 

  const username = user?.name;

  return (
    <div className="header" style={{display: 'flex', justifyContent: 'space-between'}}>
      <Link to="/home">
        <h3 className="text-muted" style={{textAlign: 'center'}}>PRODUCT HUB</h3>
      </Link>
      <div className='div-header' style={{backgroundColor: '#e9ecef', margin: '10px', padding: '10px'}}>
        <div>
          <p style={{padding: '5px'}}>사용자: {username}</p>
        </div>
        <div>
          <buttom className='div-header-btn' type="submit">로그아웃</buttom>
        </div>
      </div>
    </div>
  );
}

export default Header;
