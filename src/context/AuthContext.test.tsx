import type { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react'
import { buildAuthUser } from '../test/fixtures'

const authService = vi.hoisted(() => ({
  useSession: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  hasRole: vi.fn(),
}))

vi.mock('../services/auth', () => ({
  authClient: {
    useSession: authService.useSession,
  },
  login: authService.login,
  logout: authService.logout,
  hasRole: authService.hasRole,
}))

import { AuthProvider, useAuth } from './AuthContext'

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

describe('AuthContext', () => {
  beforeEach(() => {
    authService.useSession.mockReset()
    authService.login.mockReset()
    authService.logout.mockReset()
    authService.hasRole.mockReset()
  })

  it('exposes an anonymous session', () => {
    authService.useSession.mockReturnValue({ data: null })

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('exposes the authenticated user', () => {
    const user = buildAuthUser()
    authService.useSession.mockReturnValue({ data: { user } })

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toBe(user)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('delegates login credentials', async () => {
    authService.useSession.mockReturnValue({ data: null })
    authService.login.mockResolvedValue(undefined)
    const { result } = renderHook(() => useAuth(), { wrapper })
    const credentials = {
      email: 'test@example.com',
      password: 'secret',
    }

    await act(() => result.current.login(credentials))

    expect(authService.login).toHaveBeenCalledWith(credentials)
  })

  it('delegates logout', async () => {
    authService.useSession.mockReturnValue({ data: { user: buildAuthUser() } })
    authService.logout.mockResolvedValue(undefined)
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(() => result.current.logout())

    expect(authService.logout).toHaveBeenCalledOnce()
  })

  it('checks roles against the current user', () => {
    const user = buildAuthUser({ roles: ['admin'] })
    authService.useSession.mockReturnValue({ data: { user } })
    authService.hasRole.mockReturnValue(true)
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.hasRole('admin')).toBe(true)
    expect(authService.hasRole).toHaveBeenCalledWith(user, 'admin')
  })

  it('checks roles against null for an anonymous session', () => {
    authService.useSession.mockReturnValue({ data: null })
    authService.hasRole.mockReturnValue(false)
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.hasRole('user')).toBe(false)
    expect(authService.hasRole).toHaveBeenCalledWith(null, 'user')
  })

  it('throws when useAuth is rendered outside AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider',
    )
  })
})
