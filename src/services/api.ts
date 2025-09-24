import { Post } from "../types/Post"

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

  async getPosts(slug: string): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/postsBy/${slug}`)
    const data = await response.json()
    return data.posts
  },

  async getPost(id: string): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/getPost/${id}`)
    const data = await response.json()
    return data.post
  }
}
