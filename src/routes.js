import React from 'react';
import { Switch, Route } from "react-router-dom";
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import Profile from './Components/Profile/Profile';
import New from './Components/New/New';
import Register from './Components/Register/Register';
import PostPage from './Components/PostPage/PostPage';
import Search from './Components/Search/Search';


export default (
    <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/login' component={Login}/>
        <Route path='/register' component={Register}/>
        <Route path='/profile/:id' component={Profile}/>
        <Route path='/post/:id' component={PostPage}/>
        <Route path='/new' component={New}/>
        <Route path='/search/:query' component={Search}/>
        <Route path='/search' component={Search}/>
    </Switch>
)