import { screen } from '@testing-library/react'
import { api } from '../services/api'
import { buildAuthSession, buildPost, buildQuote } from '../test/fixtures'
import { renderWithProviders } from '../test/render'
import Layout from './layout'

const auth = vi.hoisted(() => ({
  session: undefined as ReturnType<typeof buildAuthSession> | undefined,
}))

vi.mock('../services/api', () => ({
  api: {
    getQuotes: vi.fn(),
    getPosts: vi.fn(),
    getPost: vi.fn(),
    addQuote: vi.fn(),
    addPost: vi.fn(),
  },
}))

vi.mock('../services/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../services/auth')>()
  return {
    ...actual,
    authClient: {
      useSession: () => ({ data: auth.session }),
    },
    login: vi.fn(),
    logout: vi.fn(),
  }
})

const getQuotes = vi.mocked(api.getQuotes)
const getPosts = vi.mocked(api.getPosts)
const getPost = vi.mocked(api.getPost)

function renderLayout(path: string) {
  return renderWithProviders(<Layout />, {
    auth: true,
    modal: {
      showModal: false,
      setShowModal: vi.fn(),
      modalText: null,
      setModalText: vi.fn(),
    },
    router: { initialEntries: [path] },
  })
}

describe('Layout', () => {
  beforeEach(() => {
    auth.session = buildAuthSession()
    getQuotes.mockResolvedValue({
      quotes: [buildQuote({ quote: 'Sidebar quote', author: 'Ada' })],
    })
    getPosts.mockImplementation(async (slug) => [
      buildPost({ title: `${slug} route post`, user: slug }),
    ])
    getPost.mockResolvedValue([buildPost({ title: 'Single route post' })])
  })

  it('renders the header, main area, sidebar, and footer shell', async () => {
    renderLayout('/')

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('complementary')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Wintertons.us')
    expect(await screen.findByText('"Sidebar quote"')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Winterton Links' }),
    ).toBeInTheDocument()
  })

  it.each([
    ['/', 'Main route post'],
    ['/nav/Elijah', 'Elijah route post'],
    ['/post/post-42', 'Single route post'],
    ['/addQuote', 'Add new quote'],
    ['/addPost', 'Add new post'],
    ['/login', 'Login'],
  ])('renders the expected screen at %s', async (path, expectedText) => {
    renderLayout(path)

    expect(await screen.findByText(expectedText)).toBeInTheDocument()
  })
})
