import React, { useEffect, useState } from 'react'
import './Cart.css'
import img15 from '../Images/img15.png';
import { useCartContext } from '../cartcontext'
import toast, { Toaster } from 'react-hot-toast'
import img23 from '../Images/img23.png'
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';


function Cart() {
    const [cart, setCart] = useCartContext();
    let loginUserData = localStorage.getItem('user');
    const navigate = useNavigate();
    let userId;

    if (loginUserData) {
        if (JSON.parse(loginUserData)._id) {
            userId = JSON.parse(loginUserData)._id;
        }
        else {
            userId = JSON.parse(loginUserData).id;
        }
    }

    useEffect(() => {
        fetch(`http://localhost:3001/favorites/${userId}`)
            .then((response) => response.json())
            .then((data) => setCart(data))
            .catch((err) => console.log(err));
    }, [])

    const handleLikeBtn = (item, index) => {
        const productId = item._id;

        const Update = cart.filter((val, id) => {
            return index !== id
        })
        setCart(Update);

        axios.post('http://localhost:3001/favorites/remove', { productId, userId })
            .then(() => {
                toast.error('Removed From Favourite!')
            })
            .catch((err) => {
                console.log('✌️err --->', err);
            })
    }
    const handleDealsBooking = (item) => {
        localStorage.setItem('destination', item.city);
        navigate('/bookingdetails')
    }
    return (
        <div className='Deals' id='deals'>
            <h1 className='cart-heading'>Favorites</h1>

            <div className="cart-container container">
                <div className="Deal-content">
                    {cart.length > 0 ? (
                        <>
                            <div className="row Deal-boxes gy-4 mt-2">
                                {cart.map((item, index) => (
                                    <div className="col-lg-3 col-md-6 col-sm-12" key={index} >
                                        <div className="Deal-box">
                                            <div className="image-container">
                                                <img id='location-img' src={item.imgURL ? item.imgURL : item.img} alt="" onClick={() => handleDealsBooking(item)} />
                                                <i className="fa-regular fa-heart heart-icon" title='Remove From Favourite' style={{ backgroundColor: '#FA7436', color: 'white' }} onClick={() => handleLikeBtn(item, (index))}></i>
                                                <Toaster />
                                            </div>
                                            <div className="Deal-carddetail">
                                                <div className='Deal-City'>
                                                    <p className='Deal-topics'>{item.city ? item.city : item.location}</p>
                                                    <div className='d-flex'>
                                                        <img src={img15} alt="" />
                                                        <p>{item.rating}</p>
                                                    </div>
                                                </div>
                                                <div className="detail-container py-2">
                                                    <div className='Deal-details d-flex gap-1'>
                                                        {
                                                            item.country ? <i className="fa-solid fa-location-dot"></i>
                                                                :
                                                                <img style={{ width: '1rem', height: '1rem', marginTop: '3px' }} src={img23} alt="" />
                                                        }
                                                        <p>{item.country ? item.country : `${item.duration} day trip`}</p>
                                                    </div>
                                                    <div className="price d-flex gap-2">
                                                        <p style={{ textDecoration: 'line-through' }}>{`${item.cutoutPrice ? `$${item.cutoutPrice}` : ""}`}</p>
                                                        <p className="discounted">${`${item.duration ? `${item.price}K` : `${item.price}`}`}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>) : <h1 className='text-center' style={{ color: "#FA7436", opacity: '0.5' }}>Item Not Foud In Favourite</h1>
                    }
                </div>
            </div>
        </div >
    )
}

export default Cart
