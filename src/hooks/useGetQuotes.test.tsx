import { act, renderHook } from '@testing-library/react'
import { mockRandom, setStoredValue, setSystemTime } from '../test/controls'
import { buildQuote } from '../test/fixtures'
import { api } from '../services/api'
import useGetQuotes from './useGetQuotes'

const NOW = '2026-01-15T12:00:00Z'

describe('useGetQuotes', () => {
  beforeEach(() => {
    setSystemTime(NOW)
  })

  it('uses valid cached quotes without fetching', () => {
    const quotes = [
      buildQuote({ quote: 'First' }),
      buildQuote({ quote: 'Second' }),
    ]
    setStoredValue('quotes', {
      expiry: Date.now() + 10_000,
      value: quotes,
    })
    mockRandom(0.75)
    const getQuotes = vi.spyOn(api, 'getQuotes')

    const { result } = renderHook(() => useGetQuotes())

    expect(result.current.quotes).toEqual(quotes)
    expect(result.current.quote).toEqual(quotes[1])
    expect(getQuotes).not.toHaveBeenCalled()
  })

  it('fetches, caches, and selects a quote when the cache is missing', async () => {
    const quotes = [
      buildQuote({ quote: 'First' }),
      buildQuote({ quote: 'Second' }),
    ]
    vi.spyOn(api, 'getQuotes').mockResolvedValue({ quotes })
    mockRandom(0)

    const { result } = renderHook(() => useGetQuotes())

    await act(async () => {})

    expect(result.current.quotes).toEqual(quotes)
    expect(result.current.quote).toEqual(quotes[0])
    expect(JSON.parse(localStorage.getItem('quotes') ?? '')).toEqual({
      expiry: Date.now() + 30_000,
      value: quotes,
    })
  })

  it('removes an expired cache entry and fetches fresh quotes', async () => {
    const cachedQuotes = [buildQuote({ quote: 'Expired' })]
    const freshQuotes = [buildQuote({ quote: 'Fresh' })]
    setStoredValue('quotes', {
      expiry: Date.now() - 1,
      value: cachedQuotes,
    })
    const getQuotes = vi.spyOn(api, 'getQuotes').mockResolvedValue({
      quotes: freshQuotes,
    })

    const { result } = renderHook(() => useGetQuotes())
    await act(async () => {})

    expect(getQuotes).toHaveBeenCalledOnce()
    expect(result.current.quotes).toEqual(freshQuotes)
  })

  it('fetches fresh quotes when the cached list is empty', async () => {
    const freshQuotes = [buildQuote({ quote: 'Fresh' })]
    setStoredValue('quotes', {
      expiry: Date.now() + 10_000,
      value: [],
    })
    const getQuotes = vi.spyOn(api, 'getQuotes').mockResolvedValue({
      quotes: freshQuotes,
    })

    const { result } = renderHook(() => useGetQuotes())
    await act(async () => {})

    expect(getQuotes).toHaveBeenCalledOnce()
    expect(result.current.quotes).toEqual(freshQuotes)
  })

  it.each([
    ['malformed JSON', '{not-json'],
    ['an invalid cache shape', JSON.stringify({ value: [] })],
  ])('recovers from %s', async (_name, cacheValue) => {
    const freshQuotes = [buildQuote({ quote: 'Recovered' })]
    localStorage.setItem('quotes', cacheValue)
    const getQuotes = vi.spyOn(api, 'getQuotes').mockResolvedValue({
      quotes: freshQuotes,
    })

    const { result } = renderHook(() => useGetQuotes())
    await act(async () => {})

    expect(getQuotes).toHaveBeenCalledOnce()
    expect(result.current.quotes).toEqual(freshQuotes)
  })

  it('keeps an empty state and does not cache a failed request', async () => {
    const error = new Error('Network unavailable')
    vi.spyOn(api, 'getQuotes').mockRejectedValue(error)
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { result } = renderHook(() => useGetQuotes())
    await act(async () => {})

    expect(consoleError).toHaveBeenCalledWith('Failed to fetch quotes:', error)
    expect(result.current.quotes).toEqual([])
    expect(result.current.quote).toEqual({})
    expect(localStorage.getItem('quotes')).toBeNull()
  })
})
