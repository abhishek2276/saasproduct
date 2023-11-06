import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

const DriverInfo = () => {
    const location = useLocation();
    const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [crn, setCRN] = useState(''); // Assuming you have a way to set CRN
  const [driverDetails, setDriverDetails] = useState([]);
  const [filteredDriverDetails, setFilteredDriverDetails] = useState([]);
  useEffect(() => {
    if (location.state && location.state.crn) {
      setCRN(location.state.crn);
      console.log('CRN:', location.state.crn);
    }
  }, [location.state]);
  useEffect(() => {
    // Fetch all driver details when the component mounts
    fetchDriverData(crn);
  }, [crn]);

  
  const fetchDriverData = (crn) => {
    axios
      .get(`http://localhost:9000/fetchdriver?crn=${crn}`)
      .then((response) => {
        setDriverDetails(response.data);
        setFilteredDriverDetails(response.data); // Initially, show all driver details
      })
      .catch((error) => {
        console.error('Error fetching driver details:', error);
      });
  };
  useEffect(() => {
    const uniquePhoneNumbers = [...new Set(driverDetails.map((driver) => driver.phoneNumber))];
    setPhoneNumbers(uniquePhoneNumbers);
  }, [driverDetails]);
const handleFetchDetails = () => {
    // Filter driver details based on the selected phone number
    if (phoneNumber) {
      const filteredDrivers = driverDetails.filter((driver) => driver.phoneNumber === phoneNumber);
      setFilteredDriverDetails(filteredDrivers);
    } else {
      // If no phone number is selected, show all driver details
      setFilteredDriverDetails(driverDetails);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container my-4" style={{minHeight:'100vh'}}>
        <h2 className="my-4">Driver Info</h2>
        <div className="row mb-3">
          <div className="col-md-6">
            <select
              className="form-control"
              value={phoneNumber}
              style={{ maxWidth: '200px' }}
              onChange={(e) => setPhoneNumber(e.target.value)}
            >
              <option value="" style={{ maxWidth: '200px' }}>Select Phone Number</option>
              {phoneNumbers.map((phone) => (
                <option key={phone} value={phone}>
                  {phone}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-">
          <button className="btn btn-primary" onClick={handleFetchDetails}>
             Get Info
            </button>
          </div>
        </div>
        <table className="table table-sm table-bordered" style={{textAlign:'center'}}>
          <thead className="thead-light">
            <tr>
              <th>S.No</th>
              <th>Driver Name</th>
              <th>Phone Number</th>
              <th>Date of Joining</th>
              <th>Driver  License Front Side </th>
            </tr>
          </thead>
          <tbody>
            {filteredDriverDetails.length === 0 ? (
              <tr>
                <td colSpan="4">No drivers found.</td>
              </tr>
            ) : (
              filteredDriverDetails.map((driver, index) => (
                <tr key={driver.id}>
                  <td>{index + 1}</td>
                  <td>{driver.driverName}</td>
                  <td>{driver.phoneNumber}</td>
                  <td>{driver.dateOfJoining.split('-').reverse().join('-')}</td>
                  <td>{driver.licenseFront}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverInfo;
