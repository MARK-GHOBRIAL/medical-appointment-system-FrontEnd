import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Medical System
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                {user.role === 'patient' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/doctors">
                        Doctors
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/user-appointments">
                        My Appointments
                      </Link>
                    </li>
                  </>
                )}
                {user.role === 'doctor' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/doctor-appointments">
                      My Appointments
                    </Link>
                  </li>
                )}
                {user.role === 'admin' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin-users">
                        Manage Users
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin-doctors">
                        Manage Doctors
                      </Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
          {user && (
            <span className="navbar-text text-white">
              Welcome, {user.name} ({user.role})
            </span>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
