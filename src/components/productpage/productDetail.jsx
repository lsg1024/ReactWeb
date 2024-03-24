import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    
    serialNumber: '',
    color: '',
    size: '',
    weight: '',
    other: '',
    image: [],
    factoryId: '',
    factoryName: ''
  });

  const nameRef = useRef(null);
  const serialNumberRef = useRef(null);
  const factoryNameRef = useRef(null);
  const colorRef = useRef(null);
  const sizeRef = useRef(null);
  const weightRef = useRef(null);
  const otherRef = useRef(null);

  // refs를 순회하기 위한 배열
  const inputRefs = [nameRef, serialNumberRef, factoryNameRef, colorRef, sizeRef, weightRef, otherRef];

  const handleKeyDown = async (event, currentIndex) => {
    // Enter 키와 Tab 키 처리
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault(); // 폼 제출 및 기본 Tab 동작 방지
  
      // 공장 필드에 있을 때 API 호출
      if (currentIndex === 2) {
        const isSuccess = await handleInputFinish(event); // API 호출 및 결과 확인
        if (isSuccess) {
          // API 호출 성공 시, 다음 필드로 포커스 이동
          moveToNextField(currentIndex);
        }
        return; // 다음 로직을 실행하지 않고 함수 종료
      } else {
        // 공장 필드가 아닐 경우, 다음 필드로 포커스 이동
        moveToNextField(currentIndex);
      }
    }
  };

  // 다음 필드로 포커스 이동하는 로직을 별도의 함수로 분리
  const moveToNextField = (currentIndex) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < inputRefs.length) {
      inputRefs[nextIndex].current.focus(); // 다음 입력 필드로 포커스 이동
    } else {
      // 마지막 입력 필드인 경우, 포커스 제거
      inputRefs[currentIndex].current.blur();
    }
  };

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

  // FactorySearchModal에서 공장이 선택되었을 때 호출될 함수
  const handleFactorySelect = (factory) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      factoryId: factory.factoryId,
      factoryName: factory.factoryName
    }));
    setIsModalOpen(false);
  };


  // Enter 키 누르거나 다른 Tab으로 이동할 때 실행되는 함수
  const handleInputFinish = async (event) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      try {
        const response = await client.get(`/api/factory?factoryName=${encodeURIComponent(product.factoryName)}`, {
          headers: { "access": localStorage.getItem("access") }
        });
        // 성공적으로 공장 목록을 가져온 후의 로직을 여기에 구현합니다.
        if (response.status === 200) {
          return true;
        }
        // 409 에러 핸들링 등 필요한 경우 이곳에서 처리
      } catch (error) {
        if (error.response && error.response.status === 401) {
          await reissueToken();
          handleInputFinish();
        } else if (error.response && error.response.status === 409){
          setIsModalOpen(true); // 409 에러 발생 시 모달 열기
          return false;
        } else {
          console.error('factories:', error);
          alert('로그인 시간 만료');
          navigate('/');
        }
      }
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProduct(); 
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // serialNumber, size, weight 필드에 대한 처리
    if (['serialNumber', 'size', 'weight'].includes(name)) {
      // 현재 값 확인을 위해 문자열 타입으로 변환
      const currentValue = product[name] ? product[name].toString() : '';
  
      // 새로운 입력값이 소수점이고, 현재 값에 이미 소수점이 있다면, 추가 입력을 무시
      if (value.endsWith('.') && currentValue.includes('.')) {
        return; // 아무런 동작도 하지 않고 리턴
      }
  
      // 숫자, 소수점만 허용 (연속된 소수점 입력 방지 포함)
      const cleanedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
  
      setProduct(prevState => ({ ...prevState, [name]: cleanedValue }));
    } else {
      setProduct(prevState => ({ ...prevState, [name]: value }));
    }
  };  
  
  const handleEdit = () => {
    setIsEditing(true);
  };

  //토큰 리프레쉬
  const reissueToken = useCallback(async (callback) => {
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
        await reissueToken();
        fetchProductDetails();
      }
    };

    fetchProductDetails();
  }, [productId, reissueToken]);

  const updateProduct = useCallback(async () => {
    try {

      const formData = new FormData();
      formData.append("product", JSON.stringify({
        name: product.name,
        serialNumber: product.serialNumber,
        color: product.color,
        size: product.size,
        weight: product.weight,
        other: product.other,
        factoryId : product.factoryId,
      }));

      // 이미지가 있을 경우에만 FormData에 추가
      if (uploadedImages.length > 0) {
        uploadedImages.forEach((file, index) => {
            formData.append(`images`, file);
        });
      } else {
        // 이미지가 없음을 명시적으로 표시하는 경우
        formData.append('images', null);
      }

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
          {/* 상품명 */}
          <div className="form-group" style={{marginBottom : '5px'}}>
            <label htmlFor="name">상품명</label>
            <input ref={nameRef} onKeyDown={(e) => handleKeyDown(e, 0)} type="text" id="name" name="name" value={product.name} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="상품명을 입력하세요" />
          </div>

          {/* 시리얼 번호 */}
          <div className="form-group" style={{marginBottom : '5px'}}>
            <label htmlFor="serialNumber">시리얼</label>
            <input ref={serialNumberRef} onKeyDown={(e) => handleKeyDown(e, 1)} type="text" id="serialNumber" name="serialNumber" value={product.serialNumber} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="시리얼을 입력하세요" />
          </div>
        </div>
        
        <div className='form-row'>

          {/* 공장 */}
          <div className="form-group" style={{marginBottom : '5px'}}>
            <label htmlFor="name">공장</label>
            <div className='factory-form-group'>
              <input
              ref={factoryNameRef}
              type="text"
              id="factoryName"
              name="factoryName"
              value={product.factoryName}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-control"
              placeholder="공장명을 입력하세요"
              style={{cursor: 'default'}}
              onBlur={handleInputFinish}
              onKeyDown={(e) => handleKeyDown(e, 2)}
              />
            <img src={searchImage} alt="Search" className="search-icon" hidden={!isEditing} onClick={handleSearchIconClick} />
            <FactorySearchModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} onFactorySelect={handleFactorySelect}/>
            </div>
          </div>

          {/* 색상 */}
          <div className="form-group" style={{marginBottom : '5px'}}>
            <label htmlFor="color">색상</label>
            <input ref={colorRef} onKeyDown={(e) => handleKeyDown(e, 3)} type="text" id="color" name="color" value={product.color} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="색상을 입력하세요" />
          </div>

          {/* 크기 */}
          <div className="form-group" style={{marginBottom : '5px'}}>
            <label htmlFor="size">크기</label>
            <input ref={sizeRef} onKeyDown={(e) => handleKeyDown(e, 4)} type="text" id="size" name="size" value={product.size} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="크기를 입력하세요" />
          </div>

          {/* 무게 */}
          <div className="form-group" style={{marginBottom : '5px'}}>
            <label htmlFor="weight">무게</label>
            <input ref={weightRef} onKeyDown={(e) => handleKeyDown(e, 5)} type="text" id="weight" name="weight" value={product.weight} onChange={handleChange} disabled={!isEditing} className="form-control" placeholder="무게를 입력하세요" />
          </div>

        </div>

        <div className='form-row'>
              {/* 기타 정보 */}
              <div style={{width:"100%", paddingLeft:"15px", paddingRight:"15px"}}>
                <label htmlFor="other">기타 정보</label>
                <textarea
                  ref={otherRef}
                  id="other"
                  name="other"
                  value={product.other}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="기타 정보를 입력하세요"
                  rows="4"
                  disabled={!isEditing}
                  onKeyDown={(e) => handleKeyDown(e, 6)}
                ></textarea>
              </div>
            </div>

        <div style={{ textAlign: 'center'}}>
        <button className='custom-btn btn-5' type="button" onClick={handleEdit} hidden={isEditing}>수정하기</button>
        <button className='custom-btn btn-5' type="button" onClick={handleSave} hidden={!isEditing}>수정완료</button>
        </div>
      </form>
    </div>
  );
};

export default ProductDetail;
