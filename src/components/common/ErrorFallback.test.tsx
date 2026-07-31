import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorFallback from './ErrorFallback'

describe('ErrorFallback', () => {
  it('renders an explicit error message', () => {
    render(<ErrorFallback error={new Error('Could not load the page')} />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Could not load the page',
    )
  })

  it('renders the default message when no error is supplied', () => {
    render(<ErrorFallback />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Unknown error occurred',
    )
    expect(
      screen.queryByRole('button', { name: 'Try again' }),
    ).not.toBeInTheDocument()
  })

  it('offers an optional reset action', async () => {
    const user = userEvent.setup()
    const resetErrorBoundary = vi.fn()
    render(<ErrorFallback resetErrorBoundary={resetErrorBoundary} />)

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(resetErrorBoundary).toHaveBeenCalledOnce()
  })
})
