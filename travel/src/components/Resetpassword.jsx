import React from 'react'
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import instance from './axios_instance';
import toast, { Toaster } from 'react-hot-toast';

function Resetpassword() {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { id, token } = useParams();

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        switch (true) {
            case password === "":
                toast.error("Please fill all the fields");
                break;

            case password !== confirmPassword:
                toast.error("Password and Confirm Password should be same");
                break;

            default:
                instance.post(`/reset-password/${id}/${token}`, { password }, { withCredentials: true })
                    .then((response) => {
                        console.log(response)
                        if (response.data.Status === "Success") {
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
            <div className="signup-form m-0">
                <div className="fields-container">
                    <h3 className="text-center">Reset Password</h3>
                    <form className='form' onSubmit={handleSubmit}>
                        <TextField id="password" label="Password" variant="outlined" type="password" onChange={(e) => { setPassword(e.target.value) }} />
                        <TextField id="confirm-password" label="Confirm Password" variant="outlined" type="password" onChange={(e) => { setConfirmPassword(e.target.value) }} />
                        <div className="signup-btn">
                            <Button type='submit' variant="contained">Update</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Resetpassword
