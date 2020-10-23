module.exports = {
    post: async (req,res)=>{
        let {type, content} = req.body;
        if(type !== 'img')
            type = 'text';
        if(content.length > 250)
            content = content.substring(0,250);
        const user_id = req.session.user.id;
        const body = {type,content,user_id};
        
        const db = req.app.get('db');
        const post = await db.post(body);

        return res.status(200).send(post[0]);
    },
    getSingle: async (req,res)=>{
        const db = req.app.get('db');
        const {id} = req.params;
        if(!req.session.user){
            const post = await db.get_single_post({id});
            if(!post[0]){
                return res.status(404).send('Post not found');
            }
            return res.status(200).send(post[0]);
        }else{
            const post = await db.get_single_post_logged({id, user_id: req.session.user.id});
            if(!post[0]){
                return res.status(404).send('Post not found');
            }
            return res.status(200).send(post[0]);
        }
    },
    like: async(req,res)=>{
        const db= req.app.get('db');
        const {post_id} = req.params;
        const user_id = req.session.user.id;
        const body = {post_id, user_id};
        const liked = await db.check_like(body);
        if(liked[0]){
            await db.unlike(body);
        }else{
            await db.like(body);
        }
        
        post = await db.get_single_post_logged({id: post_id, user_id: req.session.user.id});
        return res.status(200).send(post[0]);
    },
    getComments: async(req,res)=>{
        const db= req.app.get('db');
        const {post_id} = req.params;
        
        const comments = await db.get_comments({post_id});
        return res.status(200).send(comments);
    },
    postComment: async(req,res)=>{
        const db = req.app.get('db');
        const {post_id} = req.params;
        const user_id = req.session.user.id;
        let {comment} = req.body;
        if(comment.length > 125)
            comment = comment.substring(0,250);
        
        await db.post_comment({post_id,user_id,comment});
        return res.sendStatus(200);
        
        
    }
}