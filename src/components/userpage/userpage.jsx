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

    const fetchStores = useCallback(async (currentPage, searchQuery)  => {
        const url = searchQuery
            ? `/users/search?userSearch=${searchQuery}&page=${currentPage}`
            : `/users?page=${currentPage}`;
        try {
            const response = await client.get(url, {
                headers: {
                    "access" : localStorage.getItem("access")
                }
            })
            console.log("response status = ",response.status)
            if (response.status === 200) {
                const {content, totalPages} = response.data;
                setUsers(content);
                setTotalPages(totalPages);
            } 
        }
        catch (error) {
            if (error.response && error.response.status === 401) {
                await reissueToken();
                fetchStores(currentPage, searchQuery);
            } 
            else if (error.status === 403) {
                alert("접근 권한이 없습니다.")
                navigate("/home")
            }
        }
        
    }, [reissueToken, navigate]);

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
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{user.userName}</td>
                                    <td>{user.userEmail}</td>
                                    <td>{user.role}</td>
                                    <td>{user.lastModifiedDate}</td>
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