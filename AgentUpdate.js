import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AgentUpdate.css'
import './AgentRegistration.css'; // Your custom CSS file
import Navbar from './Navbar';
import { Container, Form, Button, Row, Col } from 'react-bootstrap'; import { useLocation } from 'react-router-dom';

export default function AgentUpdate() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [agentData, setAgentData] = useState({
    agentType: '',
    name: '',
    phonenumber: '',
    email: '',
    password: '',
    aadharNumber: '',
    uploadAadhar: '',
    pancardNumber: '',
    uploadPan: '',
    doorNo: '',
    street: '',
    landmark: '',
    village: '',
    pincode: '',
    mandal: '',
    district: '',
    state: '',
    crn: null,
    id: null,

  });
  console.log(agentData)
  useEffect(() => {
    if (location.state && (location.state.crn || location.state.agentData)) {
      const { crn, agentData } = location.state;
      // fetchAgentData(crn, agentData);
      setAgentData(agentData)
      setIsLoading(false)
      console.log(crn, agentData)
    }
  }, [location.state]);
  const handleInputChange = (e) => {
    console.log('handleInputChange function called'); // Add this line to check if the function is called
    const { name, value } = e.target;
    console.log(`Field Name: ${name}, Field Value: ${value}`);
    console.log('handleInputChange function called');
    console.log('Field Name:', name);
    console.log('Field Value:', value);

    setAgentData({
      ...agentData,
      [name]: value,
    });
  };
  //   const fetchAgentData = (crn, phonenumber) => {
  //     const fetchURL = `http://localhost:9000?${crn ? `crn=${crn}` : ''}${crn && phonenumber ? '&' : ''}${phonenumber ? `phonenumber=${phonenumber}` : ''}`;
  //     console.log("Fetch URL: ", fetchURL);
  //     if (fetchURL) {
  //       axios
  //         .get(fetchURL)
  //         .then((response) => {
  //           if (response.data) {
  //             console.log('Before setting agentData:', agentData);
  // setAgentData(response.data);
  // console.log('After setting agentData:', response.data);
  //            // Set the state with the fetched data
  //             setIsLoading(false);
  //           }
  //         })
  //         .catch((error) => {
  //           console.error('Error fetching agent data:', error);
  //           setIsLoading(false);
  //         });
  //     }
  //   };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setAgentData({
      ...agentData,
      [name]: files[0], // Store the file object
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    // Display a confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to update the agent details?');
  
    if (isConfirmed) {
      const dataToSend = {
        crn: agentData.crn,
        phonenumber: agentData.phonenumber,
        id:agentData.id,
      
          agentType: agentData.agentType,
          name: agentData.name,
          email: agentData.email,
          password: agentData.password,
          aadharNumber: agentData.aadharNumber,
          uploadAadhar: agentData.uploadAadhar,
          pancardNumber: agentData.pancardNumber,
          uploadPan: agentData.uploadPan,
          doorNo: agentData.doorNo,
          street: agentData.street,
          landmark: agentData.landmark,
          village: agentData.village,
          pincode: agentData.pincode,
          mandal: agentData.mandal,
          district: agentData.district,
          state: agentData.state,
      
      };
  
      console.log('Data to be sent to the backend:', dataToSend);
  
      // Send a PUT request to update the agent's details
      axios
        .put(`http://localhost:9000/updateagent`, dataToSend)
        .then(() => {
          // Handle success
          alert('Agent details updated successfully!');
        })
        .catch((error) => {
          console.error('Error updating agent data:', error);
        });
    }
  };
  return (
    <div>
      {console.log('agentType:', agentData)}

      <Navbar />
      <Container className="Agent">
        <h1>Update Agent Details</h1>
        {isLoading ? ( // Conditional rendering based on isLoading
          <p>Loading...</p>
        ) : (
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col>
                <Form.Group controlId="agentType">
                  <Form.Label>Agent Type:</Form.Label>

                  <Form.Control
                    as="select"
                    name="agentType"

                    value={agentData.agentType}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                  >
                    <option value="">Select Agent Type</option>
                    <option value="prepaid">Prepaid</option>
                    <option value="postpaid">Postpaid</option>
                    <option value="Prepaid/Postpaid">Prepaid/Postpaid</option>
                  </Form.Control>
                  {console.log('agentType:', agentData.agentType)}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="name">
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={agentData.name}
                    onChange={handleInputChange}
                    style={{ textTransform: 'capitalize' }}
                    maxLength={40}
                    required
                    autoComplete="name"
                  />
                  {console.log('name:', agentData.name)}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="phonenumber">
                  <Form.Label>Mobile Number:</Form.Label>
                  <Form.Control
                    type="text"
                    value={agentData.phonenumber}
                    onChange={handleInputChange}
                    maxLength={10}
                    placeholder="Enter Number"
                    required
                    autoComplete="tel"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="email">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={agentData.email}
                    onChange={handleInputChange}
                    placeholder="Email@gmail.com"
                    required
                    autoComplete="email"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="password">
                  <Form.Label>Create Password:</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={agentData.password}
                    onChange={handleInputChange}
                    placeholder="Create Password"
                    required
                    autoComplete="new-password"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="aadharNumber">
                  <Form.Label>Aadhar Number:</Form.Label>
                  <Form.Control
                    type="text"
                    name="aadharNumber"
                    value={agentData.aadharNumber}
                    onChange={handleInputChange}
                    maxLength={12}
                    minLength={12}
                    placeholder="Enter Aadhar Number"
                    required
                    autoComplete="off"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="uploadAadhar">
                  <Form.Label>Upload Aadhar Card:</Form.Label>
                  <Form.Control
                    type="file"
                    name="uploadAadhar"
                    // value={agentData.uploadAadhar}
                    onChange={handleFileChange}
                    placeholder=""
                    required
                    autoComplete="off"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="pancardNumber">
                  <Form.Label>Pancard Number:</Form.Label>
                  <Form.Control
                    type="text"
                    name="pancardNumber"
                    value={agentData.pancardNumber}
                    onChange={handleInputChange}
                    placeholder="Enter Pancard"
                    required
                    autoComplete="off"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="uploadPan">
                  <Form.Label>Upload Pancard:</Form.Label>
                  <Form.Control
                    type="file"
                    name="uploadPan"
                    // value={agentData.uploadPan}
                    onChange={handleFileChange}
                    placeholder=""
                    required
                    autoComplete="off"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="doorNo">
                  <Form.Label>Door No:</Form.Label>
                  <Form.Control
                    type="text"
                    name="doorNo"
                    value={agentData.doorNo}
                    onChange={handleInputChange}
                    placeholder="Door No"
                    required
                    autoComplete="off"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="street">
                  <Form.Label>Street:</Form.Label>
                  <Form.Control
                    type="text"
                    name="street"
                    value={agentData.street}
                    onChange={handleInputChange}
                    placeholder="Street"
                    required
                    autoComplete="address-line1"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="landmark">
                  <Form.Label>Landmark:</Form.Label>
                  <Form.Control
                    type="text"
                    name="landmark"
                    value={agentData.landmark}
                    onChange={handleInputChange}
                    placeholder="Landmark"
                    required
                    autoComplete="address-line2"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="village">
                  <Form.Label>Village:</Form.Label>
                  <Form.Control
                    type="text"
                    name="village"
                    value={agentData.village}
                    onChange={handleInputChange}
                    placeholder="Village"
                    required
                    autoComplete="address-line2"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="pincode">
                  <Form.Label>Pincode:</Form.Label>
                  <Form.Control
                    type="text"
                    name="pincode"
                    value={agentData.pincode}
                    onChange={handleInputChange}
                    placeholder="Pincode"
                    required
                    autoComplete="postal-code"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="mandal">
                  <Form.Label>Mandal:</Form.Label>
                  <Form.Control
                    type="text"
                    name="mandal"
                    value={agentData.mandal}
                    onChange={handleInputChange}
                    placeholder="Mandal"
                    required
                    autoComplete="address-level1" // Administrative division (e.g., Mandal)
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="district">
                  <Form.Label>District:</Form.Label>
                  <Form.Control
                    type="text"
                    name="district"
                    value={agentData.district}
                    onChange={handleInputChange}
                    placeholder="District"
                    required
                    autoComplete="address-level2" // District
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="state">
                  <Form.Label>State:</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={agentData.state}
                    style={{maxWidth:'49%'}}
                    onChange={handleInputChange}
                    placeholder="State"
                    required
                    autoComplete="address-level1"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        )}
      </Container>
    </div>
  );
}
