import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginContainer from './LoginContainer'

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  navigate: vi.fn(),
  location: { state: null as null | { from: { pathname: string } } },
}))

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: mocks.login,
    isAuthenticated: false,
    user: null,
    logout: vi.fn(),
    hasRole: vi.fn(),
  }),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
    useLocation: () => mocks.location,
  }
})

async function submitCredentials() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Email'), 'person@example.com')
  await user.type(screen.getByLabelText('Password'), 'correct horse')
  await user.click(screen.getByRole('button', { name: 'Submit' }))
}

describe('LoginContainer', () => {
  beforeEach(() => {
    mocks.location.state = null
  })

  it('logs in, shows success, and navigates home by default', async () => {
    mocks.login.mockResolvedValue(undefined)
    render(<LoginContainer />)

    await submitCredentials()

    expect(mocks.login).toHaveBeenCalledWith({
      email: 'person@example.com',
      password: 'correct horse',
    })
    expect(screen.getByRole('alert')).toHaveTextContent('Login successful!')
    expect(mocks.navigate).toHaveBeenCalledWith('/', { replace: true })
  })

  it('returns to the saved pathname after login', async () => {
    mocks.location.state = { from: { pathname: '/addPost' } }
    mocks.login.mockResolvedValue(undefined)
    render(<LoginContainer />)

    await submitCredentials()

    expect(mocks.navigate).toHaveBeenCalledWith('/addPost', { replace: true })
  })

  it('shows a dismissible error and does not navigate after failed login', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    mocks.login.mockRejectedValue(new Error('Unauthorized'))
    render(<LoginContainer />)

    await submitCredentials()

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Invalid email or password',
    )
    expect(mocks.navigate).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(2500))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
