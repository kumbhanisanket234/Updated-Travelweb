import React, { Children, useEffect, useState } from 'react';
import img1 from './Images/booking.png'
import img2 from './Images/plane.png'
import img3 from './Images/package.png'
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const TravelForm = () => {

    const navigate = useNavigate();
    const destination = localStorage.getItem('destination');
    const duration = localStorage.getItem('dealduration');
    const user = localStorage.getItem('user')
    const today = new Date().toISOString().substring(0, 10);

    let userid;

    if (JSON.parse(user)._id) {
        userid = JSON.parse(user)._id;
    }
    else {
        userid = JSON.parse(user).id;
    }

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, []);

    const [bookingData, setBookingData] = useState({
        title: "",
        fname: "",
        lname: "",
        birthDate: "",
        email: "",
        phone: "",
        children: "",
        adults: "",
        departureCity: "",
        destination,
        departureDate: today,
        returnDate: "",
        totalCost: 0,
        userId: userid
    })



    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    const handleBookingForm = (e) => {
        const { name, value } = e.target;
        setBookingData({ ...bookingData, [name]: value });
    }


    useEffect(() => {
        const price = localStorage.getItem('price');
        const adults = Number(bookingData.adults) || 0;
        const children = Number(bookingData.children) || 0;

        const TotalCost = price * (adults + children / 2);
        setBookingData({ ...bookingData, totalCost: TotalCost });
    }, [bookingData.adults, bookingData.children])


    useEffect(() => {
        const calculateReturnDate = () => {
            const departure = new Date(bookingData.departureDate);
            departure.setDate(departure.getDate() + Number(duration));
            setBookingData({ ...bookingData, returnDate: departure.toISOString().substring(0, 10), userId: userid })
        };

        calculateReturnDate();
    }, [bookingData.departureDate, duration]);

    const handleSubmit = () => {
        switch (true) {
            case (!bookingData.title || !bookingData.fname || !bookingData.lname || !bookingData.birthDate || !bookingData.email || !bookingData.phone || !bookingData.children || !bookingData.adults || !bookingData.departureCity || !bookingData.departureDate):
                toast.error("Fill All Details First.");
                break;

            case (!validateEmail(bookingData.email)):
                toast.error("Enter a valid email address");
                console.log("Enter Valid Email")
                return false;


            case ((bookingData.phone.toLowerCase() >= 'a' && bookingData.phone.toLowerCase() <= 'z') || (bookingData.phone.length != 10)):
                toast.error("Enter Valid Phone Number");
                console.log("Enter Valid Phone")
                break;

            default:
                // navigate('/payment');
                navigate('/payment', { state: { bookingData } });
                break;
        }
    }
    return (
        <>
            <div className='booking'>
                <Toaster />
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
                    <form onSubmit={(event) => event.preventDefault()}>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <select name="title" value={bookingData.title} onChange={handleBookingForm} >
                                <option value="">Please Select</option>
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Dr">Dr</option>
                            </select>
                        </div>

                        <label htmlFor="Contact Name">Contact Name</label>
                        <div className='contact-name'>
                            <div className="form-group">
                                <input type="text" id="fname" name="fname" value={bookingData.fname} onChange={handleBookingForm}  />
                                <label htmlFor="fname">First Name</label>
                            </div>
                            <div className="form-group">
                                <input type="text" id="lname" name="lname" value={bookingData.lname} onChange={handleBookingForm}  />
                                <label htmlFor="lname" >Last Name</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="birthDate" >Birth Date</label>
                            <input type="date" id="birthDate" name="birthDate" value={bookingData.birthDate} onChange={handleBookingForm}  />
                        </div>
                        <div className='email-phone'>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="text" id="bookingemail" name="email" value={bookingData.email} onChange={handleBookingForm}  />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone</label>
                                <input type="text" id="bookingphone" name="phone" value={bookingData.phone} onChange={handleBookingForm}  />
                            </div>
                        </div>
                        <div className='tourist-counter email-phone'>
                            <div className="form-group">
                                <label htmlFor="adults">Adults</label>
                                <input type="text" id="adults" name="adults" value={bookingData.adults} onChange={handleBookingForm}  />
                            </div>
                            <div className="form-group">
                                <label htmlFor="children">Children</label>
                                <input type="text" id="children" name="children" value={bookingData.children} onChange={handleBookingForm}  />
                            </div>
                        </div>
                        <div className='travel-detail mb-2'>Travel Detail</div>

                        <div className="form-group">
                            <label htmlFor="title">Departure</label>
                            <select name="departureCity" value={bookingData.departureCity} onChange={handleBookingForm} >
                                <option value="">Please Select</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Bhopal">Bhopal</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Assam">Assam</option>
                                <option value="Kerala">Kerala</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="title">Destination country</label>
                            <input type="text" id="organization" name="organization" value={destination} disabled />
                        </div>

                        <div className="form-group">
                            <label htmlFor="departureDate">Departure date & time</label>
                            <input type="date" id="departureDate" name="departureDate" min={today} value={bookingData.departureDate} onChange={handleBookingForm}  />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ReturnDate">Return date & time</label>
                            <input type="date" id="ReturnDate" name="ReturnDate" value={bookingData.returnDate} disabled />
                        </div>
                        <button type='submit' onClick={handleSubmit}>Submit</button>
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
