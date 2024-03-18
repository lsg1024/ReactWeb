import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import SearchBox from '../searchBox';
import Pagination from '../Pagination';
import client from '../client';
import { useNavigate } from 'react-router-dom';

const FactorySearchModal = ({ isOpen, onRequestClose, onFactorySelect }) => {

    const [factories, setFactories] = useState([]);
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

    const fetchFactory = useCallback(async (currentPage, searchQuery) => {
        const url  = searchQuery 
        ? `/api/factory/search?factorySearch=${searchQuery}&page=${currentPage}`
        : `/api/factory?page=${currentPage}`;
    
        await client.get(url, {
            headers: {
                "access" : localStorage.getItem("access")
            }
        })
        .then(response => {
            const {content, totalPages} = response.data;
            setFactories(content);
            setTotalPages(totalPages);
        })
        .catch(async error => {
            if (error.response && error.response.status === 401) {
                // 액세스 토큰이 만료되었을 때
                await reissueToken();
                console.log("액세스 토큰 재발급")
            
            } else {
                console.error('Error fetching products:', error);
                alert('로그인 시간 만료');
                navigate('/');
            }
        });
    }, [reissueToken, navigate]);

    useEffect(() => {
        fetchFactory(page, searchTerm);
    }, [fetchFactory, page, searchTerm]);

    const handleSearch = (query) => {
        setSearchTerm(query);
        setPage(1);
    };

    const handleSelectFactory = (factory) => {
        onFactorySelect(factory); // 선택된 공장 정보를 ProductDetail로 전달
        onRequestClose(); // 모달 닫기
      };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className='model' >

            <div className='container'>

                <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <h2>공장 검색</h2>
                <button style= {{width: '40px', height: '40px', margin: '20px', border: 'none', backgroundColor: 'white'}} onClick={onRequestClose}>X</button>
                </div>
                
                <SearchBox onSearch={handleSearch}/>
                <div className="store-list" style={{marginTop : '15px', flexGrow: '1', overflow: 'auto'}}>
                        <table className="table mx-auto">
                            <thead>
                                <tr>
                                    <th className="th-1" scope="col">번호</th>
                                    <th className="th-1">이름</th>
                                    <th className="th-1"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {factories.map((factory, index) => (
                                    <tr key={index} onClick={() => handleSelectFactory(factory)}>
                                        <td>{index + 1 + (page - 1) * 10}</td>
                                        <td>{factory.factoryName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

            </div>

        </Modal>
    );
};

export default FactorySearchModal;