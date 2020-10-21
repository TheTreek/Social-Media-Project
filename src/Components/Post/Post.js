import React, { useEffect, useState } from 'react';
import './Post.css';
import { connect } from 'react-redux';
import axios from 'axios';

function Post(props){

    const [data, setData] = useState({});    
    const id=props.match.params.id;


    useEffect(()=>{
        axios.get(`/api/post/${id}`)
            .then(res=>{
                setData(res.data);
            }).catch(err=>{
                console.log(err);
            });
    },[id]);
    

    let date = new Date(data.date);
    date.setHours(date.getHours()-6);

    return(
        <div className='post-container'>
            <div className='post'>
                <span className='post-header'>
                    <span className='post-profile'>
                        <img src={data.profile_pic} alt={`Profile of ${data.user_name}`}/>
                        <span className='post-username'>{data.user_name}</span>
                    </span>
                    <span className='post-date'>{date.toLocaleString()}</span>
                </span>
                <span className='post-body'>
                    <p>{data.content}</p>
                </span>
            </div>
        </div>
    )
}

const mapStateToProps = reduxState => reduxState;
export default connect(mapStateToProps)(Post);