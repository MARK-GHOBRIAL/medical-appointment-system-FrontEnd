// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react'
import { apiService } from '../services/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const userData = await apiService.getCurrentUser()
          setUser(userData)
        } catch (error) {
          console.error('Token validation failed:', error)
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

      const { accessToken: token, user: userData } = response

      if (!token || !userData) {
        throw new Error('Invalid login response')
      }

      const normalizedUser = {
        ...userData,
        role: userData.role.replace('ROLE_', ''),
      }

      setUser(normalizedUser)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(normalizedUser))

      return normalizedUser
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
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
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
