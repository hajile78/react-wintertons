import React, { useState } from 'react'
import Alert from '../Alert'
import './quoteForm.css'
import useGetQuotes from '../../hooks/useGetQuotes'

function QuoteForm() {
  interface FormElements extends HTMLFormControlsCollection {
    quote: HTMLInputElement
    author: HTMLInputElement
  }

  interface QuotesForm extends HTMLFormElement {
    readonly elements: FormElements
  }

  const {quotes} = useGetQuotes()

  const [alert, setAlert] = useState({ show: false, message: '', type: '' })
  const handleAlert = (show = false, type = '', message = '') => {
    setAlert({ show, type, message })
  }

  const handleSubmit = (e: React.FormEvent<QuotesForm>) => {
    e.preventDefault()
    const currentTarget = e.currentTarget
    console.log(
      `Button Clicked quote: ${e.currentTarget.quote.value} author: ${e.currentTarget.author.value}`
    )
    const url = 'https://apiwintertons.uc.r.appspot.com/quote'
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity: {
          quote: currentTarget.quote.value,
          author: currentTarget.author.value || 'Unknown',
        },
      }),
    })
      .then((res) => {
        if (res.ok) {
          currentTarget.quote.value = ''
          currentTarget.author.value = ''
          return handleAlert(true, 'success', 'Quote has been added')
        }
        throw new Error()
      })
      .catch((err) => {
        handleAlert(true, 'danger', 'Quote has Not been added')
        console.log(err)
      })
  }
  return (
    <>
      <h2>Add new quote</h2>
      <form id="addQuotes" onSubmit={handleSubmit} autoComplete="off">
        {alert.show && <Alert {...alert} removeAlert={handleAlert} />}
        <fieldset>
          <label>Quote</label>
          <input type="text" name="quote" required />
          <label>Author</label>
          <input type="text" name="author" />
        </fieldset>

        <button type="submit">Add Quote</button>
      </form>

      <h2>Quotes in DB already</h2>
      <figure>
        {quotes &&
          quotes.map((quote) => {
            return (
              <>
                <blockquote>
                  <p>{quote.quote}</p>
                </blockquote>
                <figcaption>{quote.author}</figcaption>
              </>
            )
          })}
      </figure>
    </>
  )
}

export default QuoteForm
