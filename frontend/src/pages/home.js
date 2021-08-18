import React, { useContext } from 'react';
import { UIdContext } from "../components/appcontext";
import Auth from '../components/auth';
import NewPost from '../components/posts/newpost';
import Thread from '../components/thread';

const Home = () => {
  const uId = useContext(UIdContext);

  return (
    <div className='my-5 py-5 d-flex flex-column'>
      {!uId && (
        <>
        <h1 className='text-center'>Groupomania Connect</h1>
        <h2 className='fs-4 mt-4 text-center'>Le réseau social qui réunit les membres de Groupomania !</h2>
        <Auth register={false} login={true}/>
        </>
      )}
      {uId && (
        <>
        <h1 className='mt-2 text-center'>Groupomania Connect</h1>
        <h2 className='fs-4 mt-4 text-center'>Le réseau social des membres de Groupomania !</h2>
        <div>
          <h3 className='fs-5 mt-3 mb-3 text-center'>Partagez avec vos collègues</h3>        
          <NewPost />
        </div>
        <div className=''>
          <h3 className='fs-5 mt-4 text-center'>Les dernières nouvelles de vos collègues</h3>
          <Thread />
        </div>
        </>
      )}
    </div>
  );
};

export default Home;