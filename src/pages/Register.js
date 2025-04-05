import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiService } from '../services/api'

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
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'role' ? value.toUpperCase() : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error('Please fill in all fields')
      }

      const response = await apiService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })

      if (response.message) {
        navigate('/login', {
          state: {
            registrationSuccess: true,
            email: formData.email,
          },
        })
      } else {
        throw new Error('Registration failed')
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
      console.error('Registration error:', err)
    }
  }

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow">
          <div className="card-body">
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
                  Password (min 6 characters)
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label">
                  Account Type
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
                <small className="text-muted">
                  Note: Doctor and Admin accounts require verification
                </small>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Register
              </button>
            </form>
            <div className="mt-3 text-center">
              <p>
                Already have an account? <a href="/login">Login</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
