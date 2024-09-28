import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import instance from './axios_instance';

function Payment() {
    const location = useLocation();
    const { bookingData } = location.state || {};

    console.log(bookingData)
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.cardName) {
            toast.error("Name on card is required")
        }
        if (!formData.cardNumber || !/^\d{4} \d{4} \d{4} \d{4}$/.test(formData.cardNumber)) {
            toast.error("Valid card number is required (e.g., 1234 5678 9012 3456)")
        }
        if (!formData.expiry || !/^(0[1-9]|1[0-2])\/?([0-9]{2}|[0-9]{4})$/.test(formData.expiry)) {
            toast.error("Valid expiration date is required (MM/YY)")
        }
        if (!formData.cvc || !/^\d{3}$/.test(formData.cvv)) {
            toast.error("Valid CVC is required (3 digits)")

        }

        instance.post('/orderdetails', {
            ...bookingData,
            cardNumber: formData.cardNumber
        })
            .then((res) => {
                console.log(res)
                toast.success("Payment successful")
                navigate('/orders');
            })
            .catch((err) => {
                console.log(err)
            })
    };

    return (
        <div className="payment-page">
            <Toaster />
            <h2>Payment Information</h2>
            <form className="payment-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="cardName">Name on Card</label>
                    <input
                        type="text"
                        id="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                        type="text"
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        required
                    />

                </div>

                <div className="form-group">
                    <label htmlFor="expiry">Expiration Date</label>
                    <input
                        type="text"
                        id="expiry"
                        value={formData.expiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        required
                    />

                </div>

                <div className="form-group">
                    <label htmlFor="cvc">CVV</label>
                    <input
                        type="text"
                        id="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        required
                    />

                </div>

                <div className="form-group">
                    <label htmlFor="price">Total Cost</label>
                    <input
                        type="text"
                        id="price"
                        value={`$${bookingData.totalCost}`}
                        disabled
                    />
                </div>

                <button type="submit">Pay Now</button>
            </form>
        </div>)
}

export default Payment
