import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import axios from 'axios';

import './Dashboard.css';

function Dashboard() {
  const navigate=useNavigate();
  const [popupVisible1, setPopupVisible1] = useState(false);
  const [chatPopupVisible, setChatPopupVisible] = useState(false);
  const [popupVisible2, setPopupVisible2] = useState(false);
  const [phonenumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const authenticateUser = async () => {
    const storedPhoneNumber = sessionStorage.getItem('phoneNumber');
    const storedPassword = sessionStorage.getItem('password');

    if (storedPhoneNumber && storedPassword) {
      // Automatically log in using stored credentials
      try {
        const response = await axios.post('http://localhost:9000/auth', {
          phonenumber: storedPhoneNumber,
          password: storedPassword,
        });

        if (response.status === 200) {
          // Successful login
          const userData = response.data.user;

          if (userData && userData.crn) {
            const userCRN = userData.crn;

            // Store user CRN in localStorage
            localStorage.setItem('userCRN', userCRN);

            console.log('Automatic Login successful');
            setMessage('Automatic Login Successful!');
            navigate('/OwnerInterface');
          } else {
            // Handle missing CRN in the response
            setError('CRN not found in user data');
          }
        }
      } catch (error) {
        setError('Automatic login failed. Please log in manually.');
        console.error('Automatic Login error:', error);
      }
    }
  };

  useEffect(() => {
    // Check for automatic login on component mount
    authenticateUser();
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate input (you can add more validation)
    if (!phonenumber || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Send a request to your backend for authentication using axios
      const response = await axios.post('http://localhost:9000/auth', {
        phonenumber,
        password,
      });

      if (response.status === 200) {
        // Successful login
        const userData = response.data.user;
 const token = response.data.token;
        if (userData && userData.crn) {
          const userCRN = userData.crn;
          const name= userData.name;
          console.log(userCRN)
          localStorage.setItem('userToken', token);
          // Store user CRN in localStorage
          localStorage.setItem('userCRN', userCRN);
          sessionStorage.setItem('userCRN', userCRN);

          sessionStorage.setItem('phoneNumber', phonenumber);
          sessionStorage.setItem('password', password);
          sessionStorage.setItem('name', name);
          const loginTimestamp = new Date().getTime();
          localStorage.setItem('loginTimestamp', loginTimestamp);
          console.log('Login successful');
          setMessage('Successful Login!');
          navigate('/OwnerInterface', { state: { crn: userCRN,name:name } });
        } else {
          // Handle missing CRN in the response
          setError('CRN not found in user data');
        }
      } else {
        // Failed login
        const data = response.data;
        setError(data.message || 'Login failed.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error('Login error:', error);
    }
  };
  const handleLogin1 = async (e) => {
    e.preventDefault();

    // Validate input (you can add more validation)
    if (!phonenumber || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Send a request to your backend for authentication
      const response = await axios.post('http://localhost:9000/Agentauth', {
        agentId:phonenumber,
        password,
      });
console.log(response ,'login')
      if (response.status === 200) {
        // Agent login successful
        // const agentData = await response.json();
  
        // Fetch agent type
        const agentTypeResponse =  await axios.get('http://localhost:9000/agentType', {
          params: {
            agentId:phonenumber
            
          },

        });
        console.log(agentTypeResponse,'resoponse')
  
        if (agentTypeResponse.status === 200) {
          const agentTypeData = await agentTypeResponse.data;
          console.log(agentTypeData,'jijij')
          const agentType = agentTypeData[0].agentType;
          const name = agentTypeData[0].name;
          const agentId = agentTypeData[0].agentId;
          const phonenumber = agentTypeData[0].phonenumber;
          const crn = agentTypeData[0].crn;
          sessionStorage.setItem('phoneNumber1', phonenumber);
          sessionStorage.setItem('password1', password);
          sessionStorage.setItem("agentCRN", crn);
          sessionStorage.setItem("agentName", name);
          sessionStorage.setItem("agentId", agentId);

          console.log("CRN in session storage:", crn);
          console.log("agentId:", agentId);

          // Redirect to AgentInterface and pass the agent type
          navigate('/AgentInterface', { state: { agentType,name,agentId,phonenumber,crn } });
        } else {
          // Handle error fetching agent type
        }
      } else {
        // Handle agent login error
      }
    } catch (error) {
      // Handle general error
      setError('please enter the valid detials, try again');
      console.error('Login error:', error);
    }
  };
  const handleTruckOwnerLogin = () => {
    // Check if the login timestamp exists in local storage
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    if (loginTimestamp) {
      // Calculate the time difference in milliseconds
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - parseInt(loginTimestamp);
  
      // Define the time limit (24 hours in milliseconds)
      const timeLimit = 24 * 60 * 60 * 1000;
  
      // If the time difference is within the time limit, navigate to the owner interface
      if (timeDifference <= timeLimit) {
        const userCRN = sessionStorage.getItem('userCRN');
        const name = sessionStorage.getItem('name');
  
        navigate('/OwnerInterface', { state: { crn: userCRN, name } });
      } else {
        // The user needs to log in again since the time limit has passed
        togglePopup1();
      }
    } else {
      // The user has never logged in before, so they need to log in
      togglePopup1();
    }
  };
  
  const togglePopup1 = () => {
    setPopupVisible1(!popupVisible1);
  };

  const togglePopup2 = () => {
    setPopupVisible2(!popupVisible2);
  };

  return (
    <div>
      <Navbar/>
   
    <div className="App">
      
      <div className="background"></div>

    

      <div className="buttons-container1">
        <div className="numbered-button1">
          <span className="button-number">1</span>
          <button className='but' > <a href="/AddSub">Home</a></button>
        </div>
        <div className="numbered-button1">
          <span className="button-number">2</span>
          <button className='but' onClick={togglePopup1}>Truck Owner Login</button>
        </div>
        <div className="numbered-button1">
          <span className="button-number">3</span>
          <button className='but' onClick={togglePopup2}>Agent Login</button>
        </div>
      </div>

     
      <div className="chat-icon  fa-4x" id="chatIcon" onClick={() => setChatPopupVisible(!chatPopupVisible)}>
      <i className="bi bi-chat-dots-fill fa-lg">
      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-chat-text" viewBox="0 0 16 16">
        <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
        <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8zm0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/>
      </svg>
    </i>
    {chatPopupVisible && (
    <div className="popup5" id="popup5">
      
      <a href="tel:123456789"><i className="bi bi-phone"><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-telephone-forward-fill" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zm10.761.135a.5.5 0 0 1 .708 0l2.5 2.5a.5.5 0 0 1 0 .708l-2.5 2.5a.5.5 0 0 1-.708-.708L14.293 4H9.5a.5.5 0 0 1 0-1h4.793l-1.647-1.646a.5.5 0 0 1 0-.708z"/>
      </svg></i></a>
      <a href="https://wa.me/123456789"><i className="bi bi-whatsapp"><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
      </svg></i></a>
      <a href="mailto:info@example.com"><i className="bi bi-envelope"><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-envelope-at-fill" viewBox="0 0 16 16">
        <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671Z"/>
        <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034v.21Zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z"/>
      </svg></i></a>
    </div>
    )}
  </div>

     

      {popupVisible1 && (
        <div className="popup-container1" id="popupSignIn">
 <div className="popup1">
      <span className="close-button" onClick={togglePopup1}>&times;</span>
      <h2>2.Truck Owner Login</h2>
      1 <input type="text" placeholder="Enter Phonenumber" inputMode='tel'  value={phonenumber} onChange={(e) => setPhoneNumber(e.target.value)} required></input><br></br>
      2 <input type="password" placeholder="Enter Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required></input>
    <div className="otp-input">
   <center> {error && <div className="error">{error}</div>}
    {message && <div className="message">{message}</div>}</center>
      </div>

      <button type="sumbit" className="btn  hello" id="registerTruckButton1"  onClick={handleLogin}>Login</button><br></br>
     <p><a href="" className='hii-2'>forgot password</a></p>
    </div>        </div>
      )}

      {popupVisible2 && (
        <div className="popup-container2" id="popupSignIn1">
<div className="popup1">
      <span className="close-button" onClick={togglePopup2}>&times;</span>
      <h2>3.Agent Login</h2>
      1 <input type="text" placeholder="Agent ID" inputMode='tel' value={phonenumber} onChange={(e) =>  setPhoneNumber(e.target.value)} required></input><br></br>
      2 <input type="password" placeholder="Enter Password"value={password}
          onChange={(e) => setPassword(e.target.value)}  required></input>
      <div className="otp-input">
      {error && <div className="error ms-5">{error}</div>}
    {message && <div className="message ms-5">{message}</div>}
      </div>

      <button type="sumbit" className="btn-hello" id="registerTruckButton1"><button onClick={handleLogin1}>Login</button></button><br></br>
     <center><p><a href="">forgot password</a></p></center>
    </div>        </div>
      )}
    </div>
    </div>
  );
}

export default  Dashboard;
