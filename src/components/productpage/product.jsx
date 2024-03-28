import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../fragment/header';
import BodyHeader from '../fragment/bodyheader';
import SearchBox from '../searchBox';
import Pagination from '../Pagination';
import client from '../client';


const Product = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

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

    const fetchProducts = useCallback(async (currentPage, searchQuery) => {
        const url = searchQuery 
        ? `/products/search?productSearch=${searchQuery}&page=${currentPage}` 
        : `/products?page=${currentPage}`;

        try {
            const response = await client.get(url, {
                headers: {
                    "access" : localStorage.getItem("access")
                }
            });
            if (response.status === 200) {
                const { content, totalPages } = response.data;
                setProducts(content);
                setTotalPages(totalPages);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // 액세스 토큰이 만료되었을 때
                await reissueToken();
                console.log("액세스 토큰 재발급")
                fetchProducts(currentPage, searchQuery);
                console.log("fetchProducts 재실행")
            } else {
                console.error('Error fetching products:', error);
                navigate('/');
            }
        }
    }, [reissueToken, navigate]);

    useEffect(() => {
        fetchProducts(page, searchTerm);
    }, [fetchProducts, page, searchTerm]); 
    

    const handleSearch = (query) => {
        setSearchTerm(query);
        setPage(1);
    };
    
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