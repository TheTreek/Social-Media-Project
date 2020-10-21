const bcrypt = require('bcrypt');
const default_pic = "https://litter.s3-us-west-2.amazonaws.com/defaults/default-user.png";
module.exports = {
    register: async(req,res)=>{
        // res.status(500).send('oof');
        const {email,password,first_name,last_name,user_name} = req.body;
        if(!email || !password || !first_name || !last_name || !user_name)
            return res.status(406).send('Please fill out all of the inputs.');
        
        const db = req.app.get('db'); //db

        const foundUser = await db.check_user({user_name});
        if(foundUser[0])
            return res.status(400).send('Username already in use');
        
        const foundEmail = await db.check_email({email});
        if(foundEmail[0])
            return res.status(400).send('Email already in use');

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password,salt);

        const user = await db.register({email,first_name,last_name,user_name, password: hash, profile_pic: default_pic});
        delete user[0].password;
        req.session.user = user[0];
        return res.status(200).send(req.session.user);
    },
    getSession: (req,res)=>{
        return res.status(200).send(req.session.user);
    },
    logout: (req,res)=>{
        req.session.destroy();
        res.sendStatus(200);
    },
    login: async(req,res)=>{
        const {password, user_name} = req.body;
        if(!password || !user_name)
            return res.status(406).send('Username or password is empty');
        
        const db = req.app.get('db');
        const foundUser = await db.check_user({user_name});
        if(!foundUser[0])
            return res.status(401).send('Username or password incorrect');
        
        const auth = bcrypt.compareSync(password, foundUser[0].password);
        if(!auth)
            return res.status(401).send('Username or password incorrect');
        
        delete foundUser[0].password;
        req.session.user = foundUser[0];
        return res.status(200).send(req.session.user);
    }
}