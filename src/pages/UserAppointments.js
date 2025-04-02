import React, { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import { useAuth } from '../context/AuthContext'

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await apiService.getUserAppointments(user._id)
        setAppointments(data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch appointments')
        setLoading(false)
      }
    }

    if (user) {
      fetchAppointments()
    }
  }, [user])

  const handleCancel = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await apiService.cancelAppointment(appointmentId)
        setAppointments(appointments.filter((a) => a._id !== appointmentId))
      } catch (err) {
        setError('Failed to cancel appointment')
      }
    }
  }

  if (loading)
    return <div className="text-center mt-5">Loading appointments...</div>
  if (error) return <div className="alert alert-danger mt-5">{error}</div>

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Appointments</h2>
      {appointments.length === 0 ? (
        <p>You have no upcoming appointments.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Doctor</th>
              <th>Specialty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                <td>{appointment.time}</td>
                <td>{appointment.doctor.name}</td>
                <td>{appointment.doctor.specialty}</td>
                <td>{appointment.status}</td>
                <td>
                  {appointment.status === 'confirmed' && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancel(appointment._id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default UserAppointments
