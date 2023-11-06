import React, { useState } from 'react';
import axios from 'axios';

function AddSub() {
  const [loadingSublocations, setFrom] = useState('');
  const [unloadingSublocations, setTo] = useState('');
  const [distance, setDistance] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an object with the form data
    const formData = {
      loadingSublocations,
      unloadingSublocations,
      distance,
    };

    try {
      // Send a POST request to your backend using Axios
      const response = await axios.post('http://localhost:9000/addsublocations', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        // Data submitted successfully
        alert('Data submitted');
        console.log('Data submitted successfully');
      } else {
        // Handle submission error
        console.error('Data submission failed');
      }
    } catch (error) {
      // Handle general error
      console.error('An error occurred while submitting data:', error);
    }
    // setFrom('');
    // setTo('');
    setDistance('');

  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Data Submission Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>From:</label>
          <input
            type="text"
            className="form-control"
            value={loadingSublocations}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>To:</label>
          <input
            type="text"
            className="form-control"
            value={unloadingSublocations}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Distance:</label>
          <input
            type="text"
            className="form-control"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddSub;
