import React, { useState, useEffect } from "react";
import "./OwnerBooking.css"; // Import your CSS file here
import axios from "axios"; // Import your CSS file here
import Navbar from "./Navbar";
import jsPDF from "jspdf";
import { useLocation,useNavigate } from 'react-router-dom';


function OwnerBooking() {
  const location = useLocation();
const navigate=useNavigate();
  const [activeContent, setActiveContent] = useState("MyTruckPostings");
  const [data, setData] = useState([]);
  const [from, setFrom] = useState(""); // State to store the "From Date"
  const [to, setTo] = useState("");
  const [selectedRegistrationNumber, setSelectedRegistrationNumber] = useState("");
  const [truckData, setTruckData] = useState([]);
  const [registrationNumbers, setRegistrationNumbers] = useState([]);
  // const [crn, setCRN] = useState('');
  const [tbr, setTBR] = useState('');
  const [bookings, setBookings] = useState([]);
  const displayContent = (contentId) => {
    setActiveContent(contentId);
  };
  const crn = sessionStorage.getItem('userCRN');
  console.log(crn)

  useEffect(() => {
    // Fetch registration numbers from your backend API and set them in registrationNumbers state
    async function fetchRegistrationNumbers() {
      try {
        const response = await axios.get("http://localhost:9000/truckNumber2", {
          params: {
            crn: crn, // Pass the CRN as a query parameter
          },
        });
        const registrationNumbersData = response.data;
        setRegistrationNumbers(registrationNumbersData);
      } catch (error) {
        console.error("Error fetching registration numbers:", error);
      }
    }

    fetchRegistrationNumbers();
  }, [crn]); 
  const handleRepost= () => {
    navigate('/TruckPosting', { state: { crn } })
  };
  const fetchDataByDateRange = async () => {
    try {
      console.log(`Fetching data for date range: from ${from} to ${to}`);
      const response = await axios.get('http://localhost:9000/PostDate', {

        params: {
          from,
          to,
          crn,
        },
      });

      const fetchedData = response.data;
      console.log('Fetched Data:', fetchedData);
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors
    }
  };
    const [truckPostings, setTruckPostings] = useState([]);
    useEffect(() => {
      // Fetch only the last 7 days posted trucks from the backend when the component mounts
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
      axios
        .get("http://localhost:9000/Post", {
          params: {
            date: sevenDaysAgo.toISOString().split("T")[0], // Convert to YYYY-MM-DD format
          },
        })
        .then((response) => {
          setTruckPostings(response.data);
        })
        .catch((error) => {
          console.error("Error fetching last 7 days truck postings:", error);
        });
    }, []);
    // useEffect(() => {
    //   if (location.state && location.state.crn) {
    //     setCRN(location.state.crn);
    //     console.log('CRN:', location.state.crn);
    //   }
    // }, [location.state]);  
    useEffect(() => {
      if (crn) {
        fetchTruckPostingsByCRN(crn);
      }
    }, [crn]);
    const fetchTruckPostingsByCRN = async (crn) => {
      try {
        const response = await axios.get('http://localhost:9000/Post', {
          params: {
            crn,
          },
        });
  
        const fetchedTruckPostings = response.data;
        console.log('Fetched Truck Postings:', fetchedTruckPostings);
        setTruckPostings(fetchedTruckPostings);
      } catch (error) {
        console.error('Error fetching truck postings:', error);
      }
    };
    useEffect(() => {
      // Fetch bookings data from the backend when the component mounts
      axios.get(`http://localhost:9000/booking/${crn}`)
        .then((response) => {
          setBookings(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error fetching bookings:', error);
        });
    },[crn]);
  
    const handleCancelPosting = (id, date, time) => {
      // Check if an agent is booked for this truck posting
      const booking = bookings.find(
        (booking) =>
          booking.truckNumber === selectedRegistrationNumber &&
          booking.date === date &&
          booking.time === time
      );
    
      if (booking) {
        console.log(
          `Booking found for truck ${selectedRegistrationNumber}, booking agent: ${booking.name}`
        );
        // Set the booking status as "Booking Completed"
        const updatedTruckPostings = truckPostings.map((posting) => {
          if (posting.id === id) {
            posting.status = "Booking Completed";
          }
          return posting;
        });
        setTruckPostings(updatedTruckPostings);
      } else {
        // Delete the truck posting if no booking found
        axios
          .delete(`http://localhost:9000/post/${id}`)
          .then(() => {
            // Remove the deleted posting from the local state
            setTruckPostings(truckPostings.filter((posting) => posting.id !== id));
          })
          .catch((error) => {
            console.error("Error deleting truck posting:", error);
          });
    
        axios
          .delete(`http://localhost:9000/post1/${id}`)
          .then(() => {
            console.log("Truck posting deleted from post1 table.");
          })
          .catch((error) => {
            console.error("Error deleting truck posting from post1:", error);
          });
      }
    };
    
    const fetchDataByTBR = async () => {
      try {
        console.log(`Fetching data for TBR number: ${tbr}`);
        const response = await axios.get('http://localhost:9000/tbr', {
          params: {
            tbr,
            crn,
          },
        });
  
        const fetchedData = response.data;
        console.log('Fetched Data:', fetchedData);
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

  const fetchTruckByRegistration = async () => {
    try {
      console.log(`Fetching truck data for registration number: ${selectedRegistrationNumber}`);
      const response = await axios.get('http://localhost:9000/PostTruck', {
        params: {
          truckNumber: selectedRegistrationNumber,
          crn: crn,

        },
      });

      const fetchedData = response.data;
      console.log('Fetched Truck Data:', fetchedData);
      setTruckData(fetchedData);
    } catch (error) {
      console.error('Error fetching truck data:', error);
    }
  };
  const isPrintButtonDisabled = (booking) => {
    return !booking || booking.status !== "active";
  };

  const generatePDF = (booking) => {
    if (isPrintButtonDisabled(booking)) {
      console.log("Print button is disabled.");
      return;
    }
    const doc = new jsPDF({
      orientation: 'p', // 'p' for portrait, 'l' for landscape
      unit: 'mm',
      format: 'a4', // or your desired page format
    });
    const topMargin = 9; // Adjust the margin as needed
  
    // Calculate the center of the page horizontally
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;
  
    // Calculate the top position for the heading
    let topPosition = topMargin;
  
    // Add content to the PDF
    doc.setFontSize(16); // Adjust the font size as needed
    doc.text('GRCTOB', centerX, topPosition, { align: 'center' });
    
    // Increase the topPosition for the next element
    topPosition += 10;
  
    doc.setFontSize(12);
    doc.text(`Agent Name: ${booking.name}`, 15, topPosition);
    topPosition += 10;
    doc.text(`Agent ID: ${booking.agentId}`, 15, topPosition);
    topPosition += 10;
    doc.text(`Agent Phone Number: ${booking.phonenumber}`, 15, topPosition);
    topPosition += 10;
  
    doc.text(`From Location: ${booking.from}`, 15, topPosition);
    topPosition += 10;
  
    doc.text(`Loading Sublocation: ${booking.fromSublocation}`, 15, topPosition);
    topPosition += 10;
  
    doc.text(`Loading Address: ${booking.fromAddress}`, 15, topPosition);
    topPosition += 10;
  
    doc.text(`Loading Pincode: ${booking.fromPincode}`, 15, topPosition);
    topPosition += 15; // Increase spacing for the table
  
    // Add a table for sno, truck number, kilometers, max weight, and price
    const tableData = [];
    tableData.push(["S.No", "Truck Number", "Date ","TBR", "Material", "Price"]);
    // Add your data to the table here (replace the example data)
    tableData.push(["1", booking.truckNumber, booking.date, booking.tbr,booking.type, booking.totalPrice]);
  
    doc.autoTable({
      startY: topPosition,
      head: tableData.slice(0, 1),
      body: tableData.slice(1),
      margin: { top: 70 },
    });
  
    // Increase the topPosition for the next element after the table
    topPosition = doc.autoTable.previous.finalY + 15;
  
    doc.text(`To Location: ${booking.to}`, 15, topPosition);
    topPosition += 10;
  
    doc.text(`Unloading Sublocation: ${booking.toSublocation}`, 15, topPosition);
    topPosition += 10;
  
    doc.text(`Unloading Address: ${booking.toAddress}`, 15, topPosition);
    topPosition += 10;
  
    doc.text(`Unloading Pincode: ${booking.toPincode}`, 15, topPosition);
    topPosition += 10;
    doc.text(`Distance: ${booking.totalKilometers} KMs`, 15, topPosition);
    topPosition += 10; 
    doc.text(`Truck-Max Weight: ${booking.truckMaxWeight} Tons`, 15, topPosition);
    topPosition += 10;
  
    // Save the PDF or open in a new tab
    doc.save(`Booking_${booking.id}.pdf`);
  };    // Save the PDF or open in a new tab
  const generatePDF1 = (booking) => {
    if (isPrintButtonDisabled(booking)) {
      console.log("Print button is disabled.");
      return;
    }
    const doc = new jsPDF({
      orientation: 'p', // 'p' for portrait, 'l' for landscape
      unit: 'mm',
      format: 'a4', // or your desired page format
    });
    const topMargin = 9; // Adjust the margin as needed
  
    // Calculate the center of the page horizontally
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;
  
    // Calculate the top position for the heading
    let topPosition = topMargin;
    doc.setFont("fontName", "fontStyle"); // Replace "fontName" and "fontStyle" with your desired values

    // Add content to the PDF
    doc.setFontSize(16); // Adjust the font size as needed
    doc.setTextColor(0, 51, 102); // Set text color (R, G, B)
    // doc.setFontStyle('bold'); // Set font style to bold
    doc.text('GRCTOB', centerX, topPosition, { align: 'center' });
    doc.setFont("Arial", "normal");
    doc.text('GRCTOB', centerX, topPosition, { align: 'center' });
    
    // Increase the topPosition for the next element
    topPosition += 10;
  
    doc.setFontSize(12);
    doc.text(`TBR Number: ${booking.tbr}`, 15, topPosition);
    topPosition += 10;
    doc.text(`Truck Number: ${booking.truckNumber}`, 15, topPosition);
    topPosition += 10;
    doc.text(`Date Of Booking: ${booking.date}`, 15, topPosition);
    topPosition += 10;

    doc.text(`Agent Name: ${booking.name}`, 15, topPosition);
    topPosition += 10;
    doc.text(`Agent ID: ${booking.agentId}`, 15, topPosition);
    topPosition += 10;
    doc.text(`Agent Phone Number: ${booking.phonenumber}`, 15, topPosition);
    topPosition += 10;
  
    doc.text(`From Location: ${booking.from}`, 15, topPosition);
    topPosition += 10;
  
    doc.text(`Loading Sublocation: ${booking.fromSublocation}`, 15, topPosition);
    topPosition += 10;
  
    doc.text(`Loading Address: ${booking.fromAddress}`, 15, topPosition);
    topPosition += 10;
  
    doc.text(`Loading Pincode: ${booking.fromPincode}`, 15, topPosition);
    topPosition += 15; // Increase spacing for the table
  
    // Add a table for sno, truck number, kilometers, max weight, and price
    
  
    doc.text(`To Location: ${booking.to}`, 15, topPosition);
    topPosition += 10;
  
    doc.text(`Unloading Sublocation: ${booking.toSublocation}`, 15, topPosition);
    topPosition += 10;
  
    doc.text(`Unloading Address: ${booking.toAddress}`, 15, topPosition);
    topPosition += 10;
  
    doc.text(`Unloading Pincode: ${booking.toPincode}`, 15, topPosition);
    topPosition += 10;
    doc.text(`Distance: ${booking.totalKilometers} KMs`, 15, topPosition);
    topPosition += 10; 
    doc.text(`Truck-Max Weight: ${booking.truckMaxWeight} Tons`, 15, topPosition);
    topPosition += 10;
    doc.text(`Booking Price: ${booking.totalPrice}/-`, 15, topPosition);
    topPosition += 10;
  
    // Save the PDF or open in a new tab
    doc.save(`Booking_${booking.id}.pdf`);
  }; 
  return (
    <div className="fo" style={{height:'100%'}}>
      <Navbar />
      <div className="container-fluid" >
        <div className="row">
          <div className="col-md-3 options">
            <h3>1 Manage Bookings</h3>
            <button
              className={`btn btn-primary option-button ${activeContent === "MyTruckPostings" ? "active" : ""
                }`}
              onClick={() => displayContent("MyTruckPostings")}
            >
              <span className="button-number-1 me-3">A </span>My Truck Postings
            </button>
            <button
              className={`btn btn-primary option-button ${activeContent === "searchByVehicleForm" ? "active" : ""
                }`}
              onClick={() => displayContent("searchByVehicleForm")}
            >
              <span className="button-number-1">B</span>Search by Registration No
            </button>
            <button
              className={`btn btn-primary option-button ${activeContent === "searchByDateForm" ? "active" : ""
                }`}
              onClick={() => displayContent("searchByDateForm")}
            >
              <span className="button-number-1">C</span> Search by Date
            </button>
            <button
              className={`btn btn-primary option-button ${activeContent === "invoiceTrackingForm" ? "active" : ""
                }`}
              onClick={() => displayContent("invoiceTrackingForm")}
            >
              <span className="button-number-1">D</span>TBR Number
            </button>
            <button
              className={`btn btn-primary option-button ${activeContent === "trucktrackingform" ? "active" : ""
                }`}
              onClick={() => displayContent("trucktrackingform")}
            >
              <span className="button-number-1">E</span>Invoice Number
            </button>
          </div>
          <div className="col-md-9 content">
          {activeContent === "MyTruckPostings" && (
              <div>
              <center>  <h2 style={{color:"red",textDecoration:'underline'}}>Posted Trucks</h2></center><br></br>
               
                <table className="table" style={{textAlign:'center',textTransform:'capitalize'}}>
        <thead>
          <tr>
            <th>Truck Number</th>
            <th>Date of Posting</th>
            <th>Time</th>
            <th>From </th>
            <th>From Sublocations</th>
            <th>To </th>
            <th>To Sublocations </th>
            <th>Status </th>
            <th>Agent Booked</th>
            <th>Print</th>


          </tr>
        </thead>
        <tbody>
          {truckPostings.map((posting) => {
 const booking = bookings.find(
  (booking) =>
    booking.truckNumber === posting.truckNumber &&
    booking.date === posting.date &&
    booking.time === posting.time
);             console.log(booking)
             return (
          
            <tr key={posting.id}>
              <td>{posting.truckNumber}</td>
              <td>{posting.date.split('-').reverse().join('-')}</td>
              <td>{posting.time}</td>
              <td>{posting.from}</td>

              <td>{posting.loadingSublocations}</td>
              <td>{posting.to}</td>
              <td>{posting.unloadingSublocations}</td>

             
              <td >
              {booking ? (
               booking.status === "active" ? (
                <span style={{ color: 'green', fontSize: '15px', fontWeight: 'bold' }}>
                  Booking Completed
                </span>
              ) : booking.status === "canceled" ? (
                <div>
                <span style={{ color: 'red', fontSize: '15px', fontWeight: 'bold' }}>
                  Booking Cancelled
                </span>
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ maxWidth:'200px' }}
                  onClick={() => handleCancelPosting(posting.id)}
                >
                  Cancel Posting
                </button>
              </div>
                
              ) : (
                <span style={{ color: 'orange', fontSize: '15px', fontWeight: 'bold' }}>
                  Booking In Progress
                </span>
              )
            ) : new Date(posting.date) <= new Date() ? (
              <div>
              <span style={{color:'red',fontWeight:'bold'}}>Truck Expired</span>
              <button
        type="button"
        className="btn btn-primary"
        onClick={() => handleRepost(posting)}
      >
        Repost
      </button></div>
              ) : (
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ maxWidth: "500px" }}
                  onClick={() => handleCancelPosting(posting.id)}
                >
                  Cancel Posting
                </button>
               )}
            </td>
                    
                        
              <td style={{color:"blue",fontSize:'15px', fontWeight: 'bold'}}> {booking ? booking.name : "No agent booked"}</td>
<td> <button
                        type="button"
                        className="btn btn-primary"
                        style={{ maxWidth: "500px" }}
                        disabled={isPrintButtonDisabled(booking)}
                        onClick={() => generatePDF(booking)} // Add this line
                      >
                        Print Booking
                      </button></td>
            </tr>
          );
              })}
        </tbody>
      </table>
              </div>
            )}
            {activeContent === "searchByVehicleForm" && (
  <div>
    <h2>2 Search by Registration Number</h2>
    <form>
    <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
  <label htmlFor="vehicleNo" style={{ marginRight: '1rem' }}>
    Truck Registration Number
  </label>
  <select
    className="form-control mt-2" style={{ maxWidth: '30%' }}
    value={selectedRegistrationNumber}
    onChange={(e) => setSelectedRegistrationNumber(e.target.value)}
  >
    <option value="">- Select -</option>
    {registrationNumbers.map((truckNumber) => (
      <option key={truckNumber} value={truckNumber}>
        {truckNumber}
      </option>
    ))}
  </select>
  <button
    type="button"
    onClick={fetchTruckByRegistration}
    className="btn btn-primary ms-2 p-1"
  >
    Submit
  </button>
</div>
      <br></br><br></br>
    </form>
    {truckData.length === 0 ? (
      <p>No bookings done for this truck number.</p>
    ) : (
      <table className="table" style={{textAlign:'center',textTransform:'capitalize'}} >
        <tr>
          <th>Truck Numbers</th>
          <th>Agent Name</th>
          <th>Booked Date</th>
          <th>From Location</th>
          <th>To Location</th>
          <th>Booking Status</th>
          <th>Payment Status</th>
        </tr>
        <tbody>
          {truckData.map((truck) => (
            <tr key={truck.id}>
              <td>{truck.truckNumber}</td>
              <td>{truck.name}</td>
              <td>{truck.date.split('-').reverse().join('-')}</td>
              <td>{truck.from}</td>
              <td>{truck.to}</td>
              <td>
                {truck.status === "active" ? (
                  <span style={{ color: 'green', fontSize: '15px', fontWeight: 'bold' }}>
                    Booking Completed
                  </span>
                ) : truck.status === "canceled" ? (
                  <span style={{ color: 'red', fontSize: '15px', fontWeight: 'bold' }}>
                    Booking Cancelled
                  </span>
                ) : (
                  <span style={{ color: 'orange', fontSize: '15px', fontWeight: 'bold' }}>
                    Booking In Progress
                  </span>
                )}
              </td>
              <td>
                {truck.paymentStatus === "PaymentPending" && truck.status === "active" ? (
                  <span style={{ color: 'orange', fontSize: '15px', fontWeight: 'bold' }}>
                    Pending Payment
                  </span>
                ) : truck.paymentStatus === "payment completed" ? (
                  <span style={{ color: 'green', fontSize: '15px', fontWeight: 'bold' }}>
                    Payment Completed
                  </span>
                ) : (
                  <span style={{ color: 'red', fontSize: '15px', fontWeight: 'bold' }}>
                    Booking Cancelled
                  </span>
                )}
              </td>
              {/* Other columns here */}
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}

            {activeContent === "searchByDateForm" && (
              <div>
                <h2>3 Search by Date</h2>
                <div >
                  <div className="form-group">
                    <label htmlFor="fromDate">From Date</label>
                    <input
                      type="date"
                      id="fromDate" 
                      name="fromDate"
                      className="form-control"
                      style={{ maxWidth: '200px', marginLeft: '10px',textTransform:'uppercase' }}

                      value={from}
                      onChange={(e) => setFrom(e.target.value)} required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="toDate">To Date</label>
                    <input
                      type="date"
                      id="toDate"
                      name="toDate"
                      style={{ maxWidth: '200px', marginLeft: '10px',textTransform:'uppercase' }}

                      className="form-control"
                      value={to}
                      onChange={(e) => setTo(e.target.value)} required
                    />
                  </div>
                  <button
                    onClick={fetchDataByDateRange}
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                </div>
                <br></br>
                <table className="table" style={{textAlign:'center'}}>
                  <thead>
                    <tr>
                      <th>Truck Number</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>From</th>
                      <th>To</th>

                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item.id}>
                        <td>{item.truckNumber}</td>
                        <td>{item.date.split('-').reverse().join('-')}</td>
                        <td>{item.time}</td>
                        <td>{item.from}</td>
                        <td>{item.to}</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
             {activeContent === "invoiceTrackingForm" && (
              <div>
                <h2>4 Search by TBR Number</h2>
                <form>
                  <div className="form-group">
                    <label htmlFor="tbrNumber">TBR Number:</label>
                    <input
                      type="text"
                      id="tbrNumber"
                      name="tbrNumber"
                      className="form-control"
                      style={{maxWidth:'40%'}}
                      value={tbr}
                      onChange={(e) => setTBR(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={fetchDataByTBR}
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                </form>
                <br></br>
                <table className="table" style={{textAlign:'center'}}>
                  <thead >
                    <tr>
                    <th>TBR Number</th>

                      <th>Truck Number</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Print</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((booking) => (
                      <tr key={booking.id}>
                                    <td>{booking.tbr}</td>

                        <td>{booking.truckNumber}</td>
                        <td>{booking.date.split('-').reverse().join('-')}</td>
                        <td>{booking.time}</td>
                        <td>{booking.from}</td>
                        <td>{booking.to}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ maxWidth: "500px" }}
                            onClick={() => generatePDF1(booking)} // Add this line
                          >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer-fill" viewBox="0 0 16 16">
  <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/>
  <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
</svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeContent === "trucktrackingform" && (
              <div>
                <h2>5 Truck Tracking</h2>
                <form>
                  <div className="form-group">
                    <label htmlFor="trackingId">Registration Number:</label>
                    <input
                      type="text"
                      id="trackingId"
                      name="trackingId"
                      className="form-control"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerBooking;
