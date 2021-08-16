import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../actions/postsactions';
import { isEmpty } from './utils';
import Card from "./posts/card";

const Thread = () => {
    const [loadPosts, setLoadPosts] = useState(true);
    const [count, setCount] = useState(5);
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.postsReducer);
    
    const loadMore = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 > document.scrollingElement.scrollHeight) {
            setLoadPosts(true);
        }
    }

    useEffect(() => {
        if(loadPosts) {
            dispatch(getPosts(count));
            setLoadPosts(false);
            setCount(count + 5);
        }
        window.addEventListener('scroll', loadMore);
        return () => window.removeEventListener('scroll', loadMore);
    }, [loadPosts, dispatch, count])

    return (
        <div>
            {!isEmpty(posts[0]) &&
                posts.map((post) => {
                    return <Card post={post} key={post.id}/>
                })
            }     
        </div>            
    );
};

export default Thread;