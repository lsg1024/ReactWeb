import React from 'react';

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

export default Pagination;
