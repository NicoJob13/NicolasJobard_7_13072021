import React, { useEffect, useState } from 'react';
import Routes from './components/routes';
import { UIdContext } from './components/appcontext';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { getUser } from './actions/useractions';

const App = () => {
  const [uid, setUid] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchToken = async () => {
      await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/jwtid`,
        withCredentials: true
      })
      .then((res) => {
        const udata = res.data.user;
        setUid(udata.id);
      })
      .catch((err) => {
        console.log('Pas de token')
      });
    };
    fetchToken();

    if(uid) {
      dispatch(getUser(uid));
    }
  }, [uid, dispatch]);

  return (
    <UIdContext.Provider value={uid}>
      <div className='container-sm d-flex flex-column align-items-center'>
        <Routes />
      </div>
    </UIdContext.Provider>
  );
};

export default App;