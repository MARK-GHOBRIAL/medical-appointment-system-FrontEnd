import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="text-center mt-5">
      <h1 className="display-4">Welcome to the Medical Appointment System</h1>
      <p className="lead">
        Find the right doctor and book your appointment in just a few clicks!
      </p>
      {!user ? (
        <>
          <Link to="/login" className="btn btn-primary btn-lg me-2">
            Login
          </Link>
          <Link to="/register" className="btn btn-secondary btn-lg">
            Register
          </Link>
        </>
      ) : (
        <Link to="/doctors" className="btn btn-primary btn-lg">
          Browse Doctors
        </Link>
      )}
    </div>
  )
}

export default Home
