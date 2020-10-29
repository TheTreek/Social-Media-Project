import React, {useState, useEffect} from 'react';
import './Post.css';
import { Link } from 'react-router-dom';
import {Helmet} from 'react-helmet-async';
import moment from 'moment';
import axios from 'axios';

const Post = (props)=>{

    const [data,setData] = useState({});
    const [noPage, setNoPage] = useState(false);

    //Get post info
    useEffect(()=>{
        const source = axios.CancelToken.source();
        let isMounted = true;
        setNoPage(false);
        setError(false);
        axios.get(`/api/post/${props.id}`,{cancelToken: source.token})
            .then(res=>{
                setData(res.data);
            }).catch(err=>{
                if(err.response && err.response.data && err.response.status){
                    setError(err.response.data);
                    setNoPage(true);
                    // setErrCode(err.response.status);
                }else if(isMounted)
                    setError(err.message)
                else
                    ;
            });
        return () =>{
            source.cancel('Operation canceled by user.');
            isMounted = false;
        }
        },[props.num,props.refresh, props.id]);

    let date = moment(data.date);
    date.subtract(6,'hours');
    date.local();
    const formattedDate = date.format('MM/DD/YYYY h:mm a')
    
    const like = (e)=>{
        e.preventDefault();
        setData({...data, liked: !data.liked});
        axios.get(`/api/like/${data.post_id}`)
            .then(res=>{
                setData(res.data);
            }).catch(err=>{
                if(err.response.data && err.response.status && err.response){
                    setError(err.response.data);
                    // setErrCode(err.response.status);
                }else
                    setError(err.message)
            });
    }

    //Error handling
    let [error, setError] = useState(null);
    //[errCode,setErrCode] = useState(null);
    let err = (null);
    if(error){
        err = (
            <span className='err-cont'>
                <div className='error'>
                    <span className='err'>Error</span>{error}
                </div>
            </span>
        );
    }

    //Set page title if it's the page view
    let title = null;
    if(props.page){
        title = (<title>Litter | Loading...</title>);
        if(data.user_name){
            title = (<title>Litter | Post from {data.user_name}</title>)
        }
    }

    if(noPage){
        return err;
    }

    const imagePost = (
        <img src={data.content} alt={`post from ${data.user_name}`} className='content-img'/>
    )

    const textPost = (
        <p>{data.content}</p>
    )

    let postBody = textPost;
    if(data.type === 'img'){
        postBody = imagePost;
    };


    const follow = (e)=>{
        e.preventDefault();
        axios.put(`/api/follow/${data.id}`)
            .then(res=>{
                setData({...data, following: res.data.count});
                if(props.reload)
                    props.reload();
            }).catch(err=>{
                if(err.response.data && err.response.status && err.response){
                    setError(err.response.data);
                }else
                    setError(err.message)
            })
    }

    let followButton = (
        <div onClick={follow} className='post-follow-button'>Follow</div>
    );

    if(data.following && data.following === '1'){
    followButton = (
        <div onClick={follow} className='post-follow-button-followed'>Following</div>
    )
    }

    return(
        <div className='post'>
            <Helmet>
                {title}
            </Helmet>
            <span className='post-header'>
                <Link to={`/profile/${data.id}`} className='post-link'>
                    <span className='post-profile'>
                        <img src={data.profile_pic} alt={`Profile of ${data.user_name}`}/>
                        <span className='post-username'>{data.user_name}</span>
                    </span>
                </Link>
                <span className='post-date'><p>{formattedDate}</p>{followButton}</span>
            </span>
            <span className='post-body'>
    {(!props.page) ? <Link to={`/post/${props.id}`} className='post-body-link'>{postBody}</Link> : postBody}
                
            </span>
            <span className='post-footer'>
                <span className='post-likes'>
                    <span className='count'>{data.likes}</span>
                    {data.liked === '1' ? <i className='fas fa-heart like-btn' onClick={like}></i> : <i className='far fa-heart like-btn' onClick={like}></i>}
                </span>
                <span className='post-comments'>
                    <span className='count'>{data.comments}</span>
                    {(!props.page) ? <Link to={`/post/${props.id}`} className='post-comment-link'><i className="far fa-comment-alt"></i></Link> : <i className="far fa-comment-alt"></i>}
                </span>
            </span>
            {err}
        </div>
    );
}

export default Post;