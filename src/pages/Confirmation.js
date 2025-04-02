import React from 'react'
import { Link } from 'react-router-dom'

const Confirmation = () => {
  return (
    <div className="text-center mt-5">
      <h2 className="text-success">Appointment Confirmed!</h2>
      <p>Your appointment has been successfully booked.</p>
      <p>You will receive a confirmation email with all the details.</p>
      <Link to="/user-appointments" className="btn btn-primary">
        View Your Appointments
      </Link>
    </div>
  )
}

export default Confirmation
