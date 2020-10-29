import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Post from '../Post/Post';
import './Search.css';

const Search = (props)=>{
    const [posts, setPosts] = useState([]);
    const [count, setCount] = useState(8);
    const [length, setLength] = useState(0);
    const [loads, setLoads] = useState(0);
    const offset = posts.length;
    const fullPages = Math.floor(length/offset)-1;
    const remainder = length%offset;
    let [refresh, setRefresh] = useState(0);

    function reload (){
        setRefresh(refresh+1);
    }

    //Get initial posts
    useEffect(()=>{
        let url=`/api/search/${count}/0`;
        if(props.match.params.query)
            url = `/api/search/${props.match.params.query}/${count}/0`;
        axios.get(url)
            .then(res=>{
                if(res.data[0]){
                    setLength(res.data[0].posts);
                }setPosts(res.data);
            }).catch(err=>{
                console.log(err);
            })
    },[props.match.params.query,count]);

    //Load more posts (Pagination)
    const loadMore = ()=>{
        if(loads === fullPages)
            setCount(remainder);
        setLoads(loads+1);
        let url=`/api/search/${count}/${offset}`;
        if(props.match.params.query)
            url = `/api/search/${props.match.params.query}/${count}/${offset}`;
        axios.get(url)
            .then(res=>{
                if(res.data[0])
                    setPosts([...posts].concat(res.data));
            }).catch(err=>{
                console.log(err);
            });
    }

    let loadMoreBtn = null;
    if(posts.length < length && posts.length !== 0){   
            loadMoreBtn = (
                <div id='load-more' onClick={loadMore}>
                    Load More
                </div>
            )
    }

    const search = (e)=>{
        e.preventDefault();
        props.history.push(`/search/${searchText}`);
    }
    const [searchText, setSearch] = useState('');

    return (
        <div id='search-container'>
            <div id='posts-flex'>
                <form id='search-bar' onSubmit={search}>
                    <input type='text' value={decodeURIComponent(decodeURI(searchText))} onChange={e=>setSearch(encodeURI(encodeURIComponent(e.target.value)))} id='search-input' placeholder='Search...'/>
                    <input type='submit' value='Search' id='search-button'/>
                </form>
                {posts.map((val,i)=>{return <Post id={val.id} key={(i).toString()} refresh={refresh} reload={reload}/>})}
            </div>
            {loadMoreBtn}
        </div>
    )
}

export default Search;