import { DELETE_USER, GET_USER, UPDATE_USER } from "../actions/useractions";

const initialState = {};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case GET_USER:
            return action.payload;
        case UPDATE_USER:
            return action.payload;
        case DELETE_USER:
            return action.payload;

        default:
            return state;
    }
}