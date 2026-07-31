import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Post } from '../types/Post'

interface PostsListProps {
  posts: Post[]
  loading: boolean
  error: boolean
  onMore?: () => void
}

export default function PostsList({ posts, loading, error, onMore }: PostsListProps) {
  const showUser = (user: string) => (user === 'Main' ? '' : `by ${user}`)

  if (loading) {
    return <div role="status" aria-live="polite" className="loader">Loading...</div>
  }
  if (error) {
    return <div role="alert">Error loading posts.</div>
  }
  if (posts.length === 0) {
    return (
      <Card className="rounded-2xl shadow-lg overflow-hidden bg-token-surface">
        <CardContent className="p-6">
          <h3>No Content Here ☹️</h3>
        </CardContent>
      </Card>
    )
  }
  return (
    <div className="lg:col-span-2 space-y-10">
      {posts.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="rounded-2xl shadow-lg overflow-hidden bg-token-surface">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-2">
                <Link to={`/post/${post.id}`}>{post.title}</Link>
              </h3>
              <p className="lead">{showUser(post.user)}</p>
              {post.user !== 'Main' && (
                <p className="mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 inline-block mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>{' '}
                  {new Date(post.created).toDateString()} {new Date(post.created).toLocaleTimeString()}
                </p>
              )}
              <p
                className="mb-4 mt-4"
                dangerouslySetInnerHTML={{ __html: post.body }}
              ></p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      {onMore && (
        <Button
          className="btnSubmitPost bg-blue-600 hover:bg-blue-700 text-white"
          onClick={onMore}
          aria-label="Load more posts"
        >
          More
        </Button>
      )}
    </div>
  )
}
