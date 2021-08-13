import React, { useContext, useState } from 'react';
import { UIdContext } from "../appcontext";
import axios from 'axios';
import GetData from './getdata';

const UpdateProfile = () => {
    //Récupération des informations sur l'utilisateur
    const uId = useContext(UIdContext);
    const previousData = GetData();

    //Modification de l'utilisateur
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [job, setJob] = useState('');
    const [password, setPassword] = useState('');
    const [controlPassword, setControlPassword] = useState('');

    const handleUpdate = (e) => {
        e.preventDefault();

        axios({
            method: 'put',
            url: `${process.env.REACT_APP_API_URL}/api/users/${uId}`,
            withCredentials: true,
            data: {
                firstname,
                lastname,
                email,
                role: job,
                password,
                controlPassword,
            },
        })
        .then((res) => {
            if (res.data.error) {
                console.log(res.data.error);
                //emailError.textContent = res.data.errors.email;
                //passwordError.textContent = res.data.errors.password;
            } else {
                window.location = '/';
            }
        })
        .catch((err) => console.log(err));
    };

    return (
        <div className='mt-4 mb-3'>
            <div className='d-flex flex-column bg-red border border-2 rounded border-red mt-5'>
                <h2 className='text-center mt-3 mb-4'>Modification du profil</h2>
                <div className='d-flex flex-row justify-content-evenly mb-4'>
                    <form className='form d-flex flex-column' id='updateForm' action='' onSubmit={handleUpdate}>
                        <div className='col-10 mx-auto'>
                            <label className='fw-bold form-label' htmlFor='firstname'>Prénom</label>
                            <input className='mb-3 form-control' id='firstname' type='text' name='firstname' value={firstname} placeholder={previousData.firstname} onChange={(e) => setFirstname(e.target.value)}></input>
                        </div>
                        <div className='col-10 mx-auto'>
                            <label className='fw-bold form-label' htmlFor='lastname'>Nom</label>
                            <input className='mb-3 form-control' id='lastname' type='text' name='lastname' value={lastname} placeholder={previousData.lastname} onChange={(e) => setLastname(e.target.value)}></input>
                        </div>
                        <div className='col-10 mx-auto'>
                            <label className='fw-bold form-label' htmlFor='email'>Email</label>
                            <input className='mb-3 form-control' id='email' type='text' name='email' value={email} placeholder={previousData.email} onChange={(e) => setEmail(e.target.value)}></input>
                            <div id='emailError'></div>
                        </div>
                        <div className='col-10 mx-auto'>
                            <label className='fw-bold form-label' htmlFor='job'>Poste</label>
                            <select className='mb-3 form-select' id='job' name='job' value={job} onChange={(e) => setJob(e.target.value)} >
                                <option value='' >Veuillez indiquer votre fonction</option>
                                <option value='Développeur'>Développeur</option>
                                <option value='Commercial'>Commercial</option>
                                <option value='Technicien'>Technicien</option>
                                <option value='Chargé(e) de communication'>Chargé(e) de communication</option>
                            </select>
                        </div>
                        <div className='col-10 mx-auto'>
                            <label className='fw-bold form-label' htmlFor='password'>Mot de passe</label>
                            <input className='mb-3 form-control' id='password' type='password' name='password' value={password} placeholder='**********' onChange={(e) => setPassword(e.target.value)}></input>
                        <div id='passwordError'></div>
                        </div>
                        <div className='col-10 mx-auto'>
                        <div className='text-center fw-bold mt-3'>Saisissez le mot de passe pour pouvoir valider la modification</div>
                            <label className='fw-bold form-label' htmlFor='controlPassword'></label>
                            <input className='mb-3 col-8 mx-auto form-control' id='controlPassword' type='password' name='controlPassword' value={controlPassword} onChange={(e) => setControlPassword(e.target.value)} />
                            <div id='controlPasswordError'></div>
                        </div>
                        <input className='mt-3 mb-4 col-6 mx-auto btn btn-validation' type='submit' value="Modifier" />
                    </form>   
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile;