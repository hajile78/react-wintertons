import { createAuthClient } from 'better-auth/react'

const AUTH_BASE_URL = import.meta.env.VITE_BETTER_AUTH_URL ?? 'http://localhost:5000'

export const authClient = createAuthClient({
  baseURL: AUTH_BASE_URL,
})

export type LoginCredentials = {
  email: string
  password: string
}

export type AuthSession = ReturnType<typeof authClient.useSession>['data']
export type AuthUser = NonNullable<AuthSession>['user'] & {
  roles?: string[]
  username?: string
}

export async function login({ email, password }: LoginCredentials) {
  return authClient.signIn.email({
    email,
    password,
  })
}

export async function logout() {
  return authClient.signOut()
}

export async function getSession() {
  const session = await authClient.getSession()
  return session.data
}

export function hasRole(user: AuthUser | null | undefined, role: string) {
  return Array.isArray(user?.roles) ? user.roles.includes(role) : false
}
