import { useState, useCallback } from 'react'
import {
  getQuotes,
  getQuoteById,
  createQuote,
  updateQuoteStatus,
  generateQuoteNumber,
  computeTotals,
} from '../services/quotesService'

export function useQuotes() {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchQuotes = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await getQuotes()
    if (error) setError(error.message)
    else setQuotes(data)
    setLoading(false)
  }, [])

  const fetchQuote = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    const { data, error } = await getQuoteById(id)
    setLoading(false)
    if (error) { setError(error.message); return null }
    return data
  }, [])

  const addQuote = useCallback(async (quoteData, items) => {
    setLoading(true)
    setError(null)
    const quoteWithNumber = { ...quoteData, quote_number: generateQuoteNumber() }
    const { data, error } = await createQuote(quoteWithNumber, items)
    setLoading(false)
    if (error) { setError(error.message); return null }
    setQuotes(prev => [data, ...prev])
    return data
  }, [])

  const changeStatus = useCallback(async (id, status) => {
    const { data, error } = await updateQuoteStatus(id, status)
    if (!error) {
      setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q))
    }
    return { data, error }
  }, [])

  return {
    quotes,
    loading,
    error,
    fetchQuotes,
    fetchQuote,
    addQuote,
    changeStatus,
    computeTotals,
  }
}
