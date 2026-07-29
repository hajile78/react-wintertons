import { render, screen } from '@testing-library/react'
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const auth = vi.hoisted(() => ({
  isAuthenticated: false,
  hasRole: vi.fn(),
}))

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
    ...auth,
  }),
}))

function LoginDestination() {
  const location = useLocation()
  return (
    <p>
      Login destination from{' '}
      {(location.state as { from?: { pathname?: string } } | null)?.from
        ?.pathname ?? 'unknown'}
    </p>
  )
}

function renderProtected(requiredRole?: string) {
  return render(
    <MemoryRouter initialEntries={['/private']}>
      <Routes>
        <Route
          path="/private"
          element={
            <ProtectedRoute requiredRole={requiredRole}>
              <p>Protected content</p>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginDestination />} />
        <Route path="/" element={<p>Home destination</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  it('redirects anonymous users with the attempted location', () => {
    auth.isAuthenticated = false

    renderProtected()

    expect(
      screen.getByText('Login destination from /private'),
    ).toBeInTheDocument()
  })

  it('renders children for authenticated users', () => {
    auth.isAuthenticated = true

    renderProtected()

    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })

  it('redirects users lacking the required role home', () => {
    auth.isAuthenticated = true
    auth.hasRole.mockReturnValue(false)

    renderProtected('admin')

    expect(screen.getByText('Home destination')).toBeInTheDocument()
    expect(auth.hasRole).toHaveBeenCalledWith('admin')
  })

  it('renders children for users with the required role', () => {
    auth.isAuthenticated = true
    auth.hasRole.mockReturnValue(true)

    renderProtected('admin')

    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })
})
