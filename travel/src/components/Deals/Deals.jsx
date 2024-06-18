import React, { useState } from 'react'
import './Deals.css'
import img15 from '../Images/img15.png'
import img16 from '../Images/img16.png'
import { Locations } from './Locations'
import Pagination, { usePagination } from '../Pagination'


function Dealsdetails() {
  const pageLimit = 4;
  const { handleNextBtn, handlePreviousBtn, currentPage, active, startIndex, lastIndex } = usePagination();
  const pages = Locations.length / pageLimit;

  return (
    <div className='Deals' id='deals'>
      <div className="Deal-content">

        <div className="Deal-headcontain">
          <div className="Deal-textdiv">
            <div className="Deal-heading">
              <h1>Exclusive <span style={{ color: '#FA7436' }}>deals & discounts</span> </h1>
            </div>
            <div className="Deal-detail d-flex justify-content-center">
              <p>Discover our fantastic early booking discounts & start planning your journey.</p>
            </div>
          </div>
        </div>

        <div className="Deal-boxes">
          {
            Locations.slice(startIndex, lastIndex).map((item, index) => {
              return (
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
                    <div className="detail-container">
                      <div className='Deal-details d-flex'>
                        <img src={img16} alt="" />
                        <p>{item.country}</p>
                      </div>
                      <div className="price d-flex gap-2">
                        <p style={{ textDecoration: 'line-through' }}>${item.cutoutprice}</p>
                        <p style={{ color: '#FA7436', backgroundColor: '#FFE7DB', borderRadius: '7px', padding: '0px 10px', fontWeight: '700' }}>${item.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>

        <div className="prenext-btn justify-content-center d-flex">
          <button className="btn-previous btn btn-default" id='btn-previous' disabled={currentPage <= 1 ? true : false} onClick={handlePreviousBtn} style={active ? { backgroundColor: "#FA7436" } : null}><i class="fa-solid fa-arrow-left"></i></button>
          <button className="btn-next btn btn-default" id='btn-next' disabled={currentPage >= pages ? true : false} onClick={handleNextBtn} style={!active ? { backgroundColor: "#FA7436" } : { backgroundColor: "white" }}><i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>

    </div>
  )
}

function Deals() {
  const [pageLimit] = useState(4);
  return (
    <Pagination pageLimit={pageLimit}>
      <Dealsdetails />
    </Pagination>
  )
}
export default Deals
