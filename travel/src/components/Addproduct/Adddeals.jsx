import React, { useState } from 'react'
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import './Addproduct.css'
import axios from 'axios';
function Addproduct() {

    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [imgURL, setImgURL] = useState("");
    const [cutoutPrice, setCutoutPrice] = useState(0);
    const [price, setPrice] = useState(0);
    const [rating, setRating] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/products/adddeals', { city, country, imgURL, cutoutPrice, price, rating })
            .then((res) => {
                setCity('')
                setCountry('')
                setImgURL('')
                setCutoutPrice(0)
                setPrice(0)
                setRating(0)
            }).catch((err) => {
                console.log(err);
                alert(err);
            });
    }
    return (
        <div className="container mt-5">
            <div className="signup-form">
                <button className=" btn-previous btn btn-default" id='back-btn' style={{ backgroundColor: "#ccc" }} onClick={() => { navigate("/") }}><i className="fa-solid fa-arrow-left"></i></button>
                <div className="fields-container">
                    <h1 className="text-center">Add Deals</h1>
                    <form className='form' onSubmit={handleSubmit}>

                        City
                        <div className='addproduct-container'>
                            <input type="text" id='title' value={city} onChange={(e) => { setCity(e.target.value) }} />
                        </div>
                        Country
                        <div className='addproduct-container'>
                            <input type="text" id='title' value={country} onChange={(e) => { setCountry(e.target.value) }} />
                        </div>
                        Image URL
                        <div className='addproduct-container'>
                            <input type='text' id='img-url' value={imgURL} onChange={(e) => { setImgURL(e.target.value) }} />
                        </div>
                        Cutout Price
                        <div className='addproduct-container'>
                            <input type="text" id='price' value={cutoutPrice} onChange={(e) => { setCutoutPrice(e.target.value) }} />
                        </div>
                        Price
                        <div className='addproduct-container'>
                            <input type="text" id='price' value={price} onChange={(e) => { setPrice(e.target.value) }} />
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

export default Addproduct
