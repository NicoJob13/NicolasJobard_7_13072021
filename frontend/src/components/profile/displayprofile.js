import React from 'react';
import GetData from './getdata';

const DisplayProfile = ( props ) => {
    const userData = GetData();

    return (
        <div className='mt-4 mb-3'>
            <div className='d-flex flex-column bg-red border border-2 rounded border-red mt-5 py-1'>
                <h2 className='text-center mt-3 mb-4'>Mon profil</h2>
                <div className='d-flex flex-column align-items-center'>
                    <h3>Prénom</h3>
                    <p>{userData.firstname}</p>   
                </div>
                <div className='d-flex flex-column align-items-center'>
                    <h3>Nom</h3>
                    <p>{userData.lastname}</p>   
                </div>
                <div className='d-flex flex-column align-items-center'>
                    <h3>Email</h3>
                    <p>{userData.email}</p>   
                </div>
                <div className='d-flex flex-column align-items-center'>
                    <h3>Fonction</h3>
                    <p>{userData.role}</p>   
                </div>
            </div>
        </div>
    );
};

export default DisplayProfile;