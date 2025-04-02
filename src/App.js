import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Doctors from './pages/Doctors'
import BookAppointment from './pages/BookAppointment'
import Confirmation from './pages/Confirmation'
import UserAppointments from './pages/UserAppointments'
import DoctorAppointments from './pages/DoctorAppointments'
import AdminUsers from './pages/AdminUsers'
import AdminDoctors from './pages/AdminDoctors'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'

// Protected Route component
const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<Doctors />} />

            {/* Protected routes */}
            <Route
              path="/book-appointment"
              element={
                <ProtectedRoute roles={['patient']}>
                  <BookAppointment />
                </ProtectedRoute>
              }
            />

            <Route
              path="/confirmation"
              element={
                <ProtectedRoute roles={['patient']}>
                  <Confirmation />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user-appointments"
              element={
                <ProtectedRoute roles={['patient']}>
                  <UserAppointments />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor-appointments"
              element={
                <ProtectedRoute roles={['doctor']}>
                  <DoctorAppointments />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-users"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-doctors"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDoctors />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  )
}

export default App
