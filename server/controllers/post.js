const {Buffer} = require('buffer');
var AWS = require('aws-sdk');
const { resolve } = require('path');
const {AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY} = process.env;
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminMozjpeg = require('imagemin-mozjpeg');
AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: 'us-west-2'
});
const s3Bucket = new AWS.S3({ params: {Bucket: 'litter'}});

const getImgBuffer = (base64)=>{
    const base64str = base64.replace(/^data:image\/\w+;base64,/,'');
    return Buffer.from(base64str,'base64');
}

const imageUpload = (path,buffer) =>{
    const data = {
        Key: path,
        Body: buffer,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
        ACL: 'public-read'
    };
    new Promise((resolve,reject)=>{
        s3Bucket.putObject(data, (err) => {
            if(err) {
                return reject(err);
            }else{
                return resolve('https://litter.s3-us-west-2.amazonaws.com/' + path);
            }
        });
    });
}

const getImageUrl = async(type,base64Image) => {
    const buffer = getImgBuffer(base64Image);   
    return imageUpload(`${type}`, buffer);
}


module.exports = {
    post: async (req,res)=>{
        let {type, content} = req.body;
        if(type !== 'img'){
            type = 'text';
            if(content.length > 250)
                content = content.substring(0,250);
        }
        if(type === 'img'){
            console.log(req.files, req.file)
            if(!req.file)
                return res.status(400).send('No file was uploaded');
            const currentTime = new Date().getTime();
            const url = `picture-uploads/${currentTime}.jpeg`
            const buff = await imagemin.buffer(req.file.buffer, {
                plugins: [
                    imageminMozjpeg({quality: 75})
                ]
            });
            console.log(buff);
            await getImageUrl(url, buff.toString('base64'));
            content = 'https://litter.s3-us-west-2.amazonaws.com/' + url;
        }
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
    postComment: async (req,res)=>{
        const db = req.app.get('db');
        const {post_id} = req.params;
        const user_id = req.session.user.id;
        let {comment} = req.body;
        if(comment.length > 125)
            comment = comment.substring(0,250);
        
        await db.post_comment({post_id,user_id,comment});
        return res.sendStatus(200);
    },
    search: async(req,res)=>{
        let {query,limit,offset} = req.params;
        if(!query)
            query = '';
        const body = {query,limit,offset};
        const db = req.app.get('db');

        const posts = await db.search(body);

        return res.status(200).send(posts);
    }
}