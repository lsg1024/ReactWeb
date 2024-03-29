import React, { useState, useEffect, useCallback } from 'react';
import Header from '../fragment/header';
import BodyHeader from '../fragment/bodyheader';
import SearchBox from '../searchBox';
import Pagination from '../Pagination';
import client from '../client';
import { useNavigate } from 'react-router-dom';


const Factory = () => {
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
        ? `/factory/search?factorySearch=${searchQuery}&page=${currentPage}`
        : `/factories?page=${currentPage}`;
    
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
                fetchFactory();
            
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
    
    const handleEdit = async (factoryId) => {
        const factoryName = prompt("공장 이름을 수정하세요:", "");
        if (factoryName != null && factoryName !== "") {
            await client.post(`/factory/update?factoryId=${factoryId}`, 
            {
                factoryId: factoryId,
                factoryName: factoryName 
            },
            {
                headers: {"access" : localStorage.getItem("access")}}, 
            ).then(response => {
                if (response.status === 200) {

                    const updatedFactories = factories.map(factory => {
                        if (factory.factoryId === factoryId) {
                        return { ...factory, factoryName: factoryName };
                        }
                        return factory;
                    });
                    setFactories(updatedFactories); // 상태 업데이트
                    console.log("공장 이름이 성공적으로 수정되었습니다.");

                }
            }).catch(async error => {
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
        }
      };

    return (
        <div className="container">
            <Header/>
            <BodyHeader />
            <SearchBox onSearch={handleSearch} />
            <div className="store-list" style={{marginTop : '15px'}}>
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
                            <tr key={index}>
                                <td>{index + 1 + (page - 1) * 10}</td>
                                <td>{factory.factoryName}</td>
                                <td>
                                <button className="btn btn-primary edit_btn" onClick={() => 
                                    handleEdit(factory.factoryId)}>수정</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );

};

export default Factory;