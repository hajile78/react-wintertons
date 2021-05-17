import React, { useState, useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser'; 
import { Link } from 'react-router-dom'

function Posts(props) {
const [posts, setPosts] = useState();
const { slug, id } = props;
  useEffect(() => {
		async function getPosts() {
        const server = 'https://apiwintertons.uc.r.appspot.com';
		//const server = 'http://localhost:5000'
			const endPoint = slug ? `postsBy/${slug}` : `getPost/${id}`;
			const arrName = slug ? `posts` : `post`;
      await fetch(`${server}/${endPoint}`).then(
        (response) => response.json()
      ).then(
        data => {
					const postElem = data[arrName]					
					setPosts(postElem)
				}
      ).catch(e => {
				setPosts([]);
				console.log(`Error Message ${e}`);
			});
	}
	getPosts()
	}, [slug, id]);
	
	const showUser = (user) => slug === 'Main' ? '' : `by ${user}`;
	//const chunkBody = (id, body) => id ? body.substring(0, 100) : body;

	return (	
			<div>{posts ? (posts.length > 0) 
				? posts.map((post) => {	
					return <div id={post.id} key={post.id} >							
						<h2>
							<Link to={'/post/' + post.id}>{post.title}</Link>
						</h2>
						<p className='lead'> 
							{showUser(post.user)}
						</p>
						<p><span className="glyphicon glyphicon-time"></span> {new Date(post.created).toDateString()} {new Date(post.created).toLocaleTimeString()}</p>				
						<div className='postBody'>{ReactHtmlParser (post.body) }</div>
						<hr />
					</div>
				}) 
				: <h4>No Content Here :(</h4> 
			: <div className="loader">Loading...</div>

			}</div>
	)
}

export default Posts;