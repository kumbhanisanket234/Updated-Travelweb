import React from 'react'
import Button from '@mui/material/Button';
import './Signup.css'
import { useNavigate } from 'react-router';
import { useState } from 'react';
import axios from 'axios';

function Forgotpassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        switch (true) {
            case email === "":
                alert("Please fill all the fields");
                break;
            case (!validateEmail(email)):
                alert("Enter a valid email address");
                return false;

            default:
                axios.post('http://localhost:3001/forgotpassword', { email }, { withCredentials: true })
                    .then((response) => {
                        console.log(response)   
                        if (response.data.Status === "Success") {
                            alert("Reset Password Link Sent To Your Email!")
                            navigate('/login')
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        alert(error.response.data);
                    });
        }

    };
    return (
        <div className="container">
            <div className="signup-form">
                <div className="fields-container">
                    <h3 className="text-center">Forgot Password</h3>
                    <form className='form' onSubmit={handleSubmit}>

                        <div className='email-password-container'>
                            <input type="email" id='login-email' placeholder="Email" style={{ width: '320px', height: '43px' }} onChange={(e) => { setEmail(e.target.value) }} />
                        </div>

                        <div className="signup-btn">
                            <Button type='submit' variant="contained">Send</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Forgotpassword
