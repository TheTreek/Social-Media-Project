module.exports = {
    follow: async (req,res)=>{
        const {user_id} = req.params;
        const follower_id = req.session.user.id;
        const body = {user_id,follower_id};
        const db = req.app.get('db');
        const result = await db.follow(body);
        res.status(200).send(result[0]);
    }
}