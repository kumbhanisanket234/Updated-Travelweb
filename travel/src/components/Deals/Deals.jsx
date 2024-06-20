import React, { useState } from 'react';
import './Deals.css';
import img15 from '../Images/img15.png';
import { Locations } from './Locations';
import Pagination, { usePagination } from '../Pagination';

function Dealsdetails() {
  const pageLimit = 4;
  const { handleNextBtn, handlePreviousBtn, currentPage, active, startIndex, lastIndex } = usePagination();
  const pages = Math.ceil(Locations.length / pageLimit);

  return (
    <div className='Deals' id='deals'>
      <div className="container">
        <div className="Deal-content">
          <div className="Deal-headcontain row text-center">
            <div className="col">
              <div className="Deal-heading">
                <h1>Exclusive <span style={{ color: '#FA7436' }}>deals & discounts</span></h1>
              </div>
              <div className="Deal-detail">
                <p>Discover our fantastic early booking discounts & start planning your journey.</p>
              </div>
            </div>
          </div>

          <div className="row Deal-boxes gy-4">
            {Locations.slice(startIndex, lastIndex).map((item, index) => (
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="Deal-box">
                  <img id='location-img' src={item.img} alt="" />
                  <div className="Deal-carddetail">
                    <div className='Deal-City'>
                      <p className='Deal-topics'>{item.city}</p>
                      <div className='d-flex'>
                        <img src={img15} alt="" />
                        <p>{item.rating}</p>
                      </div>
                    </div>
                    <div className="detail-container py-2">
                      <div className='Deal-details d-flex gap-1'>
                        <i className="fa-solid fa-location-dot"></i>
                        <p>{item.country}</p>
                      </div>
                      <div className="price d-flex gap-2">
                        <p style={{ textDecoration: 'line-through' }}>${item.cutoutprice}</p>
                        <p className="discounted">${item.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="prenext-btn">
            <button className="btn-previous btn btn-default" id='btn-previous' disabled={currentPage <= 1 ? true : false} onClick={handlePreviousBtn} style={active ? { backgroundColor: "#FA7436" } : null}><i class="fa-solid fa-arrow-left"></i></button>
            <button className="btn-next btn btn-default" id='btn-next' disabled={currentPage >= pages ? true : false} onClick={handleNextBtn} style={!active ? { backgroundColor: "#FA7436" } : { backgroundColor: "white" }}><i class="fa-solid fa-arrow-right"></i></button>
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
