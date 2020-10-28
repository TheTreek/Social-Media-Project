require('dotenv').config();
const express = require('express'),
multer = require('multer'),
upload = multer({})
massive = require('massive'),
session = require('express-session'),
{SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env,
app = express(),
authCont = require('./controllers/auth'),
postCont = require('./controllers/post'),
profCont = require('./controllers/profile'),
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
app.post('/api/post', upload.single('image'), authMiddle.loggedIn, postCont.post); //Create post
app.get('/api/post/:id', postCont.getSingle) //Get single post
app.get('/api/like/:post_id', authMiddle.loggedIn, postCont.like); //Like a post
app.get('/api/post/:post_id/comments',postCont.getComments); // Get comments
app.post('/api/post/:post_id/comment', authMiddle.loggedIn, postCont.postComment); //Post a comment

//Search
app.get('/api/search/:query/:limit/:offset', postCont.search); //Search for posts
app.get('/api/search/:limit/:offset', postCont.search); //search for all posts

//Profile
app.put('/api/follow/:user_id', authMiddle.loggedIn, profCont.follow); //Follow a user

//Connect to server -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then(db=>{
    app.set('db',db);
    console.log('DB connected');
    app.listen(SERVER_PORT, console.log(`Server listening on port ${SERVER_PORT}`));
})