import axios from "axios";

export const GET_USER = "GET_USER";
export const UPDATE_USER = "UPDATE_USER";
export const DELETE_USER = "DELETE_USER";

export const getUser = (uid) => {
    return (dispatch) => {
        return axios
            .get(`${process.env.REACT_APP_API_URL}/api/users/${uid}`)
            .then((res) => {
                dispatch({ type: GET_USER, payload: res.data });
            })
            .catch((err) => console.log(err));
    };
};

export const updateUser = (uid, password, controlPassword) => {
    return (dispatch) => {
        return axios({
            method: 'put',
            url: `${process.env.REACT_APP_API_URL}/api/users/${uid}`,
            withCredentials: true,
            data: {
                password,
                controlPassword,
            },
        })
        .then((res) => {
            dispatch({ type: UPDATE_USER, payload: {password, controlPassword} })
        })
        .catch((err) => console.log(err));
    };
};

export const deleteUser = (uid, controlPassword) => {
    return (dispatch) => {
        return axios({
            method: 'delete',
            url: `${process.env.REACT_APP_API_URL}/api/users/${uid}`,
            withCredentials: true,
            data: {
                controlPassword,
            },
        })
        .then((res) => {
            dispatch({ type: DELETE_USER, payload: controlPassword});
        })
        .catch((err) => console.log(err));
    };
};