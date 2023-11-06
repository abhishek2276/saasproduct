import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './NewDriver.css'; // Import a custom CSS file for styling
import { useLocation } from 'react-router-dom';

export default function NewDriver() {
    const navigate = useNavigate();
    const location = useLocation();

    const [driverName, setDriverName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [licenseFront, setLicenseFront] = useState(null);
    const [licenseBack, setLicenseBack] = useState(null);
    const [licenseIssuedDate, setLicenseIssuedDate] = useState('');
    const [licenseValidityDate, setLicenseValidityDate] = useState('');
    const [aadharFront, setAadharFront] = useState(null);
    const [aadharBack, setAadharBack] = useState(null);
    const [policeVerificationCertificate, setPoliceVerificationCertificate] = useState(null);
    const [healthCertificate, setHealthCertificate] = useState(null);
    const [driverPhoto, setDriverPhoto] = useState(null);
    const [dateOfJoining, setDateOfJoining] = useState('');
    const [crn, setCRN] = useState('');


    React.useEffect(() => {
        if (location.state && location.state.crn) {
            setCRN(location.state.crn);
            console.log('CRN:', location.state.crn);
        }
    }, [location.state]);
    const handleSubmit = (e) => {
        e.preventDefault();

        // Create form data for file uploads
        // Send formData to the backend API using Axios
        axios
            .post('http://localhost:9000/driver', { driverName, phoneNumber, email, licenseFront, licenseBack, licenseIssuedDate, licenseValidityDate, aadharFront, aadharBack, policeVerificationCertificate, healthCertificate, driverPhoto, dateOfJoining, crn })
            .then((response) => {
                console.log(response.data);
                // Handle success, e.g., display a success message or navigate to another page
                navigate('/OwnerInterface', { state: { crn } })
            })
            .catch((error) => {
                console.error(error);
                // Handle error, e.g., display an error message
            });
    };

    return (
        <div>
            <Navbar />
            <div className="container custom-container"> {/* Use a custom CSS class for styling */}
                <h2 style={{ textAlign: 'center' }}>Driver Registration</h2>
                <form onSubmit={handleSubmit}>
                    <div className="shadow p-3 mb-3 bg-white rounded">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label>Driver Name</label>
                                    <input
                                        type="text"
                                        name="driverName"
                                        value={driverName}
                                        onChange={(e) => setDriverName(e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Driver Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label>Driver Mobile Number</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Driver License Front Side</label>
                                    <input
                                        type="file"
                                        name="licenseFront"
                                        onChange={(e) => setLicenseFront(e.target.value)}
                                        className="form-control-file"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label>Driver License Back Side</label>
                                    <input
                                        type="file"
                                        name="licenseBack"
                                        onChange={(e) => setLicenseBack(e.target.value)}
                                        className="form-control-file"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>License Issued Date</label>
                                    <input
                                        type="date"
                                        name="licenseIssuedDate" style={{textTransform:'uppercase'}}
                                        value={licenseIssuedDate}
                                        onChange={(e) => setLicenseIssuedDate(e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label>License Validity Date</label>
                                    <input
                                        type="date"
                                        name="licenseValidityDate"style={{textTransform:'uppercase'}}
                                        value={licenseValidityDate}
                                        onChange={(e) => setLicenseValidityDate(e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Driver Aadhar Front Side</label>
                                    <input
                                        type="file"
                                        name="aadharFront"
                                        onChange={(e) => setAadharFront(e.target.value)}
                                        className="form-control-file"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label>Driver Aadhar Back Side</label>
                                    <input
                                        type="file"
                                        name="aadharBack"
                                        onChange={(e) => setAadharBack(e.target.value)}
                                        className="form-control-file"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Police Verification Certificate</label>
                                    <input
                                        type="file"
                                        name="policeVerificationCertificate"
                                        onChange={(e) => setPoliceVerificationCertificate(e.target.value)}
                                        className="form-control-file"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label>Health Certificate</label>
                                    <input
                                        type="file"
                                        name="healthCertificate"
                                        onChange={(e) => setHealthCertificate(e.target.value)}
                                        className="form-control-file"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Driver Photo</label>
                                    <input
                                        type="file"
                                        name="driverPhoto"
                                        onChange={(e) => setDriverPhoto(e.target.value)}
                                        className="form-control-file"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                        <div className="mb-3">
                            <label>Date of Joining</label>
                            <input
                                type="date"
                                name="dateOfJoining"style={{textTransform:'uppercase'}}
                                value={dateOfJoining}
                                onChange={(e) => setDateOfJoining(e.target.value)}
                                className="form-control"
                                required
                            />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-1">
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
}
