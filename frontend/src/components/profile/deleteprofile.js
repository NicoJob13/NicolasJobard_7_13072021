import React, { useContext, useState } from 'react';
import { UIdContext } from "../appcontext";
import axios from 'axios';
import cookie from 'js-cookie';

const DeleteProfile = () => {
    const uId = useContext(UIdContext);

    //Suppression de l'utilisateur
    const [controlPassword, setControlPassword] = useState('');

    const handleDeletion = async (e) => {
        e.preventDefault();

        const deleteCookie = (key) => {
            if(window !== 'undefined') {
                cookie.remove(key, { expires: 1 });
            }
        };

        axios({
            method: 'delete',
            url: `${process.env.REACT_APP_API_URL}/api/users/${uId}`,
            withCredentials: true,
            data: {
                controlPassword,
            },
        })
        .then(() => deleteCookie('jwt'))
        .catch((err) => console.log(err));
        
        window.location = '/';
    }

    return (
        <div className='mt-4 mb-3'>
            <div className='d-flex flex-column bg-red border border-2 rounded border-red mt-5'>
                <h3 className='text-center mt-3'>Supprimer mon profil</h3>
                <div className='d-flex flex-row justify-content-evenly mt-4 mb-4'>
                    <form className='form d-flex flex-column' id='deletionForm' action='' onSubmit={handleDeletion}>
                    <div className='col-10 mx-auto'>
                        <div className='text-center fw-bold'>Saisissez votre mot de passe pour pouvoir valider la suppression</div>
                        <label className='form-label' htmlFor='password'></label>
                        <input className='mb-3 col-8 mx-auto form-control' id='controlPass' type='password' name='controlPass' value={controlPassword} onChange={(e) => setControlPassword(e.target.value)} />
                        <div id='passwordError'></div>
                    </div>
                    <input className='mt-3 mb-4 col-6 mx-auto btn btn-validation' type='submit' value="Supprimer" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeleteProfile;