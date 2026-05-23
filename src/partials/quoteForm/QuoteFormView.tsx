import { FormEvent } from 'react'
import Form from '../../components/common/Form'
import { Quote } from './Quote'

interface QuoteFormViewProps {
  quotes: Quote[]
  loading: boolean
  alert: { show: boolean; message: string; type: string }
  onSubmit: (quote: string, author: string) => void
  onDismissAlert: () => void
}

export default function QuoteFormView({
  quotes,
  loading,
  alert,
  onSubmit,
  onDismissAlert,
}: QuoteFormViewProps) {
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const quote = (form.elements.namedItem('quote') as HTMLInputElement).value
    const author = (form.elements.namedItem('author') as HTMLInputElement).value
    onSubmit(quote, author)
    form.reset()
  }

  return (
    <>
      <Form
        id="addQuotes"
        title="Add new quote"
        onSubmit={handleFormSubmit}
        alert={alert}
        onDismissAlert={onDismissAlert}
      >
        <fieldset>
          <label htmlFor="quote">Quote</label>
          <input id="quote" type="text" name="quote" required />
          <label htmlFor="author">Author</label>
          <input id="author" type="text" name="author" />
        </fieldset>
      </Form>
      <h2>Quotes in DB already</h2>
      {loading ? (
        <div role="status" aria-live="polite">Loading quotes...</div>
      ) : (
        <figure>
          {quotes.map((quote, index) => (
            <div key={index}>
              <blockquote>
                <p>{quote.quote}</p>
              </blockquote>
              <figcaption>{quote.author}</figcaption>
            </div>
          ))}
        </figure>
      )}
    </>
  )
}
