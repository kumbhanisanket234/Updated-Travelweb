import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useNavigate } from 'react-router';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store';
import { Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    // const userData = useSelector((state) => state.user);
    const dispatch = useDispatch();

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
                alert("Please fill all the fields");
                break;
            case (!validateEmail(email)):
                alert("Enter a valid email address");
                return false;

            default:
                axios.post('http://localhost:3001/login', { email, password }, { withCredentials: true })
                    .then((response) => {
                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('user', JSON.stringify({ ...response.data.user, fullName: response.data.user.firstName + " " + response.data.user.lastName }));

                        dispatch(setUser({ ...response.data.user, fullName: response.data.user.firstName + " " + response.data.user.lastName }));
                        navigate('/')
                    })
                    .catch((error) => {
                        console.error(error);
                        alert(error.response.data);
                    });
        }

    };

    const handleLoginWithGoogle = () => {
        window.open("http://localhost:3001/auth/google", "_self");
    }

    const handleLoginWithGithub = () => {
        window.open("http://localhost:3001/auth/github", "_self");
    }

    const hadleLoginWithFacebook = () => {
        window.open("http://localhost:3001/auth/facebook", "_self");
    }
    return (
        <>
            <div className="container dja mt-5">
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
                                <Link to="/forgotpassword" className="login-link">Forgot Password</Link>
                                <Link to="/signup" className="login-link m-0">Not have an account?</Link>
                            </div>
                        </form>

                        <div className="social-signup mt-3">
                            <Button variant="contained" className="google-btn" onClick={handleLoginWithGoogle}>
                                <div className='d-flex align-items-center justify-content-between' style={{ width: '300px' }}>
                                    <i className="fab fa-google"></i> Continue with Google
                                </div>
                            </Button>
                            <Button variant="contained" className="meta-btn" onClick={hadleLoginWithFacebook}>
                                <div className='d-flex align-items-center justify-content-between' style={{ width: '300px' }}>
                                    <i className="fab fa-facebook"></i> Continue with Meta
                                </div>
                            </Button>
                            <Button variant="contained" className="github-btn" onClick={handleLoginWithGithub}>
                                <div className='d-flex align-items-center justify-content-between' style={{ width: '300px' }}>
                                    <i className="fab fa-github"></i> Continue with GitHub
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Login
