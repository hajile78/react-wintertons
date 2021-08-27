import React, { useState } from 'react'

import Alert from './Alert'

function QuoteForm() {
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })
  const handleAlert = (show = false, type = '', message = '') => {
    setAlert({ show, type, message })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(
      `Button Clicked quote: ${e.target.quote.value} author: ${e.target.author.value}`
    )
    const url = 'https://apiwintertons.uc.r.appspot.com/quote'
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity: {
          quote: e.target.quote.value,
          author: e.target.author.value || 'Unknown',
        },
      }),
    })
      .then((res) => {
        if (res.ok) {
          e.target.quote.value = ''
          e.target.author.value = ''
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
    <form id="addQuotes" onSubmit={handleSubmit}>
      {alert.show && <Alert {...alert} removeAlert={handleAlert} />}
      <fieldset>
        <label>Quote</label>
        <input type="input" name="quote" required />
        <label>Author</label>
        <input type="input" name="author" />
      </fieldset>

      <button type="submit">Submit</button>
    </form>
  )
}

export default QuoteForm
