import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../actions/useractions';

const UpdateProfile = () => {
    const userData = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    const [updatePassword, setUpdatePassword] = useState(false);

    const [password, setPassword] = useState('');
    const [controlPassword, setControlPassword] = useState('');

    const handleUpdate = (e) => {
        e.preventDefault();
        
        dispatch(updateUser(userData.id, password, controlPassword));

        setUpdatePassword(false);

        window.location.reload();
    };

    return (
        <div>
            <div className='form d-flex flex-column bg-red mt-4'>
                <h2 className='text-center mt-3 mb-4'>Mes informations</h2>
                <div className='d-flex flex-column align-items-center mb-4'>
                    <div className='col-10 d-flex flex-column align-items-center mx-auto text-center'>
                        <h3>Prénom</h3>
                        <p className='profile-data rounded'>{userData.firstname}</p>
                    </div>
                    <div className='col-10 d-flex flex-column align-items-center mx-auto text-center'>
                        <h3>Nom</h3>
                        <p className='profile-data rounded'>{userData.lastname}</p>
                    </div>
                    <div className='col-10 d-flex flex-column align-items-center mx-auto text-center'>
                        <h3>Email</h3>
                        <p className='profile-data rounded'>{userData.email}</p>
                    </div>
                    <div className='col-10 d-flex flex-column align-items-center mx-auto text-center'>
                        <h3>Poste</h3>
                        <p className='profile-data rounded'>{userData.role}</p>
                    </div>
                    <div className='col-10 d-flex flex-column align-items-center mx-auto text-center'>
                        <label className='fw-bold form-label' htmlFor='password'><h4>Mot de passe</h4></label>
                        {updatePassword !== true && (
                            <div>
                                <p className='profile-data rounded' onClick={() => setUpdatePassword(!updatePassword)}>Cliquez-ici pour me modifier !</p>
                            </div>
                        )}
                        {updatePassword && (
                            <>
                            <input className='profile-data mb-3 form-control' id='password' type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
                            </>
                        )}
                    </div>
                    <div className='col-10 mx-auto text-center'>
                        <h3 className='text-center fw-bold mt-3'>Saisissez le mot de passe pour pouvoir valider la modification</h3>
                        <label className='fw-bold form-label' htmlFor='controlPassword'></label>
                        <input className='profile-data mb-3 col-8 mx-auto form-control' id='controlPassword' type='password' name='controlPassword' value={controlPassword} onChange={(e) => setControlPassword(e.target.value)} />
                    </div>
                    <button className='mt-3 mb-4 col-4 mx-auto btn btn-validation' onClick={handleUpdate}>Modifier</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile;