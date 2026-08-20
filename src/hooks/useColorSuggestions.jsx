import { useState } from 'react';
import { supabase } from '../services/supabase';

export function useColorSuggestions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getSuggestions({ businessType, name, description }) {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('suggest-colors', {
        body: JSON.stringify({
          business_type: businessType,
          name: name,
          description: description
        })
      });

      if (fnError) throw fnError;

      return data;
    } catch (err) {
      console.error('Error getting color suggestions:', err);
      setError(err.message);
      
      // Fallback
      return getFallbackColors(businessType);
    } finally {
      setLoading(false);
    }
  }

  function getFallbackColors(businessType) {
    const palettes = {
      'restaurant': {
        colors: {
          primary: '#8B4513',
          secondary: '#DAA520',
          accent: '#F5DEB3',
          background: '#1A0F0A',
          surface: '#2C1810',
          text: '#FFFFFF',
          text_muted: '#94A3B8'
        },
        typography: {
          heading: 'Playfair Display',
          body: 'Inter',
          accent: 'Lato'
        }
      },
      'fast-food': {
        colors: {
          primary: '#E63946',
          secondary: '#F4A261',
          accent: '#E9C46A',
          background: '#FFFFFF',
          surface: '#F8F9FA',
          text: '#212529',
          text_muted: '#6C757D'
        },
        typography: {
          heading: 'Bebas Neue',
          body: 'Inter',
          accent: 'Lato'
        }
      },
      'pizza': {
        colors: {
          primary: '#C0392B',
          secondary: '#F39C12',
          accent: '#F1C40F',
          background: '#FFFFFF',
          surface: '#FDF2E9',
          text: '#1A1A2E',
          text_muted: '#6C757D'
        },
        typography: {
          heading: 'Playfair Display',
          body: 'Inter',
          accent: 'Lato'
        }
      },
      'cafe': {
        colors: {
          primary: '#6F4E37',
          secondary: '#C8A88E',
          accent: '#D4A373',
          background: '#FDF6EE',
          surface: '#FFFFFF',
          text: '#1A1A2E',
          text_muted: '#8D8D8D'
        },
        typography: {
          heading: 'Playfair Display',
          body: 'Inter',
          accent: 'Lato'
        }
      },
      'bar': {
        colors: {
          primary: '#1A0A2E',
          secondary: '#C70039',
          accent: '#FFD700',
          background: '#0D0D0D',
          surface: '#1A1A2E',
          text: '#FFFFFF',
          text_muted: '#A0A0A0'
        },
        typography: {
          heading: 'Bebas Neue',
          body: 'Inter',
          accent: 'Lato'
        }
      },
      'default': {
        colors: {
          primary: '#8B4513',
          secondary: '#DAA520',
          accent: '#F5DEB3',
          background: '#1A0F0A',
          surface: '#2C1810',
          text: '#FFFFFF',
          text_muted: '#94A3B8'
        },
        typography: {
          heading: 'Playfair Display',
          body: 'Inter',
          accent: 'Lato'
        }
      }
    };

    return palettes[businessType] || palettes['default'];
  }

  return { getSuggestions, loading, error };
}