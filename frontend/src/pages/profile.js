import React, { useContext } from 'react';
import Auth from '../components/auth';
import { UIdContext } from "../components/appcontext";

const Profile = () => {
    const uId = useContext(UIdContext);

    return (
        <div>
            {uId ? (
                <h1>UPDATE PAGE</h1>
            ) : (
                <div>
                <Auth register={true} login={false} />
                </div>
            )}
        </div>
    );
};

export default Profile;