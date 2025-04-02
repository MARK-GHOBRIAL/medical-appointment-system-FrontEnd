import React, { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import { useAuth } from '../context/AuthContext'

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await apiService.getDoctorAppointments(user._id)
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

  const handleComplete = async (appointmentId) => {
    try {
      // This would call your backend API to mark appointment as completed
      await fetch(`${API_BASE_URL}/appointments/${appointmentId}/complete`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      setAppointments(
        appointments.map((a) =>
          a._id === appointmentId ? { ...a, status: 'completed' } : a
        )
      )
    } catch (err) {
      setError('Failed to update appointment status')
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
              <th>Patient</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                <td>{appointment.time}</td>
                <td>{appointment.patient.name}</td>
                <td>{appointment.status}</td>
                <td>
                  {appointment.status === 'confirmed' && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleComplete(appointment._id)}
                    >
                      Mark as Completed
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

export default DoctorAppointments
