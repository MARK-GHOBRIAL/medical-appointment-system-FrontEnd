// src/services/api.js
const API_BASE_URL = 'http://localhost:3001/api'

export const apiService = {
  // Auth endpoints
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    })

    if (!response.ok) throw new Error('Login failed')

    const data = await response.json()

    if (!data.token || !data.user) {
      throw new Error('Invalid response format')
    }
    return data
  },

  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role || 'patient',
        }),
      })
      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || 'Registration failed')
      }

      return responseData
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  },

  // Appointments endpoints
  bookAppointment: async (appointmentData) => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData),
    })
    return await response.json()
  },

  getUserAppointments: async (userId) => {
    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/appointments`,
      {
        headers: apiService.getAuthHeaders(),
      }
    )
    if (!response.ok) throw new Error('Failed to fetch appointments')
    return await response.json()
  },

  getDoctorAppointments: async (doctorId) => {
    const response = await fetch(
      `${API_BASE_URL}/doctors/${doctorId}/appointments`
    )
    return await response.json()
  },

  cancelAppointment: async (appointmentId) => {
    const response = await fetch(
      `${API_BASE_URL}/appointments/${appointmentId}`,
      {
        method: 'DELETE',
      }
    )
    return await response.json()
  },

  getAuthHeaders: () => {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  },

  // Doctors endpoints
  getAllDoctors: async () => {
    const response = await fetch(`${API_BASE_URL}/doctors`)
    return await response.json()
  },

  // Admin endpoints
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`)
    return await response.json()
  },

  getAllDoctorsAdmin: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/doctors`)
    return await response.json()
  },
}
