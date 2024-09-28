import React from 'react'
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import axios from 'axios';
import instance from './axios_instance';
import toast, { Toaster } from 'react-hot-toast';

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
                toast.error("Please fill all the fields");
                break;
            case (!validateEmail(email)):
                toast.error("Enter a valid email address");
                return false;

            default:
                instance.post('/forgotpassword', { email }, { withCredentials: true })
                    .then((response) => {
                        console.log(response)
                        if (response.data.Status === "Success") {
                            toast.error("Reset Password Link Sent To Your Email!")
                            navigate('/login')
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        toast.error(error.response.data);
                    });
        }

    };
    return (
        <div className="container dja">
            <Toaster />
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
