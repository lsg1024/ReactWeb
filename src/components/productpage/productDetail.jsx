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
import close from '../../image/close.svg'
import FactorySearchModal from '../factorypage/factorySearchModal';

const ProductDetail = () => {
  const { productId } = useParams(); // URL에서 productId 파라미터를 추출
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    serialNumber: '',
    color: '',
    size: '',
    weight: '',
    other: '',
    images: [],
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

  const inputRefs = [nameRef, serialNumberRef, factoryNameRef, colorRef, sizeRef, weightRef, otherRef];

  const handleKeyDown = async (event, currentIndex) => {
    // Enter 키와 Tab 키 처리
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault(); 
  
      // 공장 필드에 있을 때 API 호출
      if (currentIndex === 1) {
        handleSearchIconClick();
        moveToNextField(currentIndex);
        return;
      } 
      else {
        moveToNextField(currentIndex);
      }
    }
  };

  const moveToNextField = (currentIndex) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < inputRefs.length) {
      inputRefs[nextIndex].current.focus();
    } else {
      inputRefs[currentIndex].current.blur();
    }
  };

  const [isEditing, setIsEditing] = useState(false);
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
        console.log(response.data);
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
      }  else if (error.response && error.response.data) {
        // 서버로부터 받은 에러 메시지가 있는 경우
        const errors = error.response.data;
        
        // 여러 필드의 에러 메시지를 처리하는 경우
        if (typeof errors === 'object' && errors !== null) {
            const errorMessages = Object.keys(errors).map(key => `${key}: ${errors[key]}`).join('\n');
            alert(`상품 생성 실패:\n${errorMessages}`);
        } else {
            // 단일 에러 메시지를 처리하는 경우
            alert(`상품 생성 실패: ${errors}`);
        }
      } 
      else {
          // 기타 네트워크 에러 등의 경우
          console.error("상품 생성 에러", error);
          alert("상품 생성 실패: 네트워크 오류 또는 알 수 없는 오류 발생");
      }
    }
  }, [product, productId, reissueToken, uploadedImages]);

  const removeServerImage = async (imageId) => {
    if (window.confirm('이미지를 삭제하시겠습니까?')) {

      try {
        const response = await client.post(`/images/?imageId=${imageId}`, {
          headers: {
            'access': localStorage.getItem('access'),
          }
        });
        if (response.status === 200) {
          alert('이미지가 성공적으로 삭제되었습니다.');
          const updatedImages = product.images.filter(img => img.imageId !== imageId);
          setProduct({...product, images: updatedImages});
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          await reissueToken();
          removeServerImage();
        }
        else {
          console.log(error)
          alert("이미지 삭제를 실패했습니다.")
        }
        
      }
    }
  };
  

  return (
    <div className="container">
      <Header/>
      <BodyHeader/>
 
      <div className="slick-slider" style={{ textAlign: 'center', marginTop: '50px' }}>
        {uploadedImages.length > 0 || (product.images && product.images.length > 0) ? (
          <Slider {...sliderSettings}>
            {uploadedImages.map((img, index) => (
              <div key={`uploaded-${index}`} style={{ position: 'relative' }}>
                <img src={URL.createObjectURL(img)} alt={`Uploaded ${index}`} style={{ width: '100%', height: 'auto' }} />
                {isEditing && (
                <button 
                onClick={() => removeUploadedImage(img.imageId)} 
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '1px',
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
                }}>
                <img src={close} alt="" style={{width: '20px', height: '20px'}}/>
                </button>
              )}
              </div>
            ))}
            {product.images && product.images.map((img, index) => (
              <div key={`server-${index}`}>
                <img src={"http://localhost:8080/images/?imagePath=" + img.imagePath} alt={`Server ${index}`} style={{ width: '100%', height: 'auto' }} />
                {isEditing && (
                <button 
                  onClick={() => removeServerImage(img.imageId)} 
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: 'px',
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
                  }}>
                  <img src={close} alt="" style={{width: '20px', height: '20px'}}/>
                </button>
              )}
              </div>
            ))}
          </Slider>
        ) : (
          <img src={notImage} alt="Product" className="product-image" />
        )}
        {isEditing && (
          <div className="file-upload-wrapper">
            <input type="file" className="file-upload-input" accept="image/*" multiple onChange={handleImageUpload} id="file-upload" />
            <label htmlFor="file-upload" className="file-upload-button">
              <img src={camera} alt=""></img>
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
              readOnly
              onClick={handleSearchIconClick}
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
