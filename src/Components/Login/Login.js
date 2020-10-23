import React, {useState} from 'react';
import './Login.css';
import { connect } from 'react-redux';
import {getUser} from '../../redux/reducer';
import axios from 'axios'
import {Helmet} from 'react-helmet-async';

function Login(props){
    let [state, setState] = useState({
        password: '', 
        user_name: '',
    });
    let [error, setError] = useState(null);
        // [errCode,setErrCode] = useState(null);

    const submitForm = (e)=>{
        axios.post('/api/login',state).then(res=>{
            const {id,user_name,profile_pic,authenticated} = res.data;
            props.getUser(id,user_name,profile_pic,authenticated);
            props.history.push(`/profile/${id}`);
        }).catch(err=>{
            if(err.response.data){
                setError(err.response.data);
                // setErrCode(err.response.status);
            }else
                setError(err.message)
        });
        e.preventDefault();
    }

    let err = (null);
    if(error){
        err = (
        <div id='error'>
            {/* <img src={`https://http.cat/${errCode}`} alt='cat'/> */}
            <span id='err'>Error</span>{error}
        </div>);
    }
    return (
        <div id='login'>
            <Helmet>
                <title>Litter | Login</title>
            </Helmet>
            {err}
            <form onSubmit={submitForm}>
                <span id='f-username'>
                    <label htmlFor='username'>Username: </label>
                    <input autoFocus value={state.user_name} onChange={e=>setState({...state,user_name: e.target.value})} type='text' id='username' name='username' required/>
                </span>
                <span id='f-password'>
                    <label htmlFor='password'>Password: </label>
                    <input value={state.password} onChange={e=>setState({...state,password: e.target.value})}type='password' id='password' name='password' required/>
                </span>
                <span id='f-submit'>
                    <input type='submit' value='Submit'/>
                </span>
            </form>
        </div>
    )
}

const mapStateToProps = reduxState => reduxState;
export default connect(mapStateToProps, {getUser})(Login);