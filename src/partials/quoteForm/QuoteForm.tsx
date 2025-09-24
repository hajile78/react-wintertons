import { useState, FormEvent } from 'react'
import './quoteForm.css'
import useGetQuotes from '../../hooks/useGetQuotes'
import Form from '../../components/common/Form'
import { api } from '../../services/api'

interface FormElements extends HTMLFormControlsCollection {
  quote: HTMLInputElement
  author: HTMLInputElement
}

interface QuotesFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

function QuoteForm() {
  const { quotes } = useGetQuotes()
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })

  const handleSubmit = async (e: FormEvent<QuotesFormElement>) => {
    e.preventDefault()
    const currentTarget = e.currentTarget
    
    try {
      await api.addQuote(
        currentTarget.quote.value,
        currentTarget.author.value
      )
      
      currentTarget.quote.value = ''
      currentTarget.author.value = ''
      setAlert({ show: true, type: 'success', message: 'Quote has been added' })
    } catch (err) {
      setAlert({ show: true, type: 'danger', message: 'Quote has not been added' })
      console.error(err)
    }
  }

  return (
    <>
      <Form
        id="addQuotes"
        title="Add new quote"
        onSubmit={handleSubmit}
        alert={alert}
      >
        <fieldset>
          <label>Quote</label>
          <input type="text" name="quote" required />
          <label>Author</label>
          <input type="text" name="author" />
        </fieldset>
      </Form>

      <h2>Quotes in DB already</h2>
      <figure>
        {quotes?.map((quote, index) => (
          <div key={index}>
            <blockquote>
              <p>{quote.quote}</p>
            </blockquote>
            <figcaption>{quote.author}</figcaption>
          </div>
        ))}
      </figure>
    </>
  )
}

export default QuoteForm
