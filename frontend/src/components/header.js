import React from 'react';
import Navbar from './navbar';

const Header = () => {
  return (
    <header className='header container px-3 py-2 border-bottom border-red'>
      <Navbar />
    </header>
  );
};
  
export default Header;