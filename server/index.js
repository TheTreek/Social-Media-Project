require('dotenv').config();
const express = require('express'),
massive = require('massive'),
session = require('express-session'),
{SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env,
app = express(),
authCont = require('./controllers/auth');
postCont = require('./controllers/post');
authMiddle = require('./middleware/auth');

app.use(express.json());

//Set up sessions -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
app.use(session({
resave: false,
saveUninitialized: true,
secret: SESSION_SECRET,
cookie: {maxAge: 1000 * 60 * 60 * 24 * 14}  //2 weeks
}))


//Endpoints -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

//Auth
app.post('/api/register', authCont.register); //Create account
app.get('/api/session',authCont.getSession); //Get session of user
app.get('/api/logout', authCont.logout); //Delete session of user
app.post('/api/login',authCont.login); //Login to account

//Posts
app.post('/api/post', authMiddle.loggedIn, postCont.post); //Create post
app.get('/api/post/:id', postCont.getSingle) //Get single post

//Connect to server -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then(db=>{
    app.set('db',db);
    console.log('DB connected');
    app.listen(SERVER_PORT, console.log(`Server listening on port ${SERVER_PORT}`));
})