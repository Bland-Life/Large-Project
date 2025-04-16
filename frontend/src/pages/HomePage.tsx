
import React from 'react';
import videoBack from '../assets/clouds.mp4';
import logoImage from '../assets/logoFull.png';
import '../css/HomePage.css'


const HomePage = () => {
    return (
        <div className="page-content">
            <video src={videoBack} autoPlay loop muted />
            <div className="content-box">
                {/* <h2 className="subheading">Whether You're on a Plane or on a Train...</h2> */}
                <img src={logoImage} alt="The website logo. Oh The Places You'll Go!" className = "logo" />
                {/* <h3 className="tagline">We've Got You Covered!</h3>
                <h1 className="main-heading">Oh, the Places You'll Go!</h1> */}
            </div>
            <div className="button-container"> 
                <a href="/Login"><button className="button">Login!</button></a>
                <button className="button">Sign Up!</button>
            </div>
        </div>
    );
};

export default HomePage;
