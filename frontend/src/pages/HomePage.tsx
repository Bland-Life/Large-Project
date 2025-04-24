
import React, { useState } from 'react';
import videoBack from '../assets/clouds.mp4';
import logoImage from '../assets/logoFull.png';
import '../css/HomePage.css'


const HomePage = () => {
    const [videoLoaded, setVideoLoaded] = useState(false);
  
    const handleVideoLoaded = () => {
      setVideoLoaded(true);
    };
  
    return (
      <div className="page-content">
        {!videoLoaded && (
          <div className="loading-screen">
            Loading...
            {/* You can swap this with a spinner, skeleton, etc. */}
          </div>
        )}
  
        <video
          src={videoBack}
          autoPlay
          loop
          muted
          onCanPlayThrough={handleVideoLoaded}
          style={{
            display: videoLoaded ? 'block' : 'none',
          }}
        />
  
        {videoLoaded && (
          <>
            <div className="content-box">
              <img
                src={logoImage}
                alt="The website logo. Oh The Places You'll Go!"
                className="logo"
              />
            </div>
            <div className="button-container">
              <a href="/Login"><button className="button">Login!</button></a>
              <a href="/Signup"><button className="button">Sign Up!</button></a>
            </div>
          </>
        )}
      </div>
    );
  };

export default HomePage;
