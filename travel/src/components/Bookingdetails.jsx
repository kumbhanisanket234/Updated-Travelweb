import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Bookingdetails = () => {
  const navigate = useNavigate();
  const destination=localStorage.getItem('destination');
  const [packageDetails, setPackageDetails] = useState([]);

  const handleBooking = () => {
    navigate('/booking');
  }

  useEffect(() => {
    fetch("http://localhost:3001/Boookingdetails/getBoookingdetails")
      .then(response => response.json())
      .then(data => {
        data.map((item,index)=>{
          if(item.location.trim().toLowerCase()===destination.trim().toLowerCase()){
            setPackageDetails(item);
            console.log(item.duration)
            localStorage.setItem('dealduration',item.duration)

          }
        })
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <div className="bookingdetails-container fcc">
      <div className="booking-details">
        <h1>Booking Details</h1>
        <div className="package-info">
          <h2>{packageDetails?.location}</h2>
          <p>{packageDetails?.description}</p>
        </div>
        <div className="facilities">
          <h3>Facilities Provided:</h3>
          <ul>
            {packageDetails?.facilities?.map((facility, index) => (
              <li key={index}>{facility}</li>
            ))}
            <li>Duration: {packageDetails?.duration} Days</li>
          </ul>
        </div>
        
        <div className="btndiscover">
          <button className="btn btn-primary discover-btn" id='btn-discover' onClick={handleBooking}>Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default Bookingdetails;
