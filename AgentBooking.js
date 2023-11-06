import React, { useState, useEffect } from 'react';
import './OwnerBooking.css';
import AgentNavbar from './AgentNavbar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
function AgentBooking() {
  const location = useLocation();
  const [crn, setCRN] = useState(null);
  const [phonenumber, setPhonenumber] = useState(null);

  const [showLoadingOTPInput, setShowLoadingOTPInput] = useState(false);
  const [showUnloadingOTPInput, setShowUnloadingOTPInput] = useState(false);
  const [unloadingDisabled, setUnloadingDisabled] = useState(true);
  const [payNowDisabled, setPayNowDisabled] = useState(true);
  const [loadingOTP, setLoadingOTP] = useState('');
  const [unloadingOTP, setUnloadingOTP] = useState('');
  const [from, setFromDate] = useState('');
  const [to, setToDate] = useState('');
  const [tbr, setTBR] = useState('');
  const [data, setData] = useState([]);

  const [loadingOTPVerified, setLoadingOTPVerified] = useState(false);
  const [unloadingOTPVerified, setUnloadingOTPVerified] = useState(false);
  const [printBookings, setPrintBookings] = useState([]);
  const [activeContent, setActiveContent] = useState('ShowMyBookings');
  const [bookings, setBookings] = useState([]); 
  useEffect(() => {
    if (location.state && location.state.crn && location.state.phonenumber) {
      setCRN(location.state.crn);
      setPhonenumber(location.state.phonenumber)
      console.log(location.state.crn, location.state.phonenumber)
    }
  }, [location.state]);
  useEffect(() => {
    if (crn && phonenumber) {
      console.log(crn, phonenumber)
      axios.get('http://localhost:9000/booking1', {
        params: {
          crn: crn,
          phonenumber: phonenumber,
        }
      })
        .then((response) => {
          setBookings(response.data);
        })
        .catch((error) => {
          console.error('Error fetching bookings:', error);
        });
    }
  }, [crn, phonenumber]);
  const handlePrintInvoice = () => {

  }
  const handleCancelBooking = (bookingId) => {
    const parsedBookingId = parseInt(bookingId);
    console.log(parsedBookingId)
    if (isNaN(parsedBookingId)) {
      console.error('Invalid booking ID:', bookingId);
      return;
    } const confirmed = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirmed) {
      return;
    }
    axios.put(`http://localhost:9000/booking/${parsedBookingId}`, { status: 'canceled' })
      .then(() => {
        const updatedBookings = bookings.map((booking) => {
          if (booking.id === parsedBookingId) {
            return { ...booking, status: 'canceled' };
          }
          return booking;
        });
        setBookings(updatedBookings);
        console.log(`Successfully canceled booking with ID: ${parsedBookingId}`);
        window.location.reload();
      })
      .catch((error) => {
        console.error(`Error canceling booking with ID: ${parsedBookingId}`, error);
      });
  };
  const generatePDF = () => {
    const doc = new jsPDF();

    const columns = ['Booking Sno', 'From Location', 'To Location', 'Date', 'Truck Number', 'Time', 'Total Price', 'type', 'status'];
    const data = bookings.map((booking, index) => {
      const { from, to, date, truckNumber, time, totalPrice, type, status } = booking;
      return [index + 1, from, to, date, truckNumber, time, totalPrice, type, status];
    });

    const tableOptions = {
      startY: 20, 
      margin: { top: 20 }, 
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }, 
      styles: { fontSize: 10 },
    };

    doc.autoTable(columns, data, tableOptions);

    doc.save('my-bookings-table.pdf');
  };
  const handlePrintBookings = () => {
    const doc = new jsPDF();

    const columns = ['TBR', 'From Location', 'To Location', 'loading location', 'unloading location', 'Date', 'Truck Number', 'Time', 'Total Price', 'status'];
    const data = printBookings.map((booking) => {
      const { tbr, from, to, fromSublocation, toSublocation, date, truckNumber, time, totalPrice, status } = booking;
      return [tbr, from, to, fromSublocation, toSublocation, date, truckNumber, time, totalPrice, status];
    });

    const tableOptions = {
      startY: 17, 
      margin: { top: 20 }, 
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }, 
      styles: { fontSize: 9 },
    };

    doc.autoTable(columns, data, tableOptions);

    doc.save('my-bookings-table.pdf');
  };

  const handleSearch = () => {
    axios.get(`http://localhost:9000/Bookings`, {
      params: {
        from,
        to,
      },
    })
      .then((response) => {
        setPrintBookings(response.data);
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error);
      });
  };

  const isPayNowDisabled = (booking) => {
    if (booking.unloadingstatus === 'pending') {
      return true;
    }
    return false; 
  };

  const displayContent = (contentId) => {
    setActiveContent(contentId);
  };
  const handleLoadingOTPClick = (bookingId) => {
    setShowLoadingOTPInput((prevState) => ({
      ...prevState,
      [bookingId]: true,
    }));
    setUnloadingDisabled(true);
  };

  // Update this function to set the corresponding booking's input field to true
  const handleUnloadingOTPClick = (bookingId) => {
    setShowUnloadingOTPInput((prevState) => ({
      ...prevState,
      [bookingId]: true,
    }));
    setPayNowDisabled(true);
  };
  const handleLoadingOTPVerify = (bookingId) => {
    console.log(bookingId)
    if (loadingOTP === '1234') {
      console.log('Loading OTP verified:', loadingOTP);
      setLoadingOTPVerified(true);
      setShowLoadingOTPInput(false); 
      setUnloadingDisabled(false); 
      const currentDate  = new Date();
    const verificationDate = currentDate.toISOString().split('T')[0];
    console.log('Data to be sent to the backend:');
    console.log('Booking ID:', bookingId);
    console.log('Verification Date:', verificationDate);
    axios.put(`http://localhost:9000/loadingstatus/${bookingId}`, {
      loadingstatus: verificationDate, 
    })
      .then((response) => {
        console.log(response.data.message);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error updating status:', error);
      });
    } else {
      console.log('Incorrect Loading OTP:', loadingOTP);
    
    }
  };

  const handleUnloadingOTPVerify = (bookingId) => {
    if (unloadingOTP === '5678') {
      console.log('Unloading OTP verified:', unloadingOTP);
      localStorage.setItem('unloadingOTPVerified', 'true');
      setUnloadingOTPVerified(true);
      setShowUnloadingOTPInput(false); 
      setPayNowDisabled(false); 
      const currentDate  = new Date();
      const verificationDate = currentDate.toISOString().split('T')[0];
      console.log('Data to be sent to the backend:');
      console.log('Booking ID:', bookingId);
      console.log('Verification Date:', verificationDate);
      axios.put(`http://localhost:9000/unloadingstatus/${bookingId}`, {
        unloadingstatus: verificationDate, 
      })
        .then((response) => {
          console.log(response.data.message);
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error updating status:', error);
        });
    } else {
      console.log('Incorrect Unloading OTP:', unloadingOTP);
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
  const handlePayNowClick = (bookingId) => {
    if (unloadingOTPVerified) {
      axios.put(`http://localhost:9000/booking/${bookingId}/updatePaymentStatus`, { paymentStatus: 'Payment Completed' })
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error updating payment status:', error);
        });
    } else {
      alert('Please verify unloading OTP first.');
    }
  };

 
  const isToday = (someDate) => {
    const today = new Date();
    return someDate > today;
  };
  const generatePDF1 = (booking) => {

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });
    const topMargin = 9; 

    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;

    let topPosition = topMargin;
    doc.setFont("fontName", "fontStyle"); 

    doc.setFontSize(16); 
    doc.setTextColor(0, 51, 102);
    doc.text('GRCTOB', centerX, topPosition, { align: 'center' });
    doc.setFont("Arial", "normal");
    doc.text('GRCTOB', centerX, topPosition, { align: 'center' });

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

    doc.save(`Booking_${booking.id}.pdf`);
  };
  return (
    <div >
      <AgentNavbar />
      <div className="container-fluid"style={{minHeight:'100vh'}}>
        <div className="row">
          <div className="col-md-3 options">
            <h3>1 Manage Bookings</h3>
            <button className="btn btn-primary option-button" onClick={() => displayContent('ShowMyBookings')}>
              <span className="button-number-1">A</span> Show My Bookings
            </button>
            {/* <button className="btn btn-primary option-button" onClick={() => displayContent('searchByDateForm')}>
              <span className="button-number-1">2</span> Cancel Booking
            </button> */}
            <button className="btn btn-primary option-button" onClick={() => displayContent('truckTrackingForm')}>
              <span className=" button-number-1">B</span> Print Bookings
            </button>
            {/* <button className="btn btn-primary option-button" onClick={() => displayContent('ChangeBookingForm')}>
              <span className="button-number-1">4</span> change booking date
            </button> */}
            <button className="btn btn-primary option-button" onClick={() => displayContent('ChangeBookingForm')}>
              <span className="button-number-1">C</span> TBR Number
            </button>
          </div>
          <div className="col-md-9 content" style={{ display: activeContent === 'ShowMyBookings' ? 'block' : 'none' }}>
            {/* Content for searchByVehicleForm */}
            <div className="container mt-4">
              <h1>My Bookings</h1>
              {bookings.map((booking) => (
                <div className="accordion" key={booking.id}>
                  <div className="accordion-item">
                    <h2
                      className="accordion-header"
                      id={`heading${booking.id}`}
                    >
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${booking.id}`}
                        aria-expanded="false"
                        aria-controls={`collapse${booking.id}`}
                      >
                        {booking.status === 'active' ? (
                          <>
                            TBR:<b style={{ color: 'black', marginLeft: 10, marginRight: 5 }}>{booking.tbr}</b> |
                            From Location: <b style={{ color: 'black', marginLeft: 10, marginRight: 5 }}>{booking.from}</b>
                            | To Location: <b style={{ color: 'black', marginLeft: 10, marginRight: 5 }}>{booking.to}</b> |
                            Date: <b style={{ color: 'black', marginLeft: 10, marginRight: 5, textDecoration: 'reverse' }}>{booking.date.split('-').reverse().join('-')}</b>
                            {isToday(new Date(booking.date)) ? (
                              <>
                                {booking.paymentStatus === 'payment completed' ? (
                                  <span className="text-success ms-2">Payment Completed</span>
                                ) : (
                                  <button
                                    type="submit"
                                    style={{ maxWidth: '200px' }}
                                    className="btn btn-danger ms-2"
                                    onClick={(event) => {
                                      handleCancelBooking(booking.id, event);
                                    }}
                                  >
                                    Cancel Booking
                                  </button>
                                )}
                              </>
                            ) : (
                              <>
                                {booking.paymentStatus === 'PaymentPending' ? (
                                  <span className="text-warning ms-2">Payment Pending</span>
                                ) : booking.paymentStatus === 'payment completed' ? (
                                  <span className="text-success ms-2"><b>Payment Completed</b></span>
                                ) : (
                                  <button
                                    type="submit"
                                    style={{ maxWidth: '200px' }}
                                    className="btn btn-danger ms-2"
                                    onClick={(event) => {
                                      handleCancelBooking(booking.id, event);
                                    }}
                                  >
                                    Cancel Booking
                                  </button>
                                )}
                              </>
                            )}
                          </>
                        ) : (
                          <span className="text-danger ms-2">
                            TBR:<b style={{ color: 'black', marginLeft: 10, marginRight: 5 }}>{booking.tbr}</b> | Booking Cancelled <b style={{ color: 'black', marginLeft: 10, marginRight: 5 }}>
                              {booking.date.split('-').reverse().join('-')}
                            </b>
                          </span>
                        )}


                      </button>

                    </h2>
                    <div
                      id={`collapse${booking.id}`}
                      className={`accordion-collapse collapse `}
                      aria-labelledby={`heading${booking.id}`}
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        <p>Truck Number: <b>{booking.truckNumber}</b></p>
                        <p>Time: <b>{booking.time}</b></p>
                        <p>Total Price:<b>{booking.totalPrice}</b></p>

                        {booking.status === 'active' ? (
                          <>
                            {booking.paymentStatus === 'payment completed' ? (
                              <button className="btn btn-primary ms-3 me-3" onClick={() => handlePrintInvoice(booking)}>
                                Print Invoice
                              </button>
                            ) : (
                              <>
                                {booking.loadingstatus === 'pending' ? (
                                  <>
                                    <button
                                      className={`btn ${loadingOTPVerified ? 'btn-success' : 'btn-primary'} ms-3 me-3`}
                                      onClick={() => handleLoadingOTPClick(booking.id)}
                                      disabled={loadingOTPVerified}
                                    >
                                      {loadingOTPVerified ? 'Loading OTP Verified' : 'Loading OTP'}
                                    </button>
                                    {showLoadingOTPInput && (
                                      <>
                                        <input
                                          type="text"
                                          placeholder="Enter Loading OTP"
                                          value={loadingOTP}
                                          className="smaller-input"
                                          onChange={(e) => setLoadingOTP(e.target.value)}
                                        />
                                        <button
                                          className="btn btn-success"
                                          onClick={() => handleLoadingOTPVerify(booking.id)}
                                        >
                                          Verify
                                        </button>
                                      </>
                                    )}
                                  </>
                                ) : (
                                  <button
                                    className={`btn ${loadingOTPVerified ? 'btn-primary' : 'btn-success' } ms-3 me-3`}
                                    onClick={() => handleLoadingOTPVerify(booking.id)}
                                    // style={{}}
                                    disabled={true}
                                  >
                                    Loading OTP Verified
                                  </button>
                                )}

                                {booking.unloadingstatus === 'pending' ? (
                                  <>
                                    <button
                                      className={`btn ${unloadingOTPVerified ? 'btn-success' : 'btn-primary'} ms-3 me-3`}
                                      onClick={() => handleUnloadingOTPClick(booking.id)}
                                      disabled={unloadingOTPVerified}
                                    >
                                      {unloadingOTPVerified ? 'Unloading OTP Verified' : 'Unloading OTP'}
                                    </button>
                                    {showUnloadingOTPInput && (
                                      <>
                                        <input
                                          type="text"
                                          placeholder="Enter Unloading OTP"
                                          value={unloadingOTP}
                                          className="smaller-input"
                                          onChange={(e) => setUnloadingOTP(e.target.value)}
                                        />
                                        <button
                                          className="btn btn-success"
                                          onClick={() => handleUnloadingOTPVerify(booking.id)}
                                        >
                                          Verify
                                        </button>
                                      </>
                                    )}
                                  </>
                                ) : (
                                  <button
                                    className={`btn ${unloadingOTPVerified ? 'btn-success' : 'btn-success'} ms-3 me-3`}
                                    onClick={handleUnloadingOTPClick}
                                    disabled={true}
                                  >
                                    Unloading OTP Verified
                                  </button>
                                )}

                                <button
                                  className="btn btn-primary ms-3 me-3"
                                  onClick={() => handlePayNowClick(booking.id)}
                                  disabled={isPayNowDisabled(booking)}
                                >
                                  Pay Now
                                </button>
                              </>
                            )}
                          </>
                        ) : (
                          <span className="text-danger ms-2">
                            Booking Canceled <b style={{ color: 'black', marginLeft: 10, marginRight: 5 }}>
                              {booking.date}
                            </b>
                          </span>
                        )}
                        <button
                          className="btn btn-primary option-button"
                          onClick={generatePDF}
                        >
                          <span className="button-number-1"></span> Print Bookings
                        </button>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-9 content" style={{ display: activeContent === 'searchByDateForm' ? 'block' : 'none' }}>
            <h2>2 Print Bookings:</h2>
            <table cellSpacing="30px" className="table">
              <tr>
                <th>Sl No</th>
                <th>Vehicle No</th>
                <th>Date</th>
                <th>Time</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>AP12AS1234</td>
                  <td>31-08-2023</td>
                  <td>10:30AM</td>
                  <td>10000</td>
                  <td>
                    <p type="button" className='btn btn-primary'>Cancel</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-md-9 content" style={{ display: activeContent === 'truckTrackingForm' ? 'block' : 'none' }}>
            <h2>2 Print Bookings:</h2>
            <form>
              <div className="form-group">
                <label htmlFor="fromDate">From Date -</label>
                <input
                  type="date"
                  id="fromDate"
                  name="fromDate"
                  value={from}
                  style={{ maxWidth: '200px', marginLeft: '10px' }}
                  onChange={(e) => setFromDate(e.target.value)}
                  required
                /><br></br><br></br>
                <label htmlFor="toDate">To Date -</label>
                <input
                  type="date"
                  id="toDate"
                  name="toDate"
                  style={{ maxWidth: '200px', marginLeft: '29px' }}

                  value={to}
                  onChange={(e) => setToDate(e.target.value)}
                  required
                />
                <br /><br></br>
                <button
                  type="button"
                  className='btn btn-primary'
                  onClick={handleSearch}
                >

                  Search
                </button>
              </div>
            </form>

            <table className="table">
              <thead>
                <tr>
                  <th>TBR</th>
                  <th>From Location</th>
                  <th>To Location</th>
                  <th>Date</th>
                  <th>Truck Number</th>
                  <th>Loading Sublocation</th>
                  <th>Unloading Sublocation</th>

                  <th>Time</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {printBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.tbr}</td>
                    <td>{booking.from}</td>
                    <td>{booking.to}</td>
                    <td>{booking.date}</td>
                    <td>{booking.truckNumber}</td>
                    <td>{booking.fromSublocation}</td>
                    <td>{booking.toSublocation}</td>

                    <td>{booking.time}</td>
                    <td>{booking.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="btn btn-primary"
              onClick={handlePrintBookings}
            >
              Print Bookings
            </button>
          </div>
          <div className="col-md-9 content" style={{ display: activeContent === 'ChangeBookingForm' ? 'block' : 'none' }}>
            <div>
              <h2>3 Search by TBR Number</h2>
              <form>
                <div className="form-group">
                  <label htmlFor="tbrNumber">TBR Number:</label>
                  <input
                    type="text"
                    id="tbrNumber"
                    name="tbrNumber"
                    className="form-control"
                    style={{ maxWidth: '40%' }}
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
              <table className="table" style={{ textAlign: 'center' }}>
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
                      <td>{booking.date}</td>
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
                            <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z" />
                            <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-md-9 content" style={{ display: activeContent === 'truckTracking1Form' ? 'block' : 'none' }}>
            <h2>5 Truck tracking:</h2>
            <form>
              <label htmlFor="trackingId">Registration Number:</label><br></br>
              <input type="text" style={{ maxWidth: 400 }} id="trackingId" name="trackingId" required /><br></br><br></br>
              <p type="button" className='btn btn-primary'>Submit</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentBooking;
