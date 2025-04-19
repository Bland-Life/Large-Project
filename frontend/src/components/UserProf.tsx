import React, { useState } from 'react';
import '../css/UserProfile.css';

function UserProf() {
    // placeholder until API inclusion
    const [userData, setUserData] = useState({
        name: "John Doe",
        username: "johndoe123",
        email: "john.doe@example.com"
    });

    return(
        <div className="user-profile-container">
            <h1 className="profile-title">Hello, {userData.name.split(" ")[0]}!</h1>
            
            <div className="profile-card">
                <div className="profile-avatar">
                    {/* Profile image placeholder - first letter of name */}
                    <div className="avatar-placeholder">
                        {userData.name.charAt(0)}
                    </div>
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