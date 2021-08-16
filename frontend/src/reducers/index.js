import { combineReducers } from "redux";
import userReducer from "./userreducer";
import usersReducer from "./usersreducer";
import postsReducer from "./postsreducers";

export default combineReducers({
    userReducer,
    usersReducer,
    postsReducer,
});