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
    const [message, setMessage] = useState('');
    const usersData = useSelector((state) => state.usersReducer);
    const userData = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

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

    const cancelCom = () => {
        setMessage('');
    };

    const sendCom = async (e) => {
        e.preventDefault();

        if(message !== null) {
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
                cancelCom();
                getComments();
            })
            .catch((err) => console.log(err));
        } else {
            alert("Veuillez entrer un commentaire")
        }
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
                <div onClick={() => {
                    setShowComments(!showComments);
                    getComments();
                }}>
                <i className='far fa-comment-dots'><span className='ms-1'>Afficher/Masquer les commentaires</span></i>
                </div>
                {showComments && (
                    <div>
                        {comments.map(comment => (
                            <div className='border border-1 border-dark' key={comment.id}>
                                <div>
                                    <h4>{comment.userName}</h4>
                                    <div className='pt-1'>{dateParser(comment.createdAt)}</div>
                                </div>
                                <div>{comment.text}</div>
                            </div>
                        ))}
                    </div>
                )}
                <form className='' id='postForm' action='' onSubmit={sendCom}>
                    <div>
                        <label className='fw-bold form-label' htmlFor='commentaire'>Nouveau message</label>
                        <textarea className='form-control' name='commentaire' id='commentaire' placeholder='Laissez un commentaire' value={message} onChange={(e) => setMessage(e.target.value)}/>
                        <input className='' type='submit' value="Envoyer" />
                    </div>
                </form>
                <button className="" onClick={cancelCom}>Annuler</button>
            </div>
            </>)}
        </div>
    );
};

export default Card;