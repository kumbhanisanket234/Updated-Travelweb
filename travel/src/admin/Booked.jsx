import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import instance from '../components/axios_instance';
function Booked() {

    const navigate = useNavigate();
    const [booked, setBooked] = useState([]);

    const fetchOrderDetails = () => {
        instance.get('/orders/all')
            .then((response) => {
                console.log(response.data);
                setBooked(response.data);
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
                        booked ?
                            booked.map((order, index) => (
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
                            <h1 className='text-center' style={{ color: "#FA7436", opacity: '0.5' }}>Not Foud Any Booking</h1>
                    }

                </tbody>
            </table>
        </div >
    )
}

export default Booked
