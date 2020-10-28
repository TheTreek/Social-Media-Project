import React, { useEffect, useState, useCallback} from 'react';
import { connect } from 'react-redux';
import './PostPage.css';
import Post from '../Post/Post';
import Comment from '../Comment/Comment';
import axios from 'axios';

function PostPage(props){
    let id=props.match.params.id;

    // Get comments
    const [comments, setComments] = useState([]);
    const getComments = useCallback(()=>{
        axios.get(`/api/post/${id}/comments`)
        .then(res=>{
            setComments(res.data.map((val,i)=>{
                return <Comment data={val} key={i}/>;
            }));           
        }).catch(err=>{
            console.log(err);
        });
    },[id]);
    useEffect(()=>{
        getComments();
    },[props,getComments]);

    //Post comment
    const [num,setNum] = useState(0);
    const [form, setForm] = useState('');
    const postComment = (e)=>{
        e.preventDefault();
        axios.post(`/api/post/${id}/comment`, {comment: form})
            .then(res=>{
                setForm('');
                getComments();
                setNum(num+1);
            }).catch(err=>{
                console.log(err);
            })
    }

    //If logged in
    let commentForm = null;
    if(props.user_name){
        commentForm = (
            <form id='comment-form' onSubmit={postComment}>
                    {/* <label htmlFor='comment'>Write a comment:</label> */}
                    <textarea value={form} onChange={(e)=>setForm(e.target.value)} maxLength="125" name='comment' id='comment-text' placeholder='Write a comment...' required></textarea>
                    <span id='submit-container'>
                        <span id='comment-length'>{form.length} / 125 &nbsp;</span>
                        <input type='submit' value='Submit'/>
                    </span>
                </form>
        );
    }
    return(
        <div className='post-container'>
            {/* Back Button */}
            <span>
                <div className='back-btn' onClick={props.history.goBack}><i className="fas fa-arrow-left"></i>&nbsp;<span>Back</span></div>
            </span>

            {/* The post */}
            <Post num={num} page={true} id={id}/>

            {/* Comments */}
            <div id='comment-container'>
                {/* <h1>Write a comment:</h1> */}
                <h1>Comments:</h1>
                {commentForm}
                {comments}
            </div>
        </div>
    )
}

const mapStateToProps = reduxState => reduxState;
export default connect(mapStateToProps)(PostPage);