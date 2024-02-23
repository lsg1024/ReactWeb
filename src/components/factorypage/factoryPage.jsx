import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../fragment/header';
import BodyHeader from '../fragment/bodyheader';
import SearchBox from '../searchBox';
import Pagination from '../Pagination';


const Factory = () => {
    const [factories, setFactories] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchFactory(page, searchTerm);
    }, [page, searchTerm]);

    const fetchFactory = (currentPage, searchQuery) => {
        const url  = searchQuery = 
        `http://localhost:8080/api/factory/search?factorySearch=${searchQuery}&page=${currentPage}`
    
        axios.get(url, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                // 필요한 경우 추가 헤더를 여기에 포함시킵니다.
            }
        })
        .then(response => {
            const {content, totalPages} = response.data;
            setFactories(content);
            setTotalPages(totalPages);
        })
        .catch(error => alert(error));
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
        setPage(1);
    };
    
    const handleEdit = (factoryId) => {
        const factoryName = prompt("공장 이름을 수정하세요:", "");
        if (factoryName != null && factoryName !== "") {
          axios.post(
            `http://localhost:8080/api/factory/update?factoryId=${factoryId}`, 
          {allowCredentials: true}, {
            factoryName: factoryName
          }).then(response => {
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
          }).catch(error => {
            alert("공장 이름 수정에 실패했습니다.");
            console.error("Error:", error);
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