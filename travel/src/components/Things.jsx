import React from 'react';
import img4 from './Images/img4.png';
import img5 from './Images/img5.png';
import img6 from './Images/img6.png';
import img7 from './Images/img7.png';
import img8 from './Images/img8.png';
import img9 from './Images/img9.png';
import img10 from './Images/img10.png';

function Things() {

  const back = {
    backgroundImage: `url(${img8})`,
  };

  const back2 = {
    backgroundImage: `url(${img9})`,
  };

  const back3 = {
    backgroundImage: `url(${img10})`,
  };

  return (
    <div className='Things dja' id='things'>
      <div className="container dja">
        <div className="content-all">
          <div className="row text-md-end">
            <div className="col-md-9 head-text-contain dja">
              <div className="heading">
                <h1>Things you need <span style={{ color: '#FA7436' }}>to do</span> </h1>
              </div>
              <div className="detail">
                <p>We ensure that you’ll embark on a perfectly planned, safe vacation at a price you can afford.</p>
              </div>
            </div>
            <div className="col-md-3 text-center mt-2">
              <div className="imgdiv">
                <img src={img4} alt="flightpic" className="img-fluid" />
              </div>
            </div>
          </div>

          <div className="row boxes mt-5">
            <div className="col-md-4 mb-4">
              <div className="box" style={back}>
                <img src={img5} alt="Sign Up" className="img-fluid" />
                <p className='topics'>Sign Up</p>
                <p className='details'>Completes all the work associated with planning and processing</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="box" style={back2}>
                <img src={img6} alt="Worth of Money" className="img-fluid" />
                <p className='topics'>Worth of Money</p>
                <p className='details'>After successful access then book from exclusive deals & pricing</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="box" style={back3}>
                <img src={img7} alt="Exciting Travel" className="img-fluid" />
                <p className='topics'>Exciting Travel</p>
                <p className='details'>Start and explore a wide range of exciting travel experiences.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Things;
