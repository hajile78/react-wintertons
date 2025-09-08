const API_BASE_URL = 'https://api.wintertons.us'

export const api = {
  async getQuotes() {
    const response = await fetch(`${API_BASE_URL}/quotes`)
    return response.json()
  },

  async addQuote(quote: string, author: string = 'Unknown') {
    const response = await fetch(`${API_BASE_URL}/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity: {
          quote,
          author,
        },
      }),
    })
    if (!response.ok) {
      throw new Error('Failed to add quote')
    }
    return response.json()
  },

  async addPost(title: string, body: string, user: string, created: Date) {
    const response = await fetch(`${API_BASE_URL}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity: {
          title,
          body,
          user,
          created,
        },
      }),
    })
    if (!response.ok) {
      throw new Error('Failed to add post')
    }
    return response.json()
  },

  async getPosts(slug?: string, id?: string) {
    if (!slug && !id) {
      slug = "Main"
      id = "Main"
    }
    const endPoint = slug ? `postsBy/${slug}` : `getPost/${id}`
    const response = await fetch(`${API_BASE_URL}/${endPoint}`)
    return response.json()
  }
}
