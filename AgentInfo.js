import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AgentInfo.css'; // Your custom CSS file
import Navbar from './Navbar';
import { Container, Table, Form, Button } from 'react-bootstrap'; // Import Bootstrap components
import { useLocation,useNavigate } from 'react-router-dom';

export default function AgentInfo() {
  const location = useLocation();
  const [crn, setCRN] = useState(null);

  const [originalAgentData, setOriginalAgentData] = useState([]); // Store the original data
  const [agentData, setAgentData] = useState([]); // Store the filtered data
  const [loading, setLoading] = useState(false);

  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');
  const [allPhoneNumbers, setAllPhoneNumbers] = useState([]); // Store all fetched phone numbers
const navigate = useNavigate();
  useEffect(() => {
    if (location.state && location.state.crn) {
      // Fetch all agent data when the component mounts
      fetchAllAgentData(location.state.crn);
      setCRN(location.state.crn)
    }
  }, [location.state]);
  useEffect(() => {
    // Log the selected phone number when it changes
    console.log("Selected PhoneNumber:", selectedPhoneNumber);
  }, [selectedPhoneNumber]);
  const fetchAllAgentData = (crn) => {
    setLoading(true);
    axios
      .get(`http://localhost:9000/AgentInfo?crn=${crn}`)
      .then((response) => {
        console.log(response.data);
        setOriginalAgentData(response.data);
        const phoneNumbers = [...new Set(response.data.map((agent) => agent.phonenumber))];
        setAllPhoneNumbers(phoneNumbers);
        setAgentData(response.data); // Set agentData to all data initially
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching agent data by CRN:', error);
        setLoading(false);
      });
  };

  const filterAgentDataByPhoneNumber = (phoneNumber) => {
    if (phoneNumber === '') {
      return originalAgentData; // Return the original data when no phone number is selected
    } else {
      return originalAgentData.filter((agent) => agent.phonenumber === phoneNumber);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const filteredData = filterAgentDataByPhoneNumber(selectedPhoneNumber);
    setAgentData(filteredData);
  };
  const Update= () => {
    const selectedAgentData = agentData[0]; 
    console.log(selectedAgentData)
    navigate('/AgentUpdate', { state:{agentData: selectedAgentData, crn  } } )
  };

  return (
    <div>
      <Navbar />
      <Container className="Agent">
        <h1>Agent Info Page</h1>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group controlId="phoneNumber">
            <Form.Label>Agent ID</Form.Label>
            <Form.Control
              as="select"
              value={selectedPhoneNumber}
              style={{ width: '200px' }} 
              onChange={(e) => setSelectedPhoneNumber(e.target.value)}
            >
              <option value="">Select Agent Id</option>
              {allPhoneNumbers.map((phoneNumber) => (
                <option key={phoneNumber} value={phoneNumber}>
                  {phoneNumber}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Get Info
          </Button><br></br><br></br>
        </Form>
        <Table striped bordered hover style={{textTransform:'capitalize'}}>
          <thead>
            <tr>
              <th style={{textAlign:'center'}}>Agent Type</th>
              <th style={{textAlign:'center'}}>Agent Name</th>
              <th style={{textAlign:'center'}}>Phone Number</th>
              <th style={{textAlign:'center'}}>Mandal</th>
              <th style={{textAlign:'center'}}>District</th>
              <th style={{textAlign:'center'}}>State</th>
              <th style={{textAlign:'center'}}>Edit</th>
              <th style={{textAlign:'center'}}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8">Loading agent details...</td>
              </tr>
            ) : agentData.length === 0 ? (
              <tr>
                <td colSpan="8">No agent details available.</td>
              </tr>
            ) : (
              agentData.map((agent) => (
                <tr key={agent.id}>
                  <td style={{textAlign:'center'}}>{agent.agentType}</td>
                  <td style={{textAlign:'center'}}>{agent.name}</td>
                  <td style={{textAlign:'center'}}>{agent.phonenumber}</td>
                  <td style={{textAlign:'center'}}>{agent.village}</td>
                  <td style={{textAlign:'center'}}>{agent.district}</td>
                  <td style={{textAlign:'center'}}>{agent.state}</td>
                  <td style={{textAlign:'center'}}>
                  <Button
  variant="info"
  size="sm"
  onClick={Update}
>
  <span role="img" aria-label="Edit">✏️Edit</span>
</Button>

                  </td>
                  <td style={{textAlign:'center'}}>
                    <Button variant="danger" size="sm">
                      <span role="img" aria-label="Delete">❌Delete</span>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}
