import React, { useState, useEffect } from 'react';
import './New.css';
import { connect } from 'react-redux';
import axios from 'axios';
import {Helmet} from 'react-helmet-async';

function New(props){
    const [text, setText] = useState(''),
        [type,setType] = useState('text'),
        [image,setImage] = useState({});

    //Make sure that the user is logged in
    useEffect(()=>{
        if(!props.id){
            props.history.push('/');
        }
    },[props.id, props.history]);

    const submit = (e)=>{
        setType('text');
        let body = {
            type: type,
            content: text
        };
        if(type ==='img'){
            const fd = new FormData();
            console.log(image);
            fd.append('image', image, image.name);
            fd.append('type', type);
            fd.append('content', image.name);
            body = fd;
        };
        console.log(body);
        axios.post('/api/post',body, {
            onUploadProgress: progressEvent =>{
                console.log('Upload progress: ' + progressEvent.loaded / progressEvent.total)
            }
        })
            .then(res=>{
                const id = res.data.id;
                props.history.push(`/post/${id}`);
            }).catch(err=>{
                console.log(err);
            });
        setText('');
        e.preventDefault();
    }

    const typeChange = (e)=>{
        setType(e.target.value);
    }

    const textArea = (
        <span id='text'>
            <textarea placeholder='Type your message here...' value={text} onChange={e=>setText(e.target.value)} autoFocus required name='text' maxLength='250'></textarea>
            <span id='text-info'>{text.length}/250 Characters</span>
        </span>
    );

    const imageInput = (
        <span id='image'>
            <input type='file' name='image' accept='image/*' id='image-input' onChange={e=>setImage(e.target.files[0])}/>
        </span>
    )

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
                            <input id='text-input' onChange={e=>typeChange(e)} type='radio' name='type' value='text' defaultChecked/>
                            <label htmlFor='text-input'>Text</label>
                        </span>
                        &emsp;
                        <span>
                            <input id='img-input' onChange={e=>typeChange(e)} type='radio' name='type' value='img' />
                            <label htmlFor='img-input'>Image</label>
                        </span>
                    </span>
                    {(type === 'text') ? textArea : imageInput}
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