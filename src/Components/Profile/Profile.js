import React, { useEffect, useState } from 'react';
import './Profile.css';
import { connect } from 'react-redux';
import axios from 'axios';
import Post from '../Post/Post';
import Comment from '../Comment/Comment';

function Profile(props){
    const [selected, setSelected] = useState('posts')
    const [content, setContent] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [profile, setProfile] = useState({
        user_name: 'userName',
        first_name: 'firstName',
        last_name: 'lastName',
        profile_pic: 'https://litter.s3-us-west-2.amazonaws.com/defaults/default-user.png',
        bio: 'User has no bio...',
        followers: 0,
        following: 0,
        post_count: 0
    });
    //Inital loading
    useEffect(()=>{
        axios.get(`/api/profile/${props.match.params.id}`)
            .then(res=>{
                setProfile(res.data);
            }).catch(err=>{
                console.log(err);
            })
    }, [props.match.params.id]);

    //Get content
    useEffect(()=>{
        setContent([]);
        let url = `/api/profile/${props.match.params.id}/${selected}`
        axios.get(url)
            .then(res=>{
                setContent(res.data);
            }).catch(err=>{
                console.log(err);
            });
    },[selected, props.match.params.id]);

    const reload = ()=>{
        console.log(refresh)
        setRefresh(refresh+1);
    }

    if(!profile.bio){
        setProfile({...profile, bio: 'User has no bio set...'})
    }
    return (
        <div id='profile-container'>
            <div id='profile-header'>
                <div id='profile-picture'>
                    <h1 id='profile-username'>{profile.user_name}</h1>
                    <img src={profile.profile_pic} alt={`Profile of ${profile.user_name}`}/>
                </div>
                <div id='header-info'>
                    <h1 id='full-name'>{profile.first_name} {profile.last_name}</h1>
                    <div id='header-bio'>
                        <p>{profile.bio}</p>
                    </div>
                    <div id='header-stats'>
                        <span id='followers' className='count-box'>
                            <span className='count-title'>Followers</span>
                            <span className='count-data'>{profile.followers}</span>
                        </span>
                        <span id='following' className='count-box'>
                            <span className='count-title'>Following</span>
                            <span className='count-data'>{profile.following}</span>
                        </span>
                        <span id='posts' className='count-box'>
                            <span className='count-title'>Posts</span>
                            <span className='count-data'>{profile.post_count}</span>
                        </span>
                    </div>
                </div>
            </div>
            <div id='profile-menu'>
                {selected === 'posts' ? 
                    <span className='menu-btn selected' onClick={e=>setSelected('posts')}><span>Posts</span></span> : 
                    <span className='menu-btn' onClick={e=>setSelected('posts')}><span>Posts</span></span>
                }
                {selected === 'likes' ? 
                    <span className='menu-btn selected' onClick={e=>setSelected('likes')}><span>Likes</span></span> : 
                    <span className='menu-btn' onClick={e=>setSelected('likes')}><span>Likes</span></span>
                }
                {selected === 'comments' ? 
                    <span className='menu-btn selected' onClick={e=>setSelected('comments')}><span>Comments</span></span> : 
                    <span className='menu-btn' onClick={e=>setSelected('comments')}><span>Comments</span></span>
                }
            </div>
            <div id='content-container'>
                {(selected === 'posts' || selected === 'likes') ?
                    content.map((val, i)=>{
                        return <span key={(i).toString()} className='post-links' onClick={e=>props.history.push(`/post/${val.id}`)}to={`/post/${val.id}`} ><Post id={val.id} refresh={refresh} reload={reload}/></span>
                    }) : 
                    content.map((val, i)=>{
                        return <span key={(i).toString()} className='links' onClick={e=>props.history.push(`/post/${val.post_id}`)}><Comment id={val.id}/></span>
                    })}
            </div>
        </div>
    )
}

const mapStateToProps = reduxState => reduxState;
export default connect(mapStateToProps)(Profile);