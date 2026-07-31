import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { api } from '../../services/api'
import {
  createTestQueryClient,
  renderWithProviders,
} from '../../test/render'
import QuoteFormContainer from './QuoteFormContainer'

vi.mock('../../services/api', () => ({
  api: {
    getQuotes: vi.fn(),
    addQuote: vi.fn(),
  },
}))

const getQuotes = vi.mocked(api.getQuotes)
const addQuote = vi.mocked(api.addQuote)

describe('QuoteFormContainer', () => {
  it('shows loading and then renders the API quote array', async () => {
    let resolveQuotes!: (value: {
      quotes: { quote: string; author: string }[]
    }) => void
    getQuotes.mockReturnValue(
      new Promise((resolve) => {
        resolveQuotes = resolve
      }),
    )
    renderWithProviders(<QuoteFormContainer />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading quotes...')

    resolveQuotes({
      quotes: [{ quote: 'Container quote', author: 'Ada' }],
    })

    expect(await screen.findByText('Container quote')).toBeInTheDocument()
    expect(screen.getByText('Ada')).toBeInTheDocument()
  })

  it('presents query errors in the view', async () => {
    getQuotes.mockRejectedValue(new Error('Query failed'))
    renderWithProviders(<QuoteFormContainer />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Error loading quotes.',
    )
  })

  it('submits mutation values, shows success, and invalidates quotes', async () => {
    const user = userEvent.setup()
    getQuotes.mockResolvedValue({ quotes: [] })
    addQuote.mockResolvedValue({})
    const queryClient = createTestQueryClient()
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')
    renderWithProviders(<QuoteFormContainer />, { queryClient })

    await screen.findByRole('figure')
    await user.type(screen.getByLabelText('Quote'), 'A new quote')
    await user.type(screen.getByLabelText('Author'), 'Grace')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(addQuote).toHaveBeenCalledWith('A new quote', 'Grace')
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Quote has been added',
    )
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['quotes'] })
  })

  it('shows a mutation error without invalidating quotes', async () => {
    const user = userEvent.setup()
    getQuotes.mockResolvedValue({ quotes: [] })
    addQuote.mockRejectedValue(new Error('Mutation failed'))
    const queryClient = createTestQueryClient()
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')
    renderWithProviders(<QuoteFormContainer />, { queryClient })

    await screen.findByRole('figure')
    await user.type(screen.getByLabelText('Quote'), 'A rejected quote')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Quote has not been added',
    )
    expect(invalidateQueries).not.toHaveBeenCalled()
  })
})
