import React from "react";
import { Pagination as BSPagination } from "react-bootstrap";
import "./styles/Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    let pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const leftBound = Math.max(1, currentPage - 2);
      const rightBound = Math.min(totalPages, currentPage + 2);

      if (leftBound > 1) pages.push(1, "...");
      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }
      if (rightBound < totalPages) pages.push("...", totalPages);
    }

    return pages;
  };

  return (
    <BSPagination className="custom-pagination">
      <BSPagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {getPageNumbers().map((number, index) =>
        number === "..." ? (
          <BSPagination.Ellipsis key={`ellipsis-${index}`} />
        ) : (
          <BSPagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => onPageChange(number)}
          >
            {number}
          </BSPagination.Item>
        )
      )}
      <BSPagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    </BSPagination>
  );
};

export default Pagination;
