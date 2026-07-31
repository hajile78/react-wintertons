import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuoteFormView from './QuoteFormView'

const hiddenAlert = { show: false, type: '', message: '' }

describe('QuoteFormView', () => {
  it('shows a loading state instead of the quote list', () => {
    render(
      <QuoteFormView
        quotes={[]}
        loading
        alert={hiddenAlert}
        onSubmit={vi.fn()}
        onDismissAlert={vi.fn()}
      />,
    )

    expect(screen.getByRole('status')).toHaveTextContent('Loading quotes...')
    expect(screen.queryByRole('figure')).not.toBeInTheDocument()
  })

  it('renders existing quotes and their authors', () => {
    render(
      <QuoteFormView
        quotes={[
          { quote: 'Be curious.', author: 'Ada' },
          { quote: 'Stay kind.', author: 'Grace' },
        ]}
        loading={false}
        alert={hiddenAlert}
        onSubmit={vi.fn()}
        onDismissAlert={vi.fn()}
      />,
    )

    expect(screen.getByText('Be curious.')).toBeInTheDocument()
    expect(screen.getByText('Ada')).toBeInTheDocument()
    expect(screen.getByText('Stay kind.')).toBeInTheDocument()
    expect(screen.getByText('Grace')).toBeInTheDocument()
  })

  it('renders an empty quote list', () => {
    render(
      <QuoteFormView
        quotes={[]}
        loading={false}
        alert={hiddenAlert}
        onSubmit={vi.fn()}
        onDismissAlert={vi.fn()}
      />,
    )

    expect(screen.getByRole('figure')).toBeEmptyDOMElement()
  })

  it('submits required quote text with an optional author and resets the form', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <QuoteFormView
        quotes={[]}
        loading={false}
        alert={hiddenAlert}
        onSubmit={onSubmit}
        onDismissAlert={vi.fn()}
      />,
    )

    const quote = screen.getByLabelText('Quote')
    const author = screen.getByLabelText('Author')
    expect(quote).toBeRequired()
    expect(author).not.toBeRequired()

    await user.type(quote, 'Family is everything.')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit).toHaveBeenCalledWith('Family is everything.', '')
    expect(quote).toHaveValue('')
    expect(author).toHaveValue('')
  })

  it('renders and dismisses an alert', () => {
    vi.useFakeTimers()
    const onDismissAlert = vi.fn()
    render(
      <QuoteFormView
        quotes={[]}
        loading={false}
        alert={{ show: true, type: 'success', message: 'Quote saved' }}
        onSubmit={vi.fn()}
        onDismissAlert={onDismissAlert}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Quote saved')
    act(() => vi.advanceTimersByTime(2500))
    expect(onDismissAlert).toHaveBeenCalledOnce()
  })
})
