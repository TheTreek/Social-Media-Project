import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Post from '../Post/Post';
import './Search.css';

const Search = (props)=>{
    const [posts, setPosts] = useState([]);
    const [newPosts, setNewPosts] = useState(0);
    const offset = posts.length;
    const [count, setCount] = useState(8);
    const [length, setLength] = useState(0);
    const fullPages = Math.floor(length/offset)-1;
    const remainder = length%offset;
    const [loads, setLoads] = useState(0);

    //Get initial posts
    useEffect(()=>{
        let url=`/api/search/${count}/0`;
        if(props.match.params.query)
            url = `/api/search/${props.match.params.query}/${count}/0`;
        axios.get(url)
            .then(res=>{
                setPosts(res.data.map((val,i)=>{
                    setLength(val.posts);
                    return <Post id={val.id} key={i}/>
                }));
                setNewPosts(res.data.length);
            }).catch(err=>{
                console.log(err);
            })
    },[props.match.params.query]);


    const loadMore = ()=>{
        if(loads === fullPages)
            setCount(remainder);
        setLoads(loads+1);
        let url=`/api/search/${count}/${offset}`;
        if(props.match.params.query)
            url = `/api/search/${props.match.params.query}/${count}/${offset}`;
        axios.get(url)
            .then(res=>{
                const dataPosts = res.data.map((val, i)=>{
                    return <Post id={val.id} key={offset+i}/>
                })
                 setPosts([...posts].concat(dataPosts));
                 setNewPosts(res.data.length);
            }).catch(err=>{
                console.log(err);
            });
    }

    let loadMoreBtn = null;

    if(posts.length < length){   
            loadMoreBtn = (
                <div id='load-more' onClick={loadMore}>
                    Load More
                </div>
            )
    }

    return (
        <div id='search-container'>
            <div id='posts-flex'>
                {posts}
            </div>
            {loadMoreBtn}
        </div>
    )
}

export default Search;