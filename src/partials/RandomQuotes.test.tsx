import { render, screen } from '@testing-library/react'
import RandomQuotes from './RandomQuotes'

describe('RandomQuotes', () => {
  it('renders a quote and its author', () => {
    render(<RandomQuotes quote="Be curious." author="Ada" />)

    expect(screen.getByText('"Be curious."')).toBeInTheDocument()
    expect(screen.getByText('Ada')).toBeInTheDocument()
  })

  it('shows a loading state for an empty quote object', () => {
    render(<RandomQuotes />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading quote...')
    expect(
      screen.queryByRole('heading', { name: 'Random Quotes' }),
    ).not.toBeInTheDocument()
  })
})
