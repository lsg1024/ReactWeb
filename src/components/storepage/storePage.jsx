import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../fragment/header';
import BodyHeader from '../fragment/bodyheader';
import Pagination from '../Pagination';
import SearchBox from '../searchBox';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
        fetchStores(page, searchTerm);
    }, [page, searchTerm]);

    const fetchStores = (currentPage, searchQuery)  => {
        const url = searchQuery
            ? `http://localhost:8080/api/stores/search?storeSearch=${searchQuery}&page=${currentPage}`
            : `http://localhost:8080/api/stores?page=${currentPage}`;

        axios.get(url, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then(response => {
            const {content, totalPages} = response.data;
            setStores(content);
            setTotalPages(totalPages);
        })
        .catch(error => alert(error));
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
        setPage(1);
    };
    
    const handleEdit = (storeId) => {
        const storeName = prompt("상점 이름을 수정하세요:", "");
        if (storeName != null && storeName !== "") {
          axios.post(`http://localhost:8080/api/stores/update?storeId=${storeId}`,
          { storeName: storeName }, 
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          })
          .then(response => {
          if (response.status === 200) {

              const updatedStores = stores.map(store => {
                  if (store.storeId === storeId) {
                    return { ...store, storeName: storeName };
                  }
                  return store;
                });
                setStores(updatedStores); // 상태 업데이트
                console.log("상점 이름이 성공적으로 수정되었습니다.");

          }
          }).catch(error => {
            alert("상점 이름 수정에 실패했습니다.");
            console.error("Error:", error);
          });
        }
      };

  return (
    <div className="container">
      <Header />
      <BodyHeader />
      <SearchBox onSearch={handleSearch}/>
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
            {stores.map((store, index) => (
              <tr key={index}>
                <td>{index + 1 + (page - 1) * 10}</td>
                <td>{store.storeName}</td>
                <td>
                <button className="btn btn-primary edit_btn" onClick={() => 
                  handleEdit(store.storeId)}>수정</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage}/>
    </div>
  );
};

export default StoreList;
