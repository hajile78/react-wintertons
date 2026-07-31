import { Post } from "../types/Post"

const API_BASE_URL = 'https://api.wintertons.us'

async function readJson(response: Response, errorMessage: string) {
  if (!response.ok) {
    throw new Error(errorMessage)
  }

  return response.json()
}

export const api = {
  async getQuotes() {
    const response = await fetch(`${API_BASE_URL}/quotes`)
    return readJson(response, 'Failed to get quotes')
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
    return readJson(response, 'Failed to add quote')
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
    return readJson(response, 'Failed to add post')
  },

  async getPosts(slug: string): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/postsBy/${slug}`)
    const data = await readJson(response, 'Failed to get posts')
    return data.posts
  },

  async getPost(id: string): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/getPost/${id}`)
    const data = await readJson(response, 'Failed to get post')
    return data.post
  }
}
