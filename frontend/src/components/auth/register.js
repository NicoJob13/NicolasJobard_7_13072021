import React, { useState } from 'react';
import axios from 'axios';
import LogIn from './login';

const Register = () => {
    const [formSubmit, setFormSubmit] = useState(false);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [job, setJob] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        //const emailError = document.getElementById('emailError');
        //const passwordError = document.getElementById('passwordError');

        await axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_URL}/api/auth/register`,
            withCredentials: true,
            data: {
                firstname,
                lastname,
                email,
                role: job,
                password
            },
        })
        .then((res) => {
            console.log(res);
            if (res.data.error) {
                console.log(res.data.error);
                //emailError.textContent = res.data.errors.email;
                //passwordError.textContent = res.data.errors.password;
            } else {
              setFormSubmit(true);
            }
          })
        .catch((err) => console.log(err));
    };

    return (
        <>
        {formSubmit ? (
            <>
                <LogIn />
                <div className='text-success fw-bold text-center mb-3'>Inscription réussie, vous pouvez vous connecter</div>
            </>
        ) : (
            <>
                <form className='form d-flex flex-column' id='registerForm' action='' onSubmit={handleRegister}>
                    <div className='col-10 mx-auto'>
                        <label className='fw-bold form-label' htmlFor='firstname'>Prénom</label>
                        <input className='mb-3 form-control' id='firstname' type='text' name='firstname' value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                    </div>
                    <div className='col-10 mx-auto'>
                        <label className='fw-bold form-label' htmlFor='lastname'>Nom</label>
                        <input className='mb-3 form-control' id='lastname' type='text' name='lastname' value={lastname} onChange={(e) => setLastname(e.target.value)} />
                    </div>
                    <div className='col-10 mx-auto'>
                        <label className='fw-bold form-label' htmlFor='email'>Email</label>
                        <input className='mb-3 form-control' id='email' type='text' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        <div id='emailError'></div>
                    </div>
                    <div className='col-10 mx-auto'>
                        <label className='fw-bold form-label' htmlFor='job'>Poste</label>
                        <select className='mb-3 form-select' id='job' name='job' value={job} onChange={(e) => setJob(e.target.value)} >
                                <option value=''>Veuillez indiquer votre fonction</option>
                                <option value='Développeur'>Développeur</option>
                                <option value='Commercial'>Commercial</option>
                                <option value='Technicien'>Technicien</option>
                                <option value='Chargé(e) de communication'>Chargé(e) de communication</option>
                        </select>
                    </div>
                    <div className='col-10 mx-auto'>
                        <label className='fw-bold form-label' htmlFor='password'>Mot de passe</label>
                        <input className='mb-3 col-8 mx-auto form-control' id='password' type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        <div id='passwordError'></div>
                    </div>
                    <input className='mt-3 mb-4 col-6 mx-auto btn btn-validation ' type='submit' value="S'inscrire" />
                </form>
            </>
        )}
        </>
    );
};

export default Register;