import { useState, useEffect } from 'react'
import { Quote, QuoteData } from '../partials/quoteForm/Quote'

const useGetQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [quote, setQuote] = useState<Quote>({})

  const getQuotes = async () => {
    const server = 'https://apiwintertons.uc.r.appspot.com'
    //const server = 'http://localhost:5000'
    await fetch(`${server}/quotes`)
      .then((response) => response.json())
      .then((data: QuoteData) => {
        console.log('setting localstorage quotes')
        setLocalStore('quotes', data.quotes, 30000)
        setQuotes(data.quotes)
      })
      .catch((e) => console.log(`Error Message ${e}`))
  }

  useEffect(() => {
    const qArr: Quote[] = getLocalStore('quotes')

    if (qArr && qArr.length > 0) {
      console.log('setting quote useState Vars')
      setQuotes(qArr)
      setQuote(qArr[Math.floor(Math.random() * qArr.length)])
    } else {
      console.log('getting localstorage quotes')
      getQuotes()
    }
  }, [])

  return { quotes, quote, setQuote }
}

const getLocalStore = (key: string): Quote[] => {
  const local: string | null = localStorage.getItem(key)
  const quotes: quoteData = JSON.parse(local ? local : '{}')
  if (!quotes || new Date().getTime() > quotes.expiry) {
    localStorage.removeItem(key) // Remove expired item
    return []
  }
  return quotes.value
}

type quoteData = {
  expiry: number
  value: Quote[]
}

const setLocalStore = (key: string, value: any[], ttl: number): void => {
  const data: quoteData = {
    expiry: new Date().getTime() + ttl,
    value: value,
  }

  localStorage.setItem(key, JSON.stringify(data))
}

export default useGetQuotes
