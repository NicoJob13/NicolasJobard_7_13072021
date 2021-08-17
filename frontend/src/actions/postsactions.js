import axios from "axios";

// Posts
export const GET_POSTS = "GET_POSTS";
export const ADD_POST = "ADD_POST";
export const UPDATE_POST = "UPDATE_POST";
export const DELETE_POST = "DELETE_POST";

export const getPosts = (num) => {
    return (dispatch) => {
        return axios
            .get(`${process.env.REACT_APP_API_URL}/api/posts/`)
            .then((res) => {
                const array = res.data.slice(0, num);
                dispatch({ type: GET_POSTS, payload: array })
            })
            .catch((err) => console.log(err));
    };
};

export const addPost = (data) => {
    return (dispatch) => {
        return axios
            .post(`${process.env.REACT_APP_API_URL}/api/posts/`, data);
    };
};

export const updatePost = (pid, text) => {
    return (dispatch) => {
        return axios({
            method: 'put',
            url: `${process.env.REACT_APP_API_URL}/api/posts/${pid}`,
            data: {
                text,                    
            },
        })
        .then((res) => {
            dispatch({ type: UPDATE_POST, payload: { pid, text }});
        })
        .catch((err) => console.log(err));
    };
};

export const deletePost = (pid) => {
    return (dispatch) => {
        return axios({
            method: 'delete',
            url: `${process.env.REACT_APP_API_URL}/api/posts/${pid}`,
        })
        .then((res) => {
            dispatch({ type: DELETE_POST, payload: pid });
        })
        .catch((err) => console.log(err));
    };
};