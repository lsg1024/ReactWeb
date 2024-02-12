import React, { useState } from 'react';
import '../assets/style.css';
import searchImage from '../image/search.png';

const SearchBox = ({ onSearch }) => { 
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="header-container">
      <div className="search">
        <form onSubmit={handleSearch}>
          <input 
            type="text" 
            name="Search" 
            placeholder="검색" 
            className="search-box" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img className="search-img" src={searchImage} alt="Search"/>
        </form>
      </div>
    </div>
  );
};


export default SearchBox;
