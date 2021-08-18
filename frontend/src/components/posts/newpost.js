import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from '../../actions/postsactions'

const NewPost = () => {
    const [text, setText] = useState(null);
    const userData = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    const cancelPost = (e) => {
        e.preventDefault();
        
        setText('');
    };

    const sendPost = async (e) => {
        e.preventDefault();

        if(text) {
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
                setText('');
                dispatch(getPosts());
            })
            .catch((err) => console.log(err));
        } else {
            alert("Veuillez entrer un message")
        }
    };

    return (
        <div className='d-flex flex-column mt-2'>
            <form className='form bg-red' id='postForm' action='' onSubmit={sendPost}>
                <div className='container d-flex flex-column'>
                    <label className='form-label my-2 align-self-center fw-bold' htmlFor='message'>Déposez un nouvel article</label>
                    <textarea className='text-area-post form-control my-1' name='message' id='message' placeholder='Quoi de neuf ?' value={text} onChange={(e) => setText(e.target.value)}/>
                </div>
                <div className='container d-flex flex-row justify-content-center mb-2'>
                    <button className="btn btn-post mx-1" onClick={cancelPost}>Annuler</button>
                    <button className='btn btn-post mx-1' type='submit'>Envoyer</button>
                </div>
            </form>
        </div>
    );
};

export default NewPost;