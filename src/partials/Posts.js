import React, { useState, useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser'; 

function Posts(props) {

	const [posts, setPosts] = useState();

  useEffect(async () => {
      const server = 'https://apiwintertons.uc.r.appspot.com';
			//const server = 'http://localhost:5000'
			setPosts([]);
			console.log(props);
			const endPoint = props.slug ? `postsBy/${props.slug}` : `post/${props.id}`;
			const arrName = props.slug ? `posts` : `post`;
      await fetch(`${server}/${endPoint}`).then(
        (response) => response.json()
      ).then(
        data => {
					console.log("data", JSON.stringify(data));
					const postElem = data[arrName].map((post) => {
						console.log("post", JSON.stringify(post));	
						return <div key={post.id} >							
							<h2>
								<a href= { '/post/' + post.id} >{post.title}</a>
							</h2>
							<p className='lead ng-binding'> 
							{showUser(post.user)}
							</p>
							<p><span className="glyphicon glyphicon-time"></span> {post.created}</p>				
							<p>{ReactHtmlParser (post.body) }</p>
							<hr />
						</div>
					});
					console.log(postElem)
					setPosts(postElem)
				}
      ).catch(e => console.log(`Error Message ${e}`));
	}, []);
	
	const showUser = (user) => props.slug == 'Main' ? '' : `by ${user}`;

	return (
		<div>		
			{posts ? posts : ''}
		</div>
	)
}

export default Posts;