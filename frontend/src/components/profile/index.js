import React, { useState } from 'react';
import GetData from './getdata';
import DisplayProfile from './displayprofile';
import DeleteProfile from './deleteprofile';
import UpdateProfile from './updateprofile';

const HandleProfile = ( props ) => {
    const userData = GetData();

    const [profileForm, setProfileForm] = useState(props.display);
    const [updateForm, setUpdateForm] = useState(props.update);
    const [deleteForm, setDeleteForm] = useState(props.delete);


    const handleForms = (e) => {
        if(e.target.id === 'profile') {
            setProfileForm(true);
            setUpdateForm(false);
            setDeleteForm(false);
        } else if(e.target.id === 'update') {
            setProfileForm(false);
            setUpdateForm(true);
            setDeleteForm(false);
        } else if(e.target.id === 'delete') {
            setProfileForm(false);
            setUpdateForm(false);
            setDeleteForm(true);
        }
    };

    return (
        <div>
            <h1 className='mt-4 text-center'>Bienvenue {userData.firstname} !</h1>
            <div>
                <div className='form d-flex flex-row justify-content-evenly mt-4 mb-4'>
                    {profileForm ? (
                        <>
                        <div className='btn btn-inactive' id='update' onClick={handleForms} >
                        Modification
                        </div>
                        <div className='btn btn-inactive' id='delete' onClick={handleForms}>
                        Suppression
                        </div>
                        </>
                    ) : (
                        <></>
                    )}
                    {updateForm ? (
                        <>
                        <div className='btn btn-inactive' id='profile' onClick={handleForms}>
                        Consultation
                        </div>
                        </>
                    ) : (
                        <></>
                    )}
                    {deleteForm ? (
                        <>
                        <div className='btn btn-inactive' id='profile' onClick={handleForms}>
                        Consultation
                        </div>
                        </>
                    ) : (
                        <></>
                    )}   
                </div>
                <div>
                    {profileForm && <DisplayProfile />}
                    {updateForm && <UpdateProfile />}
                    {deleteForm && <DeleteProfile />}
                </div>
            </div>
        </div>
    );
};

export default HandleProfile;