import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../fragment/header';
import BodyHeader from '../fragment/bodyheader';
import SearchBox from '../searchBox';
import '../../assets/style.css';


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

        axios.get(url)
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
                        <h4>{product.name}</h4>
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

const Pagination = ({ page, totalPages, onPageChange }) => {
    const startPage = Math.floor((page - 1) / 10) * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPages);

    return (
        <nav aria-label="Page navigation example" className="d-flex justify-content-center">
            <ul className="pagination justify-content-center">
                {/* 이전 버튼 */}
                <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(Math.max(page - 10, 1))} aria-label="이전 페이지">
                        &laquo;
                    </button>
                </li>

                {/* 페이지 번호 */}
                {[...Array(endPage + 1 - startPage).keys()].map(num => (
                    <li key={startPage + num} className={`page-item ${startPage + num === page ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => onPageChange(startPage + num)}>
                            {startPage + num}
                        </button>
                    </li>
                ))}

                {/* 다음 버튼 */}
                <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(Math.min(page + 10, totalPages))} aria-label="다음 페이지">
                        &raquo;
                    </button>
                </li>
            </ul>
        </nav>
    );
};



export default Product;