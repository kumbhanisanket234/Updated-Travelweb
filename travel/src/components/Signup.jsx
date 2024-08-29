import React, { useState, useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';

function Signup() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [timer, setTimer] = useState(60);
    const navigate = useNavigate();

    let numberOfDigits = 4;
    const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
    const otpBoxReference = useRef([]);
    const [otpSent, setOtpSent] = useState(false);


    const Timer = () => {
        const interval = setInterval(() => {

            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setOtpSent(false);
                    setTimer(60);
                    return 0;
                }
                return prev - 1;
            });

            return () => clearInterval(interval)
        }, 1000);
    }
    function handleChange(value, index) {
        let newArr = [...otp];
        newArr[index] = value;
        setOtp(newArr);

        if (value && index < numberOfDigits - 1) {
            otpBoxReference.current[index + 1].focus()
        }
    }

    function handleBackspaceAndEnter(e, index) {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            otpBoxReference.current[index - 1].focus()
        }
        if (e.key === "Enter" && e.target.value && index < numberOfDigits - 1) {
            otpBoxReference.current[index + 1].focus()
        }
    }


    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    const handleSendOtp = () => {
        if (!validateEmail(email) || email === "") {
            alert("Enter a valid email address");
            return;
        }

        axios.post('http://localhost:3001/sendOTP', { email })
            .then(response => {
                console.log("response send otp", response)
                if (response.data.status === "FAILED") {
                    alert(response.data.message)
                }
                else {
                    setOtpSent(true);
                    alert("OTP sent to your email. Please enter the OTP to complete registration.");
                    Timer();
                }

            })
            .catch(error => {
                console.error(error);
                alert("Failed to send OTP");
            });
    };

    const handleSubmit = (e) => {
        switch (true) {
            case firstName === "" || lastName === "" || email === "" || password === "" || confirmPassword === "" || phone === "":
                alert("Please enter all details");
                break;

            case (!validateEmail(email)):
                alert("Enter a valid email address");
                return false;

            case ((phone.toLowerCase() >= 'a' && phone.toLowerCase() <= 'z') || (phone.length != 10)):
                alert("Enter Valid Phone Number");
                break;

            case password !== confirmPassword:
                alert("Password and Confirm Password should be same");
                break;

            default:
                const otpValue = otp.join('');
                if (otpValue === "") {
                    alert("Enter OTP and verify your Email first!")
                }
                else {
                    axios.post('http://localhost:3001/verifyOTP', { userId: email, otp: otpValue })
                        .then(response => {
                            if (response.data.status === "SUCCESS") {
                                axios.post('http://localhost:3001/register', { firstName, lastName, email, phone, password, confirmPassword })
                                    .then((response) => {
                                        navigate('/login')
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                        alert(error.response.data);
                                    })

                            } else {
                                alert(response.data.message);
                            }
                        })
                        .catch(error => {
                            alert("Failed to verify OTP. Please try again.");
                        });
                }
        }
    };

    const handleLoginWithGoogle = () => {
        window.open("http://localhost:3001/auth/google", "_self");
    }

    const handleLoginWithGithub = () => {
        window.open("http://localhost:3001/auth/github", "_self");
    }

    const handleLoginWithLinkedIn = () => {
        window.open("http://localhost:3001/auth/linkedin", "_self");
    }

    const handleLoginWithMicrosoft = () => {
        window.open("http://localhost:3001/auth/microsoft", "_self");
    }

    const hadleLoginWithFacebook = () => {
        window.open("http://localhost:3001/auth/facebook", "_self");
    }

    return (
        <div className="container dja mt-3">
            <div className="signup-form">
                <div className="fields-container">
                    <button className=" btn-previous btn btn-default" id='back-btn' style={{ backgroundColor: "#ccc" }} onClick={() => { navigate("/") }}><i className="fa-solid fa-arrow-left"></i></button>
                    <h1 className="text-center">Sign Up</h1>
                    <div className='form'>
                        <div className='d-flex gap-2'>
                            <TextField id="first-name" label="First Name" variant="outlined" onChange={(e) => { setFirstName(e.target.value) }} />
                            <TextField id="last-name" label="Last Name" variant="outlined" onChange={(e) => { setLastName(e.target.value) }} />
                        </div>

                        <div className='d-flex gap-1'>
                            <TextField id="email" label="Email" variant="outlined" onChange={(e) => { setEmail(e.target.value) }} />
                            <button className="btn btn-outline-success" onClick={handleSendOtp} disabled={otpSent}>SendOTP</button>
                        </div>
                        <TextField id="phone" label="Phone" variant="outlined" onChange={(e) => { setPhone(e.target.value) }} />

                        <div className='d-flex gap-2'>
                            <TextField id="password" label="Password" variant="outlined" type="password" onChange={(e) => { setPassword(e.target.value) }} />
                            <TextField id="confirm-password" label="Confirm Password" variant="outlined" type="password" onChange={(e) => { setConfirmPassword(e.target.value) }} />
                        </div>
                        <div className='d-flex justify-content-center align-items-center gap-4'>
                            {otp.map((digit, index) => (
                                <input key={index} value={digit} maxLength={1}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                    onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
                                    ref={(reference) => (otpBoxReference.current[index] = reference)}
                                    className={`OTP-boxes border rounded-md block focus:border-2 focus:outline-none appearance-none`}
                                />
                            ))}
                        </div>
                        {otpSent && (
                            <>
                                <p className='text-center m-0'>You can resend OTP after {timer} second</p>
                            </>
                        )}

                        <div className="signup-btn">
                            <Button type='submit' variant="contained" onClick={handleSubmit}>Sign Up</Button>
                            <Link to="/login" className="login-link">Already have an account?</Link>
                        </div>

                        <div className="social-signup">
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
        </div>
    );
}

export default Signup;
