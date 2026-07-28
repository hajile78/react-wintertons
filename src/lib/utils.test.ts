import { cn } from './utils'

describe('cn', () => {
  it('combines conditional class names', () => {
    expect(cn('base', false && 'hidden', { active: true })).toBe('base active')
  })

  it('keeps the last conflicting Tailwind utility', () => {
    expect(cn('px-2 text-sm', 'px-6 text-lg')).toBe('px-6 text-lg')
  })
})
