// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react'
import { apiService } from '../services/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const data = await apiService.login(email, password)

      if (!data.token || !data.user) {
        throw new Error('Risposta di login non valida')
      }

      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      return data
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const data = await apiService.register(userData)
      return data
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext)
