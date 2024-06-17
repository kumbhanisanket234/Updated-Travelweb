import React from 'react'
import './Footer.css'
import img29 from '../Images/img29.png'
import img30 from '../Images/img30.png'
import img31 from '../Images/img31.png'


function Footer() {
  return (
    <div className='Footer' id='footer'>
      <div className="Footer-contain">
        <div className="Footer-subscribecontaine">
          <div className="Footer-subscribe">
            <div className="Footer-subscribe_inrdiv">
              <div className="Footer-heading">
                <h1>Subscribe and get exclusive deals & offer</h1>
                <div className="Footer-inputdata px-2">
                  <form className='form-group'>
                    <input type="text" className='form-control' id='Footer-input' placeholder='Enter Your Mail' required />
                  </form>
                  <button className="btn btn-default">subscribe</button>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="Footer-downdiv">
          <div className="Footer-containdetails">
            <div className="Footer-details">
              <div className="Footer-contact">
                <p className='Footer-ourname'>Trabook</p>
                <p className='Footer-line'>Book your trip in minute, get full Control for much longer.</p>
                <div className="Footer-imgcontain d-flex ">
                  <a href="https://www.facebook.com/profile.php?id=100069547090386" target="_blank"><img src={img29} alt="" /></a>
                  <a href="https://www.instagram.com/kumbhani___sanket/" target='_blank'><img src={img30} alt="" /></a>
                  <a href="https://x.com/KumbhaniSanket" target='_blank'><img src={img31} alt="" /></a>
                </div>
              </div>

              <div className="Footer-listcontain">
                <div className="Footer-list1">
                  <ul>
                    <li id='Footer-listheading'>Company</li>

                    <li>About</li>
                    <li>Careers</li>
                    <li>Logistic</li>
                    <li>Privacy & Policy</li>
                  </ul>
                </div>
                <div className="Footer-list1">
                  <ul>
                    <li id='Footer-listheading'>Contact</li>

                    <li>Help/FAQ</li>
                    <li>Press</li>
                    <li>Affilates</li>
                  </ul>
                </div>
                <div className="Footer-list1">
                  <ul>
                    <li id='Footer-listheading'>More</li>

                    <li>Press Centre</li>
                    <li>Our Blog</li>
                    <li>Low fare tips</li>
                  </ul>
                </div>
              </div>


            </div>
            <div className="Footer-endpart">
              <p>Copyright, Trabook 2022. All rights reserved.</p>
              <p>Terms & Conditions</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Footer
