import React, { useEffect, useState, useRef } from 'react';
import img15 from './Images/img15.png';
import Pagination, { usePagination } from './Pagination';
import toast, { Toaster } from "react-hot-toast"
import { useCartContext } from '../context/cartcontext';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

function Dealsdetails() {
  const [cardContain, setCardContain] = useState([]);
  const [active, setActive] = useState(false);
  const [cart, setCart] = useCartContext();

  const navigate = useNavigate();

  let loginUserData = localStorage.getItem('user');
  let userId;
  if (loginUserData) {
    if (JSON.parse(loginUserData)._id) {
      userId = JSON.parse(loginUserData)._id;
    }
    else {
      userId = JSON.parse(loginUserData).id;
    }
  }

  useEffect(() => {
    fetch(`http://localhost:3001/favorites/${userId}`)
      .then((response) => response.json())
      .then((data) => setCart(data))
      .catch((err) => console.log(err));

    fetch('http://localhost:3001/products/getdeals')
      .then(response => response.json())
      .then(data => setCardContain(data))
      .catch(err => console.log(err));

  }, [userId])

  const handleLikeBtn = (item, index) => {
    console.log('✌️item --->', item);

    const productId = item._id;

    const itemInCart = cart.some((cartValue) => cartValue._id === item._id);
    if (itemInCart) {
      const Update = cart.filter((val, id) => {
        return item._id !== val._id
      })
      setCart(Update);

      axios.post('http://localhost:3001/favorites/remove', { productId, userId })
        .then(() => {
          toast.error('Removed From Favourite!')
        })
        .catch((err) => {
          console.log('✌️err --->', err);
        })
      return;
    }

    axios.post("http://localhost:3001/favorites/add", { userId, productId, item })
      .then((data) => {
        setCart(data.data.favoriteProducts)
        toast.success('Added To Favourite!')
      })
      .catch((err) => {
        console.log('✌️err --->', err);
      });
  }

  const handleDealsBooking = (item) => {
    localStorage.setItem('destination',item.city);
    navigate('/bookingdetails')
  }

  const [itemsPerPage, setItemsPerPage] = useState(1);
  const carouselRef = useRef(null);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 500 }, items: 2 },
    mobile: { breakpoint: { max: 500, min: 0 }, items: 1 }
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

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.previous();
      setActive(true);
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
      setActive(false);
    }
  };


  return (
    <div className='Deals' id='deals'>
      <div className="container dja">
        <div className="Deal-content">
          <div className="Deal-headcontain row text-center">
            <div className="dja head-text-contain">
              <div className="heading">
                <h1>Exclusive <span style={{ color: '#FA7436' }}>deals & discounts</span></h1>
              </div>
              <div className="detail">
                <p>Discover our fantastic early booking discounts & start planning your journey.</p>
              </div>
            </div>
          </div>

          <div className="row dja gy-4 mt-3">
          {/* <Toaster /> */}
            <Carousel
              responsive={responsive}
              keyBoardControl={true}
              customLeftArrow={<div style={{ display: 'none' }} />}
              customRightArrow={<div style={{ display: 'none' }} />}
              removeArrowOnDeviceType={["tablet", "mobile"]}
              afterChange={(previousSlide, { currentSlide }) => { }}
              slidesToSlide={itemsPerPage}
              ref={carouselRef}
            >
              {cardContain.map((item, index) => (
                <div className="Deal-card" key={index}>
                  <div className="Deal-box">
                    <div className="image-container">
                      <img id='location-img' src={item.imgURL} alt="" onClick={() => handleDealsBooking(item)} />
                      <i className="fa-regular fa-heart like-icon" title={cart.some((cartValue) => cartValue._id === item._id) ? "Remove From Favourite" : "Add To Favourite"} style={cart.some((cartValue) => cartValue._id === item._id) ? { backgroundColor: '#FA7436', color: 'white' } : null} onClick={() => handleLikeBtn(item, index)}></i>

                    </div>
                    <div className="Deal-carddetail">
                      <div className='Deal-City'>
                        <p className='Deal-topics'>{item.city}</p>
                        <div className='d-flex'>
                          <img src={img15} alt="" />
                          <p>{item.rating}</p>
                        </div>
                      </div>
                      <div className="detail-container py-2">
                        <div className='details d-flex gap-1'>
                          <i className="fa-solid fa-location-dot"></i>
                          <p>{item.country}</p>
                        </div>
                        <div className="price d-flex gap-2">
                          <p style={{ textDecoration: 'line-through' }}>${item.cutoutPrice}</p>
                          <p className="discounted">${item.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
              )}
            </Carousel>

          </div>

          <div className="prenext-btn">
            <button className="btn-previous btn btn-default" id='btn-previous' onClick={handlePrev} style={active ? { backgroundColor: "#FA7436" } : { backgroundColor: "white" }}><i className="fa-solid fa-arrow-left"></i></button>
            <button className="btn-next btn btn-default" id='btn-next' onClick={handleNext} style={!active ? { backgroundColor: "#FA7436" } : { backgroundColor: "white" }}><i className="fa-solid fa-arrow-right"></i></button>
          </div>
        </div>
      </div>
    </div >
  );
}

function Deals() {
  const [pageLimit] = useState(4);
  return (
    <Pagination pageLimit={pageLimit}>
      <Dealsdetails />
    </Pagination>
  );
}

export default Deals;
