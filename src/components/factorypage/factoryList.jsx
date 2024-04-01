import React, {useCallback} from 'react';
import { useLocation } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';
import Header from '../fragment/header';
import BodyHeader from '../fragment/bodyheader';
import client from '../client';

const FactoryList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const datas = location.state?.data; 

  const reissueToken = useCallback(async () => {
    try {
        const response = await client.post('/reissue');
        const { status, headers } = response;
        if (status === 200) {
            const accessToken = headers['access'];
            localStorage.setItem("access", accessToken);
        }
    } catch (error) {
        console.error('Error reissuing token:', error);
        navigate('/');
    }
}, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();

    const factoryNames = datas.map(data => ({factoryName: data.name}))

    console.log(JSON.stringify(factoryNames))
    try {
        // 서버에 데이터 저장 요청 보내기
        const response = await client.post('/factories', factoryNames, {
          headers: {
            'access' : localStorage.getItem('access')
          } 
        });
        console.log(response.data); // 서버 응답 출력
        alert('데이터가 성공적으로 저장되었습니다.'); // 사용자에게 성공 알림
        navigate('/factory/create')
      } catch (error) {
        if (error.response.status === 401) {
            await reissueToken()
            handleSave(e);
        }
        console.error('데이터 저장 중 오류가 발생했습니다.', error);
        alert('데이터 저장 중 오류가 발생했습니다.'); // 사용자에게 오류 알림
      }
  };

  return (
    <div className="container">
      <Header/>
      <BodyHeader />
      <form onSubmit={handleSave}>
        <button type="submit" className="excel-save-btn btn-primary">데이터 저장</button>
      </form>
      <table className="table table-striped" style={{marginTop : '15px'}}>
        <thead>
          <tr>
            <th className="th-1" scope="col">번호</th>
            <th className="th-1" scope="col">이름</th>
          </tr>
        </thead>
        <tbody>
          {datas?.map((data, index) => ( 
            <tr key={index}>
              <td>{data.id}</td>
              <td>{data.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FactoryList;
