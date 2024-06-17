import React, { useState } from 'react'
import './Plans.css'
import img15 from '../Images/img15.png'
import img19 from '../Images/img19.png'
import img23 from '../Images/img23.png'
import { Exclusiveplans } from './Exclusiveplans'
import Pagination, { usePagination } from '../Pagination'

function Plansdetails() {
  const [pageLimit, setPageLimit] = useState(3);
  const pages = Exclusiveplans.length / pageLimit;
  const { handleNextBtn, handlePreviousBtn, active, currentPage, startIndex, lastIndex } = usePagination();

  return (
    <div className='Plans' id='plans'>
      <div className="Plans-content">

        <div className="Plans-headcontain">
          <div className="Plans-textdiv">
            <div className="Plans-heading">
              <h1>Best <span style={{ color: '#FA7436' }}>vacation plan</span> </h1>
            </div>
            <div className="Plans-detail d-flex justify-content-center">
              <p>Plan your perfect vacation with our travel agency. Choose among hundreds of all-inclusive offers! </p>
            </div>
          </div>
          <div className="imgdiv">
            <img src={img19} alt="img" />
          </div>
        </div>

        <div className="Plans-boxes">
          {
            Exclusiveplans.slice(startIndex, lastIndex).map((item, index) => {
              return (
                <div className="Plans-box">
                  <img src={item.img} id='city-image' alt="" />
                  <div className="Plans-carddetail">
                    <div className='Plans-City'>
                      <p className='Plans-topics'>{item.place}</p>
                      <div className='d-flex Plans-amt'>
                        <p>${item.price}</p>
                      </div>
                    </div>
                    <div className="detail-container">
                      <div className='Plans-details d-flex'>
                        <img src={img23} alt="" />
                        <p>{item.duration} Days Trip</p>
                      </div>
                      <div className="Plans-price d-flex" >
                        <img src={img15} alt="" />
                        <p>{item.rating}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className="prenext-btn justify-content-center d-flex">
          <button className="btn-previous btn btn-default" disabled={currentPage <= 1 ? true : false} onClick={handlePreviousBtn} style={active ? { backgroundColor: "#FA7436" } : null}><i class="fa-solid fa-arrow-left"></i></button>
          <button className="btn-next btn btn-default" disabled={currentPage >= pages ? true : false} onClick={handleNextBtn} style={!active ? { backgroundColor: "#FA7436" } : { backgroundColor: "white" }}><i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
    </div>
  )
}

function Plans() {
  const [pageLimit] = useState(3);

  return (
    <Pagination pageLimit={pageLimit}>
      <Plansdetails />
    </Pagination>
  )
}

export default Plans;
