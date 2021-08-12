import React, { useState } from 'react';
import axios from 'axios';

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        //const emailError = document.getElementById('emailError');
        //const passwordError = document.getElementById('passwordError');

        await axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_URL}/api/auth/login`,
            data: {
                email,
                password
            },
            withCredentials: true,
        })
        .then((res) => {
            console.log(res);
            if(res.data.error) {
                console.log(res.data.error); 
            } else {
                window.location = '/';
            }
        })
        .catch((err) => {
            console.log(err);
        });
    };
    
    return (
        <form className='form d-flex flex-column' id='logInForm' action='' onSubmit={handleLogin}>
            <div className='col-10 mx-auto'>
                <label className='fw-bold form-label' htmlFor='email'>Email</label>
                <input className='mb-3 form-control' id='email' type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <div className='fw-bold text-danger' id='emailError'></div>
            </div>
            <div className='col-10 mx-auto'>
                <label className='fw-bold form-label' htmlFor='password'>Mot de passe</label>
                <input className='mb-3 form-control' id='password' type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className='fw-bold text-danger' id='passwordError'></div>
            </div>
            <input className='mt-3 mb-4 btn btn-validation col-6 mx-auto' type='submit' value='Se connecter' />
        </form>
    )
};

export default LogIn;