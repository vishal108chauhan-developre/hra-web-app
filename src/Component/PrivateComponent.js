import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
function PrivateComponent() {
    const auth = localStorage.getItem("username")
    return auth ? <Outlet /> : <Navigate to="/SignUp" />
}

export default PrivateComponent