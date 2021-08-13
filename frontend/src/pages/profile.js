import React, { useContext } from 'react';
import Auth from '../components/auth';
import { UIdContext } from "../components/appcontext";
import HandleProfile from '../components/profile/';

const Profile = () => {
    const uId = useContext(UIdContext);

    return (
        <div>
            {uId ? (
                <HandleProfile display={true} update={false} delete={false}/>
            ) : (
                <div>
                <Auth register={true} login={false} />
                </div>
            )}
        </div>
    );
};

export default Profile;