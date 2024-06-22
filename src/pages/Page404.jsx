//Importing the dependencies
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Page404 = () => {
  const navigate = useNavigate();
  return (
    <div className="not-found page">
    <h3>Page not found.</h3>
    <img
      src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
      alt="not found"
    />
    <button onClick = {() => navigate("/")} >Back to Home</button>
  </div>
  )
}
export default Page404