import React from 'react';

const Footer = () => {
  return (
    <footer className='container px-3 mt-5 border-top border-red'>
      <div className='d-flex flex-column align-items-center'>
        <div className='mt-3 mx-auto'>
          <img className='logo' src='./pictures/icons/icon-logo-font-monochrome-black.png' alt="Logo de l'entreprise Groupomania" />
        </div>
        <div className='container-sm mt-2 d-flex flex-row justify-content-center'>
          <span className='px-2'>Créé avec</span>
          <i className="fas fa-heart text-danger pt-1"></i>
          <span className='px-2'>et...</span>
          <img className='logo' src='./pictures/icons/logo192.png' alt="Logo de l'entreprise Groupomania" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;