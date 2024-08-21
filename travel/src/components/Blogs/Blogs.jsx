import React, { useEffect, useState, useRef } from 'react';
import './Blogs.css';
import { Blogscontain } from './Blogscontain';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link, useNavigate } from 'react-router-dom';

function Blogs() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const carouselRef = useRef(null);
  const dotLength = [];
  const navigate=useNavigate();

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
  };

  useEffect(() => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 3000) {
      setItemsPerPage(responsive.superLargeDesktop.items);
    } else if (screenWidth >= 1024) {
      setItemsPerPage(responsive.desktop.items);
    } else if (screenWidth >= 464) {
      setItemsPerPage(responsive.tablet.items);
    } else {
      setItemsPerPage(responsive.mobile.items);
    }
  }, []);

  const handleDotClick = (index) => {
    setCurrentPage(index);
    carouselRef.current.goToSlide(index * itemsPerPage);
  };

  const handleSlideChange = (currentSlide) => {
    setCurrentPage(Math.ceil(currentSlide / itemsPerPage));
  };

  for (let i = 0; i < Math.ceil(Blogscontain.length / itemsPerPage); i++) {
    dotLength.push(i);
  }

  const handleBlog=(item)=>{
    localStorage.setItem('blogtitle',item.title)
  }
  return (
    <div className='Blogs' id='blogs'>
      <div className="Blog-containall">
        <div className="Blogs-heading">
          <h1>Get update with <span style={{ color: '#FA7436' }}>latest blog</span></h1>
        </div>

        <div className="Blogs-cards">
          <Carousel
            responsive={responsive}
            keyBoardControl={true}
            removeArrowOnDeviceType={["tablet", "mobile"]}
            afterChange={(previousSlide, { currentSlide }) => handleSlideChange(currentSlide)}
            slidesToSlide={itemsPerPage}
            ref={carouselRef}
          >
            {Blogscontain.map((items, index) => (
              <div className="Blogs-card1 m-auto" key={index}>
                <div><Link style={{display: "table-cell"}} to="/blog" target="_blank"><img src={items.img} alt="" onClick={()=>handleBlog(items)}/></Link></div>
                <p className='Blogs-desc'>{items.title}</p>
                <p className='Blogs-date'>{items.date}</p>  
              </div>
            ))}
          </Carousel>
        </div>

        <div className="Blogs-ellipse-container">
          {dotLength.map((index) => (
            <div
              key={index}
              className={`Blogs-ellipse1 ${currentPage === index ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Blogs;
