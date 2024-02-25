import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../fragment/header';
import BodyHeader from '../fragment/bodyheader';
import SearchBox from '../searchBox';
import Pagination from '../Pagination';


const Product = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts(page, searchTerm);
    }, [page, searchTerm]); 

    const fetchProducts = (currentPage, searchQuery) => {
        const url = searchQuery
            ? `http://localhost:8080/api/product/search?productSearch=${searchQuery}&page=${currentPage}`
            : `http://localhost:8080/api/product?page=${currentPage}`;

        axios.get(url, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                }
            })
            .then(response => {
                const { content, totalPages } = response.data;
                setProducts(content);
                setTotalPages(totalPages);
            })
            .catch(error => console.error('Error fetching products:', error));
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
        setPage(1);
    };


    const navigate = useNavigate();
    
    const goToProductDetail = (productId) => {
        navigate(`/product/detail/${productId}`);
    };
    

    return (
        <div>
        <div className="container">
            <Header/>
            <BodyHeader />
            <SearchBox onSearch={handleSearch} />
            <div className="product-list">
                {products.map(product => (
                    <div key={product.id} className="product-item">
                        <div className='product-info'>
                        <h4 onClick={() => goToProductDetail(product.id)}>{product.name}</h4>
                        <p>Color: {product.color}</p>
                        <p>Size: {product.size}</p>
                        <p>Weight: {product.weight}</p>
                        <p>Other: {product.other}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
};


export default Product;