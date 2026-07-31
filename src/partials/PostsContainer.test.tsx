import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, Route, Routes } from 'react-router-dom'
import { api } from '../services/api'
import { buildPost, buildQuote } from '../test/fixtures'
import { renderWithProviders } from '../test/render'
import PostsContainer from './PostsContainer'

vi.mock('../services/api', () => ({
  api: {
    getPosts: vi.fn(),
    getPost: vi.fn(),
  },
}))

const getPosts = vi.mocked(api.getPosts)
const getPost = vi.mocked(api.getPost)

function renderContainer(
  initialEntry: string,
  {
    quotes = [],
    setQuote = vi.fn(),
  }: Partial<React.ComponentProps<typeof PostsContainer>> = {},
) {
  return {
    setQuote,
    ...renderWithProviders(
      <>
        <Link to="/nav/Katie">Go to Katie</Link>
        <Routes>
          <Route
            path="/"
            element={<PostsContainer quotes={quotes} setQuote={setQuote} />}
          />
          <Route
            path="/nav/:slug"
            element={<PostsContainer quotes={quotes} setQuote={setQuote} />}
          />
          <Route
            path="/post/:id"
            element={<PostsContainer quotes={quotes} setQuote={setQuote} />}
          />
        </Routes>
      </>,
      { router: { initialEntries: [initialEntry] } },
    ),
  }
}

describe('PostsContainer', () => {
  it('fetches Main posts for the default route', async () => {
    getPosts.mockResolvedValue([buildPost({ title: 'Main post' })])

    renderContainer('/')

    expect(await screen.findByText('Main post')).toBeInTheDocument()
    expect(getPosts).toHaveBeenCalledWith('Main')
    expect(getPost).not.toHaveBeenCalled()
  })

  it('fetches posts by slug on a navigation route', async () => {
    getPosts.mockResolvedValue([
      buildPost({ title: 'Elijah post', user: 'Elijah' }),
    ])

    renderContainer('/nav/Elijah')

    expect(await screen.findByText('Elijah post')).toBeInTheDocument()
    expect(getPosts).toHaveBeenCalledWith('Elijah')
  })

  it('fetches one post by ID on a post route', async () => {
    getPost.mockResolvedValue([buildPost({ title: 'One post' })])

    renderContainer('/post/post-42')

    expect(await screen.findByText('One post')).toBeInTheDocument()
    expect(getPost).toHaveBeenCalledWith('post-42')
  })

  it('propagates loading and error states', async () => {
    let rejectPosts!: (reason: Error) => void
    getPosts.mockReturnValue(
      new Promise((_resolve, reject) => {
        rejectPosts = reject
      }),
    )
    renderContainer('/')

    expect(screen.getByRole('status')).toHaveTextContent('Loading...')

    rejectPosts(new Error('Unable to load'))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Error loading posts.',
    )
  })

  it('paginates posts in groups of three and removes More at the end', async () => {
    const user = userEvent.setup()
    getPosts.mockResolvedValue([
      buildPost({ id: '1', title: 'Post 1' }),
      buildPost({ id: '2', title: 'Post 2' }),
      buildPost({ id: '3', title: 'Post 3' }),
      buildPost({ id: '4', title: 'Post 4' }),
    ])
    renderContainer('/')

    expect(await screen.findByText('Post 3')).toBeInTheDocument()
    expect(screen.queryByText('Post 4')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Load more posts' }))

    expect(screen.getByText('Post 4')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Load more posts' }),
    ).not.toBeInTheDocument()
  })

  it('selects a deterministic quote when quotes arrive', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.75)
    getPosts.mockResolvedValue([])
    const setQuote = vi.fn()
    const quotes = [
      buildQuote({ quote: 'First quote' }),
      buildQuote({ quote: 'Second quote' }),
    ]

    renderContainer('/', { quotes, setQuote })
    await screen.findByRole('heading', { name: 'No Content Here ☹️' })

    expect(setQuote).toHaveBeenCalledWith(quotes[1])
  })

  it('refetches and resets pagination when route params change', async () => {
    const user = userEvent.setup()
    getPosts.mockImplementation(async (slug) =>
      [1, 2, 3, 4].map((number) =>
        buildPost({
          id: `${slug}-${number}`,
          title: `${slug} post ${number}`,
          user: slug,
        }),
      ),
    )
    renderContainer('/nav/Elijah')

    await screen.findByText('Elijah post 3')
    await user.click(screen.getByRole('button', { name: 'Load more posts' }))
    expect(screen.getByText('Elijah post 4')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Go to Katie' }))

    expect(await screen.findByText('Katie post 3')).toBeInTheDocument()
    expect(screen.queryByText('Katie post 4')).not.toBeInTheDocument()
    expect(getPosts).toHaveBeenCalledWith('Katie')
    expect(
      screen.getByRole('button', { name: 'Load more posts' }),
    ).toBeInTheDocument()
  })
})
