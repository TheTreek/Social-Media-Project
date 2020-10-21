import React from 'react';
import './Home.css';
import { connect } from 'react-redux';

function Home(){
    return (
        <div>
            Home
        </div>
    )
}

const mapStateToProps = reduxState => reduxState;
export default connect(mapStateToProps)(Home);