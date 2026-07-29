import { render, screen } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary'

function ThrowingChild(): never {
  throw new Error('Child failed')
}

describe('ErrorBoundary', () => {
  it('renders children when they do not throw', () => {
    render(
      <ErrorBoundary fallback={<div>Fallback content</div>}>
        <p>Normal content</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('Normal content')).toBeInTheDocument()
    expect(screen.queryByText('Fallback content')).not.toBeInTheDocument()
  })

  it('renders its fallback and logs errors thrown by children', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary fallback={<div role="alert">Fallback content</div>}>
        <ThrowingChild />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Fallback content')
    expect(consoleError).toHaveBeenCalledWith(
      'Error caught by boundary:',
      expect.objectContaining({ message: 'Child failed' }),
      expect.objectContaining({ componentStack: expect.any(String) }),
    )
  })
})
