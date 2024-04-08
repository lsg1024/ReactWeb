import React, { useState, useEffect, useCallback } from 'react';
import Header from '../fragment/header';
import BodyHeader from '../fragment/bodyheader';
import Pagination from '../Pagination';
import SearchBox from '../searchBox';
import client from '../client';
import { useNavigate } from 'react-router-dom';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [token, setToken] = useState(localStorage.getItem("access") || '')
    const navigate = useNavigate();

    const reissueToken = useCallback(async () => {
        try {
            const response = await client.post('/reissue');
            const { status, headers } = response;
            if (status === 200) {
                const accessToken = headers['access'];
                localStorage.setItem("access", accessToken);
                setToken(accessToken);
            }
            console.log("200 에러 위치")
        } catch (error) {
            if (error.response && error.response.status === 400) {
                navigate('/');
                alert("로그인 유지 시간이 만료되었습니다.")
            }
            
        }
    }, [navigate]);

    const fetchStores = useCallback(async (currentPage, searchQuery)  => {
        const url = searchQuery
            ? `/users/search?userSearch=${searchQuery}&page=${currentPage}`
            : `/users?page=${currentPage}`;
        try {
            const response = await client.get(url, {
                headers: {
                    "access" : token
                }
            })
            if (response.status === 200) {
                const {content, totalPages} = response.data;
                setUsers(content);
                setTotalPages(totalPages);
            } 
        }
        catch (error) {
            if (error.response.status === 401) {
                await reissueToken();
                fetchStores(currentPage, searchQuery);
            
            } 
            else {
                alert("접근 권한이 없습니다.")
                navigate("/home")
            }
        }
        
    }, [reissueToken, navigate, token]);
    
    useEffect(() => {
        fetchStores(page, searchTerm);
    }, [fetchStores, page, searchTerm]);

    const handleSearch = (query) => {
        setSearchTerm(query);
        setPage(1);
    };

    return (
        <div>
            <div className= "container">
                <Header/>
                <BodyHeader/>
                <SearchBox onSearch={handleSearch}/>
                <div className="store-list" style={{marginTop : '15px'}}>
                    <table className="table mx-auto">
                        <thead>
                            <tr>
                                <th className='th-1'>번호</th>
                                <th className='th-1'>이름</th>
                                <th className='th-1'>이메일</th>
                                <th className='th-1'>권한</th>
                                <th className='th-1'>생성일</th>
                                <th className='th-1'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index} style={{height:'55px', verticalAlign:'middle'}}>
                                    <td>{index + 1}</td>
                                    <td>{user.userName}</td>
                                    <td>{user.userEmail}</td>
                                    <td>{user.role}</td>
                                    <td>{user.lastModifiedDate}</td>
                                    <td><button className='btn btn-danger edit_btn'>삭제</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage}/>
        </div>
    )
};

export default Users;