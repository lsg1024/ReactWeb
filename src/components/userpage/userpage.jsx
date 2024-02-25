import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../fragment/header';
import BodyHeader from '../fragment/bodyheader';
import Pagination from '../Pagination';
import SearchBox from '../searchBox';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    
    useEffect(() => {
        fetchStores(page, searchTerm);
    }, [page, searchTerm]);

    const fetchStores = (currentPage, searchQuery)  => {
        const url = searchQuery
            ? `http://localhost:8080/api/users/search?userSearch=${searchQuery}&page=${currentPage}`
            : `http://localhost:8080/api/users?page=${currentPage}`;

        axios.get(url, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            const {content, totalPages} = response.data;
            setUsers(content);
            setTotalPages(totalPages);
        })
        .catch(error => alert(error));
    };

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
                                <th className='th-1'>수정일</th>
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