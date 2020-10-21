module.exports = {
    loggedIn: (req,res,next)=>{
        if(!req.session.user)
            return res.status(401).send('You must be logged in to do that.');
        next();
    }
}