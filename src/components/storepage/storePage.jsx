import React, { useState, useEffect, useCallback } from 'react';
import Header from '../fragment/header';
import BodyHeader from '../fragment/bodyheader';
import Pagination from '../Pagination';
import SearchBox from '../searchBox';
import client from '../client';
import { useNavigate } from 'react-router-dom';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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
  
  const fetchStores = useCallback(async(currentPage, searchQuery)  => {
    const url = searchQuery
        ? `/stores/search?storeSearch=${searchQuery}&page=${currentPage}`
        : `/stores?page=${currentPage}`;

    await client.get(url, {
      headers: {
        'access' : localStorage.getItem("access")
      }
    })
    .then(response => {
        const {content, totalPages} = response.data;
        setStores(content);
        setTotalPages(totalPages);
    })
    .catch(async error => {
      if (error.response && error.response.status === 401) {
          // 액세스 토큰이 만료되었을 때
          await reissueToken();
          console.log("액세스 토큰 재발급")
          fetchStores();
      
      } else {
          console.error('Error fetching factory:', error);
          alert('로그인 시간 만료');
          navigate('/');
      }
    });
  }, [reissueToken, navigate]);

  useEffect(() => {
        fetchStores(page, searchTerm);
    }, [fetchStores, page, searchTerm]);

    const handleSearch = (query) => {
        setSearchTerm(query);
        setPage(1);
    };
    
    const handleEdit = async (storeId) => {
        const storeName = prompt("상점 이름을 수정하세요:", "");
        if (storeName != null && storeName !== "") {
          await client.post(`/stores/update?storeId=${storeId}`,
          { storeName: storeName }, 
          { headers: {'access' : localStorage.getItem("access")} })
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
          })
          .catch(async error => {
            if (error.response && error.response.status === 401) {
                // 액세스 토큰이 만료되었을 때
                await reissueToken();
                console.log("액세스 토큰 재발급")
                fetchStores();
            
            } else {
                console.error('Error fetching factory:', error);
                alert('로그인 시간 만료');
                navigate('/');
            }
          });
        }
      };

  return (
    <div className="container">
      <Header />
      <BodyHeader />
      <SearchBox onSearch={handleSearch}/>
      <div className="store-list" >
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
              <tr key={index} style={{height:'55px', verticalAlign:'middle'}}>
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
