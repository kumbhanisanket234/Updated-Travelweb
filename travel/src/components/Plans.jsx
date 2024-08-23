import React, { useState, useRef, useEffect } from 'react';
import img15 from './Images/img15.png';
import img19 from './Images/img19.png';
import img23 from './Images/img23.png';
import Pagination, { usePagination } from './Pagination';
import toast, { Toaster } from "react-hot-toast"
import { useCartContext } from '../context/cartcontext';
import Carousel from 'react-multi-carousel';
import axios from 'axios';
import 'react-multi-carousel/lib/styles.css';
import { useNavigate } from 'react-router-dom';

function Plansdetails() {
  const [plansContain, setPlansContain] = useState([]);
  const [active, setActive] = useState(false);
  const navigate=useNavigate();

  const [cart, setCart] = useCartContext();
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

    fetch('http://localhost:3001/plans/getplans', { withCredentials: true })
      .then(response => response.json())
      .then(data => setPlansContain(data))
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
      setActive(false);
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
      setActive(true);
    }
  };

  const handlePlansBooking = (item) => {
    localStorage.setItem('destination',item.location);
    navigate('/bookingdetails')
  }

  return (
    <div className='Plans' id='plans'>
      <div className="container fcc">
        <div className="Plans-content">
          <div className="Plans-headcontain row align-items-center text-center">
            <div className="col-md-8">
              <div className="Plans-heading">
                <h1>Best <span style={{ color: '#FA7436' }}>vacation plan</span></h1>
              </div>
              <div className="Plans-detail">
                <p>Plan your perfect vacation with our travel agency. Choose among hundreds of all-inclusive offers!</p>
              </div>
            </div>
            <div className="col-md-4">
              <img src={img19} alt="img" className="img-fluid" />
            </div>
          </div>
          <div className="row Plans-boxes">
            <Toaster />

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
              {
                plansContain.map((item, index) => (
                  <div className="Plans-card" key={index}>
                    <div className="Plans-box">
                      <div className="image-container">
                        <img id='location-img' src={item.imgURL} alt="" onClick={()=>handlePlansBooking(item)}/>
                        <i className="fa-regular fa-heart heart-icon" title={cart.some((cartValue) => cartValue._id === item._id) ? "Remove From Favourite" : "Add To Favourite"} style={cart.some((cartValue) => cartValue._id === item._id) ? { backgroundColor: '#FA7436', color: 'white' } : null} onClick={() => handleLikeBtn(item, index)}></i>
                      </div>
                      <div className="Plans-carddetail">
                        <div className='Plans-City d-flex justify-content-between'>
                          <p className='Plans-topics'>{item.location}</p>
                          <div className='Plans-amt'>
                            <p>${item.price}k</p>
                          </div>
                        </div>
                        <div className="detail-container mt-1 d-flex justify-content-between">
                          <div className='Plans-details gap-1 d-flex'>
                            <img src={img23} alt="" />
                            <p>{item.duration} Days Trip</p>
                          </div>
                          <div className="Plans-price gap-1 d-flex">
                            <img src={img15} alt="" />
                            <p>{item.rating}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </Carousel>

          </div>

          <div className="prenext-btn justify-content-center d-flex">
            <button className="btn-previous btn btn-default" id='btn-previous' onClick={handlePrev} style={active ? { backgroundColor: "#FA7436" } : null}><i className="fa-solid fa-arrow-left"></i></button>
            <button className="btn-next btn btn-default" id='btn-next' onClick={handleNext} style={!active ? { backgroundColor: "#FA7436" } : { backgroundColor: "white" }}><i className="fa-solid fa-arrow-right"></i></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Plans() {
  const [pageLimit] = useState(3);

  return (
    <Pagination pageLimit={pageLimit}>
      <Plansdetails />
    </Pagination>
  );
}

export default Plans;
