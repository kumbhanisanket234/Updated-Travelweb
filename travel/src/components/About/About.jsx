import React, { useState } from 'react'
import './About.css'
import img24 from '../Images/img24.png'

import { Reviews } from './Reviewcontain'


function About() {

  const [newIndex, setNewIndex] = useState(0);
  const [active, setActive] = useState(false)
  const handleNextBtn = () => {
    setNewIndex(pre => pre + 1);
    setActive(false);
  }
  const handlePreviousBtn = () => {
    setNewIndex(pre => pre - 1)
    setActive(true)
  }

  return (
    <div className='About' id='about'>
      <div className="About-containAll">
        <div className="col-md-6 About-heading">
          <h1>What people say <span style={{ color: '#FA7436' }}>about Us.</span></h1>
          <p>Our Clients send us bunch of smilies with our services and we love them.</p>

          <div className="prenext-btn justify-content-center d-flex">
            <button className="btn-previous btn btn-default" id='btn-next' disabled={newIndex <= 0 ? true : false} style={active ? { backgroundColor: "#FA7436" } : null} onClick={handlePreviousBtn} ><i class="fa-solid fa-arrow-left"></i></button>
            <button className="btn-next btn btn-default" id='btn-previous' disabled={newIndex >= Reviews.length - 1 ? true : false} style={!active ? { backgroundColor: "#FA7436" } : { backgroundColor: "white" }} onClick={handleNextBtn} ><i class="fa-solid fa-arrow-right"></i></button>
          </div>
        </div>

        <div className="col-md-6">
          <div className="About-client1 position-relative">
            <img src={Reviews[newIndex].img} alt="profile photo" style={{ zIndex: "1000" }} />
            <div className="About-review position-absolute end-0 bottom-0">
              <p className='About-description'>“{Reviews[newIndex].description}”</p>
              <p className='username'>{Reviews[newIndex].name}</p>
              <p className='userlocation'>{Reviews[newIndex].location}</p>
            </div>
            {
              Reviews.length - 1 > newIndex &&
              < div className="About-client2">
                <p className='username'>{Reviews[newIndex + 1].name}</p>
                <p className='userdetail'>{Reviews[newIndex + 1].post}</p>
              </div >
            }
          </div>
        </div>
      </div>
    </div >
  )
}

export default About
