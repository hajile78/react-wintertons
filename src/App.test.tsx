import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { api } from './services/api'
import { buildAuthSession, buildPost, buildQuote } from './test/fixtures'
import { createTestQueryClient } from './test/render'
import App from './App'

const controls = vi.hoisted(() => ({
  throwFromLayout: false,
  session: undefined as ReturnType<typeof buildAuthSession> | undefined,
}))

vi.mock('./partials/layout.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./partials/layout')>()
  const ReactModule = await import('react')
  return {
    default: () => {
      if (controls.throwFromLayout) {
        throw new Error('Controlled layout failure')
      }
      return ReactModule.createElement(actual.default)
    },
  }
})

vi.mock('./services/api', () => ({
  api: {
    getQuotes: vi.fn(),
    getPosts: vi.fn(),
    getPost: vi.fn(),
    addQuote: vi.fn(),
    addPost: vi.fn(),
  },
}))

vi.mock('./services/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./services/auth')>()
  return {
    ...actual,
    authClient: {
      useSession: () => ({ data: controls.session }),
    },
    login: vi.fn(),
    logout: vi.fn(),
  }
})

function renderApp(path = '/') {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('App', () => {
  beforeEach(() => {
    controls.throwFromLayout = false
    controls.session = buildAuthSession()
    vi.mocked(api.getQuotes).mockResolvedValue({
      quotes: [buildQuote({ quote: 'App quote' })],
    })
    vi.mocked(api.getPosts).mockResolvedValue([
      buildPost({ title: 'App post' }),
    ])
  })

  it('composes auth and query behavior for a protected route', async () => {
    renderApp('/addPost')

    expect(
      await screen.findByRole('heading', { name: 'Add new post' }),
    ).toBeInTheDocument()
  })

  it('opens and closes the prayer modal through the real Links UI', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(
      await screen.findByRole('button', { name: 'Winterton Prayer' }),
    )

    expect(
      screen.getByRole('dialog', {
        name: /prayer for the author and other wintertons/i,
      }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close dialog' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the application fallback when a controlled child throws', () => {
    controls.throwFromLayout = true
    vi.spyOn(console, 'error').mockImplementation(() => {})

    renderApp()

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Unknown error occurred',
    )
  })
})
