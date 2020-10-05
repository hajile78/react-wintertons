import React, { useState, useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser'; 

function Posts(props) {

	const [posts, setPosts] = useState();

  useEffect(() => {
		async function getPosts() {
        const server = 'https://apiwintertons.uc.r.appspot.com';
		//const server = 'http://localhost:5000'
		//const server = 'http://192.168.0.14:5000'
			const endPoint = props.slug ? `postsBy/${props.slug}` : `post/${props.id}`;
			const arrName = props.slug ? `posts` : `post`;
			console.log("slug", props.slug);
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
	}, []);
	
	const showUser = (user) => props.slug === 'Main' ? '' : `by ${user}`;

	return (	
			<div>{posts ? posts.map((post) => {	
				return <div id={post.id} >							
					<h2>
						<a href= { '/getPost/' + post.id} >{post.title}</a>
					</h2>
					<p className='lead'> 
						{showUser(post.user)}
					</p>
					<p><span className="glyphicon glyphicon-time"></span> {post.created}</p>				
					<div>{ReactHtmlParser (post.body) }</div>
					<hr />
				</div>
			}) : <div className="loader">Loading...</div>
			}</div>
	)
}

export default Posts;