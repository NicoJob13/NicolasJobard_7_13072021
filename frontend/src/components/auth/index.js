import React, { useState } from 'react';
import Register from './register';
import LogIn from './login';

const Auth = ( props ) => {
    const [registerForm, setRegisterForm] = useState(props.register);
    const [logInForm, setLogInForm] = useState(props.login);

    const handleForms = (e) => {
        if(e.target.id === 'register') {
            setLogInForm(false);
            setRegisterForm(true);
        } else if(e.target.id === 'login') {
            setRegisterForm(false);
            setLogInForm(true);
        }
    };
    
    return (
        <div className='d-flex flex-column bg-red border border-2 rounded border-red mt-5'>
            <div className='d-flex flex-row justify-content-evenly mt-4 mb-4'>
                <div className={registerForm ? 'btn btn-active' : 'btn btn-inactive'} id='register' onClick={handleForms}>
                    Inscription
                </div>
                <div className={logInForm ? 'btn btn-active' : 'btn btn-inactive'} id='login' onClick={handleForms} >
                    Connexion
                </div>
            </div>
            <div>
                {registerForm && <Register />}
                {logInForm && <LogIn />}
            </div>
        </div>
    ); 
};

export default Auth;