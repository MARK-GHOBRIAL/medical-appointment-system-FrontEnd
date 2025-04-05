const API_BASE_URL = 'http://localhost:3001/api'

export const apiService = {
  // Auth endpoints
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const data = await response.json()

      return {
        token: data.accessToken || data.token,
        user: {
          id: data.user?.id,
          name: data.user?.name,
          email: data.user?.email,
          role: data.user?.role,
        },
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
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
          role: userData.role.toUpperCase(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registration failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/current-user`, {
      headers: apiService.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }

    const userData = await response.json()
    return {
      ...userData,
      role: userData.role.replace('ROLE_', ''),
    }
  },

  // Appointments endpoints
  bookAppointment: async (doctorId, date, time) => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...apiService.getAuthHeaders(),
      },
      body: JSON.stringify({ doctorId, date, time }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Booking failed')
    }

    return await response.json()
  },

  getUserAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments/user`, {
      headers: apiService.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch appointments')
    }

    return await response.json()
  },

  getDoctorAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments/doctor`, {
      headers: apiService.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch appointments')
    }

    return await response.json()
  },

  getAvailableSlots: async (doctorId, date) => {
    const response = await fetch(
      `${API_BASE_URL}/appointments/available-slots?doctorId=${doctorId}&date=${date}`,
      {
        headers: apiService.getAuthHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch available slots')
    }

    return await response.json()
  },

  cancelAppointment: async (id) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: apiService.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to cancel appointment')
    }

    return await response.json()
  },

  // Doctors endpoints
  getAllDoctors: async () => {
    const response = await fetch(`${API_BASE_URL}/doctors`)

    if (!response.ok) {
      throw new Error('Failed to fetch doctors')
    }

    return await response.json()
  },

  getDoctorById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/doctors/${id}`)

    if (!response.ok) {
      throw new Error('Failed to fetch doctor')
    }

    return await response.json()
  },

  // Admin endpoints
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: apiService.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }

    return await response.json()
  },

  getAllDoctorsAdmin: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/doctors`, {
      headers: apiService.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch doctors')
    }

    return await response.json()
  },

  getAuthHeaders: () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  },
}
