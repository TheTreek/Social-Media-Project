import React, {useEffect, useState } from 'react';
import './Header.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {getUser} from '../../redux/reducer';
import axios from 'axios';
import {Helmet} from 'react-helmet-async';

function Header(props){
    const [mm, setMM] = useState(false);

    let mmStyle = {display: 'none'};
    if(mm){
        mmStyle = {};
    }

    useEffect(()=>{
        if(!props.user_name){
            axios.get('/api/session').then(res=>{
                const {id,user_name,profile_pic,authenticated} = res.data;
                props.getUser(id,user_name,profile_pic,authenticated);
            }).catch(err=>{
                console.log(err);
            });
        }
    },[props])

    let links = (
        <nav>
            <Link to='/login' className='nav-link'>Login</Link>
            <Link to='/register' className='nav-link'>Register</Link>
        </nav>
    );

    let bottomLinks = (
        <nav style={mmStyle}>
            <Link onClick={e=>setMM(!mm)}  to='/login' className='nav-link mobile-links'>Login</Link>
            <Link onClick={e=>setMM(!mm)}  to='/register' className='nav-link mobile-links' >Register</Link>
        </nav>
    );
    
    if(props.user_name){
        links = (
            <nav>
                <Link to='/' className='nav-link'>Home</Link>
                <Link to={`/profile/${props.id}`} className='nav-link'>Profile</Link>
                <Link to='/new' className='nav-link'>New</Link>
            </nav>
        );
        bottomLinks = (
            <nav style={mmStyle}>
                <Link onClick={e=>setMM(!mm)} to='/' className='nav-link mobile-links'>Home</Link>
                <Link onClick={e=>setMM(!mm)} to={`/profile/${props.id}`} className='nav-link mobile-links'>Profile</Link>
                <Link onClick={e=>setMM(!mm)} to='/new' className='nav-link mobile-links'>New</Link>
            </nav>
        );
    }

    return (
        <div id='header-container'>
            <header id='header'>
                <Helmet>
                    <script src="https://kit.fontawesome.com/6f23942a28.js" crossorigin="anonymous"></script>
                </Helmet>
                <span id='title'>
                    Litter
                </span>
                <i id='hamburger' className='fa fa-bars' onClick={e=>setMM(!mm)}></i>
                {links}
            </header>
            {bottomLinks}
        </div>
    );
}

const mapStateToProps = reduxState => reduxState;
export default connect(mapStateToProps, {getUser})(Header);