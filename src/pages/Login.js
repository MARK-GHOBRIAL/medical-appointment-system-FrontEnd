// src/pages/Login.js
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    }
  }

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6">
        <h2 className="text-center mb-4">Login</h2>
        {error && (
          <div className="alert alert-danger">
            {error}
            {error.includes('credentials') && (
              <div>
                <p>Prova con:</p>
                <ul>
                  <li>Admin: admin@clinica.com / adminpassword</li>
                  <li>Dottore: doctor@clinica.com / doctorpassword</li>
                  <li>Paziente: user@clinica.com / userpassword</li>
                </ul>
              </div>
            )}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
