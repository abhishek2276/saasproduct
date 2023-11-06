import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

import './NewTruck.css';

export default function NewTruck() {
  const navigate = useNavigate();
  const location = useLocation();

  const [truckNumber, setTruckNumber] = useState('');
  const [truckMaxWeight, setTruckMaxWeight] = useState('');
  const [truckWheels, setTruckWheels] = useState('');
  const [truckImages, setTruckImages] = useState({
    uploadRegistration:null,
    truckFrontSideWithNumberPlate: null,
    truckBackSideWithNumberPlate: null,
    truckCabin: null,
    rightside:null,
    leftside:null,
    truckOdometer: null,
    truckVideo: null,
    truckPermit: null,
    truckFit: null,
    truckPollutionCertificate: null,
    truckInsuranceCertificate: null,
    truckOwnerPassportSizePhoto: null,
  });
  const [truckPermitValidity, setTruckPermitValidity] = useState('');
  const [truckFitValidity, setTruckFitValidity] = useState('');
  const [truckPollutionCertificateValidity, setTruckPollutionCertificateValidity] = useState('');
  const [truckInsuranceCertificateValidity, setTruckInsuranceCertificateValidity] = useState('');
  const [crn, setCRN] = useState('');
  const [name,setName]=useState(null);

  const [errors, setErrors] = useState({
    truckNumber: '',
  });

  const validateFileSize = (file, maxSizeInBytes) => {
    if (file && file.size > maxSizeInBytes) {
      return `File size should not exceed ${maxSizeInBytes / (1024 * 1024)} MB.`;
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!truckNumber) {
      newErrors.truckNumber = 'Please enter the truck number.';
    }

    // Validate file sizes
    const maxSize = 15 * 1024 * 1024; // 15MB

    for (const key in truckImages) {
      if (truckImages[key]) {
        const errorMessage = validateFileSize(truckImages[key], maxSize);
        if (errorMessage) {
          newErrors[key] = errorMessage;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    // Log the CRN for verification
    if (location.state && location.state.crn && location.state.name) {
      setCRN(location.state.crn);

      setName(location.state.name)
      console.log('CRN:', location.state.crn);
      console.log('name',location.state.name);
      // ... Rest of your component logic
    }
  }, [location.state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    const currentDate = new Date().toLocaleDateString();
    formData.append('truckNumber', truckNumber);
    formData.append('truckMaxWeight', truckMaxWeight);
    formData.append('truckWheels', truckWheels);
    for (const key in truckImages) {
      if (truckImages[key]) {
        formData.append(key, truckImages[key]);
      }
    }
    formData.append('truckPermitValidity', truckPermitValidity);
    formData.append('truckFitValidity', truckFitValidity);
    formData.append('truckPollutionCertificateValidity', truckPollutionCertificateValidity);
    formData.append('truckInsuranceCertificateValidity', truckInsuranceCertificateValidity);
    formData.append('crn', crn);
    formData.append('date', currentDate); 
    formData.append('name', name);


    axios
      .post('http://localhost:9000/truck', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for sending files
        },
      })
      .then((response) => {
        console.log(response.data);
        alert('Your request is in process. Kindly check in agent info!');
        navigate('/OwnerInterface', { state: { crn } });
        // Handle success, e.g., display a success message
      })
      .catch((error) => {
        console.error(error);
        // Handle error, e.g., display an error message
      });

    // Reset form fields
    setTruckNumber('');
    setTruckMaxWeight('');
    // ... Clear other fields
  };

  return (
    <div>
      <Navbar />
      <div className="hello-2">
        <div className="hii-2">
          <center>
            <h1>Truck Registration</h1>
          </center>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="grid-container-2">
              <div>
                <label htmlFor="truckNumber">1. Truck Number</label>
                <input
                  type="text"
                  id="truckNumber"
                  name="truckNumber"className="form-control"
                  value={truckNumber}
                  onChange={(e) => setTruckNumber(e.target.value)}
                  placeholder="Enter Truck Number"
                  required
                  maxLength="10"
                />
                {errors.truckNumber && <span className="error">{errors.truckNumber}</span>}
              </div>
              <div>
                <label htmlFor="maxWeight">2. Truck Max Weight</label>
                <input
                  type="number"
                  id="maxWeight"className="form-control"
                  name="maxWeight"
                  value={truckMaxWeight}
                  onChange={(e) => setTruckMaxWeight(e.target.value)}
                  placeholder="Enter Truck Max Weight"
                  required
                />
              </div>
              <div>
                <label htmlFor="wheelsAxles">3. Truck Wheels - Axles</label>
                <select
                  id="wheelsAxles"
                  name="wheelsAxles"className="form-control"
                  value={truckWheels}
                  onChange={(e) => setTruckWheels(e.target.value)}
                  required
                >
                  <option value="">- Choose Wheels -</option>
                  <option value="4 Wheels - 2 Axles">4 Wheels - 2 Axles</option>
                  <option value="6 Wheels - 2 Axles">6 Wheels - 2 Axles</option>
                  <option value="10 Wheels - 3 Axles">10 Wheels - 3 Axles</option>
                  <option value="12 Wheels - 4 Axles">12 Wheels - 4 Axles</option>
                  <option value="14 Wheels - 5 Axles">14 Wheels - 5 Axles</option>
                  <option value="16 Wheels - 5 Axles">16 Wheels - 5 Axles</option>
                </select>
              </div>
              <div>
  <label htmlFor="registrationCertificate">
    4. Upload Registration Certificate
  </label>
  <input
    type="file"
    id="registrationCertificate"
    name="registrationCertificate"className="form-control"
    accept=".pdf, .jpg, .jpeg, .png"
    onChange={(e) => setTruckImages({ ...truckImages, uploadRegistration: e.target.files[0] })}
    required
  />
  {errors['registrationCertificate'] && (
    <span className="error">{errors['registrationCertificate']}</span>
  )}
</div>
<h3>Truck Photos</h3><br></br><br></br>
              <div>
  <label htmlFor="frontSideWithNumberPlate">5. Truck Front Side With Number Plate</label>
  <input
    type="file"
    id="frontSideWithNumberPlate"
    name="frontSideWithNumberPlate"className="form-control"
    accept=".jpg, .jpeg, .png"
    onChange={(e) => setTruckImages({ ...truckImages, truckFrontSideWithNumberPlate: e.target.files[0] })}
    required
  />
  {errors['truckFrontSideWithNumberPlate'] && (
    <span className="error">{errors['truckFrontSideWithNumberPlate']}</span>
  )}
</div>
<div>
  <label htmlFor="frontSideWithNumberPlate">6. Truck Right Side</label>
  <input
    type="file"
    id="rightside"
    name="rightside"className="form-control"
    accept=".jpg, .jpeg, .png"
    onChange={(e) => setTruckImages({ ...truckImages, rightside: e.target.files[0] })}
    required
  />
  {errors['truckFrontSideWithNumberPlate'] && (
    <span className="error">{errors['truckFrontSideWithNumberPlate']}</span>
  )}
</div>

{/* Add more file input fields for other images here */}
<div>
  <label htmlFor="backSideWithNumberPlate">7. Truck Back Side With Number Plate</label>
  <input
    type="file"
    id="backSideWithNumberPlate"className="form-control"
    name="backSideWithNumberPlate"
    accept=".jpg, .jpeg, .png"
    onChange={(e) => setTruckImages({ ...truckImages, truckBackSideWithNumberPlate: e.target.files[0] })}
    required
  />
  {errors['truckBackSideWithNumberPlate'] && (
    <span className="error">{errors['truckBackSideWithNumberPlate']}</span>
  )}
</div>
<div>
  <label htmlFor="backSideWithNumberPlate">8. Truck Left Side</label>
  <input
    type="file"
    id="leftside"className="form-control"
    name="leftside"
    accept=".jpg, .jpeg, .png"
    onChange={(e) => setTruckImages({ ...truckImages, leftside: e.target.files[0] })}
    required
  />
  {errors['truckBackSideWithNumberPlate'] && (
    <span className="error">{errors['truckBackSideWithNumberPlate']}</span>
  )}
</div>
<div>
  <label htmlFor="cabin">9. Truck Cabin</label>
  <input
    type="file"
    id="cabin"className="form-control"
    name="cabin"
    accept=".jpg, .jpeg, .png"
    onChange={(e) => setTruckImages({ ...truckImages, truckCabin: e.target.files[0] })}
    required
  />
  {errors['truckCabin'] && <span className="error">{errors['truckCabin']}</span>}
</div>
<div>
  <label htmlFor="odometer">10. Truck Odometer</label>
  <input
    type="file"
    id="odometer"className="form-control"
    name="odometer"
    accept=".jpg, .jpeg, .png"
    onChange={(e) => setTruckImages({ ...truckImages, truckOdometer: e.target.files[0] })}
    required
  />
  {errors['truckOdometer'] && <span className="error">{errors['truckOdometer']}</span>}
</div>
<div>
  <label htmlFor="video">11. Truck Video</label>
  <input
    type="file"
    id="video"
    name="video"className="form-control"
    accept=".mp4, .avi, .mkv"
    onChange={(e) => setTruckImages({ ...truckImages, truckVideo: e.target.files[0] })}
    required
  />
  {errors['truckVideo'] && <span className="error">{errors['truckVideo']}</span>}
</div>
<div>
  <label htmlFor="permitCertificate">12. Truck Permit Certificate</label>
  <input
    type="file"
    id="permitCertificate"className="form-control"
    name="permitCertificate"
    accept=".pdf, .jpg, .jpeg, .png"
    onChange={(e) => setTruckImages({ ...truckImages, truckPermit: e.target.files[0] })}
    required
  />
  {errors['truckPermit'] && <span className="error">{errors['truckPermit']}</span>}
</div>
<div>
  <label htmlFor="permitCertificateValidity">13. Truck Permit Certificate Validity</label>
  <input
    type="date"
    id="permitCertificateValidity"className="form-control"
    name="permitCertificateValidity"
    style={{ textTransform: 'uppercase' }}
    value={truckPermitValidity}
    onChange={(e) => setTruckPermitValidity(e.target.value)}
    required
  />
</div>
<div>
  <label htmlFor="fitnessCertificate">14. Truck Fitness Certificate</label>
  <input
    type="file"
    id="fitnessCertificate"
    name="fitnessCertificate"className="form-control"
    accept=".pdf, .jpg, .jpeg, .png"
    onChange={(e) => setTruckImages({ ...truckImages, truckFit: e.target.files[0] })}
    required
  />
  {errors['truckFit'] && <span className="error">{errors['truckFit']}</span>}
</div>
<div>
  <label htmlFor="fitnessCertificateValidity">15. Truck Fitness Certificate Validity</label>
  <input
    type="date"
    id="fitnessCertificateValidity"
    name="fitnessCertificateValidity"className="form-control"
    style={{ textTransform: 'uppercase' }}
    value={truckFitValidity}
    onChange={(e) => setTruckFitValidity(e.target.value)}
    required
  />
</div>
<div>
  <label htmlFor="pollutionCertificate">16. Truck Pollution Certificate</label>
  <input
    type="file"
    id="pollutionCertificate"className="form-control"
    name="pollutionCertificate"
    accept=".pdf, .jpg, .jpeg, .png"
    onChange={(e) => setTruckImages({ ...truckImages, truckPollutionCertificate: e.target.files[0] })}
    required
  />
  {errors['truckPollutionCertificate'] && <span className="error">{errors['truckPollutionCertificate']}</span>}
</div>
<div>
  <label htmlFor="pollutionCertificateValidity">17. Truck Pollution Certificate Validity</label>
  <input
    type="date"
    id="pollutionCertificateValidity"className="form-control"
    name="pollutionCertificateValidity"
    style={{ textTransform: 'uppercase' }}
    value={truckPollutionCertificateValidity}
    onChange={(e) => setTruckPollutionCertificateValidity(e.target.value)}
    required
  />
</div>
<div>
  <label htmlFor="insuranceCertificate">18. Truck Insurance Certificate</label>
  <input
    type="file"
    id="insuranceCertificate"
    name="insuranceCertificate"className="form-control"
    accept=".pdf, .jpg, .jpeg, .png"
    onChange={(e) => setTruckImages({ ...truckImages, truckInsuranceCertificate: e.target.files[0] })}
    required
  />
  {errors['truckInsuranceCertificate'] && <span className="error">{errors['truckInsuranceCertificate']}</span>}
</div>
<div>
  <label htmlFor="insuranceCertificateValidity">19. Truck Insurance Certificate Validity</label>
  <input
    type="date"
    id="insuranceCertificateValidity"
    name="insuranceCertificateValidity"className="form-control"
    style={{ textTransform: 'uppercase' }}
    value={truckInsuranceCertificateValidity}
    onChange={(e) => setTruckInsuranceCertificateValidity(e.target.value)}
    required
  />
</div>
<div>
  <label htmlFor="ownerPhoto">20. Truck Owner Passport Size Photo</label>
  <input
    type="file"
    id="ownerPhoto"
    name="ownerPhoto"
    accept=".jpg, .jpeg, .png"className="form-control"
    onChange={(e) => setTruckImages({ ...truckImages, truckOwnerPassportSizePhoto: e.target.files[0] })}
    required
  />
  {errors['truckOwnerPassportSizePhoto'] && (
    <span className="error">{errors['truckOwnerPassportSizePhoto']}</span>
  )}
</div>
</div>
            <div className="flex1">
              <button type="submit" className='btn btn-primary'>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
