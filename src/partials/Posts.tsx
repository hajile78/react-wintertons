import { useState, useEffect, SetStateAction, Dispatch } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { Link, useParams } from 'react-router-dom'
import { Quote } from './quoteForm/Quote'

type Post = {
  id: string
  body: string
  title: string
  user: string
  created: Date
}

interface PostQuote {
  quotes: Quote[]
  setQuote: Dispatch<SetStateAction<Quote>> 
}

const postsPerPage: number = 3


function Posts({quotes, setQuote}: PostQuote ) {
  const [posts, setPosts] = useState<Post[]>([])
  const [totalPosts, setTotalPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  let {id, slug} = useParams()

  
  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])
    async function getPosts() {
      const server = 'https://apiwintertons.uc.r.appspot.com'
      //const server = 'http://localhost:5000'
      if(!slug && !id) {
        slug = "Main"
        id = "Main"
      }
      const endPoint = slug ? `postsBy/${slug}` : `getPost/${id}`
      const arrName = slug ? `posts` : `post`
      await fetch(`${server}/${endPoint}`)
        .then((response) => response.json())
        .then((data) => {
          const postElem = data[arrName]
          // console.log(postElem)
          setPosts(
            postElem.reduce((a: Post[], c: Post, i: number) => {
              if (i < postsPerPage) {
                a.push(c)
              }
              return a
            }, [])
          )
          setTotalPosts(
            postElem.filter((v: Post, i: number) => {
              return i >= postsPerPage
            })
          )
		  setLoading(false)
        })
        .catch((e) => {
          setTotalPosts([])
          setPosts([])
		  setLoading(false)
          console.log(`Error Message ${e}`)
        })
    }
    getPosts()
  }, [slug, id, setQuote])

  const showUser = (user: string) => (slug === 'Main' ? '' : `by ${user}`)
  const handelMoreClick = () => {
    const morePosts = totalPosts.filter((v: Post, i: number) => {
      return i < postsPerPage 
    })
    setPosts([...posts, ...morePosts])
    setTotalPosts([...totalPosts.slice(postsPerPage)])
  }

  const createBody: any = (post: Post) => { return ReactHtmlParser(`<div classNName="postBody">${post.body}</div>`) }

  return (
    <article className="postArticle">
      {
        posts.length > 0 ? (
          posts.map((post) => {
            return (
              <div id={post.id} key={post.id}>
                <h2>
                  <Link to={'/post/' + post.id}>{post.title}</Link>
                </h2>
                <p className="lead">{showUser(post.user)}</p>
                <p>
                  <span className="glyphicon glyphicon-time"></span>{' '}
                  {new Date(post.created).toDateString()}{' '}
                  {new Date(post.created).toLocaleTimeString()}
                </p>
                {createBody(post)}
              </div>
            )
          })
        ) : (
		  <>
			{ loading ? <div className="loader">Loading...</div> : <h3>No Content Here ☹️</h3> }
		  </>
        )
      }
      {totalPosts && totalPosts.length > 0 ? (
        <button className="btnSubmitPost" onClick={handelMoreClick}>More</button>
      ) : (
        ''
      )}
    </article>
  )
}

export default Posts
