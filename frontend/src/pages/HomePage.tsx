import React from 'react';
import videoBack from '../assets/clouds.mp4';
import './HomePage.css'

const HomePage = () => {
    return (
        <div className="background-content">
            <video src={videoBack} autoPlay loop muted />
            <div className="content-box">
                <h2 className="subheading">Whether You're on a Plane or on a Train...</h2>
                <h3 className="tagline">We've Got You Covered!</h3>
                <h1 className="main-heading">Oh, the Places You'll Go!</h1>
                <div className="button-container">
                    <button className="button">Login!</button>
                    <button className="button">Sign Up!</button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
