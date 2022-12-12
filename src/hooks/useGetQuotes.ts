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
        setQuotes(data.quotes)
        localStorage.setItem('quotes', JSON.stringify(data.quotes))
      })
      .catch((e) => console.log(`Error Message ${e}`))
  }

  useEffect(() => {
    const local: string | null = localStorage.getItem('quotes')
    const qArr: Quote[] = local ? JSON.parse(local) : []
    console.log(`qArr: ${qArr} local: ${local}`)
    if (qArr && qArr.length > 0) {
      console.log('setting useState Vars')
      setQuotes(qArr)
      setQuote(qArr[Math.floor(Math.random() * qArr.length)])
    } else {
      console.log('getting localstorage quotes')
      getQuotes()
    }
  }, [setQuotes, setQuote])

  return { quotes, quote, setQuote }
}

export default useGetQuotes
