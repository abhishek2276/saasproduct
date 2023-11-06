import React, { useState,useEffect } from 'react';
import axios from 'axios';
import './AgentBooknow.css'; // Create a CSS file for styling
import AgentNavbar from './AgentNavbar';
import Modal from 'react-modal'; 
import { useLocation , useNavigate } from 'react-router-dom';
export default function AgentBookNow() {
    const [formData, setFormData] = useState({
        registrationNumber: '',
        wheels: '',
        maxWeight: '',
        fromLocation: '',
        fromSublocation: '',
        fromAddress: '',
        fromPincode: '',
        toLocation: '',
        toSublocation: '',
        toAddress: '',
        toPincode: '',
        type: '',
    });

    const [totalKilometers, setTotalKilometers] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0); // Manually set initial total price to 0
    const [totalPrice1, setTotalPrice1] = useState(0); // Manually set initial total price to 0

    const [isModalOpen, setIsModalOpen] = useState(false); 
    const location = useLocation();
    const navigate = useNavigate();
    
    const { truckData,agentType,name,agentId,phonenumber,crn } = location.state || {};
    console.log(truckData);
    console.log(crn)
    console.log(phonenumber)
    const {
        date,
        from,
        time,
        to,
        truckMaxWeight,
        truckNumber,
        truckWheels,
        loadingSublocations,
        unloadingSublocations,
      } = truckData;
      
    useEffect(() => {
        // Calculate total kilometers when sublocations change
        const calculateTotalKilometers = async () => {
          try {
            const response = await axios.get('http://localhost:9000/sub', {
              params: {
                loadingSublocations: formData.fromSublocation,
                unloadingSublocations: formData.toSublocation,
              },
            });
      
            if (response.status === 200) {
              const { distance } = response.data[0];
              setTotalKilometers(distance);
              console.log(response.data)
            } else {
              // Handle error response from the server
              console.error('Error fetching sublocation distances');
            }
          } catch (error) {
            // Handle network or other errors
            console.error('An error occurred while fetching sublocation distances:', error);
          }
        };
      
        calculateTotalKilometers();
      }, [formData.fromSublocation, formData.toSublocation]);
    useEffect(() => {
        // Calculate total price when totalKilometers or pricePerKilometer change
        const calculateTotalPrice = () => {
          const totalPrice = totalKilometers * 200;
          setTotalPrice(totalPrice);
          const totalPrice1 = totalKilometers * 210 ;
          setTotalPrice1(totalPrice1);
        };
        calculateTotalPrice();
      }, [totalKilometers]);
      const openModal = () => {
        setIsModalOpen(true);
      };
      
      // Function to close the modal
      const closeModal = () => {
        setIsModalOpen(false);
      };
      const handleBookNowClick = async () => {
        if (agentType === 'postpaid') {
          // Send data to the backend server
           await sendDataToBackend();
           deleteBookedTruck(truckNumber);
        } else if (agentType === 'prepaid') {
          // Navigate to the payment interface for prepaid agent
          console.log('prepaid agent');
          navigate('/PaymentInterface');
        } else {
          // Handle other agent types if needed
        }
      };
      const deleteBookedTruck = async (truckNumber) => {
        try {
          // Send a DELETE request to the backend to delete the booked truck
          await axios.delete(`http://localhost:9000/deltruck/${truckNumber}`);
          // Redirect to the AgentInterface page after successful deletion
          navigate('/AgentBooking',);
        } catch (error) {
          console.error('An error occurred while deleting the truck:', error);
        }
      };
      const sendDataToBackend = async () => {
        // Create a data object to send to the server
        const bookingData = {
         truckNumber,
          truckWheels,
          truckMaxWeight,
          fromSublocation: formData.fromSublocation,
          toSublocation: formData.toSublocation,
          date,
          from,
          time,
          to,
          fromPincode: formData.fromPincode,
          toPincode: formData.toPincode,
          totalKilometers,
          totalPrice:totalPrice1,
          name,
phonenumber,
agentId,
crn,
type:formData.type,
          fromAddress: formData.fromAddress,
          toAddress: formData.toAddress,
        };
    
        try {
          // Send a POST request with the booking data to your backend server
          const response = await axios.post('http://localhost:9000/book', bookingData);
    
          if (response.status === 200) {
            alert('Booking confirmed!'); // Show a success message to the user
            navigate('/AgentBooking',{state :{crn:crn,phonenumber:phonenumber}}); 
            console.log(crn,phonenumber)// Navigate to a success page or the homepage
          } else {
            console.error('Error confirming booking');
          }
        } catch (error) {
          console.error('An error occurred while confirming booking:', error);
        }
      };
    
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    
    
    const fromSublocations = loadingSublocations ? loadingSublocations.split(', ') : [];
const toSublocations = unloadingSublocations ? unloadingSublocations.split(', ') : [];

    function formatTruckNumber(truckNumber) {
      if (truckNumber && truckNumber.length >= 6) {
        const hiddenPart = '*'.repeat(6); // Create a string of 6 asterisks
        const visiblePart = truckNumber.slice(6); // Get the remaining characters
        return hiddenPart + visiblePart; // Combine the hidden and visible parts
      }
      return truckNumber; // Return the original truck number if it's shorter than 6 characters
    }
    return (
        <div>
        <AgentNavbar/>
        <div className="container"style={{minHeight:'100vh'}}>
            <div className="row">
                {/* Left Side (Form) */}
                <div className="col-lg-8">
                   <center> <h2>Book Now</h2></center>
                    <form >
                        <div className="form-group">

                            <p>Registration Number:{formatTruckNumber(truckNumber)}</p>
                            <p>Wheels - Axles:  {truckWheels}</p>
                            <p>Max Weight:  {truckMaxWeight} Tons</p>
                        </div>



                        <div className="grid-container-1">
                        <div> <label htmlFor="text">1.Date :</label>
<b> {date}</b>
                               </div>
                            <div> <label htmlFor="text">2.Time :</label>
                        <b> {time}</b>
                               </div>
                            <div> <label htmlFor="text">3.From :</label>
<b> {from}</b>
                               </div>
                            <div> <label htmlFor="text">4.To :</label>
                            <b> {to}</b>
                               </div>
                            <div><label>5.From Sublocation:</label>
                            <select
                                        name="fromSublocation"
                                        onChange={handleFormChange}
                                        required
                                    >
                                        <option value="">Select Sublocation</option>
                                        {fromSublocations.map((sublocation, index) => (
                                            <option key={index} value={sublocation}>
                                                {sublocation}
                                            </option>
                                        ))}
                                    </select></div>
                            <div><label>6.To Sublocation:</label>
                            <select
                                        name="toSublocation"
                                        onChange={handleFormChange}
                                        required
                                    >
                                        <option value="">Select Sublocation</option>
                                        {toSublocations.map((sublocation, index) => (
                                            <option key={index} value={sublocation}>
                                                {sublocation}
                                            </option>
                                        ))}
                                    </select></div>
                            <div><label htmlFor="text">7.From Address:</label>
                                <input type="text" placeholder="Enter Address"  onChange={handleFormChange}  name="fromAddress"  required /></div>
                            <div> <label htmlFor="text">8.To Address:</label>
                                <input type="text" placeholder="Enter Address"  onChange={handleFormChange} name="toAddress" required /></div>


                            <div> <label htmlFor="text">9.From Pincode:</label>
                                <input type="text" maxLength={6} minLength={6} placeholder="Enter Pincode"  onChange={handleFormChange} name="fromPincode" required /></div>

                            <div> <label htmlFor="text">10.To Pincode:</label>
                                <input type="text" maxLength={6} minLength={6} placeholder="Enter Pincode"  onChange={handleFormChange} name="toPincode" required /></div>
                                <div>
                  <label htmlFor="text">11.Type Of Material:</label>
                  <select
                    name="type"
                    onChange={handleFormChange}                    required
                  >
                    <option value="">Select Option </option>
                    <option value="iron">Iron</option>
                    <option value="cotton">Cotton</option>
                    <option value="woods">Woods</option>
                    <option value="others">Others</option>
                  </select>
                </div>

</div>
                    </form>
</div>
                    {/* Right Side (Pricing) */}
                    <div className="col-lg-4">
                        <h2>Pricing</h2>
                        <div className="pricing-details">
                        <p>Price per Kilometer: {200}/-</p>
          <p>Total Kilometers: {totalKilometers} km</p>
          <p> Price: {totalPrice.toFixed(2)}/-</p>
                        </div>
                        <br></br>
                        <button type='submit' className='btn btn-warning'  onClick={openModal}>Book Now</button>

                    </div>
                    
               
            </div>
        </div>
        <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Booking Details"
        className="modal-content" // Style this class
        overlayClassName="modal-overlay" // Style this class
      >
        {/* Display the filled details */}
        <div>
          <h2>Booking Details</h2>
          {/* Display the details here */}
          <p>Registration Number: {truckNumber}</p>
          <p>Wheels - Axles: {truckWheels}</p>
          <p>Max Weight: {truckMaxWeight} Tons</p>
          <p>Date: {date}</p>
          <p>Time: {time}</p>
          <p>From: {from}</p>
          <p>To: {to}</p>
          <p>From Sublocation: {formData.fromSublocation}</p>
          <p>To Sublocation: {formData.toSublocation}</p>
          <p>Type of Material: {formData.type}</p>
          <p>From Address: {formData.fromAddress}</p>

          <p>To Address: {formData.toAddress}</p>
          <p>From Pincode: {formData.fromPincode}</p>
          <p>To Pincode: {formData.toPincode}</p>
          <p>Total Kilometers: {totalKilometers} km</p>
          <p>Total Price: {totalPrice1.toFixed(2)}/-</p>
          <p className='op'>*Total price includes taxes</p>
        </div>

        {/* Buttons to confirm or cancel */}
        <div>
          <button onClick={handleBookNowClick}>Confirm</button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </Modal>
        </div>
    );
}
