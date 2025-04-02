// src/services/api.js
const API_BASE_URL = 'http://localhost:3001/api'

export const apiService = {
  // Auth endpoints
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: email,
        password,
      }),
    })
    const data = await response.json()

    if (data.token) {
      const userResponse = await fetch(`${API_BASE_URL}/auth/current-user`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      })
      const userData = await userResponse.json()
      return { token: data.token, user: userData }
    }
    return data
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
    return await response.json()
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
