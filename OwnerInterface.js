import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './OwnerInterface.css'; // Import your CSS file
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';

function OwnerInterface() {
const navigate = useNavigate('')
    const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);
    const [showAdditionalButtons1, setShowAdditionalButtons1] = useState(false);
    const location = useLocation();
    const [crn, setCRN] = useState(null);
    const [name,setName]=useState(null);
    useEffect(() => {
      if (location.state && location.state.crn && location.state.name ) {
        setCRN(location.state.crn);
        setName(location.state.name)
        console.log('CRN:', location.state.crn);
        console.log('name',location.state.name);
      }
    }, [location.state]);  
  
    const toggleAdditionalButtons = () => {
        console.log('Button clicked'); 
      setShowAdditionalButtons(!showAdditionalButtons);
    };
    const toggleAdditionalButtons1 = () => {
      console.log('Button clicked'); 
    setShowAdditionalButtons1(!showAdditionalButtons1);
  };
  const navigateToAgentRegistration = () => {
    navigate('/AgentRegistration', { state: { crn } })
  };
  const agent = () => {
    navigate('/AgentInfo', { state: { crn,name } })
  };
  const newTruck= () => {
    navigate('/NewTruck', { state: { crn,name } })
  };
  const truckPosting= () => {
    navigate('/TruckPosting', { state: { crn,name  } })
  };
  const Manage= () => {
    navigate('/OwnerBooking', { state: { crn ,name } })
  };
  const Driver= () => {
    navigate('/NewDriver', { state: { crn,name  } })
  };
  const Info= () => {
    navigate('/DriverInfo', { state: { crn ,name } })
  };
  return (
    <div>
        <Navbar/>
      <div className="center">
        <div className="center-container">
          <div className="numbered-button">
            <span className="number">1</span>
            <button className="centered-button1" onClick={toggleAdditionalButtons}>
              Agent
            </button>
          </div>
          {showAdditionalButtons && (
            <div className="additional-buttons-container">
              <div className="numbered-button">
                <span className="number">I</span>
                <button className="centered-button7" onClick={navigateToAgentRegistration}>
                Agent Registration
                </button>
              </div>
              <br />
              <div className="numbered-button">
                <span className="number">II</span>
                <button className="centered-button7" onClick={agent}>
                 Agent Info
                </button>
              </div>
            </div>
          )}
          
          <div className="numbered-button">
            <span className="number">2</span>
            <button className="centered-button2" onClick={newTruck}>
               Truck Registrations
            </button>
          </div>
          <div className="numbered-button">
            <span className="number">3</span>
            <button className="centered-button3" onClick={truckPosting}>
              Truck Posting
            </button>
          </div>
          <div className="numbered-button">
            <span className="number">4</span>
            <button className="centered-button4"onClick={Manage}>
        Manage Bookings
            </button>
          </div>
          {/* <div className="numbered-button">
            <span className="number">5</span>
            <button className="centered-button6">Settings (optional)</button>
          </div> */}
          <div className="numbered-button">
            <span className="number">5</span>
            <button className="centered-button1" onClick={toggleAdditionalButtons1}>
              Driver
            </button>
          </div>
          {showAdditionalButtons1 && (
            <div className="additional-buttons-container">
              <div className="numbered-button">
                <span className="number">A</span>
                <button className="centered-button7" onClick={Driver}>
                  Add New Driver
                </button>
              </div>
              <br />
              <div className="numbered-button">
                <span className="number">B</span>
                <button className="centered-button7" onClick={Info}>
                  Driver info
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OwnerInterface;
