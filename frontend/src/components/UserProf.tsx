import React, { useState, useEffect } from 'react';
import '../css/HomePage.css';

function UserProf() {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        name: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch user data when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Replace with your actual API endpoint
                const response = await fetch('https://your-api.com/user/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you use token-based auth
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUserData({
                    username: data.username,
                    email: data.email,
                    name: data.firstName || data.name // Adjust based on your API response
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div>Loading user data...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="user-profile-container">
            <h2>User Profile</h2>
            <div className="profile-info">
                <div className="profile-field">
                    <span className="field-label">Username:</span>
                    <span className="field-value">{userData.username}</span>
                </div>
                <div className="profile-field">
                    <span className="field-label">Email:</span>
                    <span className="field-value">{userData.email}</span>
                </div>
                <div className="profile-field">
                    <span className="field-label">Name:</span>
                    <span className="field-value">{userData.name}</span>
                </div>
            </div>
        </div>
    );
}

export default UserProf;