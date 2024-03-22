import React, { useState, useCallback } from 'react';
import Header from "../fragment/header";
import BodyHeader from "../fragment/bodyheader";
import { useNavigate } from 'react-router-dom';
import client from "../client";
import notImage from "../../image/not_ready.png";
import Slider from "react-slick";
import "../../assets/slick/slick.css"
import "../../assets/slick/slick-theme.css"
import {NextTo, Prev} from '../../assets/style';
import camera from '../../image/fill_camera.svg';
import searchImage from '../../image/search.png';
import FactorySearchModal from '../factorypage/factorySearchModal';

const ProductCreate = () => {

    const navigate = useNavigate();
    const [uploadedImages, setUploadedImages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const createProduct = async () => {
      const formData = new FormData();

      formData.append("product", JSON.stringify({
        name: product.name,
        serialNumber: product.serialNumber,
        color: product.color,
        size: product.size,
        weight: product.weight,
        other: product.other,
        factoryId: product.factoryId
      }));

      // 이미지가 있을 경우에만 FormData에 추가
      if (uploadedImages.length > 0) {
        uploadedImages.forEach((file, index) => {
            formData.append(`images`, file);
        });
      } else {
        // 이미지가 없음을 명시적으로 표시하는 경우
        // 서버 측에서 'noImages' 파라미터를 처리할 수 있는 로직이 필요합니다.
        formData.append('images', null);
      }

        // FormData 내의 모든 값 확인
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: `, value);
          
        }

      try {
        await client.post("/product/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "access" : localStorage.getItem("access")
          },
        });

        const isContinue = window.confirm("추가로 등록하시겠습니까?");
        if (isContinue) {
          navigate("/product/create")
        } else {
          navigate('/home');
        }

      }
      catch (error) {
        if (error.response.status === 401) {
          await reissueToken();
          createProduct();
        }
        else if (error.response && error.response.data) {
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

    }

    const handleImageUpload = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          Array.from(files).forEach(file => {
            console.log(`File Name: ${file.name}`);
            console.log(`File Type: ${file.type}`);
            console.log(`File Size: ${file.size} bytes`);
        });
          setUploadedImages([...uploadedImages, ...Array.from(files)]);
        }
      };
    
    const removeUploadedImage = (imageToRemove) => {
      setUploadedImages(uploadedImages.filter(image => image !== imageToRemove));
    };
  
    const handleSearchIconClick = () => {
      setIsModalOpen(true); // 모달 열기
    };

    const handleFactorySelect = (factory) => {
      setProduct((prevProduct) => ({
        ...prevProduct,
        factoryId: factory.factoryId,
        factoryName: factory.factoryName
      }));
      setIsModalOpen(false);
    };
  
    const handleSave = async (e) => {
      e.preventDefault();

      await createProduct();
      
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setProduct(prevState => ({ ...prevState, [name]: value }));

      if (e.target.name === 'serialNumber'|| e.target.name === 'color' || e.target.name === 'size' || e.target.name === 'weight') {
        const cleanedValue = e.target.value.replace(/[^0-9]/g, '');
        setProduct(prevState => ({ ...prevState, [e.target.name]: cleanedValue }));
      } else {
        setProduct(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
      }
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
            {(
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
                <input type="text" id="name" name="name" value={product.name} onChange={handleChange} className="form-control" placeholder="상품명을 입력하세요" />
              </div>

              {/* 시리얼 번호 */}
              <div className="form-group" style={{marginBottom : '5px'}}>
                  <label htmlFor="serialNumber">시리얼</label>
                  <input type="text" id="serialNumber" name="serialNumber" pattern='[0-9]+' value={product.serialNumber} onChange={handleChange} className="form-control" placeholder="시리얼을 입력하세요" />
              </div>

            </div>
            
            <div className='form-row'>

              {/* 공장 */}
              <div className="form-group" style={{marginBottom : '5px'}}>
                <label htmlFor="name">공장</label>
                <div className='factory-form-group'>
                  <input
                  type="text"
                  id="name" 
                  name="name" 
                  value={product.factoryName} 
                  onChange={handleChange} 
                  className="form-control" 
                  placeholder="공장명을 입력하세요"
                  readOnly
                  style={{cursor: 'default'}}
                />
                <img src={searchImage} alt="Search" className="search-icon" onClick={handleSearchIconClick} />
                <FactorySearchModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} onFactorySelect={handleFactorySelect}/>
                </div>
              </div>

              {/* 색상 */}
              <div className="form-group" style={{marginBottom : '5px'}}>
                <label htmlFor="color">색상</label>
                <input type="text" id="color" name="color" value={product.color} pattern='[0-9]+' onChange={handleChange} className="form-control" placeholder="색상을 입력하세요" />
              </div>
    
              {/* 크기 */}
              <div className="form-group" style={{marginBottom : '5px'}}>
                <label htmlFor="size">크기</label>
                <input type="text" id="size" name="size" value={product.size} pattern='[0-9]+' onChange={handleChange} className="form-control" placeholder="크기를 입력하세요" />
              </div>

              {/* 무게 */}
              <div className="form-group" style={{marginBottom : '5px'}}>
                <label htmlFor="weight">무게</label>
                <input type="text" id="weight" name="weight" value={product.weight} pattern='[0-9]+' onChange={handleChange}  className="form-control" placeholder="무게를 입력하세요" />
              </div>

            </div>
    
            <div className='form-row'>
              {/* 기타 정보 */}
              <div style={{width:"100%", paddingLeft:"15px", paddingRight:"15px"}}>
                <label htmlFor="other">기타 정보</label>
                <textarea
                  id="other"
                  name="other"
                  value={product.other}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="기타 정보를 입력하세요"
                  rows="4"
                ></textarea>
              </div>
            </div>
            <div style={{ textAlign: 'center'}}>
            <button className='custom-btn btn-5' type="submit" onClick={handleSave}>등록하기</button>
            </div>
          </form>
        </div>
      );
    };

export default ProductCreate;