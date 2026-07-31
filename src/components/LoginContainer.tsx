import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginView from './LoginView'

export default function LoginContainer() {
  const [alert, setAlert] = useState({ show: false, type: '', message: '' })
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (email: string, password: string) => {
    try {
      await auth.login({ email, password })
      setAlert({ show: true, type: 'success', message: 'Login successful!' })
      navigate(from, { replace: true })
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: 'Invalid email or password',
      })
    }
  }

  return (
    <LoginView
      alert={alert}
      onSubmit={handleSubmit}
      onDismissAlert={() => setAlert({ show: false, type: '', message: '' })}
    />
  )
}
