import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../fragment/header';
import BodyHeader from '../fragment/bodyheader';
import notImage from '../../image/not_ready.png'
import client from '../client';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick'; 
import "../../assets/slick/slick.css"
import "../../assets/slick/slick-theme.css"
import {NextTo, Prev} from '../../assets/style';
import camera from '../../image/fill_camera.svg';
import searchImage from '../../image/search.png';
import FactorySearchModal from '../factorypage/factorySearchModal';

const ProductDetail = () => {
  const { productId } = useParams(); // URL에서 productId 파라미터를 추출
  const [product, setProduct] = useState({
    name: '',
    color: '',
    size: '',
    weight: '',
    other: '',
    image: [],
    factoryId: '',
    factoryName: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const SlickButtonFix = ({ children, ...props }) => (
    <span {...props}>{children}</span>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    nextArrow: (
      <SlickButtonFix>
        <NextTo />
      </SlickButtonFix>
    ),
    prevArrow: (
      <SlickButtonFix>
        <Prev />
      </SlickButtonFix>
    )
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedImages([...uploadedImages, ...Array.from(files)]);
    }
  };

  const removeUploadedImage = (imageToRemove) => {
    setUploadedImages(uploadedImages.filter(image => image !== imageToRemove));
  };

  const handleSearchIconClick = () => {
    setIsModalOpen(true); // 모달 열기
  };


  const handleSave = (e) => {
    e.preventDefault();
    updateProduct(); 
    setIsEditing(false);
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

  //토큰 리프레쉬
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

      const formData = new FormData();
      formData.append("product", JSON.stringify({
        name: product.name,
        color: product.color,
        size: product.size,
        weight: product.weight,
        other: product.other,
        factoryId : product.factoryId,
        factoryName: product.factoryName
      }));

      uploadedImages.forEach((files, index) => {
        formData.append(`images`, files); // 수정 필요: 실제 파일 객체로 변경해야 합니다.
      });

        // FormData 내의 모든 값 확인
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: `, value);
        
      }
      const { data, status } = await client.post('/product/update', formData, {
        headers: {
          'access': localStorage.getItem('access'),
          'productId': productId,
          'Content-Type': 'multipart/form-data'
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
  }, [product, productId, reissueToken, uploadedImages]);
  
  useEffect(() => {
    // product 상태가 업데이트되면 factoryInfo도 업데이트
    setFactoryInfo({
      factoryId: product.factoryId,
      factoryName: product.factoryName
    });
  }, [product]);

  const [factoryInfo, setFactoryInfo] = useState({ 
    factoryId: product.factoryId, 
    factoryName: product.factoryName
  });

  // FactorySearchModal에서 공장이 선택되었을 때 호출될 함수
  const handleFactorySelect = (factory) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      factoryId: factory.id,
      factoryName: factory.factoryName
    }));
    setFactoryInfo({ factoryId: factory.id, factoryName: factory.factoryName });
  };


  return (
    <div className="container">
      <Header/>
      <BodyHeader/>
 
      <div className="slick-slider" style={{ textAlign: 'center', marginTop: '50px' }}>
        {uploadedImages.length > 0 ? (
          <Slider {...sliderSettings}>
            {uploadedImages.map((imgUrl, index) => (
              <div key={index}>
                <img src={URL.createObjectURL(imgUrl)} alt={`Uploaded ${index + 1}`} />
                <button onClick={() => removeUploadedImage(imgUrl)}>Remove</button>
              </div>
            ))}
          </Slider>
        ) : (product.image && product.image.length > 0) ? (
          <Slider {...sliderSettings}>
            {product.image.map((imgUrl, index) => (
              <div key={index}>
                <img src={imgUrl} alt={`Product ${index + 1}`} />
              </div>
            ))}
          </Slider>
        ) : (
          <img src={notImage} alt="Product" className="product-image" />
        )}
        {/* 이미지 업로드 버튼. isEditing이 true일 때만 렌더링 */}
        {isEditing && (
          <div className="file-upload-wrapper">
            <input
              type="file"
              className="file-upload-input"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              id="file-upload"
            />
            <label htmlFor="file-upload" className="file-upload-button">
              <img src={camera} alt=''></img>
            </label>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} style={{ marginTop: '50px' }}>
        <div className='form-row'>
          {/* 공장 */}
          <div className="form-group" style={{marginBottom : '5px'}}>
            <label htmlFor="name">공장</label>
            <div className='factory-form-group'>
              <input
              type="text"
              id="name" 
              name="name" 
              value={factoryInfo.factoryName} 
              onChange={handleChange} 
              disabled={!isEditing} 
              className="form-control" 
              placeholder="상품명을 입력하세요"
              readOnly
            />
            <img src={searchImage} alt="Search" className="search-icon" hidden={!isEditing} onClick={handleSearchIconClick} />
            <FactorySearchModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} onFactorySelect={handleFactorySelect}/>
            </div>
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
