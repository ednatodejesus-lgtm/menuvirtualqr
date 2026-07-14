import React from 'react'
import styled from 'styled-components'

const FooterContainer = styled.footer`
  background: #0f172a;
  color: #94a3b8;
  padding: 2rem;
  text-align: center;
  margin-top: auto;
`

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  
  p {
    margin: 0.5rem 0;
  }
`

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <p>© 2024 Menu Virtual QR - Todos os direitos reservados</p>
        <p style={{ fontSize: '0.875rem' }}>
          Feito com ❤️ para restaurantes
        </p>
      </FooterContent>
    </FooterContainer>
  )
}

export default Footer