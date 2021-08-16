import { DELETE_POST, GET_POSTS, UPDATE_POST } from "../actions/postsactions";

const initialState = {};

export default function postsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_POSTS:
            return action.payload;
        case UPDATE_POST:
            return state.map((post) => {
                if (post._id === action.payload.pid) {
                    return {
                    ...post,
                    text: action.payload.text,
                    };
                } else return post;
            });
        case DELETE_POST:
            return state.filter((post) => post.id !== action.payload.pid);
        default:
            return state;
    };
};