import React, { useEffect, useState } from 'react';
import Routes from './components/routes';
import { UIdContext } from './components/appcontext';
import axios from 'axios';

import './styles/normalize.css';
import './styles/bootstrap.css';
import './styles/styles.css';

const App = () => {
  const [uId, setUId] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/jwtid`,
        withCredentials: true
      })
      .then((res) => {
        setUId(res.data.id);
      })
      .catch((err) => {
        console.log('Pas de token')
      });
    };
    fetchToken();

  }, [uId]);
  
  return (
    <UIdContext.Provider value={uId}>
      <div className='container-sm d-flex flex-column align-items-center'>
        <Routes />
      </div>
    </UIdContext.Provider>
  );
};

export default App;
