import { RouteObject } from 'react-router-dom'
import PostsContainer from '../partials/PostsContainer'
import QuoteFormContainer from '../partials/quoteForm/QuoteFormContainer'
import PostsForm from '../partials/PostsForm'
import { Quote } from '../partials/quoteForm/Quote'
import { Dispatch, SetStateAction } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import LoginContainer from '../components/LoginContainer'

export const createRoutes = (quotes: Quote[], setQuote: Dispatch<SetStateAction<Quote>>) => {
  const routes: RouteObject[] = [
    {
      path: '/nav/:slug',
      element: <PostsContainer quotes={quotes} setQuote={setQuote} />,
    },
    {
      path: '/post/:id',
      element: <PostsContainer quotes={quotes} setQuote={setQuote} />,
    },
    {
      path: '/addQuote',
      element: <QuoteFormContainer />,
    },
    {
      path: '/addPost',
      element: (
        <ProtectedRoute requiredRole="user">
          <PostsForm />
        </ProtectedRoute>
      ),
    },
    {
      path: '/login',
      element: <LoginContainer />
    },
    {
      path: '/',
      element: <PostsContainer quotes={quotes} setQuote={setQuote} />,
    },
  ]
  return routes
}
