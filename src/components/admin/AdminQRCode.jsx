import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase, TABLES } from '../../services/supabase'
// CORREÇÃO PARA VERSÃO 4.x - Usar QRCodeCanvas
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Copy, Check, RefreshCw, Link } from 'lucide-react'
import styled from 'styled-components'
import toast from 'react-hot-toast'

const Container = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 2rem;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #0f172a;
  }
`

const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px dashed #e2e8f0;
  margin-bottom: 2rem;
`

const QRCodeWrapper = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
`

const QRCodeLink = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  width: 100%;
  max-width: 400px;
  
  input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 0.875rem;
    color: #0f172a;
    outline: none;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`

const ButtonPrimary = styled(Button)`
  background: #8B4513;
  color: white;
  
  &:hover {
    background: #6b3410;
  }
`

const ButtonSecondary = styled(Button)`
  background: #f1f5f9;
  color: #475569;
  
  &:hover {
    background: #e2e8f0;
  }
`

const InfoBox = styled.div`
  background: #fef3e8;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #fed7aa;
  margin-top: 1rem;
  
  h4 {
    color: #8B4513;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  ul {
    color: #64748b;
    font-size: 0.875rem;
    padding-left: 1.5rem;
    
    li {
      margin: 0.25rem 0;
    }
  }
`

const AdminQRCode = () => {
  const { restaurantId } = useAuth()
  const [loading, setLoading] = useState(true)
  const [qrCode, setQrCode] = useState(null)
  const [qrLink, setQrLink] = useState('')
  const [copied, setCopied] = useState(false)
  const qrRef = useRef(null)

  useEffect(() => {
    if (restaurantId) {
      generateQRCode()
    }
  }, [restaurantId])

  const generateQRCode = async () => {
    try {
      setLoading(true)
      
      const baseUrl = window.location.origin
      const link = `${baseUrl}/menu/${restaurantId}`
      setQrLink(link)

      const { data, error } = await supabase
        .from(TABLES.QR_CODES)
        .select('*')
        .eq('restaurant_id', restaurantId)
        .maybeSingle()

      if (error) throw error

      if (data) {
        setQrCode(data)
      } else {
        const { data: newQR, error: createError } = await supabase
          .from(TABLES.QR_CODES)
          .insert([{
            restaurant_id: restaurantId,
            code: `QR-${restaurantId.substring(0, 8)}`,
            link: link,
            tipo: 'menu'
          }])
          .select()
          .single()

        if (createError) throw createError
        setQrCode(newQR)
      }
    } catch (error) {
      console.error('Error generating QR code:', error)
      toast.error('Error generating QR code')
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code-canvas')
    if (canvas) {
      const link = document.createElement('a')
      link.download = `menuqr-${restaurantId}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      toast.success('QR Code downloaded!')
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrLink)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 3000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
  }

  return (
    <Container>
      <Header>
        <h2>📱 QR Code Generator</h2>
        <ButtonSecondary onClick={generateQRCode}>
          <RefreshCw size={18} />
          Regenerate
        </ButtonSecondary>
      </Header>

      <QRContainer>
        <QRCodeWrapper>
          <QRCodeCanvas
            id="qr-code-canvas"
            value={qrLink}
            size={200}
            level="H"
            includeMargin={true}
            ref={qrRef}
          />
        </QRCodeWrapper>

        <QRCodeLink>
          <Link size={16} color="#94a3b8" />
          <input 
            type="text" 
            value={qrLink} 
            readOnly 
          />
          <ButtonSecondary 
            type="button"
            onClick={copyToClipboard}
            style={{ padding: '0.25rem 0.5rem' }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </ButtonSecondary>
        </QRCodeLink>

        <ButtonGroup>
          <ButtonPrimary onClick={downloadQR}>
            <Download size={18} />
            Download QR Code
          </ButtonPrimary>
          <ButtonSecondary onClick={copyToClipboard}>
            <Copy size={18} />
            Copy Link
          </ButtonSecondary>
        </ButtonGroup>

        <InfoBox>
          <h4>💡 QR Code Tips</h4>
          <ul>
            <li>Print and display at your restaurant</li>
            <li>Share on social media</li>
            <li>Customers scan to view your menu</li>
            <li>Menu updates automatically in real-time</li>
          </ul>
        </InfoBox>
      </QRContainer>
    </Container>
  )
}

export default AdminQRCode