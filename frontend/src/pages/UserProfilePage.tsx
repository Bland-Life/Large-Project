import React from "react";
import AccountNavBar from "../components/AccountNavBar";
import UserProf from '../components/UserProf.tsx';
import '../css/HomePage.css';

const UserProfilePage = () =>
{
    return (
        <div className='page-content'>
            <AccountNavBar/>
            <UserProf />
        </div>
    );
};

export default UserProfilePage;