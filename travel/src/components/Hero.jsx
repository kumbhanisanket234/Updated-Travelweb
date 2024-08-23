import React from 'react';
import img3 from './Images/img3.png';
import headimg from './Images/Head_img.png';
import { Navigate, useNavigate } from 'react-router-dom';


function Hero() {

    const navigate =useNavigate();
    return (
        <div className='Hero' id='hero'>
            <div className="container fcc containerhome">
                <div className="row">
                    <div className="col-lg-6 col-md-12 home">
                        <div className="text">
                            <h2>Get started your exciting <span style={{ color: '#FA7436' }}>journey</span> with us.</h2>
                        </div>
                        <div className="paragraph">
                            <p>A Team of experienced tourism professionals will provide you with the best advice and tips for your desired place.</p>
                        </div>
                        <div className="btndiscover">
                            <button className="btn btn-primary discover-btn" id='btn-discover' onClick={()=>{navigate('/discover')}}>Discover Now</button>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12 main-img">
                        <img src={headimg} alt="Head" />
                    </div>
                </div>
            </div>
            <div className="navbar-main2">
                <div className="inr">
                    <div className="content">
                        <div className='d-flex gap-4'>
                            <div className="location">
                                <div className="afterpic">
                                    <p className='topicname'>Location</p>
                                    <img src={img3} alt="icon" />
                                </div>
                                <p className='que'>Where are you going</p>
                            </div>
                            <div className="Date">
                                <div className="afterpic">
                                    <p className='topicname'>Date</p>
                                    <img src={img3} alt="icon" />
                                </div>
                                <p className='que'>When you will go</p>
                            </div>
                            <div className="Guest">
                                <div className="afterpic">
                                    <p className='topicname'>Guest</p>
                                    <img src={img3} alt="icon" />
                                </div>
                                <p className='que'>Number of guest</p>
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-primary" id='btn-explore'>Explore Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;
