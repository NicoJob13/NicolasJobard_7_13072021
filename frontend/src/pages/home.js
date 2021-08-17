import React, { useContext } from 'react';
import { UIdContext } from "../components/appcontext";
import Auth from '../components/auth';
import NewPost from '../components/posts/newpost';
import Thread from '../components/thread';

const Home = () => {
  const uId = useContext(UIdContext);

  return (
    <div className='d-flex flex-column'>
      {!uId && (
        <>
        <h1 className='mt-4 text-center'>Groupomania Connect</h1>
        <h2 className='mt-4 text-center'>Le réseau social qui réunit les membres de Groupomania !</h2>
        <Auth register={false} login={true}/>
        </>
      )}
      {uId && (
        <>
        <div>
          <NewPost />
        </div>
        <div className=''>
          <Thread />
        </div>
        </>
      )}
    </div>
  );
};

export default Home;