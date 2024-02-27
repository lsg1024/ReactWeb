import { Link } from 'react-router-dom';
import { useAuth } from './../AuthContext';


function Header() {

  const { user } = useAuth();

  console.log(user);

  // 로그인 유지 남은 시간 계산
  const remainingTime = user ? new Date(user.exp).getTime() - new Date().getTime() : 0;
  const remainingMinutes = Math.floor(remainingTime / 60000); // 밀리초를 분으로 변환

  return (
    <div className="header" >
      <ul className="nav nav-pills pull-right">
        {/* 네비게이션 아이템이 여기에 들어갑니다. */}
      </ul>
      <Link to="/home">
        <h3 className="text-muted">PRODUCT HUB</h3>
      </Link>
      {user && (
        <div>
          <p>사용자 이름: {user.name}</p>
          <p>로그인 유지 시간: {remainingMinutes}분</p>
        </div>
      )}
    </div>
  );
}

export default Header;
