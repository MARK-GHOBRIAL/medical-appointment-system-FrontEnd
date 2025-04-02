import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiService } from '../services/api'

const Doctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await apiService.getAllDoctors()
        setDoctors(data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch doctors')
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  if (loading) return <div className="text-center mt-5">Loading...</div>
  if (error) return <div className="alert alert-danger mt-5">{error}</div>

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Our Doctors</h2>
      <div className="row">
        {doctors.map((doctor) => (
          <div key={doctor._id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img
                src={doctor.image || 'https://via.placeholder.com/150'}
                className="card-img-top"
                alt={doctor.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{doctor.name}</h5>
                <p className="card-text">
                  <strong>Specialty:</strong> {doctor.specialty}
                </p>
                <p className="card-text">
                  <strong>Bio:</strong> {doctor.bio || 'No bio available'}
                </p>
                <Link
                  to={`/book-appointment?doctorId=${doctor._id}`}
                  className="btn btn-primary"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Doctors
