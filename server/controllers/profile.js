module.exports = {
    follow: async (req,res)=>{
        const {user_id} = req.params;
        const follower_id = req.session.user.id;
        const body = {user_id,follower_id};
        const db = req.app.get('db');
        const result = await db.follow(body);
        return res.status(200).send(result[0]);
    },
    getProfile: async (req,res)=>{
        const {id} = req.params;
        const db = req.app.get('db');
        const result = await db.get_profile({id});
        if(!result[0])
            return res.status(404).send('Profile not found');
        return res.status(200).send(result[0]);
    },
    getContent: async (req,res)=>{
        const {id, type} = req.params;
        const db = req.app.get('db');

        let func = db.get_user_posts;
        if(type === 'comments')
            func = db.get_user_comments;
        if(type === 'likes')
            func = db.get_user_likes;
        
        const data = await func({id});
        return res.status(200).send(data);
    },
    update: async(req,res)=>{
        const {id} = req.params;
        let {first_name, last_name, bio} = req.body;
        if(req.session.user.id+'' !== id)
            return res.status(401).send('You cannot edit other people\'s profiles');
        if(!first_name || !last_name)
            return res.status(400).send('First name or last name is empty');
        if(bio.length > 250)
            bio = bio.substring(0,250);
        const db = req.app.get('db');
        await db.update_profile({id,first_name,last_name,bio});
        return (res.sendStatus(200));
    }
}