import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import instance from './axios_instance';

function Receipt() {
  const location = useLocation();
  const { order } = location.state || {};
  const [bookingData, setBookingData] = useState([]);

  useEffect(() => {
    setBookingData(order);
    console.log(bookingData)
  }, [])

  return (
    <div className="receipt-container">
      <h1 className="receipt-title">Receipt</h1>
      <hr className="divider" />
      <div className="receipt-details">
        <p><strong>Order ID:</strong> <span className="detail-value">{bookingData._id}</span></p>
        <p><strong>Name:</strong> <span className="detail-value">{bookingData.fname} {bookingData.lname}</span></p>
        <p><strong>Phone:</strong> <span className="detail-value">{bookingData.phone}</span></p>
        <p><strong>Email:</strong> <span className="detail-value">{bookingData.email}</span></p>
        <p><strong>From:</strong> <span className="detail-value">{bookingData.departureCity}</span></p>
        <p><strong>To:</strong> <span className="detail-value">{bookingData.destination}</span></p>

        <p><strong>Departure Date:</strong> <span className="detail-value">{bookingData.departureDate}</span></p>
        <p><strong>Return Date:</strong> <span className="detail-value">{bookingData.returnDate}</span></p>
        <p><strong>Paid:</strong> <span className="detail-value total-cost">${bookingData.totalCost}</span></p>
      </div>
      <hr className="divider" />
      <h3 className="thank-you">Thank you for your booking!</h3>
      <p className="contact-info">For any inquiries, please contact our customer service at support@trabook.com or call +1-800-555-0199.</p>
      <h4 className="booking-details-title">Booking Details:</h4>
      <ul className="booking-details-list">
        <li><strong>Flight Information:</strong> New York (JFK) to London (LHR), Airline: XYZ Airlines, Flight Number: XY123</li>
        <li><strong>Accommodation:</strong> Grand London Hotel, Check-in: September 25, 2024, Check-out: October 5, 2024</li>
        <li><strong>Additional Services:</strong> Airport Transfer: Included, Travel Insurance: Yes</li>
      </ul>
      <h4 className="payment-method-title">Payment Method:</h4>
      <p><strong>Debit Card:</strong> Visa</p>
      <p><strong>Card Number:</strong> **** **** **** 1234</p>
      <p className="disclaimer"><em>Please ensure all details are correct. Changes may incur additional fees.</em></p>
    </div>
  )
}

export default Receipt
