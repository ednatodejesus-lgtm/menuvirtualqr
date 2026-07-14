import React, { createContext, useState, useContext, useEffect } from 'react'

// Criar o Context
const ThemeContext = createContext()

// Provider do Theme
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    colors: {
      primary: '#8B4513',
      secondary: '#DAA520',
      accent: '#F5DEB3',
      background: '#1A0F0A',
      text: '#FFFFFF',
      card: '#FFFFFF'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Lato'
    },
    styles: {
      borders: 'rounded-lg',
      shadows: 'shadow-xl',
      buttons: 'rounded-lg',
      animations: 'fade-in-up'
    }
  })

  const [loading, setLoading] = useState(false)

  // Função para atualizar o tema
  const updateTheme = (newTheme) => {
    setTheme(prev => ({
      ...prev,
      ...newTheme
    }))
  }

  // Função para aplicar tema do restaurante
  const applyRestaurantTheme = (restaurantTheme) => {
    if (restaurantTheme) {
      setTheme(restaurantTheme)
    }
  }

  // Função para resetar tema padrão
  const resetTheme = () => {
    setTheme({
      colors: {
        primary: '#8B4513',
        secondary: '#DAA520',
        accent: '#F5DEB3',
        background: '#1A0F0A',
        text: '#FFFFFF',
        card: '#FFFFFF'
      },
      fonts: {
        heading: 'Playfair Display',
        body: 'Lato'
      },
      styles: {
        borders: 'rounded-lg',
        shadows: 'shadow-xl',
        buttons: 'rounded-lg',
        animations: 'fade-in-up'
      }
    })
  }

  const value = {
    theme,
    loading,
    updateTheme,
    applyRestaurantTheme,
    resetTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook personalizado para usar o Theme
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Exportar o Context para uso direto (se necessário)
export default ThemeContext