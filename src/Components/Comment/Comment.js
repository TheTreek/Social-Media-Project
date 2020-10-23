import React from 'react';
import { Link } from 'react-router-dom';
import './Comment.css';

const Comment = (props)=>{
    const {comment,user_name,profile_pic,user_id} = props.data;

    return (
        <div className='post-comment'>
            {/* <span className='comment-header'> */}
                <Link className='comment-header' to={`/profile/${user_id}`}>
                    <img src={profile_pic} alt={user_name} className='comment-profile-pic'/>
                    <span className='comment-username'>{user_name}</span>
                </Link>
            {/* </span> */}
            <span className='comment-body'>
                <p>{comment}</p>
            </span>
        </div>
    );
}

export default Comment;