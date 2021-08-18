import React, { useState } from 'react';
import RegisterForm from './register';
import LogInForm from './login';

const Auth = ( props ) => {
    const [registerModal, setRegisterModal] = useState(props.register);
    const [logInModal, setLogInModal] = useState(props.login);
    
    return (
        <div className='form d-flex flex-column bg-red mt-5'>
            <div className='d-flex flex-row justify-content-evenly mt-4 mb-4'>
                {logInModal && (
                    <div className='d-flex flex-column align-items-center'>
                        <h3 className='text-center'>Pas encore des nôtres ? Rejoignez-nous !</h3>
                        <button className='btn btn-register' id='register' onClick={(e) => {
                            setRegisterModal(true);
                            setLogInModal(false);
                        }}>Inscription</button>
                    </div>
                )}
                {registerModal && (
                    <div className='d-flex flex-column align-items-center'>
                        <button className='btn btn-register' id='register' onClick={(e) => {
                            setRegisterModal(false);
                            setLogInModal(true);
                        }}>Connexion</button>
                    </div>
                )}
            </div>
            <div>
                {registerModal && <RegisterForm />}
                {logInModal && <LogInForm />}
            </div>
        </div>
    ); 
};

export default Auth;