import { mockFetchJson } from '../test/controls'
import { buildPost } from '../test/fixtures'
import { api } from './api'

describe('api', () => {
  describe('reads', () => {
    it('gets quotes', async () => {
      const response = { quotes: [{ quote: 'Hello', author: 'Someone' }] }
      const fetchMock = mockFetchJson(response)

      await expect(api.getQuotes()).resolves.toEqual(response)
      expect(fetchMock).toHaveBeenCalledWith('https://api.wintertons.us/quotes')
    })

    it('maps the posts response by slug', async () => {
      const posts = [buildPost()]
      const fetchMock = mockFetchJson({ posts })

      await expect(api.getPosts('Elijah')).resolves.toEqual(posts)
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.wintertons.us/postsBy/Elijah',
      )
    })

    it('maps the post response by id', async () => {
      const posts = [buildPost()]
      const fetchMock = mockFetchJson({ post: posts })

      await expect(api.getPost('post-1')).resolves.toEqual(posts)
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.wintertons.us/getPost/post-1',
      )
    })

    it.each([
      ['quotes', () => api.getQuotes(), 'Failed to get quotes'],
      ['posts', () => api.getPosts('Main'), 'Failed to get posts'],
      ['post', () => api.getPost('post-1'), 'Failed to get post'],
    ])('rejects a non-successful %s response', async (_name, request, message) => {
      mockFetchJson({}, { ok: false, status: 500 })

      await expect(request()).rejects.toThrow(message)
    })

    it('rejects malformed JSON', async () => {
      const jsonError = new SyntaxError('Unexpected token')
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockRejectedValue(jsonError),
        }),
      )

      await expect(api.getQuotes()).rejects.toBe(jsonError)
    })
  })

  describe('writes', () => {
    it('adds a quote with its author', async () => {
      const fetchMock = mockFetchJson({ id: 'quote-1' })

      await expect(api.addQuote('Hello', 'Someone')).resolves.toEqual({
        id: 'quote-1',
      })
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.wintertons.us/quote',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entity: { quote: 'Hello', author: 'Someone' },
          }),
        },
      )
    })

    it('uses Unknown when a quote author is omitted', async () => {
      const fetchMock = mockFetchJson({})

      await api.addQuote('Hello')

      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.wintertons.us/quote',
        expect.objectContaining({
          body: JSON.stringify({
            entity: { quote: 'Hello', author: 'Unknown' },
          }),
        }),
      )
    })

    it('adds a post with the supplied creation date', async () => {
      const fetchMock = mockFetchJson({ id: 'post-1' })
      const created = new Date('2026-01-15T12:00:00Z')

      await expect(
        api.addPost('Title', '<p>Body</p>', 'Elijah', created),
      ).resolves.toEqual({ id: 'post-1' })
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.wintertons.us/post',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entity: {
              title: 'Title',
              body: '<p>Body</p>',
              user: 'Elijah',
              created,
            },
          }),
        },
      )
    })

    it.each([
      ['quote', () => api.addQuote('Hello'), 'Failed to add quote'],
      [
        'post',
        () => api.addPost('Title', 'Body', 'Elijah', new Date()),
        'Failed to add post',
      ],
    ])('rejects a non-successful %s mutation', async (_name, request, message) => {
      mockFetchJson({}, { ok: false, status: 400 })

      await expect(request()).rejects.toThrow(message)
    })
  })
})
