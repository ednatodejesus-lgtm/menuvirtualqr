import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import styled from 'styled-components'
import toast from 'react-hot-toast'

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1A0F0A 0%, #2C1810 50%, #3D2318 100%);
  padding: 1rem;
`

const LoginCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
  }
`

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: #8B4513;
    margin-bottom: 0.25rem;
    
    span {
      color: #DAA520;
    }
  }
  
  p {
    color: #94a3b8;
    font-size: 0.875rem;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
`

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: ${props => props.type === 'password' ? '3rem' : '1rem'};
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  transition: all 0.2s;
  background: #f8fafc;
  
  &:focus {
    outline: none;
    border-color: #8B4513;
    background: white;
    box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`

const TogglePassword = styled.button`
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
    color: #475569;
  }
`

const SubmitButton = styled.button`
  padding: 0.875rem;
  background: #8B4513;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    background: #6b3410;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 69, 19, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
  padding: 0.5rem;
  background: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
`

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
  
  span {
    color: #94a3b8;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login, user, userRole } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      if (userRole === 'super_admin') {
        navigate('/superadmin/dashboard')
      } else if (userRole === 'admin') {
        navigate('/admin/dashboard')
      }
    }
  }, [user, userRole, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await login(email, password)
      
      if (!result.success) {
        setError(result.error || 'Invalid credentials')
        setLoading(false)
        return
      }

      toast.success('Login successful!')
    } catch (err) {
      setError('Error logging in. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Container>
      <LoginCard>
        <Logo>
          <h1>🍽️ Menu<span>QR</span></h1>
          <p>Restaurant Management Platform</p>
        </Logo>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <InputWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <TogglePassword 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </TogglePassword>
            </InputWrapper>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Logging in...
              </>
            ) : (
              'Sign In'
            )}
          </SubmitButton>

          <Divider>
            <span>Multi-Tenant System</span>
          </Divider>
        </Form>
      </LoginCard>
    </Container>
  )
}

export default Login