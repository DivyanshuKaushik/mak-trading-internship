import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="container m-5">
        <h1 className="text-center">Welcome to the Home Page</h1>
        <div className="d-flex mx-auto container justify-content-center align-items-center">
        <Link to="/search" className="btn btn-primary m-2">
            <button className="btn btn-primary">Search</button>
        </Link>
        <Link to="/upload" className="btn btn-primary m-2">
            <button className="btn btn-primary">Upload</button>
        </Link>
        </div>
    </div>
  )
}

export default Home