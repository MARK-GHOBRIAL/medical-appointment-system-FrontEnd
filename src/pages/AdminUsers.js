import React, { useState, useEffect } from 'react'
import { apiService } from '../services/api'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiService.getAllUsers()
        setUsers(data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch users')
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleDeleteAppointment = async (userId, appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await apiService.cancelAppointment(appointmentId)
        setUsers(
          users.map((user) => {
            if (user._id === userId) {
              return {
                ...user,
                appointments: user.appointments.filter(
                  (a) => a._id !== appointmentId
                ),
              }
            }
            return user
          })
        )
      } catch (err) {
        setError('Failed to delete appointment')
      }
    }
  }

  if (loading) return <div className="text-center mt-5">Loading users...</div>
  if (error) return <div className="alert alert-danger mt-5">{error}</div>

  return (
    <div className="container mt-5">
      <h2 className="mb-4">User Management</h2>
      {users.map((user) => (
        <div key={user._id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">
              {user.name} ({user.email}) - {user.role}
            </h5>
            <h6 className="card-subtitle mb-2 text-muted">
              Appointments: {user.appointments.length}
            </h6>
            {user.appointments.length > 0 && (
              <ul className="list-group list-group-flush">
                {user.appointments.map((appointment) => (
                  <li
                    key={appointment._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>Date:</strong>{' '}
                      {new Date(appointment.date).toLocaleDateString()}
                      <br />
                      <strong>Time:</strong> {appointment.time}
                      <br />
                      <strong>Doctor:</strong> {appointment.doctor.name}
                      <br />
                      <strong>Status:</strong> {appointment.status}
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleDeleteAppointment(user._id, appointment._id)
                      }
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminUsers
