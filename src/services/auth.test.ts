const authSdk = vi.hoisted(() => {
  const useSession = vi.fn()
  const signInEmail = vi.fn()
  const signOut = vi.fn()
  const getSession = vi.fn()
  const createAuthClient = vi.fn(() => ({
    useSession,
    signIn: { email: signInEmail },
    signOut,
    getSession,
  }))

  return {
    createAuthClient,
    getSession,
    signInEmail,
    signOut,
    useSession,
  }
})

vi.mock('better-auth/react', () => ({
  createAuthClient: authSdk.createAuthClient,
}))

async function importAuth() {
  return import('./auth')
}

describe('auth service', () => {
  beforeEach(() => {
    vi.resetModules()
    authSdk.createAuthClient.mockClear()
    authSdk.getSession.mockReset()
    authSdk.signInEmail.mockReset()
    authSdk.signOut.mockReset()
  })

  it('configures the client with the environment URL', async () => {
    vi.stubEnv('VITE_BETTER_AUTH_URL', 'https://auth.example.com')

    await importAuth()

    expect(authSdk.createAuthClient).toHaveBeenCalledWith({
      baseURL: 'https://auth.example.com',
    })
  })

  it('uses the local URL when the environment URL is absent', async () => {
    vi.stubEnv('VITE_BETTER_AUTH_URL', undefined)

    await importAuth()

    expect(authSdk.createAuthClient).toHaveBeenCalledWith({
      baseURL: 'http://localhost:5000',
    })
  })

  it('delegates email login credentials', async () => {
    authSdk.signInEmail.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    const { login } = await importAuth()

    await expect(
      login({ email: 'test@example.com', password: 'secret' }),
    ).resolves.toEqual({ data: { user: { id: 'user-1' } } })
    expect(authSdk.signInEmail).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'secret',
    })
  })

  it('delegates logout', async () => {
    authSdk.signOut.mockResolvedValue({ data: { success: true } })
    const { logout } = await importAuth()

    await expect(logout()).resolves.toEqual({ data: { success: true } })
    expect(authSdk.signOut).toHaveBeenCalledOnce()
  })

  it('returns session data from the auth client response', async () => {
    const session = { user: { id: 'user-1' } }
    authSdk.getSession.mockResolvedValue({ data: session })
    const { getSession } = await importAuth()

    await expect(getSession()).resolves.toBe(session)
  })

  describe('hasRole', () => {
    it.each([
      ['matching roles', { roles: ['user', 'admin'] }, 'admin', true],
      ['a missing role', { roles: ['user'] }, 'admin', false],
      ['empty roles', { roles: [] }, 'user', false],
      ['malformed roles', { roles: 'user' }, 'user', false],
      ['a null user', null, 'user', false],
      ['an undefined user', undefined, 'user', false],
    ])('handles %s', async (_name, user, role, expected) => {
      const { hasRole } = await importAuth()

      expect(hasRole(user as never, role)).toBe(expected)
    })
  })
})
