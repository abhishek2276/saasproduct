import React from 'react';
import './AgentNavbar.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import PropTypes from 'prop-types';

export default function AgentNavbar() {
  // Retrieve agentName and crn from sessionStorage
  const agentName = sessionStorage.getItem("agentName");
  const crn = sessionStorage.getItem("agentCRN");
  const phonenumber = sessionStorage.getItem("phoneNumber1");

  const navigate = useNavigate(); // Initialize useNavigate

  console.log("CRN in AgentNavbar:", crn);
  console.log("CRN in AgentNavbar:", phonenumber);

  // Function to handle navigation and pass crn as state
  const handleMyBookingClick = () => {
    // Navigate to the AgentBooking component and pass the crn in the state
    navigate("/AgentBooking", { state: { crn: crn,phonenumber: phonenumber } });
  };

  return (
    <div>
      <nav className="navbar1">
        <div className="navbar-start">
          <li className="navbar-item1 dropdown1"  style={{ textTransform: 'capitalize' }}>
            {agentName}
            <div className="dropdown-content1">
              <Link to="/AgentInterface">Home</Link>
              <Link to="#">My Profile</Link>
              <Link to="/Dashboard">Logout</Link>
            </div>
          </li>
        </div>
        <div className="navbar-end">
          <button
            onClick={handleMyBookingClick}
            className="navbar-link1"
            style={{backgroundColor:'#333'}}
          >
            My Booking
          </button>
        </div>
      </nav>
    </div>
  );
}

AgentNavbar.propTypes = {
  crn: PropTypes.string.isRequired,
};
