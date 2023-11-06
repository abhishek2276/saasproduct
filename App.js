import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import React from "react";
import Dashboard from './Dashboard';
import OwnerInterface from "./OwnerInterface";
import AgentRegistration from "./AgentRegistration";
import AgentInfo from "./AgentInfo";
import NewTruck from "./NewTruck";
import TruckPosting from "./TruckPosting";
import OwnerBooking from "./OwnerBooking";
import AgentNavbar from "./AgentNavbar";
import AgentInterface from "./AgentInterface";
import AgentBooking from "./AgentBooking";
import AgentBooknow from "./AgentBooknow";
import AddSub from "./AddSub";
import AgentUpdate from "./AgentUpdate";
import { setToken } from "./tokenHelper";
import NewDriver from "./NewDriver";
import DriverInfo from "./DriverInfo";
import Footer from "./Footer";
export default function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set the token in the token helper
      setToken(token);
    }
  }, []);
  return (
    <div>

     
      <BrowserRouter >
        <Routes>
        <Route path='/' element={<Dashboard />}></Route>

          <Route path='Dashboard' element={<Dashboard />}></Route>

          <Route path='OwnerInterface' element={<OwnerInterface />}></Route>
          <Route path='AgentRegistration' element={<AgentRegistration  />}></Route>

          <Route path='AgentInfo' element={<AgentInfo  />}></Route>
          <Route path='AgentInfo' element={<AgentInfo  />}></Route>
          <Route path='NewDriver' element={<NewDriver  />}></Route>

          <Route path='NewTruck' element={<NewTruck  />}></Route>
          <Route path='DriverInfo' element={<DriverInfo  />}></Route>

          <Route path='TruckPosting' element={<TruckPosting  />}></Route>
          <Route path='OwnerBooking' element={<OwnerBooking />}></Route>
          <Route path='AgentNavbar' element={<AgentNavbar />}></Route>
          <Route path='AgentUpdate' element={<AgentUpdate />}></Route>

          <Route path='AgentInterface' element={<AgentInterface />}></Route>
          <Route path='AgentBooking' element={<AgentBooking />}></Route>

          <Route path='AgentBooknow' element={<AgentBooknow />}></Route>
          <Route path='AddSub' element={<AddSub />}></Route>






        </Routes>
      </BrowserRouter>
      <Footer/>

    </div>
  )
}
