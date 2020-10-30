import React from 'react';
import './Home.css';
import { connect } from 'react-redux';

function Home(){
    return (
        <div id='home-container'>
            <div id='home-header'>
                <h1>Welcome to Litter</h1>
                <p>Litter is a social media site that is made to be simple. Posts are made to be short and sweet, you can choose between a simple 250 character long text post or a single image post. You can follow people you find funny and you can like and comment on any posts. Every post you like and every comment you make will be visible on your profile. On the search page, you can search for posts through keywords, the results come from the content of each post, the poster's username, or the content of the comments on each post. 
 You must be logged in to interact with posts but you can view profiles, posts, and comments without having an account or being logged in. I wanted users to be able to share posts or profiles with friends who may not have an account or don't want to create an account.</p>
            </div>
        </div>
    )
}

const mapStateToProps = reduxState => reduxState;
export default connect(mapStateToProps)(Home);