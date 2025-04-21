import React, { useState } from 'react';
import '../css/UserProfile.css';

function UserProf() {
    let _ud : any = localStorage.getItem('user_data');
    let ud = JSON.parse( _ud );

    // placeholder until API inclusion for profile
    const [userData, setUserData] = useState({
        name: ud.firstName,
        username: ud.username,
        email: ud.email
    });

    return (
        <div className="profile-card">
            <div className="profile-label">Profile Details</div>

            <div className="profile-content">
                <div className="profile-avatar">
                    <div className="avatar-placeholder" />
                </div>

                <div className="profile-details">
                    <div className="profile-field">
                        <span className="field-label">Name:</span>
                        <span className="field-value">{userData.name}</span>
                    </div>
                    <div className="profile-field">
                        <span className="field-label">Username:</span>
                        <span className="field-value">{userData.username}</span>
                    </div>
                    <div className="profile-field">
                        <span className="field-label">Email:</span>
                        <span className="field-value">{userData.email}</span>
                    </div>
                    <div>
                        <a href="/"><button id="logout-button">Logout</button></a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProf;