import React from 'react';
import { useLocation } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../fragment/header';
import BodyHeader from '../fragment/bodyheader';

const ExcelDataList = () => {
  const location = useLocation();
  const nav = useNavigate();
  const datas = location.state?.data; 

  const handleSave = async (e) => {
    e.preventDefault();
    try {
        // 서버에 데이터 저장 요청 보내기
        const response = await axios.post('http://localhost:8080/api/stores/save', datas, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data); // 서버 응답 출력
        alert('데이터가 성공적으로 저장되었습니다.'); // 사용자에게 성공 알림
        nav('/store/create/excel')
      } catch (error) {
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
              <td>{data.storeId}</td>
              <td>{data.storeName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelDataList;
