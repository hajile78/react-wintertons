import type { AuthSession, AuthUser } from '../services/auth'
import type { Post } from '../types/Post'
import type { Quote } from '../partials/quoteForm/Quote'

export function buildPost(overrides: Partial<Post> = {}): Post {
  return {
    id: 'post-1',
    title: 'A family update',
    body: '<p>News from the family.</p>',
    user: 'Main',
    created: new Date('2026-01-15T12:00:00Z'),
    ...overrides,
  }
}

export function buildQuote(overrides: Partial<Quote> = {}): Quote {
  return {
    quote: 'A test quote.',
    author: 'Test Author',
    ...overrides,
  }
}

export function buildAuthUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    emailVerified: true,
    createdAt: new Date('2026-01-15T12:00:00Z'),
    updatedAt: new Date('2026-01-15T12:00:00Z'),
    roles: ['user'],
    username: 'test-user',
    ...overrides,
  }
}

export function buildAuthSession(
  overrides: Partial<NonNullable<AuthSession>> = {},
): NonNullable<AuthSession> {
  return {
    session: {
      id: 'session-1',
      token: 'test-session-token',
      userId: 'user-1',
      expiresAt: new Date('2026-01-16T12:00:00Z'),
      createdAt: new Date('2026-01-15T12:00:00Z'),
      updatedAt: new Date('2026-01-15T12:00:00Z'),
    },
    user: buildAuthUser(),
    ...overrides,
  }
}
