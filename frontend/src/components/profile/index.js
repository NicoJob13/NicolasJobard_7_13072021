import React from 'react';
import DeleteProfile from './deleteprofile';
import UpdateProfile from './updateprofile';
import { useSelector } from 'react-redux';

const HandleProfile = () => {
    const userData = useSelector((state => state.userReducer));

    return (
        <div className='mt-3 pt-5'>
            <h1 className='text-center'>Bienvenue {userData.firstname} !</h1>
            <div>
                <UpdateProfile />
            </div>
            <div>
                <DeleteProfile />
            </div>
        </div>
    );
};

export default HandleProfile;