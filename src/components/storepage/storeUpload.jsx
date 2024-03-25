import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../fragment/header';
import BodyHeader from '../fragment/bodyheader';
import client from '../client';

const StoreUpload = () => {
  const [file, setFile] = useState(null);
  const nav = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await client.post('/api/excel/read', formData, {
        withCredentials: true,  
        headers: {
            'Content-Type': 'multipart/form-data',
            'access' : localStorage.getItem('access')
          },
      });
      nav('/store/read', { state: {data :response.data }}); 
    } catch (error) {
      alert('파일이 정상적으로 업로드 되었는지 확인해주세요.')
      console.error('엑셀 파일 업로드 중 오류가 발생했습니다.', error);
    }
  };

  return (
    <div className="container">
        <Header/>
        <BodyHeader />
        <form onSubmit={handleSubmit} method="POST" enctype="multipart/form-data">
            <input type="file" name="file" onChange={handleFileChange} style={{ marginBottom: '15px'}} />
            <button className='excel-btn' type="submit">제출</button>
        </form>
      
    </div>
  );
};

export default StoreUpload;
