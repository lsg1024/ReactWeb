import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../fragment/header';
import BodyHeader from '../fragment/bodyheader';
import notImage from '../../image/not_ready.png'
import client from '../client';
import { useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { productId } = useParams(); // URL에서 productId 파라미터를 추출
  const [product, setProduct] = useState({
    name: '',
    color: '',
    size: '',
    weight: '',
    other: '',
    image: '',
    factoryId: '',
    factoryName: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleSave = (e) => {
    e.preventDefault();
    updateProduct(); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    setProduct(prevState => ({ ...prevState, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

//수정 URL
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await client.get(`/product/detail/${productId}`, {
          headers: {
            'access': localStorage.getItem('access')
          }
        });
        setProduct(response.data);
      } catch (error) {

      }
    };

    fetchProductDetails();
  }, [productId]);

  const reissueToken = useCallback(async () => {
    try {
      const response = await client.post('/reissue');
      const { status, headers } = response;
      if (status === 200) {
        const accessToken = headers['access'];
        localStorage.setItem("access", accessToken);
      }
    } catch (error) {
      navigate('/');
    }
  }, [navigate]);

  const updateProduct = useCallback(async () => {
    try {
      const { data, status } = await client.post('/product/update', product, {
        headers: {
          'access': localStorage.getItem('access'),
          'productId': productId
        },
      });
      if (status === 200) {
        alert("업데이트 성공");
        setIsEditing(false);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        await reissueToken();
        updateProduct();
      } else {
        console.error('Error:', error);
        alert("업데이트 실패 : " + error.message);
      }
    }
  }, [product, productId, reissueToken]);

  return (
    <div className="container">
        <Header/>
        <BodyHeader />
 
      <div style={{textAlign : 'center', marginTop: '50px'}}>
        <img src={product.image || notImage} alt="Product" className="product-image" />
      </div>

      <form onSubmit={handleSave} style={{ marginTop: '50px' }}>
        <div className='form-row'>
          {/* 공장 */}
          <div className="form-group" style={{marginBottom : '5px'}}>
            <label htmlFor="name">공장</label>
            <input type="text" id="name" name="name" value={product.factoryName} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="상품명을 입력하세요" />
          </div>
          {/* 상품명 */}
          <div className="form-group" style={{marginBottom : '5px'}}>
            <label htmlFor="name">상품명</label>
            <input type="text" id="name" name="name" value={product.name} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="상품명을 입력하세요" />
          </div>
        </div>
        
        <div className='form-row'>
          {/* 색상 */}
          <div className="form-group" style={{marginBottom : '5px'}}>
            <label htmlFor="color">색상</label>
            <input type="text" id="color" name="color" value={product.color} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="색상을 입력하세요" />
          </div>

          {/* 크기 */}
          <div className="form-group" style={{marginBottom : '5px'}}>
            <label htmlFor="size">크기</label>
            <input type="text" id="size" name="size" value={product.size} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="크기를 입력하세요" />
          </div>
        </div>

        <div className='form-row'>
          {/* 무게 */}
          <div className="form-group" style={{marginBottom : '5px'}}>
            <label htmlFor="weight">무게</label>
            <input type="text" id="weight" name="weight" value={product.weight} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="무게를 입력하세요" />
          </div>

          {/* 기타 정보 */}
          <div className="form-group">
            <label htmlFor="other">기타 정보</label>
            <input type="text" id="other" name="other" value={product.other} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="기타 정보를 입력하세요" />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '100px'}}>
        <button className='custom-btn btn-5' type="button" onClick={handleEdit} hidden={isEditing}>수정하기</button>
        <button className='custom-btn btn-5' type="submit" hidden={!isEditing}>수정완료</button>
        </div>
      </form>
    </div>
  );
};

export default ProductDetail;
