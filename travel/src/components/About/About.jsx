import React from 'react'
import './About.css'
import img17 from '../Images/img17.png'
import img18 from '../Images/img18.png'
import img24 from '../Images/img24.png'

function About() {
  return (
    <div className='About' id='about'>
      <div className="About-containAll">
        <div className="col-md-6 About-heading">
          <h1>What people say <span style={{ color: '#FA7436' }}>about Us.</span></h1>
          <p>Our Clients send us bunch of smilies with our services and we love them.</p>

          <div className="prenext-btn justify-content-center d-flex">
            <button className="btn-previous btn btn-default"><img src={img18} alt="" /></button>
            <button className="btn-next btn btn-default"><img src={img17} alt="" /></button>
          </div>
        </div>

        <div className="col-md-6">
          <div className="About-client1 position-relative">
            <img src={img24} alt="" />
            <div className="About-review position-absolute end-0 bottom-0">
              <p className='About-description'>“On the Windows talking painted pasture yet its express parties use. Sure last upon he same as knew next. Of believed or diverted no.”</p>
              <p className='username'>Mike taylor</p>
              <p className='userlocation'>Lahore, Pakistan</p>
            </div>
            <div className="About-client2">
              <p className='username'>Chris Thomas</p>
              <p className='userdetail'>CEO of Red Button</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
