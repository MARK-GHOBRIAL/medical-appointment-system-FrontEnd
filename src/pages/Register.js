// src/pages/Register.js
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER', 
  })

  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role:
          formData.role === 'USER'
            ? Role.ROLE_USER
            : formData.role === 'DOCTOR'
            ? Role.ROLE_DOCTOR
            : Role.ROLE_ADMIN,
      }

      await register(registerData)
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6">
        <h2 className="text-center mb-4">Register</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              className="form-select"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="USER">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

// Enum per i ruoli come nel backend
const Role = {
  ROLE_USER: 'ROLE_USER',
  ROLE_DOCTOR: 'ROLE_DOCTOR',
  ROLE_ADMIN: 'ROLE_ADMIN',
}

export default Register
