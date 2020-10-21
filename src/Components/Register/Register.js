import React, {useState} from 'react';
import './Register.css';
import { connect } from 'react-redux';
import {getUser} from '../../redux/reducer';
import axios from 'axios';
import {Helmet} from 'react-helmet';

function Register(props){
    let [state, setState] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        user_name: '',
    });

    let [error, setError] = useState(null)

    console.log(props);

    const submitForm = (e)=>{
        setError(null)
        axios.post('/api/register',state).then(res=>{
            setState({email: '',password: '',first_name: '', last_name: '',user_name: '',})
            console.log(res);
            const {id,user_name,profile_pic,authenticated} = res.data;
            props.getUser(id,user_name,profile_pic,authenticated);
            props.history.push(`/profile/${id}`);
        }).catch(err=>{
            if(err.response.data){
                setError(err.response.data);
            }else
                setError(err.message)
        });
        e.preventDefault();
    }

    
    let err = (null);
    if(error){
        err = (
        <div id='error'>
            <span id='err'>Error: </span>&nbsp;{error}
        </div>);
    }

    return (
        <div id='register'>
            <Helmet>
                <title>Litter | Sign up</title>
            </Helmet>
            {err}
            <form onSubmit={submitForm}>
                <span id='femail'>
                    <label htmlFor='email'>Email: </label>
                    <input value={state.email} onChange={e=>setState({...state, email: e.target.value})}type='email' id='email' name='email' required/>
                </span>
                <span id='fpassword'>
                    <label htmlFor='password'>Password: </label>
                    <input value={state.password} onChange={e=>setState({...state, password: e.target.value})}type='password' id='password' name='password' required/>
                </span>
                <span id='ffirstname'>
                    <label htmlFor='firstname'>First Name: </label>
                    <input value={state.first_name} onChange={e=>setState({...state, first_name: e.target.value})}type='text' id='firstname' name='firstname' required/>
                </span>
                <span id='flastname'>
                    <label htmlFor='lastname'>Last Name: </label>
                    <input value={state.last_name} onChange={e=>setState({...state, last_name: e.target.value})}type='text' id='lastname' name='lastname' required/>
                </span>
                <span id='fusername'>
                    <label htmlFor='username'>Username: </label>
                    <input value={state.user_name} onChange={e=>setState({...state, user_name: e.target.value})} type='text' id='username' name='username' required/>
                </span>
                <span id='submit'>
                    <br></br>
                    <input type='submit' value='Submit'/>
                </span>
            </form>
        </div>
    )
}

const mapStateToProps = reduxState => reduxState;
export default connect(mapStateToProps, {getUser})(Register);