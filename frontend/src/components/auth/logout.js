import React from 'react';
import axios from 'axios';
import cookie from 'js-cookie';

const LogOut = () => {
    const deleteCookie = (key) => {
        if(window !== 'undefined') {
            cookie.remove(key, { expires: 1 });
        }
    };
    
    const logOut = async () => {
        await axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/api/auth/logout`,
            withCredentials: true,
        })
        .then(() => deleteCookie('jwt'))
        .catch((err) => console.log(err));
          
        window.location = '/';
    };

    return (
        <span className='logout' onClick={logOut}>
            <i className="fas fa-sign-out-alt pe-2"></i>Quitter
        </span>
    );
};

export default LogOut