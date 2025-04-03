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
        const data = await apiService.getDoctorAppointments()
        setAppointments(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const handleComplete = async (appointmentId) => {
    try {
      await apiService.completeAppointment(appointmentId)
      setAppointments(
        appointments.map((a) =>
          a.id === appointmentId ? { ...a, status: 'COMPLETED' } : a
        )
      )
    } catch (err) {
      setError(err.message)
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
              <tr key={appointment.id}>
                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                <td>{appointment.time}</td>
                <td>{appointment.patient.name}</td>
                <td>{appointment.status}</td>
                <td>
                  {appointment.status === 'CONFIRMED' && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleComplete(appointment.id)}
                    >
                      Complete
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
