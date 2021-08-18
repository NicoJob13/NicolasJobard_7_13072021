import React from 'react';

const Footer = () => {
  return (
    <footer className='footer container mt-4 pb-1 border-top border-red'>
      <div className='d-flex flex-column align-items-center'>
        <div className='container-sm mt-1 d-flex flex-row justify-content-center'>
          <span className='px-2 pt-1'>Créé avec</span>
          <i className="fas fa-heart text-danger pt-2"></i>
          <span className='px-2 pt-1'>,</span>
          <img className='logo' src='./pictures/icons/logo192.png' alt="Logo React" />
          <span className='px-2 pt-1'>et</span>
          <i className="fa-2x fab fa-bootstrap"></i>
        </div>
      </div>
    </footer>
  );
};

export default Footer;