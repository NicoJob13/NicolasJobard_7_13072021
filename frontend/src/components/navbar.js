import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UIdContext } from "./appcontext";
import LogOut from './auth/logout';
import axios from 'axios';

const Navbar = () => {
    const uId = useContext(UIdContext);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const getUserData = async () => {
            await axios({
                method: 'get',
                url: `${process.env.REACT_APP_API_URL}/api/users/${uId}`,
                withCredentials: true,
            })
            .then((res) => {
                if(res.data.error) {
                    console.log(res.data.error); 
                } else {
                    setUserData(res.data);
                }
            })
            .catch((err) => {
                console.log('Problème de récupération des données');
            });
        };
        getUserData();
    }, [uId]);

    return (
        <nav className='d-flex flex-column justify-content-center align-items-center my-0'>
            <div className='container'>
                <div className='d-flex justify-content-center'>
                    <NavLink exact to='/'>
                        <div>
                            <img className='logo' src='./pictures/icons/icon-logo-font-monochrome-black.png' alt="Logo de l'entreprise Groupomania" />
                        </div>
                    </NavLink>
                </div>
                {uId ? (
                    <div className='d-flex flex-row justify-content-between align-items-center'>
                        <div>
                            <NavLink className='text-dark' exact to='/profile'>
                                <div className='mt-3'>Bonjour {userData.firstname}</div>
                            </NavLink>
                        </div>
                        <div className='mt-3'>
                            <LogOut />
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className='d-flex flex-row justify-content-end'>
                            <NavLink exact to='/profile'>  
                                <span><i className='fas fa-sign-in-alt'></i></span>
                            </NavLink>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;