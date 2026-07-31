import { Link } from 'react-router-dom'
import { Post } from '../types/Post'

interface PostsOldListProps {
  posts: Post[]
  loading: boolean
  error: boolean
  onMore?: () => void
}

export default function PostsOldList({ posts, loading, error, onMore }: PostsOldListProps) {
  const showUser = (user: string) => (user === 'Main' ? '' : `by ${user}`)

  if (loading) {
    return <div role="status" aria-live="polite" className="loader">Loading...</div>
  }
  if (error) {
    return <div role="alert">Error loading posts.</div>
  }
  if (posts.length === 0) {
    return <h3>No Content Here ☹️</h3>
  }
  return (
    <article className="postArticle">
      {posts.map((post) => (
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
      ))}
      {onMore && (
        <button className="btnSubmitPost" onClick={onMore} aria-label="Load more posts">More</button>
      )}
    </article>
  )
}
