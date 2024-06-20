
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
                <Route path='*' Component={Error}></Route>
            </Routes>

        </>
    )
}

export default Home
