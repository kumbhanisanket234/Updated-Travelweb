import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import profileimg from '../Images/img10.webp';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from '../store';
import './Navbar.css'

function Navbar() {

    const userData = useSelector((state) => state.user);
    const dispatch = useDispatch();
    let loginUserData = localStorage.getItem('user');
    const [displayName, setDisplayName] = useState("");
    const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
    const [visible, setVisible] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    const scrollToComponent = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offsetTop = element.offsetTop; // Calculate the offsetTop of the element
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            const show = prevScrollPos > currentScrollPos;

            setVisible(show);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos]);

    const getuser = async () => {
        try {
            const res = await axios.get("http://localhost:3001/login/success", { withCredentials: true });
            // setUserData(res.data.user);
            console.log("response", res);
            dispatch(setUser(res.data.user));

            if (res.data.user.fullName) {
                setDisplayName(res.data.user.fullName);
            }
        }
        catch (err) {
            console.log("Error Fetching User", err);
        }
    }

    useEffect(() => {
        let loginUserData = localStorage.getItem('user');
        if (loginUserData) {
            dispatch(setUser(JSON.parse(loginUserData)));
            setDisplayName(JSON.parse(loginUserData).fullName);
        }

        getuser();
    }, [loginUserData]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        window.open("http://localhost:3001/logout", "_self")
        dispatch(clearUser());
    }


    return (
        <div className="navbar-main" style={{ top: visible ? '0' : '-114px', transition: 'top 0.5s' }}>
            <div className="navbar">
                <div className="btn-logo">
                    <button className="btn btn-default logo navlink" onClick={() => { scrollToComponent('hero') }}>Trabook</button>
                </div>

                <div className="list">
                    <ul className="navitems">
                        <li className="navlink" onClick={() => { scrollToComponent('hero') }}>Home</li>
                        <li className="navlink" onClick={() => { scrollToComponent('about') }}>About</li>
                        <li className="navlink" onClick={() => { scrollToComponent('deals') }}>Destination</li>
                        <li className="navlink" onClick={() => { scrollToComponent('plans') }}>Tour</li>
                        <li className="navlink" onClick={() => { scrollToComponent('blogs') }}>Blog</li>
                    </ul>
                </div>
                <div className="Hero-btncontain">
                    {
                        Object.keys(userData).length > 0 ? (
                            <>
                                <button className="btn btn-default signup"><NavLink activeClassName="menu_active" className="signup-hover" aria-current="page" to="/" onClick={handleLogout}>Logout</NavLink></button>
                                <button className="btn btn-default login"><div className="navlink text-dark" style={{ fontWeight: 'bold' }}>{displayName}</div></button>
                                <img src={userData.image ? userData.image : profileimg} alt="Profile pic" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />

                            </>
                        )
                            :
                            <>
                                <button className="btn btn-default login"> <NavLink className="navlink" to="/login">Login</NavLink></button>
                                <button className="btn btn-default signup"><NavLink className="signup-hover" to="/signup" style={{ color: "black" }}>Signup</NavLink></button>
                            </>
                    }
                </div>
            </div >
        </div >

    )
}

export default Navbar
