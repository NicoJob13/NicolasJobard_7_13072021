import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UIdContext } from "./appcontext";
import LogOut from './auth/logout';

const Navbar = () => {
    //Récupération des informations sur l'utilisateur
    const uId = useContext(UIdContext);

    return (
        <nav className='container px-3 py-3 border-bottom border-red d-flex flex-column justify-content-center align-items-center my-0'>
            <div className='container'>
                <div className='d-flex justify-content-center'>
                    <NavLink exact to='/'>
                        <div>
                            <img className='logo' src='./pictures/icons/icon-logo-font-monochrome-black.png' alt="Logo de l'entreprise Groupomania" />
                        </div>
                    </NavLink>
                </div>
                {uId && (
                    <div className='d-flex flex-row justify-content-between align-items-center'>
                        <div>
                            <NavLink className='text-dark' exact to='/profile'>
                                <div className='mt-3'><i className="fas fa-user-circle pe-2"></i>Profil</div>
                            </NavLink>
                        </div>
                        <div className='mt-3'>
                            <LogOut />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;