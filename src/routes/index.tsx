import { RouteObject } from 'react-router-dom'
import Posts from '../partials/Posts'
import QuoteForm from '../partials/quoteForm/QuoteForm'
import PostsForm from '../partials/PostsForm'
import { Quote } from '../partials/quoteForm/Quote'
import { Dispatch, SetStateAction } from 'react'

export const createRoutes = (quotes: Quote[], setQuote: Dispatch<SetStateAction<Quote>>) => {
  const routes: RouteObject[] = [
    {
      path: '/nav/:slug',
      element: <Posts quotes={quotes} setQuote={setQuote} />,
    },
    {
      path: '/post/:id',
      element: <Posts quotes={quotes} setQuote={setQuote} />,
    },
    {
      path: '/addQuote',
      element: <QuoteForm />,
    },
    {
      path: '/addPost',
      element: <PostsForm />,
    },
    {
      path: '/',
      element: <Posts quotes={quotes} setQuote={setQuote} />,
    },
  ]
  return routes
}
