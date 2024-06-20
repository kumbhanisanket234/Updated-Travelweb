import React, { useState } from 'react';
import './Plans.css';
import img15 from '../Images/img15.png';
import img19 from '../Images/img19.png';
import img23 from '../Images/img23.png';
import { Exclusiveplans } from './Exclusiveplans';
import Pagination, { usePagination } from '../Pagination';

function Plansdetails() {
  const [pageLimit, setPageLimit] = useState(3);
  const pages = Math.ceil(Exclusiveplans.length / pageLimit);
  const { handleNextBtn, handlePreviousBtn, active, currentPage, startIndex, lastIndex } = usePagination();

  return (
    <div className='Plans' id='plans'>
      <div className="container">
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
            {Exclusiveplans.slice(startIndex, lastIndex).map((item, index) => (
              <div className="col-lg-4 col-md-6 col-sm-12" key={index}>
                <div className="Plans-box">
                  <img src={item.img} id='city-image' alt="" />
                  <div className="Plans-carddetail">
                    <div className='Plans-City gap-4 d-flex justify-content-between'>
                      <p className='Plans-topics'>{item.place}</p>
                      <div className='Plans-amt'>
                        <p>${item.price}</p>
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
          </div>

          <div className="prenext-btn justify-content-center d-flex">
            <button className="btn-previous btn btn-default" id='btn-previous' disabled={currentPage <= 1 ? true : false} onClick={handlePreviousBtn} style={active ? { backgroundColor: "#FA7436" } : null}><i class="fa-solid fa-arrow-left"></i></button>
            <button className="btn-next btn btn-default" id='btn-next' disabled={currentPage >= pages ? true : false} onClick={handleNextBtn} style={!active ? { backgroundColor: "#FA7436" } : { backgroundColor: "white" }}><i class="fa-solid fa-arrow-right"></i></button>
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
