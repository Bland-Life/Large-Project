import React, { useState } from 'react';
import '../css/HomePage.css'

function UserProf() {
    return(
        <div className="signupContainer">
            
                <div className="signupDiv">
                    <h2 className="signupHeader">Profile</h2>
                    <div className="input-field">
                    {/* <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    /> */}
                    </div>
                    <div className="input-field">
                    {/* <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    /> */}
                    </div>
                    <div className="input-field">
                    {/* <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    /> */}
                    </div>
                    <div className="input-field">
                    {/* <input
                        type="text"
                        id="firstName"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    /> */}
                    </div>
                    <div className="input-field">
                    {/* <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    /> */}
                    </div>
                    {/* <p id="error">{message}</p> */}
                </div>
                {/* <div className='button-signup'>
                    <input
                        type="submit"
                        id="signupButton"
                        className="button"
                        value="Sign Up"
                    />
                </div> */}
        </div>
    );
}

export default UserProf;