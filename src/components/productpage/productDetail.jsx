import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../fragment/header';
import BodyHeader from '../fragment/bodyheader';
import notImage from '../../image/not_ready.png'
import client from '../client';

const ProductDetail = () => {
  const { productId } = useParams(); // URL에서 productId 파라미터를 추출
  const [product, setProduct] = useState({
    name: '',
    color: '',
    size: '',
    weight: '',
    other: '',
    image: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);

//수정 URL
  useEffect(() => {
    client.get(`/product/detail/${productId}`, {
      headers: {
        'access' : localStorage.getItem('access')
      }
    })
      .then(response => {
        setProduct(response.data)
      })
      .catch(error => console.error("There was an error!", error));
  }, [productId]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    setProduct(prevState => ({ ...prevState, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    console.log("Request Data:", JSON.stringify(product));

    client.post('/product/update', product, {
      headers: {
        'access' : localStorage.getItem('access'),
        'userId': '1',
        'factoryId': '1',
        'productId': productId
      },
    })
    .then(({ data, status }) => {
      if (status === 200) {
        alert("데이터 수정이 완료되었습니다");
        setIsEditing(false); // 수정 모드 해제
      } else {
        // 오류 처리
        let errorMessage = data.message + ": ";
        Object.values(data.errors).forEach(message => {
          errorMessage += `${message}, `;
        });
        alert(errorMessage);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert("업데이트 실패: " + error.message);
    });
  };

  return (
    <div className="container">
        <Header/>
        <BodyHeader />
 
      <img src={product.image || notImage} alt="Product" className="product-image" />

      <form onSubmit={handleSave} style={{ marginTop: '20px' }}>
        {/* 상품명 */}
        <div className="form-group">
          <label htmlFor="name">상품명</label>
          <input type="text" id="name" name="name" value={product.name} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="상품명을 입력하세요" />
        </div>

        {/* 색상 */}
        <div className="form-group">
          <label htmlFor="color">색상</label>
          <input type="text" id="color" name="color" value={product.color} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="색상을 입력하세요" />
        </div>

        {/* 크기 */}
        <div className="form-group">
          <label htmlFor="size">크기</label>
          <input type="text" id="size" name="size" value={product.size} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="크기를 입력하세요" />
        </div>

        {/* 무게 */}
        <div className="form-group">
          <label htmlFor="weight">무게</label>
          <input type="text" id="weight" name="weight" value={product.weight} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="무게를 입력하세요" />
        </div>

        {/* 기타 정보 */}
        <div className="form-group">
          <label htmlFor="other">기타 정보</label>
          <input type="text" id="other" name="other" value={product.other} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="기타 정보를 입력하세요" />
        </div>

        <div style={{ textAlign: 'center' }}>
        <button className='custom-btn btn-5' type="button" onClick={handleEdit} hidden={isEditing}>수정하기</button>
        <button className='custom-btn btn-5' type="submit" hidden={!isEditing}>수정완료</button>
        </div>
      </form>
    </div>
  );
};

export default ProductDetail;
