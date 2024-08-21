import * as React from 'react';
import Signup from './components/Signup';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar/Navbar';
import Error from './components/Error';
import Forgotpassword from './components/Forgotpassword';
import Resetpassword from './components/Resetpassword';
import Hero from './components/Hero/Hero';
import Things from './components/Things/Things'
import Deals from './components/Deals/Deals'
import Plans from './components/Plans/Plans'
import About from './components/About/About'
import Blogs from './components/Blogs/Blogs'
import Footer from './components/Footer/Footer'
import Cart from './components/Cart/Cart';
import Adddeals from './components/Addproduct/Adddeals';
import Booking from './components/Booking/Booking';
import Bookingdetails from './components/Bookingdetails/Bookingdetails';
import Addplans from './components/Addplans/Addplans';
import Discover from './components/Discover';
import Blog from './components/Blogs/Blog';

function Home() {
    return (
        <>
            <Routes>
                <Route path='/' element={
                    <>
                        <Navbar />
                        <Hero />
                        <Things />
                        <Deals />
                        <Plans />
                        <About />
                        <Blogs />
                        <Footer />
                    </>
                } />
                <Route path="/signup" Component={Signup}></Route>
                <Route path="/login" Component={Login}></Route>
                <Route path='/forgotpassword' Component={Forgotpassword}></Route>
                <Route path='/resetpassword/:id/:token' Component={Resetpassword}></Route>
                <Route path='/cart' Component={Cart}></Route>
                <Route path='/adddeals' Component={Adddeals}></Route>
                <Route path='/addplans' Component={Addplans}></Route>
                <Route path='/booking' Component={Booking}></Route>
                <Route path='/bookingdetails' Component={Bookingdetails}></Route>
                <Route path='/discover' Component={Discover}></Route>
                <Route path='/blog' Component={Blog}></Route>
                <Route path='*' Component={Error}></Route>
            </Routes>

        </>
    )
}

export default Home
