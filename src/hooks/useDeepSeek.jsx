import { useState } from 'react'
import { supabase } from '../services/supabase'

export const useDeepSeek = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateTheme = async (restaurantData) => {
    setLoading(true)
    setError(null)

    try {
      // Call Edge Function
      const { data, error } = await supabase.functions.invoke('generate-theme', {
        body: JSON.stringify(restaurantData)
      })

      if (error) throw error

      return data.theme
    } catch (err) {
      console.error('Error generating theme:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    generateTheme,
    loading,
    error
  }
}