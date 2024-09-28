import React, { useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useNavigate } from 'react-router';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useCartContext } from '../context/cartcontext';

function Adminlogin() {

    const [a, b, TOKEN] = useCartContext();
    const EMAIL = "kumbhanisanket2522@gmail.com";
    const PASSWORD = "1122";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        switch (true) {
            case email === "" || password === "":
                toast.error("Please fill all the fields");
                break;
            case (!validateEmail(email)):
                toast.error("Enter a valid email address");
                return false;

            default:
                if (email === EMAIL && password === PASSWORD) {
                    navigate(`/adminhome/${TOKEN}`);
                }
                else {
                    toast.error('Email or Password is incorrect');
                }
        }
    };

    return (
        <>
            <div className="container dja mt-5">
                <Toaster />
                <div className="signup-form">
                    <button className=" btn-previous btn btn-default" id='back-btn' style={{ backgroundColor: "#ccc" }} onClick={() => { navigate("/") }}><i className="fa-solid fa-arrow-left"></i></button>
                    <div className="fields-container">
                        <h1 className="text-center">Login</h1>
                        <form className='form' onSubmit={handleSubmit}>

                            <div className='email-password-container'>
                                <input type="email" id='login-email' placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} />
                            </div>
                            <div className='email-password-container'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    id='login-password'
                                />
                                <span className="toggle-password" onClick={togglePasswordVisibility}>
                                    <i className={`px-2 eye-icon fa-regular ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                </span>
                            </div>

                            <div className="signup-btn">
                                <Button type='submit' variant="contained">Login</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Adminlogin
