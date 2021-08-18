import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, getPosts, updatePost } from '../../actions/postsactions';
import { dateParser, isEmpty } from '../utils';

const Card = ({ post }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdated, setIsUpdated] = useState(false);
    const [textUpdate, setTextUpdate] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [message, setMessage] = useState(null);
    const [comIsUpdated, setComIsUpdated] = useState(false);
    const [comUpdate, setComUpdate] = useState(null);
    const usersData = useSelector((state) => state.usersReducer);
    const userData = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();
    const pid = post.id;

    //Gestion de la card
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
    
    //Gestion des commentaires
    const getComments = () => {
        const pid = post.id;
        console.log(pid);
        axios.get(`${process.env.REACT_APP_API_URL}/api/comments/post/${post.id}`)
        .then(res => {
            const newCommentsData = res.data;
            console.log(newCommentsData);
            setComments(newCommentsData);
            return comments;
        });
    };

    const cancelCom = (e) => {
        e.preventDefault();

        setMessage('');
    };

    const sendCom = async (e) => {
        e.preventDefault();

        if(message) {
            await axios({
                method: 'post',
                url: `${process.env.REACT_APP_API_URL}/api/comments`,
                withCredentials: true,
                data: {
                    UserId: userData.id,
                    PostId: post.id,
                    text : message,
                },
            })
            .then((res) => {
                setMessage('');
            }).then(() => {
                getComments();
            })
            .catch((err) => console.log(err));
        } else {
            alert("Veuillez entrer un commentaire")
        }
    };

    const updateCom = (cid) => {
        if (comUpdate) {
            axios({
                method: 'put',
                url: `${process.env.REACT_APP_API_URL}/api/comments/${cid}`,
                withCredentials: true,
                data: {
                    text : comUpdate,
                },
            })
            .then((res) => {
                cancelCom();
                getComments();
                setComIsUpdated(false);
            })
            .catch((err) => console.log(err));
        }
    };

    const deleteCom = (cid) => {
        axios({
            method: 'delete',
            url: `${process.env.REACT_APP_API_URL}/api/comments/${cid}`,
        })
        .then((res) => {
            getComments();
        })
        .catch((err) => console.log(err));
    };

    useEffect(() => {
        !isEmpty(usersData) && setIsLoading(false);
    }, [usersData]);

    return (
        <div className='post-card mt-3 bg-red' key={post.id}>
            {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
            ) : (
            <>
            <div className='d-flex flex-row justify-content-between px-2 pt-1'>
                <h4 className='fs-6 me-0'>{post.userName}</h4>
                <div className='date'>{dateParser(post.createdAt)}</div>
            </div>
            <div className='text-body d-flex flex-row justify-content-between mx-auto mb-2'>
                {isUpdated === false && <div className='px-2 align-self-center'>{post.text}</div>}
                {isUpdated && (
                    <div>
                        <textarea className='post-area-edit form-control ps-1 ms-1 mt-1' defaultValue={post.text} onChange={(e) => setTextUpdate(e.target.value)} />
                        <div className='d-flex flex-row justify-content-center my-1'>
                            <button className='btn btn-post ms-5 me-1' onClick={updateCard}>Valider</button>
                            <button className='btn btn-post mx-1' onClick={() => setIsUpdated(false)}>Annuler</button>
                        </div>
                    </div>
                )}
                {(userData.id === post.UserId || userData.role === 'Chargé(e) de communication') && (
                <>
                <div>    
                    <div>
                        <div className='update-btn px-1' onClick={() => setIsUpdated(true)}><i className="far fa-edit"></i></div>
                    </div>
                    <div>
                        <div className='delete-btn px-1' onClick={() => {
                            if(window.confirm('Vous êtes sur le point de supprimer une publication. Confirmez-vous la suppression ?')) {
                                deleteCard();
                            }
                        }}><i className="far fa-trash-alt"></i>
                        </div>
                    </div>
                </div>
                </>
                )}
            </div>
            <div className='card-footer'>
                <div onClick={() => {
                    setShowComments(!showComments);
                    getComments();
                }}>
                <span className='ms-1 com-toggle'><i className='far fa-comment-dots me-2 mb-3'></i>Afficher/Masquer</span>
                </div>
                {showComments && (
                    <div>
                        {comments.map(comment => (
                            <div className='container-sm text-body mb-3' key={comment.id}>
                                <div className='d-flex flex-row justify-content-between pt-1'>
                                    <h4 className='fs-6 me-0'>{comment.userName}</h4>
                                    <div className='date-com'>{dateParser(comment.createdAt)}</div>
                                </div>
                                <div className='container-sm text-body d-flex flex-row justify-content-between mb-2'>
                                    {comIsUpdated === false && <div className='align-self-center'>{comment.text}</div>}
                                    {(userData.id === comment.UserId || userData.role === 'Chargé(e) de communication') && (comIsUpdated === false) && (
                                    <>
                                    <div>
                                        <div>
                                            <div className='update-btn' onClick={() => setComIsUpdated(true)}><i className="far fa-edit"></i></div>
                                        </div>
                                        <div>
                                            <div className='delete-btn' onClick={() => {
                                                if(window.confirm('Vous êtes sur le point de supprimer un commentaire. Confirmez-vous la suppression ?')) {
                                                    deleteCom(comment.id);
                                                }
                                            }}><i className="far fa-trash-alt"></i>
                                            </div>
                                        </div>
                                    </div>
                                    </>
                                    )}
                                    {(userData.id === comment.UserId || userData.role === 'Chargé(e) de communication') && comIsUpdated && (
                                        <div >
                                            <input className='com-input-edit mt-1 form-control' type='text'  defaultValue={comment.text} onChange={(e) => setComUpdate(e.target.value)} />
                                            <div className='d-flex flex-row justify-content-center my-1'>
                                                <button className='btn btn-post mx-1' onClick={() => updateCom(comment.id)}>Valider</button>
                                                <button className='btn btn-post mx-1' onClick={() => setComIsUpdated(false)}>Annuler</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <form id='postForm' action='' onSubmit={sendCom}>
                    <div className='d-flex flex-column'>
                        <label className='form-label align-self-center' htmlFor={'com' + pid} >Réagir à la publication</label>
                        <input className='text-area-post form-control mt-1 mb-2' type='text' name={'com' + pid} id={'com' + pid} placeholder='Laissez un commentaire' value={message} onChange={(e) => setMessage(e.target.value)}/>
                    </div>
                    <div className='d-flex flex-row justify-content-center'>
                        <button className='btn btn-post mx-1' onClick={cancelCom}>Annuler</button>
                        <button className='btn btn-post mx-1' type='submit'>Envoyer</button>
                    </div>
                </form>
            </div>
            </>)}
        </div>
    );
};

export default Card;