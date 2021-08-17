import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, getPosts, updatePost } from '../../actions/postsactions';
import { dateParser, isEmpty } from '../utils';

const Card = ({ post }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdated, setIsUpdated] = useState(false);
    const [textUpdate, setTextUpdate] = useState(null);
    const usersData = useSelector((state) => state.usersReducer);
    const userData = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    const updateCard = () => {
        if (textUpdate) {
            dispatch(updatePost(post.id, textUpdate))
                .then(() => dispatch(getPosts())
                .catch((err) => console.log(err)));
        }
        setIsUpdated(false);
    };

    const deleteCard = () => {
        dispatch(deletePost(post.id))
            .then(() => dispatch(getPosts())
            .catch((err) => console.log(err)));
    };
    
    useEffect(() => {
        !isEmpty(usersData) && setIsLoading(false);
    }, [usersData]);

    return (
        <div className='card-container d-flex flex-column mt-5 border border-2 border-red rounded' key={post.id}>
            {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
            ) : (
            <>
            <div className='card-header d-flex flex-row justify-content-between'>
                <h3 className='fs-4'>{post.userName}</h3>
                <div className='pt-1'>{dateParser(post.createdAt)}</div>
            </div>
            <div className='card-body'>
                {isUpdated === false && <div>{post.text}</div>}
                {isUpdated && (
                    <div>
                        <textarea className='form-control' defaultValue={post.text} onChange={(e) => setTextUpdate(e.target.value)} />
                        <div>
                            <button onClick={updateCard}>Valider</button>
                            <button onClick={() => setIsUpdated(false)}>Annuler</button>
                        </div>
                    </div>
                )}
                {(userData.id === post.UserId || userData.role === 'Chargé(e) de communication') && (
                <>
                    <div>
                        <div onClick={() => setIsUpdated(true)}><i className="far fa-edit"></i></div>
                    </div>
                    <div>
                        <div onClick={() => {
                            if(window.confirm('Vous êtes sur le point de supprimer une publication. Confirmez-vous la suppression ?')) {
                                deleteCard();
                            }
                        }}><i className="far fa-trash-alt"></i>
                        </div>
                    </div>
                </>
                )}
            </div>
            <div className='card-footer'>
                <div>
                <i className='far fa-comment-dots'></i>
                </div>
            </div>
            </>)}
            <div></div>
        </div>
    );
};

export default Card;