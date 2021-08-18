import React, { useState } from 'react';
import axios from 'axios';

const LogInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        const authError = document.getElementById('authError');

        axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_URL}/api/auth/login`,
            withCredentials: true,
            data: {
                email,
                password,
            },
        })
        .then((res) => {
            window.location= '/';
        })
        .catch((err) => {
            console.log(err);
            authError.textContent= 'Erreur d\'identification. Veuillez vérifier vos identifiants.';
        });
    };
    
    return (
        <form className='form d-flex flex-column' id='logInForm' action='' onSubmit={handleLogin}>
            <div className='col-10 mx-auto'>
                <label className='fw-bold form-label' htmlFor='email'>Email</label>
                <input className='mb-3 form-control' id='email' type='text' name='email' pattern="[a-z0-9.-_]+[@]{1}[a-z0-9.-_]+[.]{1}[a-z]{2,10}" title="Votre adresse email respectant le format 'exemple@mail.com'" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='col-10 mx-auto'>
                <label className='fw-bold form-label' htmlFor='password'>Mot de passe</label>
                <input className='mb-3 form-control' id='password' type='password' name='password' pattern="(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[_!@#$£µ=§%^*?-/&]).{8,}" placeholder="Minimum 8 caractères, 1 Majuscule, 1 minuscule, 1 chiffre, 1 symbole" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <input className='mt-3 mb-4 btn btn-validation col-6 mx-auto' type='submit' value='Se connecter' />
            <div className='fw-bold text-danger mx-auto mb-3' id='authError'></div>
        </form>
    )
};

export default LogInForm;