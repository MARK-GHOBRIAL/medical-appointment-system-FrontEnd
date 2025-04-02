import React, { useState, useEffect } from 'react'
import { apiService } from '../services/api'

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await apiService.getAllDoctorsAdmin()
        setDoctors(data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch doctors')
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const handleDeleteAppointment = async (doctorId, appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await apiService.cancelAppointment(appointmentId)
        setDoctors(
          doctors.map((doctor) => {
            if (doctor._id === doctorId) {
              return {
                ...doctor,
                appointments: doctor.appointments.filter(
                  (a) => a._id !== appointmentId
                ),
              }
            }
            return doctor
          })
        )
      } catch (err) {
        setError('Failed to delete appointment')
      }
    }
  }

  if (loading) return <div className="text-center mt-5">Loading doctors...</div>
  if (error) return <div className="alert alert-danger mt-5">{error}</div>

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Doctor Management</h2>
      {doctors.map((doctor) => (
        <div key={doctor._id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">
              {doctor.name} ({doctor.specialty})
            </h5>
            <h6 className="card-subtitle mb-2 text-muted">
              Appointments: {doctor.appointments.length}
            </h6>
            {doctor.appointments.length > 0 && (
              <ul className="list-group list-group-flush">
                {doctor.appointments.map((appointment) => (
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
                      <strong>Patient:</strong> {appointment.patient.name}
                      <br />
                      <strong>Status:</strong> {appointment.status}
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleDeleteAppointment(doctor._id, appointment._id)
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

export default AdminDoctors
