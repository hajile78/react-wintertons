import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import PostsList from './PostsList'
import { Quote } from './quoteForm/Quote'
import { Post } from '../types/Post'

const postsPerPage = 3

interface PostsContainerProps {
  quotes: Quote[]
  setQuote: (q: Quote) => void
}

export default function PostsContainer({ quotes, setQuote }: PostsContainerProps) {
  const { id, slug } = useParams()
  const [page, setPage] = useState(1)

  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery<Post[]>({
    queryKey: ['posts', slug, id],
    queryFn: async () => {
      if (!slug && !id) {
        return api.getPosts('Main')
      }
      return slug ? api.getPosts(slug) : api.getPost(id!)
    },
  })

  useEffect(() => {
    if (quotes.length > 0) {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)])
    }
  }, [quotes, setQuote])

  useEffect(() => {
    setPage(1)
  }, [slug, id])

  const paginatedPosts = posts.slice(0, page * postsPerPage)
  const hasMore = posts.length > paginatedPosts.length
  const handleMore = () => setPage((p) => p + 1)

  return (
    <PostsList
      posts={paginatedPosts}
      loading={isLoading}
      error={isError}
      onMore={hasMore ? handleMore : undefined}
    />
  )
}
