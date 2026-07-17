import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

import Login from './pages/Login'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import AdminDashboard from './pages/AdminDashboard'
import MenuPublic from './pages/MenuPublic'

import './styles/global.css'


function App() {

  return (

    <AuthProvider>

      <ThemeProvider>

        <Toaster position="top-right" />

        <BrowserRouter>

          <Routes>


            <Route 
              path="/login" 
              element={<Login />} 
            />


            <Route 
              path="/SuperAdminDashboard" 
              element={<SuperAdminDashboard />} 
            />


            <Route 
              path="/AdminDashboard" 
              element={<AdminDashboard />} 
            />


            <Route 
              path="/menu/:restaurantId" 
              element={<MenuPublic />} 
            />


            <Route 
              path="/" 
              element={<Navigate to="/login" />} 
            />


          </Routes>


        </BrowserRouter>


      </ThemeProvider>

    </AuthProvider>

  )

}


export default App