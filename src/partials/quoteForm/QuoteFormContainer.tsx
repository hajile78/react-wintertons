import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'
import QuoteFormView from './QuoteFormView'
import type { QuoteData } from './Quote'

export default function QuoteFormContainer() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery<QuoteData>({
    queryKey: ['quotes'],
    queryFn: api.getQuotes,
  })
  const quotes = data?.quotes ?? []
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })

  const addQuoteMutation = useMutation({
    mutationFn: ({ quote, author }: { quote: string; author: string }) =>
      api.addQuote(quote, author),
    onSuccess: () => {
      setAlert({ show: true, type: 'success', message: 'Quote has been added' })
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
    },
    onError: () => {
      setAlert({ show: true, type: 'danger', message: 'Quote has not been added' })
    },
  })

  const handleSubmit = (quote: string, author: string) => {
    addQuoteMutation.mutate({ quote, author })
  }

  return (
    <QuoteFormView
      quotes={quotes}
      loading={isLoading}
      queryError={isError}
      alert={alert}
      onSubmit={handleSubmit}
      onDismissAlert={() => setAlert({ show: false, message: '', type: '' })}
    />
  )
}
