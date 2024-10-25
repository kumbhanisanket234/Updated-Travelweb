import React, { useState, useEffect } from 'react'
import instance from '../components/axios_instance'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useCartContext } from '../context/cartcontext';

function Adminhome() {

    const navigate = useNavigate();
    const [a, b, TOKEN] = useCartContext();
    const { token } = useParams();

    useEffect(() => {
        if (TOKEN != token) {
            navigate(`/error`);
        }
    }, [token, navigate])

    const [dealsPackage, setDealsPackage] = useState([]);
    const [plansPackage, setPlansPackage] = useState([]);

    const [id, setId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [imgURL, setImgURL] = useState("");
    const [cutoutPrice, setCutoutPrice] = useState();
    const [price, setPrice] = useState("");
    const [rating, setRating] = useState();
    const [location, setLocation] = useState("");
    const [duration, setDuration] = useState();

    const handleClose = () => {
        setShowModal(false);
        setId("");
        setCity("");
        setCountry("");
        setLocation("");
        setDuration("");
        setImgURL("");
        setCutoutPrice("");
        setPrice("");
    }

    const fetchDealsPackage = () => {
        instance.get('/products/getdeals')
            .then(response => setDealsPackage(response.data))
            .catch(err => console.log(err))
    }

    const fetchPlansPackage = () => {
        instance.get('/plans/getplans')
            .then(response => setPlansPackage(response.data))
            .catch(err => console.log(err));
    }

    const handleDelete = (items) => {
        items.location ? instance.delete(`/plans/${items._id}`) : instance.delete(`/products/${items._id}`);
    }

    const handleUpdate = (items) => {
        setShowModal(true);
        setId(items._id);
        items.city ? (setCity(items.city), setCountry(items.country), setCutoutPrice(items.cutoutPrice)) : (setLocation(items.location), setDuration(items.duration));
        setImgURL(items.imgURL);
        setPrice(items.price);
        setRating(items.rating);

    }

    const handleUpdateDealsPackage = () => {

        location ?
            instance.put(`/plans/${id}`, {
                location,
                imgURL,
                duration,
                price,
                rating
            })
            :
            instance.put(`/products/${id}`, {
                city,
                country,
                imgURL,
                cutoutPrice,
                price,
                rating
            })

        toast.success('Record Update Successfully')
        setShowModal(false);
    }

    useEffect(() => {
        fetchDealsPackage();
        fetchPlansPackage();
    }, [handleDelete, handleUpdateDealsPackage])

    return (
        <div className="table-container">
            <Toaster />
            <table className="responsive-table">
                <thead>
                    <tr className='sticky'>

                        <th colSpan="6" className='heading'>Deals Package</th>

                        <th style={{ backgroundColor: 'unset', border: 'unset' }} ><button className="btn-update" onClick={() => { navigate(`/adddeals/${TOKEN}`) }}>Add</button></th>
                        <th style={{ backgroundColor: 'unset', border: 'unset' }} ><button className="btn-update" onClick={() => { navigate(`/booked/${TOKEN}`) }}>Booked</button></th>


                    </tr>
                    <tr>
                        <th>No</th>
                        <th>City</th>
                        <th>Country</th>
                        <th>Image</th>
                        <th>CutoutPrice</th>
                        <th>Price</th>
                        <th>Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dealsPackage &&
                        dealsPackage.map((items, index) => {

                            return <tr>
                                <td>{index + 1}</td>
                                <td>{items?.city}</td>
                                <td>{items?.country}</td>
                                <td><img src={items?.imgURL} alt={items?.city} height="100px" width="100px" className="table-img" /></td>
                                <td style={{ textDecoration: 'line-through' }}>${items?.cutoutPrice}</td>
                                <td>${items?.price}</td>
                                <td>{items?.rating}</td>
                                <td>
                                    <button onClick={() => handleUpdate(items)} className="btn-update">Update</button>
                                    <button onClick={() => handleDelete(items)} className="btn-delete">Delete</button>
                                </td>
                            </tr>

                        })
                    }

                </tbody>
            </table>

            <table className="responsive-table">
                <thead>
                    <tr className='sticky'>
                        <th colSpan="6" className='heading'>Plans Package</th>
                        <th style={{ backgroundColor: 'unset', border: 'unset' }} ><button className="btn-update" onClick={() => { navigate(`/addplans/${TOKEN}`) }}>Add</button></th>

                    </tr>
                    <tr>
                        <th>No</th>
                        <th>Location</th>
                        <th>Image</th>
                        <th>Duration(Days)</th>
                        <th>Price</th>
                        <th>Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        plansPackage &&
                        plansPackage.map((items, index) => {

                            return <tr>
                                <td>{index + 1}</td>
                                <td>{items?.location}</td>
                                <td><img src={items?.imgURL} alt={items?.city} height="100px" width="100px" className="table-img" /></td>
                                <td>{items?.duration}</td>
                                <td>${items?.price}</td>
                                <td>{items?.rating}</td>
                                <td>
                                    <button onClick={() => handleUpdate(items)} className="btn-update">Update</button>
                                    <button onClick={() => handleDelete(items)} className="btn-delete">Delete</button>
                                </td>
                            </tr>

                        })
                    }

                </tbody>
            </table>

            {
                showModal && (
                    <>
                        <div className="modal show text-dark" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">

                                    <div className="modal-header">
                                        <h5 className="modal-title">Update</h5>
                                        <span aria-hidden="true"><i className="fa-solid fa-xmark" onClick={handleClose}></i></span>
                                    </div>

                                    <div className="modal-body text-start">
                                        {
                                            location ?
                                                (
                                                    <>
                                                        Location: <input type="text" className="form-control" value={location} onChange={(evt) => { setLocation(evt.target.value) }} />
                                                        duration: <input type="text" className="form-control" value={duration} onChange={(evt) => { setDuration(evt.target.value) }} />

                                                    </>
                                                )
                                                :
                                                (
                                                    <>
                                                        City: <input type="text" className="form-control" value={city} onChange={(evt) => { setCity(evt.target.value) }} />
                                                        Country:<input type="text" className="form-control" value={country} onChange={(evt) => setCountry(evt.target.value)} />
                                                        CutoutPrice:<input type="num" className="form-control" value={cutoutPrice} onChange={(evt) => { setCutoutPrice(evt.target.value) }} />
                                                    </>
                                                )
                                        }
                                        Price:<input type="num" className="form-control" value={price} onChange={(evt) => { setPrice(evt.target.value) }} />
                                        imgURL : <input type="text" className="form-control" value={imgURL} onChange={(evt) => { setImgURL(evt.target.value) }} />
                                        Rating:<input type="num" className="form-control" value={rating} onChange={(evt) => { setRating(evt.target.value) }} />

                                    </div>

                                    <div className="modal-footer">

                                        <button className="btn btn-success" onClick={handleUpdateDealsPackage}>Update</button>

                                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                                            Close
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="modal-backdrop show"></div>
                    </>
                )

            }
        </div>
    )
}

export default Adminhome
