// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react'
import { apiService } from '../services/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user')
      const token = localStorage.getItem('token')

      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (err) {
          console.error('Token validation failed:', err)
          logout()
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const data = await apiService.login(email, password)

      if (!data.token || !data.user) {
        throw new Error('Authentication failed')
      }

      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)

      setUser(data.user)
      return data.user
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData)
      return response
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext)
