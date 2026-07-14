import React from 'react'
import styled from 'styled-components'

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background: #f8fafc;
`

const ErrorTitle = styled.h1`
  color: #ef4444;
  font-size: 2rem;
  margin-bottom: 1rem;
`

const ErrorMessage = styled.p`
  color: #475569;
  margin-bottom: 2rem;
`

const RetryButton = styled.button`
  background: #8B4513;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
  
  &:hover {
    background: #6b3410;
  }
`

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Oops! Algo deu errado</ErrorTitle>
          <ErrorMessage>
            {this.state.error?.message || 'Ocorreu um erro inesperado'}
          </ErrorMessage>
          <RetryButton onClick={this.handleRetry}>
            Tentar novamente
          </RetryButton>
        </ErrorContainer>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary