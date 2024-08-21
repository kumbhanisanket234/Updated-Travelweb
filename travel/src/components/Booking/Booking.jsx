import React, { useEffect, useState } from 'react';
import './Booking.css';
import img1 from '../Images/booking.png'
import img2 from '../Images/plane.png'
import img3 from '../Images/package.png'

const TravelForm = () => {
    const destination = localStorage.getItem('destination');
    const duration = localStorage.getItem('dealduration');
    const today = new Date().toISOString().substring(0, 10);
    const [departureDate, setDepartureDate] = useState(today);
    const [returnDate, setReturnDate] = useState('');

    useEffect(() => {
        const calculateReturnDate = () => {
            const departure = new Date(departureDate);
            console.log('✌️departure --->', departure);
            departure.setDate(departure.getDate() + Number(duration));
            setReturnDate(departure.toISOString().substring(0, 10));
        };

        calculateReturnDate();
    }, [departureDate, duration]);

    const handleDepartureDateChange = (e) => {
        setDepartureDate(e.target.value);
    };
    return (
        <>
            <div className='booking'>
                <div className="plane1">
                    <div>
                        <img src={img1} alt="plane" />
                    </div>
                </div>
                <div className="form-container">
                    <div className="form-header">
                        <div>
                            <img src={img2} alt="Travel" className="form-image" />
                        </div>
                        <div>
                            <h4>Travel Information Form</h4>
                            <p>Please provide us with the contact information below and we will arrange to reserve your ticket.</p>
                        </div>
                    </div>
                    <form>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <select name="title">
                                <option value="">Please Select</option>
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Dr">Dr</option>
                            </select>
                        </div>

                        <label htmlFor="firstName">Contact Name</label>
                        <div className='contact-name'>
                            <div className="form-group">
                                <input type="text" id="firstName" name="firstName" />
                                <label htmlFor="firstName">First Name</label>
                            </div>
                            <div className="form-group">
                                <input type="text" id="lastName" name="lastName" />
                                <label htmlFor="lastName">Last Name</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="birthDate">Birth Date</label>
                            <input type="date" id="birthDate" name="birthDate" />
                        </div>
                        <div className='email-phone'>
                            <div className="form-group">
                                <label htmlFor="organization">Email</label>
                                <input type="text" id="organization" name="organization" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="organization">Phone</label>
                                <input type="text" id="organization" name="organization" />
                            </div>
                        </div>
                        <div className='travel-detail mb-2'>Travel Detail</div>

                        <div className="form-group">
                            <label htmlFor="title">Departure</label>
                            <select name="title">
                                <option value="">Please Select</option>
                                <option value="Mr">Mumbai</option>
                                <option value="Ms">Bhopal</option>
                                <option value="Mrs">Delhi</option>
                                <option value="Dr">Assam</option>
                                <option value="Dr">Kerala</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="title">Destination country</label>
                            <input type="text" id="organization" name="organization" value={destination} disabled />
                        </div>

                        <div className="form-group">
                            <label htmlFor="DepartureDate">Departure date & time</label>
                            <input type="date" id="DepartureDate" name="DepartureDate" min={today} value={departureDate} onChange={handleDepartureDateChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ReturnDate">Return date & time</label>
                            <input type="date" id="ReturnDate" name="ReturnDate" value={returnDate} disabled />
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div className="plane2">
                    <div>
                        <img src={img3} alt="plane" />
                    </div>
                </div>

            </div>
        </>
    );
};

export default TravelForm;
