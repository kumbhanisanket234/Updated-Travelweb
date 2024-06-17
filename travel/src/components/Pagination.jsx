import React from 'react'
import { useContext, createContext, useState } from 'react';

const PaginationContext = createContext();

function Pagination({ children, pageLimit }) {
    const [startIndex, setStartIndex] = useState(0);
    const [lastIndex, setLastIndex] = useState(pageLimit);
    const [active, setActive] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const handlePreviousBtn = () => {
        setActive(true);
        setStartIndex(startIndex - pageLimit);
        setLastIndex(lastIndex - pageLimit);
        setCurrentPage(pre => pre - 1);
    }

    const handleNextBtn = () => {
        setActive(false);
        setStartIndex(lastIndex);
        setLastIndex(lastIndex + pageLimit);
        setCurrentPage(pre => pre + 1);
    }
    return (
        <PaginationContext.Provider value={{ handleNextBtn, handlePreviousBtn, currentPage, active, startIndex, lastIndex }}>
            {children}
        </PaginationContext.Provider>
    )
}

export default Pagination
export const usePagination = () => useContext(PaginationContext);
