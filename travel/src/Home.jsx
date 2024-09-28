import * as React from 'react';
import Signup from './components/Signup';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Error from './components/Error';
import Forgotpassword from './components/Forgotpassword';
import Resetpassword from './components/Resetpassword';
import Hero from './components/Hero';
import Things from './components/Things'
import Deals from './components/Deals'
import Plans from './components/Plans'
import About from './components/About'
import Blogs from './components/Blogs'
import Footer from './components/Footer'
import Cart from './components/Cart';
import Booking from './components/Booking';
import Bookingdetails from './components/Bookingdetails';
import Discover from './components/Discover';
import Blog from './components/Blog';
import PrivacyPolicy from './components/Privacypolicy';
import Termsandconditions from './components/Termsandconditions';
import Helpfaq from './components/Helpfaq';
import Adminlogin from './admin/Adminlogin';
import Adddeals from './admin/Adddeals';
import Addplans from './admin/Addplans';
import Adminhome from './admin/Adminhome';
import Payment from './components/Payment';
import Receipt from './components/Receipt';
import Orders from './components/Orders';
import Booked from './admin/Booked';

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
                <Route path='/booking' Component={Booking}></Route>
                <Route path='/bookingdetails' Component={Bookingdetails}></Route>
                <Route path='/discover' Component={Discover}></Route>
                <Route path='/blog' Component={Blog}></Route>
                <Route path='/privacy' Component={PrivacyPolicy}></Route>
                <Route path='/terms' Component={Termsandconditions}></Route>
                <Route path='/helps' Component={Helpfaq}></Route>
                <Route path='/admin' Component={Adminlogin}></Route>
                <Route path='/adminhome/:token' Component={Adminhome}></Route>
                <Route path='/adddeals/:token' Component={Adddeals}></Route>
                <Route path='/addplans/:token' Component={Addplans}></Route>
                <Route path='/payment' Component={Payment}></Route>
                <Route path='/receipt' Component={Receipt}></Route>
                <Route path='/orders' Component={Orders}></Route>
                <Route path='/booked' Component={Booked}></Route>
                <Route path='*' Component={Error}></Route>
            </Routes>

        </>
    )
}

export default Home
