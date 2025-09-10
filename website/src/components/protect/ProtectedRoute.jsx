import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {



    const user  = useSelector(state => state.auth.user)

    console.log(user, "lll")

    const navigate = useNavigate()


  useEffect(() => {
  if (user === null) {
        return navigate("/login")
    }
  }, [navigate])


  if(!user) return null;
  

    return (
        <div>{children}</div>
    )
}

export default ProtectedRoute