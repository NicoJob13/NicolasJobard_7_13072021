import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from '../../actions/postsactions'

const NewPost = () => {
    const [text, setText] = useState('');
    const userData = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    const cancelPost = () => {
        setText('');
    };

    const sendPost = async (e) => {
        e.preventDefault();

        if(text !== null) {
            await axios({
                method: 'post',
                url: `${process.env.REACT_APP_API_URL}/api/posts`,
                withCredentials: true,
                data: {
                    UserId: userData.id,
                    text,
                },
            })
            .then((res) => {
                dispatch(getPosts());
                cancelPost();
            })
            .catch((err) => console.log(err));
        } else {
            alert("Veuillez entrer un message")
        }
    };

    return (
        <div className='d-flex flex-column mt-3 border border-2 border-red rounded'>
            <form className='' id='postForm' action='' onSubmit={sendPost}>
                <div>
                    <label className='fw-bold form-label' htmlFor='message'>Nouveau message</label>
                    <textarea className='form-control' name='message' id='message' placeholder='Quoi de neuf ?' value={text} onChange={(e) => setText(e.target.value)}/>
                    <input className='' type='submit' value="Envoyer" />
                </div>
            </form>
            <button className="" onClick={cancelPost}>Annuler</button>
        </div>
    );
};

export default NewPost;