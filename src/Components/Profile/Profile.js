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
    const [form, setForm] = useState({
        first_name: 'FirstName',
        last_name: 'LastName',
        bio: 'User bio....'
    });
    const [edit, setEdit] = useState(false);
    const [reloadProfile, setRP] = useState(false);
    //Inital loading
    useEffect(()=>{
        axios.get(`/api/profile/${props.match.params.id}`)
            .then(res=>{
                setProfile(res.data);
                setForm({
                    first_name: res.data.first_name,
                    last_name: res.data.last_name,
                    bio: res.data.bio
                });
            }).catch(err=>{
                console.log(err);
            });
    }, [props.match.params.id, reloadProfile]);

    //Get content
    useEffect(()=>{
        setContent([]);
        let url = `/api/profile/${props.match.params.id}/${selected}`;
        axios.get(url)
            .then(res=>{
                setContent(res.data);
            }).catch(err=>{
                console.log(err);
            });
    },[selected, props.match.params.id]);

    const reload = ()=>{
        setRefresh(refresh+1);
    }

    if(!profile.bio){
        setProfile({...profile, bio: 'User has no bio set...'});
    }

    const submitForm = (e)=>{
        e.preventDefault();
        axios.put(`/api/profile/${props.match.params.id}`, form)
        .then(res=>{
            setRP(!reloadProfile);
            console.log(res.data);
        }).catch(err=>{
            console.log(err);
        });
        setEdit(!edit);
    }

    const formJSX = (
        <div id='profile-form'>
            <form id='edit-profile' onSubmit={submitForm}>
                <span id='form-firstname' className='small-inp'>
                    <label htmlFor='firstname'>First name:</label>
                    <input type='text' name='firstname' value={form.first_name} onChange={e=>setForm({...form, first_name: e.target.value})}/>
                </span>
                <span id='form-lastname' className='small-inp'>
                    <label htmlFor='lastname'>Last name:</label>
                    <input type='text' name='lastname' value={form.last_name} onChange={e=>setForm({...form, last_name: e.target.value})}/>
                </span>
                <span id='form-bio'>
                    <label htmlFor='bio'>Bio:</label>
                    <textarea name='bio' maxLength='250' value={form.bio} onChange={e=>setForm({...form, bio: e.target.value})}/>
                    <span id='bio-footer'>
                        <span id='form-count'>{form.bio.length}/250</span>
                        <input type='submit' value='Submit' id='button'/>
                        <span id='cancel' onClick={e=>setEdit(!edit)}>Cancel</span>
                    </span>
                </span>
            </form>
        </div>
    );

    const editProfile = (
        <div id='edit-cont'>
            <button onClick={e=>setEdit(!edit)}>Edit Profile</button>
        </div>
    );
    const profileHeader = (
        <div id='profile-header'>
            <div id='profile-picture'>
                <h1 id='profile-username'>{profile.user_name}</h1>
                <img src={profile.profile_pic} alt={`Profile of ${profile.user_name}`}/>
            </div>
            <div id='header-info'>
                {(props.match.params.id+'' === props.id+'') ? editProfile : null}
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
    );

    return (
        <div id='profile-container'>
            {edit ? formJSX : profileHeader}
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