import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import { useNavigate, useParams, Link } from 'react-router-dom';
import instance from '../components/axios_instance';
import { useCartContext } from '../context/cartcontext';
import toast, { Toaster } from 'react-hot-toast';

function Addplans() {

    const [a, b, TOKEN] = useCartContext();
    const [location, setLocation] = useState("");
    const [duration, setDuration] = useState(0)
    const [imgURL, setImgURL] = useState("");

    const [price, setPrice] = useState(0);
    const [rating, setRating] = useState(0);
    const navigate = useNavigate();

    const { token } = useParams();

    useEffect(() => {
        if (TOKEN != token) {
            navigate('/error');
        }
    }, [token, navigate])

    const handleSubmit = (e) => {
        e.preventDefault();
        instance.post('/plans/addplans', { location, imgURL, price, duration, rating })
            .then((res) => {
                setLocation('')
                setImgURL('')
                setDuration(0)
                setPrice(0)
                setRating(0)
            }).catch((err) => {
                console.log(err);
                toast.error(err);
            });
    }
    return (
        <div className="container dja mt-5">
            <Toaster />
            <div className="signup-form">
                <button className=" btn-previous btn btn-default" id='back-btn' style={{ backgroundColor: "#ccc" }} onClick={() => { navigate(`/adminhome/${TOKEN}`) }}><i className="fa-solid fa-arrow-left"></i></button>
                <div className="fields-container">
                    <h1 className="text-center">Add Plans</h1>
                    <div className='text-center'>
                        <Link to={`/adddeals/${TOKEN}`}>Add Deals</Link>
                    </div>
                    <form className='form' onSubmit={handleSubmit}>
                        location
                        <div className='addproduct-container'>
                            <input type="text" id='title' value={location} onChange={(e) => { setLocation(e.target.value) }} />
                        </div>
                        Image URL
                        <div className='addproduct-container'>
                            <input type='text' id='img-url' value={imgURL} onChange={(e) => { setImgURL(e.target.value) }} />
                        </div>
                        Price
                        <div className='addproduct-container'>
                            <input type="text" id='price' value={price} onChange={(e) => { setPrice(e.target.value) }} />
                        </div>
                        duration
                        <div className='addproduct-container'>
                            <input type="text" id='price' value={duration} onChange={(e) => { setDuration(e.target.value) }} />
                        </div>
                        Rating
                        <div className='addproduct-container'>
                            <input type="text" id='rating' value={rating} onChange={(e) => { setRating(e.target.value) }} />
                        </div>

                        <div className="signup-btn">
                            <Button type='submit' variant="contained">Add</Button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Addplans
