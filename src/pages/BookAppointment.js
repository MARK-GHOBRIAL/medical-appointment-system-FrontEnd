import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { apiService } from '../services/api'
import { useAuth } from '../context/AuthContext'

const BookAppointment = () => {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [doctor, setDoctor] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Get doctorId from query params
  const queryParams = new URLSearchParams(location.search)
  const doctorId = queryParams.get('doctorId')

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const data = await apiService.getAllDoctors()
        const selectedDoctor = data.find((d) => d._id === doctorId)
        setDoctor(selectedDoctor)
      } catch (err) {
        setError('Failed to fetch doctor details')
      }
    }

    if (doctorId) {
      fetchDoctor()
    }
  }, [doctorId])

  useEffect(() => {
    if (date && doctorId) {
      fetchAvailableSlots()
    }
  }, [date, doctorId])

  const fetchAvailableSlots = async () => {
    try {
      // This would call your backend API to get available slots
      // For now, we'll simulate it
      const response = await fetch(
        `${API_BASE_URL}/doctors/${doctorId}/availability?date=${date}`
      )
      const data = await response.json()
      setAvailableSlots(data.availableSlots)
    } catch (err) {
      setError('Failed to fetch available slots')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await apiService.bookAppointment({
        doctorId,
        patientId: user._id,
        date,
        time,
      })
      navigate('/confirmation')
    } catch (err) {
      setError('Failed to book appointment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!doctor) {
    return <div className="text-center mt-5">Loading doctor information...</div>
  }

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6">
        <h2 className="text-center mb-4">
          Book Appointment with {doctor.name} ({doctor.specialty})
        </h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              type="date"
              className="form-control"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          {date && (
            <div className="mb-3">
              <label htmlFor="time" className="form-label">
                Available Time Slots
              </label>
              <select
                className="form-control"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              >
                <option value="">Select a time slot</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BookAppointment
