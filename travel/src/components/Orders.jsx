import React, { useEffect, useState } from 'react'
import instance from './axios_instance';
import { useNavigate } from 'react-router-dom';

function Orders() {

    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const user = localStorage.getItem('user');

    let userId;

    if (JSON.parse(user)._id) {
        userId = JSON.parse(user)._id;
    }
    else {
        userId = JSON.parse(user).id;
    }

    const fetchOrderDetails = () => {
        instance.get(`/user/orders/${userId}`)
            .then((response) => {
                console.log(response.data);
                setOrders(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    const handleCancelOrder = (order) => {
        instance.delete(`/user/orders/${order._id}`)
            .then((response) => {
                console.log(response.data);
                fetchOrderDetails();
            })
            .catch((error) => {
                console.log(error);
            });
    }
    return (
        <div className="orders-container">
            <table className="order-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Children</th>
                        <th>Adults</th>
                        <th>Departure Date</th>
                        <th>Return Date</th>
                        <th>Total Cost</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Card Number</th>
                        <th>Receipt</th>
                        <th>Cancel Order</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orders.length > 0 ?
                            orders.map((order, index) => (
                                <tr key={index}>
                                    <td>{order._id}</td>
                                    <td>{order.fname} {order.lname}</td>
                                    <td>{order.phone}</td>
                                    <td>{order.email}</td>
                                    <td>{order.children}</td>
                                    <td>{order.adults}</td>
                                    <td>{order.departureDate}</td>
                                    <td>{order.returnDate}</td>
                                    <td>${order.totalCost}</td>
                                    <td>{order.departureCity}</td>
                                    <td>{order.destination}</td>
                                    <td>{order.cardNumber}</td>
                                    <td>
                                        <button className="btn-update" style={{ backgroundColor: "green" }} onClick={() => { navigate('/receipt', { state: { order } }) }}>view</button>
                                    </td>
                                    <td>
                                        <button className="btn-update" onClick={() => { handleCancelOrder(order) }}>Cancel</button>
                                    </td>
                                </tr>
                            ))
                            :
                            <tr className=''>
                                <td colSpan="14">
                                    <h1 className='text-center' style={{ color: "#FA7436", opacity: '0.5', textAlign: 'center' }}>Not Foud Any Booking</h1>
                                </td>

                            </tr>
                    }

                </tbody>
            </table>
        </div>
    )
}

export default Orders
