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
      const response = await apiService.login(email, password)

      if (!response.token || !response.user) {
        throw new Error('Authentication failed')
      }

      const userData = {
        _id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role.toLowerCase(),
      }

      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', response.token)

      setUser(userData)
      return userData
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
