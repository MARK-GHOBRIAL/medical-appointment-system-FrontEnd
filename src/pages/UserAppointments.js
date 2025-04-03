
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
        const data = await apiService.getUserAppointments()
        setAppointments(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const handleCancel = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await apiService.cancelAppointment(appointmentId)
        setAppointments(appointments.filter((a) => a.id !== appointmentId))
      } catch (err) {
        setError(err.message)
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
              <tr key={appointment.id}>
                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                <td>{appointment.time}</td>
                <td>{appointment.doctor.name}</td>
                <td>{appointment.doctor.specialty}</td>
                <td>{appointment.status}</td>
                <td>
                  {appointment.status === 'CONFIRMED' && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancel(appointment.id)}
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
