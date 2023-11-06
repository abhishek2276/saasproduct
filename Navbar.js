import React from 'react'
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
export default function Navbar() {
  const navigate = useNavigate(); 
  const handleLogout = () => {
    // Clear local storage and navigate to the login page
    localStorage.removeItem('userCRN');
    sessionStorage.removeItem('phoneNumber');
    sessionStorage.removeItem('password');
    navigate('/login'); // Navigate to the login page
  };
  return (
    <div>
        <nav className="navbar">
        <ul className="navbar-list">
          <li className="navbar-item dropdown">
            Abhishek Travels
            <div className="dropdown-content">
              <a href="#">My Profile</a>
              <a href="OwnerInterface">Home</a>

              <a href="Dashboard" onClick={handleLogout}>Logout</a>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )
}
