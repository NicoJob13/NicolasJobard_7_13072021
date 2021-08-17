import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser } from '../../actions/useractions';

const DeleteProfile = () => {
    const userData = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    const [controlPassword, setControlPassword] = useState('');

    const handleDelete = () => {
        dispatch(deleteUser(userData.id, controlPassword));

        window.location = '/';
    }

    return (
        <div className='mt-4 mb-3'>
            <div className='d-flex flex-column bg-red border border-2 rounded border-red mt-5'>
                <h2 className='text-center mt-3'>Supprimer mon profil</h2>
                <div className='d-flex flex-column align-items-center mt-4 mb-4'>
                    <h3 className='mb-4'>Vous souhaitez vraiment quitter Groupomania Connect ?</h3>
                    <div className='d-flex flex-column align-items-center col-10'>
                        <h4 className='text-center fw-bold'>Saisissez votre mot de passe pour pouvoir valider la suppression</h4>
                        <label className='form-label' htmlFor='controlPass'></label>
                        <input className='profile-data rounde mb-3 col-8 mx-auto form-control' id='controlPass' type='password' name='controlPass' value={controlPassword} onChange={(e) => setControlPassword(e.target.value)} />
                    </div>
                    <button className='mt-3 mb-4 col-4 mx-auto btn btn-validation' onClick={() => {
                        if(window.confirm('Vous êtes sur le point de supprimer votre compte. Confirmez-vous la suppression ?')) {
                            handleDelete();
                        }
                    }}>Supprimer</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteProfile;