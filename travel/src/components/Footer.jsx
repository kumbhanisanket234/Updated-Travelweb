import React from 'react';
import img29 from './Images/img29.png';
import img30 from './Images/img30.png';
import img31 from './Images/img31.png';

function Footer() {
  const scrollToComponent = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };
  return (
    <div className='Footer' id='footer'>
      <div className="container dja">
        <div className="Footer-downdiv">
          <div className="Footer-containdetails w-100">
            <div className="Footer-details row">
              <div className="Footer-contact col-md-4">
                <p className='Footer-ourname'>Trabook</p>
                <p className='Footer-line'>Book your trip in minute, get full Control for much longer.</p>
                <div className="Footer-imgcontain d-flex ">
                  <a href="https://www.facebook.com/profile.php?id=100069547090386" target="_blank" rel="noopener noreferrer"><img src={img29} alt="Facebook" /></a>
                  <a href="https://www.instagram.com/kumbhani___sanket/" target='_blank' rel="noopener noreferrer"><img src={img30} alt="Instagram" /></a>
                  <a href="https://x.com/KumbhaniSanket" target='_blank' rel="noopener noreferrer"><img src={img31} alt="Twitter" /></a>
                </div>
              </div>

              <div className="Footer-listcontain col-md-8 d-flex justify-content-around">
                <div className="Footer-list1">
                  <ul>
                    <li id='Footer-listheading'>Company</li>
                    <li className='navlink' onClick={() => { scrollToComponent('about') }}>About</li>
                    {/* <li>Careers</li> */}
                    {/* <li>Logistic</li> */}
                    <a href='/privacy'><li className='navlink'>Privacy & Policy</li></a>
                  </ul>
                </div>
                <div className="Footer-list1">
                  <ul>
                    <li id='Footer-listheading'>Contact</li>
                    <a href='/helps'><li className='navlink'>Help/FAQ</li></a>
                    {/* <li>Press</li> */}
                    {/* <li>Affiliates</li> */}
                  </ul>
                </div>
                <div className="Footer-list1">
                  <ul>
                    <li id='Footer-listheading'>More</li>
                    {/* <li>Press Centre</li> */}
                    <li className="navlink" onClick={() => { scrollToComponent('Blog-containall') }}>Our Blogs</li>
                    {/* <li>Low fare tips</li> */}
                  </ul>
                </div>
              </div>
            </div>

            <div className="Footer-endpart row w-100">
              <p className="col-md-6 text-center text-md-start">Copyright, Trabook 2024. All rights reserved.</p>
              <p className="col-md-6 text-center text-md-end "> <a href="/terms" className='navlink'>Terms & Conditions</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
