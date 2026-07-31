import { useState, useEffect } from 'react'
import { Quote } from '../partials/quoteForm/Quote'
import { api } from '../services/api'

const CACHE_KEY = 'quotes'
const CACHE_TTL = 30000 // 30 seconds

interface CacheData<T> {
  expiry: number
  value: T
}

const useLocalStorage = <T,>(key: string, ttl: number) => {
  const get = (): T | null => {
    const item = localStorage.getItem(key)
    if (!item) return null

    let data: CacheData<T>
    try {
      data = JSON.parse(item)
    } catch {
      localStorage.removeItem(key)
      return null
    }

    if (
      typeof data?.expiry !== 'number' ||
      !Object.prototype.hasOwnProperty.call(data, 'value') ||
      Date.now() > data.expiry
    ) {
      localStorage.removeItem(key)
      return null
    }

    return data.value
  }

  const set = (value: T): void => {
    const data: CacheData<T> = {
      expiry: Date.now() + ttl,
      value
    }
    localStorage.setItem(key, JSON.stringify(data))
  }

  return { get, set }
}

const useGetQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [quote, setQuote] = useState<Quote>({})
  const storage = useLocalStorage<Quote[]>(CACHE_KEY, CACHE_TTL)

  const getQuotes = async () => {
    try {
      const data = await api.getQuotes()
      storage.set(data.quotes)
      setQuotes(data.quotes)
      setRandomQuote(data.quotes)
    } catch (error) {
      console.error('Failed to fetch quotes:', error)
    }
  }

  const setRandomQuote = (quotesArray: Quote[]) => {
    if (quotesArray.length > 0) {
      setQuote(quotesArray[Math.floor(Math.random() * quotesArray.length)])
    }
  }

  useEffect(() => {
    const cachedQuotes = storage.get()
    if (cachedQuotes?.length) {
      setQuotes(cachedQuotes)
      setRandomQuote(cachedQuotes)
    } else {
      getQuotes()
    }
  }, [])

  return { quotes, quote, setQuote }
}

export default useGetQuotes
