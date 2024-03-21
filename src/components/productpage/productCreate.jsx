import React, { useState } from 'react';
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
    const [isEditing, setIsEditing] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
    
      const handleSave = (e) => {
        e.preventDefault();
        
        setIsEditing(false);
      };
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevState => ({ ...prevState, [name]: value }));
      };
    
      const handleEdit = () => {
        setIsEditing(true);
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
                  value={product.factoryName} 
                  onChange={handleChange} 
                  disabled={!isEditing} 
                  className="form-control" 
                  placeholder="상품명을 입력하세요"
                  readOnly
                  style={{cursor: 'default'}}
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

export default ProductCreate;