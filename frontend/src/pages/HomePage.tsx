import React from 'react';
import videoBack from '../assets/clouds.mp4';
import './HomePage.css'

const HomePage = () =>
{
	return (
		<div className = 'background-content'>
            <video src = {videoBack} autoPlay loop muted/>
			<h1> Oh, The Places You'll Go! </h1>
		</div>
	);
};

export default HomePage;
