import React, { useEffect, useState } from 'react'
import './Blogs.css'
import { Blogscontain } from './Blogscontain'

function Blogs() {
  const [pageLimit] = useState(4);
  const [startIndex, setStartIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(pageLimit);
  const [currentPage, setCurrentPage] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);

  const pages = [];

  for (let i = 0; i < Math.ceil(Blogscontain.length / pageLimit); i++) {
    pages.push(i + 1);
  }

  const handleNextPage = () => {
    setStartIndex(lastIndex);
    setLastIndex(lastIndex + pageLimit);
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    setStartIndex(startIndex - pageLimit);
    setLastIndex(lastIndex - pageLimit);
    setCurrentPage((prev) => prev - 1);
  };

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    console.log(scrollPosition)

    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleKeyDown = (e) => {
      if (scrollPosition >= 4145 && scrollPosition <= 4770) {
        if (e.key === 'ArrowRight' && currentPage < pages[Math.ceil(Blogscontain.length / pageLimit) - 1]) {
          handleNextPage();
        } else if (e.key === 'ArrowLeft' && currentPage > 1) {
          handlePreviousPage();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };

  }, [currentPage, scrollPosition]);

  const handlePageClick = (index) => {
    setCurrentPage(index + 1)
    setStartIndex((index) * pageLimit)
    setLastIndex((index) * pageLimit + pageLimit)
  }

  return (
    <div className='Blogs' id='blogs'>
      <div className="Blog-containall">
        <div className="Blogs-heading">
          <h1>Get update with <span style={{ color: '#FA7436' }}>latest blog</span></h1>
        </div>

        <div className="Blogs-cards">
          {
            Blogscontain.slice(startIndex, lastIndex).map((items, index) => {
              return (
                <div className="Blogs-card1">
                  <img src={items.img} alt="" />
                  <p className='Blogs-desc'>{items.caption}</p>
                  <p className='Blogs-date'>{items.date}</p>
                </div>
              )
            })
          }
        </div>

        <div className="Blogs-ellipse-container">
          {
            pages.map((value, index) => {
              return (
                <div className={`Blogs-ellipse1 ${currentPage === value ? 'active' : ''}`} onClick={() => handlePageClick(index)}></div>
              )
            })
          }
          
        </div>
      </div>
    </div>
  )
}

export default Blogs
