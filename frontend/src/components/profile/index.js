import React from 'react';
import DeleteProfile from './deleteprofile';
import UpdateProfile from './updateprofile';
import { useSelector } from 'react-redux';

const HandleProfile = ( props ) => {
    const userData = useSelector((state => state.userReducer));

    return (
        <div>
            <h1 className='mt-4 text-center'>Bienvenue {userData.firstname} !</h1>
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