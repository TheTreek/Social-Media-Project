import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Comment.css';

const Comment = (props)=>{
    const [data, setData] = useState({});

    useEffect(()=>{
        const source = axios.CancelToken.source();
        let isMounted = true;
        if(!props.data){
            axios.get(`/api/comment/${props.id}`, {cancelToken: source.token})
                .then(res=>{
                    setData(res.data)
                }).catch(err=>{
                    if(isMounted){
                        console.log(err)
                    }
                });
        }else{
            setData(props.data);
        }
        return ()=>{
            source.cancel();
            isMounted = false;
        }
    },[props]);

    const {comment,user_name,profile_pic,user_id} = data;

    return (
        <div className='post-comment'>
                <Link className='comment-header' to={`/profile/${user_id}`}>
                    <img src={profile_pic} alt={user_name} className='comment-profile-pic'/>
                    <span className='comment-username'>{user_name}</span>
                </Link>
            <span className='comment-body'>
                <p>{comment}</p>
            </span>
        </div>
    );
}

export default Comment;