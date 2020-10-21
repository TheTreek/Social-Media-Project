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
        const post = await db.get_single_post({id});
        return res.status(200).send(post[0]);
    }
}