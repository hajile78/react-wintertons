import { useState, useEffect, SetStateAction, Dispatch } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Quote } from './quoteForm/Quote'
import { api } from '../services/api'
import { Post } from '../types/Post'

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
    async function fetchPosts() {
      try {
        if(!slug && !id) {
          slug = "Main"
        }

        const data: Post[] = slug ? await api.getPosts(slug) : await api.getPost(id!)
        const postElem = data.sort((a: Post, b: Post) => 
          new Date(b.created).getTime() - new Date(a.created).getTime()
        )

        setPosts(
          postElem.slice(0, postsPerPage)
        )
        setTotalPosts(
          postElem.slice(postsPerPage)
        )
        setLoading(false)
      } catch (e) {
        setTotalPosts([])
        setPosts([])
        setLoading(false)
        console.error('Error fetching posts:', e)
      }
    }

    fetchPosts()
    if (quotes.length > 0) {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)])
    }
  }, [slug, id, quotes, postsPerPage])

  const showUser = (user: string) => (slug === 'Main' ? '' : `by ${user}`)
  const handelMoreClick = () => {
    const morePosts = totalPosts.filter((v: Post, i: number) => {
      return i < postsPerPage 
    })
    setPosts([...posts, ...morePosts])
    setTotalPosts([...totalPosts.slice(postsPerPage)])
  }

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
                <div dangerouslySetInnerHTML={{ __html: post.body }} />
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
