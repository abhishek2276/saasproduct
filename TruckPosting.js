import React, { useState, useEffect } from 'react';
import './TruckPostiing.css'
import Navbar from "./Navbar";
import { useLocation } from 'react-router-dom';

import Select from 'react-select';
import axios from 'axios';
function TruckPosting() {
  const location = useLocation();

  const [registrationNumbers, setRegistrationNumbers] = useState('');
  const [selectedRegistrationNumber, setSelectedRegistrationNumber] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [otp, setOtp] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [crn, setCRN] = useState('');

  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isTruckAlreadyPosted, setIsTruckAlreadyPosted] = useState(false);
  const availableSubLocations = [
    'Miyapur',
    'Kondapur',
    'Madhapur',
    // Add more sub-locations as needed
  ];
  const availableSubLocations1 = [
    'Solapur',
    'Bandra',
    'Jhodhpur',
    // Add more sub-locations as needed
  ];
  useEffect(() => {
    if (location.state && location.state.crn) {
      setCRN(location.state.crn);
      console.log('CRN:', location.state.crn);
      fetchRegistrationNumbersByCRN(location.state.crn);
    }
  }, [location.state]);  
 
  const [selectedSubLocations, setSelectedSubLocations] = useState([]);
  const [selectedSubLocations1, setSelectedSubLocations1] = useState([]);

  const fetchRegistrationNumbersByCRN = async (crn) => {
    try {
      const response = await axios.get(`http://localhost:9000/truckNumber?crn=${crn}`);
      if (Array.isArray(response.data)) {
        const completedTrucks = response.data.filter((truck) => truck.status === 'Completed');
        console.log(completedTrucks)
      setRegistrationNumbers(completedTrucks.map((truck) => truck.truckNumber));
      } else {
        setRegistrationNumbers([]); // If the response is not an array, set an empty array
      }
    } catch (error) {
      console.error('Error fetching registration numbers:', error);
      setRegistrationNumbers([]);
    }
  };
  
  // useEffect(() => {
  //   // Fetch truck post status based on the selected truck number
  //   async function checkTruckPostStatus() {
  //     try {
  //       const truckNumber= selectedRegistrationNumber;
  //       const response = await axios.get(`http://localhost:9000/TruckPost/${truckNumber}`);
  //       if (response.data.isAllowed) {
  //         setIsTruckPostAllowed(true);
  //       } else {
  //         setIsTruckPostAllowed(false);
  //       }
  //     } catch (error) {
  //       console.error('Error checking truck post status:', error);
  //     }
  //   }

  //   if (selectedRegistrationNumber) {
  //     checkTruckPostStatus();
  //   }
  // }, [selectedRegistrationNumber]);
  async function checkTruckPostStatus() {
    try {
      if (selectedRegistrationNumber && crn) {
        console.log(selectedRegistrationNumber, crn);
        const response = await axios.get(
          `http://localhost:9000/PostingStatus?crn=${crn}&truckNumber=${selectedRegistrationNumber}`
        );
  
        if (response.data.canPost === false) {
          setIsTruckAlreadyPosted(true);
          alert(response.data.message);
          window.location.reload(); 
        } else {
          setIsTruckAlreadyPosted(false);
        }
      }
    } catch (error) {
      console.error('Error checking truck post status:', error);
    }
  }
  
  useEffect(() => {
    // Call the function to check truck post status when the selected truck number changes
    checkTruckPostStatus();
  }, [selectedRegistrationNumber]);


  const handleSendOtp = () => {
    const generatedOtp = '123456';

    console.log(`OTP Sent: ${generatedOtp}`);
  };
  const handleVerifyOtp = () => {
    if (otp === '123456') {
      setIsOtpVerified(true);
      alert('OTP Verified!');
    } else if (!setIsOtpVerified) {
      alert('Invalid OTP! Please try again.');
    } 
  };
  // useEffect(() => {
  //   async function checkTruckPostStatus() {
  //     try {
  //       if (selectedRegistrationNumber) {
  //         const response = await axios.get(`http://localhost:9000/Posting/${selectedRegistrationNumber}`);
  //         if (response.data.isPosted) {
  //           // Truck has already been posted
  //           setIsTruckAlreadyPosted(true);
  //           alert('This truck has already been posted.');
  //         } else {
  //           setIsTruckAlreadyPosted(false);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error checking truck post status:', error);
  //     }
  //   }

  //   // Call the function to check truck post status when the selected truck number changes
  //   checkTruckPostStatus();
  // }, [selectedRegistrationNumber]);
  const handlePost = () => {
    if (isOtpVerified) {
      const loadingSublocations = selectedSubLocations.map((loc) => loc.value).join(', ');
      const unloadingSublocations = selectedSubLocations1.map((loc) => loc.value).join(', ');
      const postData = {
        truckNumber: selectedRegistrationNumber,
        date,
        time,
        from,
        to,
        loadingSublocations,
        unloadingSublocations,    
      crn,
      };

      axios
        .post('http://localhost:9000/Post', postData) // Replace with your actual API endpoint
        .then((response) => {
          const responseData = response.data;
          console.log(responseData);
          console.log(postData)
          alert('Truck posted successfully.');
        })
        .catch((error) => {
          console.error('Error posting data:', error);
          alert('Error posting data. Please try again.');
        });
        axios
        .post('http://localhost:9000/Post1', postData) // Replace with your actual API endpoint for the second table
        .then((response) => {
          const responseData = response.data;
          console.log(responseData);
        })
        .catch((error) => {
          console.error('Error posting data to the second table:', error);
          alert('Error posting data to the second table. Please try again.');
        });
      } else if (isTruckAlreadyPosted) {
        alert('This truck has already been posted.');
      } else {
        alert('OTP not verified. Cannot post.');
      }
    setCRN('')
    setDate('')
    setTime('')
    setOtp('')
    setRegistrationNumbers('')
    setSelectedSubLocations('')
    setSelectedSubLocations1('')
    setIsOtpVerified(false);
  }

  return (
    <div>
      <Navbar />
      <div className="hello-3">
        <div className="hii-3">

          <h1 style={{ textAlign: 'center' }}>Truck Posting</h1><br></br>

          <div>
            <label>1. Registration Number</label>
            <select
              value={selectedRegistrationNumber} className="form-control mb-3" 
              onChange={(e) => setSelectedRegistrationNumber(e.target.value)}
            >
              <option value="">- Select Registration Number -</option>
              {Array.isArray(registrationNumbers) ? (
                registrationNumbers.map((truckNumber) => (
                  <option key={truckNumber} value={truckNumber}>
                    {truckNumber}
                  </option>
                ))
              ) : (
                <option value="">No registration numbers available</option>
              )}
            </select>
          </div>
          <form>
          <label htmlFor="otp">2. From Location</label>
        <select
          type="text"
          id="otp" className="form-control mb-3" 
          value={from}
          placeholder="fron"
          onChange={(e) => setFrom(e.target.value)}

        >
          <option value="">- Select From Location -</option>

          <option value="Hyderabad">Hyderabad</option>
          <option value="Bangalore">Bangalore</option>

          <option value="Karnataka">Karnataka</option>
          </select>
          {/* Add more options as needed */}
          <label> Loading Sublocation</label>
          <Select
              isMulti
              value={selectedSubLocations}
              onChange={(selectedOptions) => setSelectedSubLocations(selectedOptions)}
              options={availableSubLocations.map((subLocation) => ({
                value: subLocation,
                label: subLocation,
              }))}
              placeholder="Select Loading Sub Locations"
            />

            <div className="grid-container-4">

            
            </div>
      

        <label htmlFor="otp">3. To Location</label>
        <select
          type="text"
          id="otp" className="form-control mb-3" 
          value={to}
          placeholder="To"
          onChange={(e) => setTo(e.target.value)}

        >
          <option value="">- Select To Location -</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Hyderbad">Hyderbad</option>
          <option value="Karnataka">Karnataka</option>
          {/* Add more options as needed */}
        </select>
        <label> Unloading Sublocation</label>

        <Select
              isMulti
              value={selectedSubLocations1}
              onChange={(selectedOptions) => setSelectedSubLocations1(selectedOptions)}
              options={availableSubLocations1.map((subLocation) => ({
                value: subLocation,
                label: subLocation,
              }))}
              placeholder="Select Unloading Sub Locations"
            />

            <div className="grid-container-4">

              
            </div>
       

        <label htmlFor="date">4. Date</label>
        <input
          type="date" className="form-control mb-3" 
          id="date"
          style={{textTransform:'uppercase'}}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Enter Name"
        />
        <label htmlFor="time">5. Time</label>
        <input
          type="time" className="form-control mb-3" 
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Enter Number"
        />
        <label htmlFor="otp">6. OTP</label>
        <input
          type="text"
          id="otp"
          value={otp} className="form-control" 
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
        />
      </form>

      <div className="grid-container-3">
      {!isOtpVerified ? (
              <div className="flex-2">
                <p type="button" className="flex-2" onClick={handleSendOtp}>
                  Send OTP
                </p>
                <p type="button" className="flex-2" onClick={handleVerifyOtp}>
                  Verify OTP
                </p>
              </div>
            ) : (
              <div className="flex-2">
                {!isTruckAlreadyPosted ? (
                  <p type="button" className="flex-2" onClick={handlePost}>
                    Post
                  </p>
                ) : (
                  <p type="button" className="flex-2">
                    Truck Already Posted
                  </p>
                )}
              </div>
            )}
      </div>
    </div>
    </div >
    </div >
  );
}

export default TruckPosting;
