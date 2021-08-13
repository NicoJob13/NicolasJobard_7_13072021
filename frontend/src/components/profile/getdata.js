import { useContext, useEffect, useState } from 'react';
import { UIdContext } from "../appcontext";
import axios from 'axios';

const GetData = () => {
    //Récupération des informations de l'utilisateur
    const uId = useContext(UIdContext);   
    
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const getUserData = async () => {
            await axios({
                method: 'get',
                url: `${process.env.REACT_APP_API_URL}/api/users/${uId}`,
                withCredentials: true,
            })
            .then((res) => { 
                setUserData(res.data);
            })
            .catch((err) => {
                console.log('Problème de récupération des données');
            });
        };
        getUserData();
    }, [uId]);

    return userData;
};

export default GetData;