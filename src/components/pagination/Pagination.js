import React from 'react';
import ReactPaginate from 'react-paginate';
import './Pagination.css';

const Pagination = ({ pageCount, currentPage, setCurrentPage }) => {
  const handlePageChange = (selectedPage) => {
    if (setCurrentPage) {
      setCurrentPage(selectedPage.selected);
    }
  };

  return (
    <div className="pagination-container">
      <ReactPaginate
        previousLabel="Prev"
        nextLabel="Next"
        breakLabel="..."
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageChange}
        containerClassName="pagination"
        activeClassName="active"
        forcePage={currentPage}
      />
    </div>
  );
};

export default Pagination;
