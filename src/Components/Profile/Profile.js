import React from 'react';
import './Profile.css';
import { connect } from 'react-redux';

function Profile(){
    return (
        <div>
            Profile
        </div>
    )
}

const mapStateToProps = reduxState => reduxState;
export default connect(mapStateToProps)(Profile);