import React, { useEffect, useState } from 'react';
import './New.css';
import { connect } from 'react-redux';
import axios from 'axios';
import {Helmet} from 'react-helmet-async';

function New(props){
    const [text, setText] = useState(''),
        [type,setType] = useState('text');

    //Make sure that the user is logged in
    useEffect(()=>{
        if(!props.id){
            props.history.push('/');
        }
    },[props.id, props.history]);

    const submit = (e)=>{
        setType('text');
        axios.post('/api/post',{type: type, content: text})
            .then(res=>{
                const id = res.data.id;
                props.history.push(`/post/${id}`);
            }).catch(err=>{
                console.log(err);
            });
        setText('');
        e.preventDefault();
    }

    return (
        <div id='new-post'>
            <Helmet>
                <title>Litter | New Post</title>
            </Helmet>
            <div id='form-container'>
                <h1>New Post</h1>
                
                <form onSubmit={submit}>
                    <span>
                        <label htmlFor='type' className='form-label'>Type: </label>
                        <span>
                            <input id='text-input' type='radio' name='type' value='text' defaultChecked/>
                            <label htmlFor='text-input'>Text</label>
                        </span>
                        &emsp;
                        <span>
                            <input id='img-input' type='radio' name='type' value='img' disabled/>
                            <label htmlFor='img-input'>Image</label>
                        </span>
                    </span>
                    <span id='text'>
                        <textarea placeholder='Type your message here...' value={text} onChange={e=>setText(e.target.value)} autoFocus required name='text' maxLength='250'></textarea>
                        <span id='text-info'>{text.length}/250 Characters</span>
                    </span>
                    <span id='btn-container'>
                        <input type='submit' value='Submit'/>
                    </span>
                </form>
            </div>
        </div>
    )
}

const mapStateToProps = reduxState => reduxState;
export default connect(mapStateToProps)(New);