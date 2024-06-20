
import React, { useState } from 'react';
import './About.css';
import { Reviews } from './Reviewcontain';

function About() {
  const [newIndex, setNewIndex] = useState(0);
  const [active, setActive] = useState(false);

  const handleNextBtn = () => {
    setNewIndex((prev) => prev + 1);
    setActive(false);
  };

  const handlePreviousBtn = () => {
    setNewIndex((prev) => prev - 1);
    setActive(true);
  };

  return (
    <div className='About' id='about'>
      <div className="container About-containAll">
        <div className="row">
          <div className="col-lg-6 col-md-12 About-heading">
            <h1>What people say <span style={{ color: '#FA7436' }}>about Us.</span></h1>
            <p>Our Clients send us bunch of smilies with our services and we love them.</p>
            <div className="prenext-btn justify-content-center d-flex">
              <button
                className="btn-previous btn btn-default"
                id='btn-previous'
                disabled={newIndex <= 0}
                style={active ? { backgroundColor: "#FA7436" } : { backgroundColor: "white" }}
                onClick={handlePreviousBtn}
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <button
                className="btn-next btn btn-default"
                id='btn-next'
                disabled={newIndex >= Reviews.length - 1}
                style={!active ? { backgroundColor: "#FA7436" } : { backgroundColor: "white" }}
                onClick={handleNextBtn}
              >
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <div className="col-lg-6 col-md-12">
            <div className="About-client1">
              <img src={Reviews[newIndex].img} alt="profile" />
              <div className="About-review">
                <div>
                  <p className='About-description'>“{Reviews[newIndex].description}”</p>
                </div>
                <div>
                  <p className='username'>{Reviews[newIndex].name}</p>
                  <p className='userlocation'>{Reviews[newIndex].location}</p>
                </div>

              </div>
              {
                Reviews.length - 1 > newIndex &&
                <div className="About-client2">
                  <p className='username'>{Reviews[newIndex + 1].name}</p>
                  <p className='userdetail'>{Reviews[newIndex + 1].post}</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
