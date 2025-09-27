import { RouteObject } from 'react-router-dom'
import Posts from '../partials/Posts'
import QuoteForm from '../partials/quoteForm/QuoteForm'
import PostsForm from '../partials/PostsForm'
import { Quote } from '../partials/quoteForm/Quote'
import { Dispatch, SetStateAction } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import path from 'path'
import Login from '../components/Login'

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
      element: <ProtectedRoute requiredRole="user" children={<PostsForm />} />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/',
      element: <Posts quotes={quotes} setQuote={setQuote} />,
    },
  ]
  return routes
}
