import React, { useState } from 'react';
import '../css/UserProfile.css';

function UserProf() {
    // placeholder until API inclusion for profile
    const [userData, setUserData] = useState({
        name: "GerBot Discord",
        username: "gerbotDiscord123",
        email: "gerbot@discord.com"
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
                </div>
            </div>
        </div>
    );
}

export default UserProf;