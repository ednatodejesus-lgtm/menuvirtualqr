import React from 'react'
import styled from 'styled-components'

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f8fafc;
`

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #8B4513;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const Message = styled.p`
  margin-top: 1rem;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 500;
`

const Loading = ({ message = 'Carregando...' }) => {
  return (
    <LoadingContainer>
      <Spinner />
      <Message>{message}</Message>
    </LoadingContainer>
  )
}

export default Loading