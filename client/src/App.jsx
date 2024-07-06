import React, { Component } from "react";
import Signup from "./pages/Authentication/Signup";
import DashBoard from "./pages/DashBoard";
import Home from "./pages/Home";
import Login from "./pages/Authentication/Login";
import Verify from "./pages/Authentication/Verify";
import ForgotPassword from "./pages/Authentication/Forgotpassword";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SuperAdminForm from "./pages/SuperAdminDashboard/SuperAdmin";
import Navbar from "./Components/Navbar/Navbar";
import PlacementForm from "./pages/PlacementInput";
import Training101 from "./pages/Training";
import ProtectedRoute from "./Components/ProtectedRoute";
import PlacementStats from "./pages/Placement Graphs/PlacementStats";
import TrainingNames from "./pages/TrainingNamesController/TrainingNames";
import Footer from "./Components/Footer";
import EditProfile from "./pages/EditProfile/EditProfile";
import StudentData from "./pages/StudentData/StudentData";
import Logs from "./pages/Logs/Logs";

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Redirect to the dashboard if user is authenticated */}
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/signup" element={<ProtectedRoute path="/signup" component={Signup} />} />
            <Route path="/verify" element={<ProtectedRoute path="/verify" component={Verify} />} />
            <Route path="/login" element={<ProtectedRoute path="/login" component={Login} />} />
            <Route path="/forgotpassword" element={<ProtectedRoute path="/forgotpassword" component={ForgotPassword} />} />
     


      // user routes 
            <Route path="/home" element={<ProtectedRoute path="/home" component={Home} />} />
            <Route path='/placement' element={<ProtectedRoute path="/placement" component={PlacementForm} />} />
            <Route path='/tr' element={<ProtectedRoute path="/tr" component={Training101} />} />
            <Route path="/dashboard" element={<ProtectedRoute path="/dashboard" component={DashBoard} />} />

            //superadmin route
            <Route path='/superadmin/trainingNames' element={<ProtectedRoute path="/superadmin/trainingNames" component={TrainingNames} />} />
            <Route
              path="/superadmin/logs"
              element={
                <ProtectedRoute path="/superadmin/logs" component={Logs} />
              }
            />

            //superadmin and admin route
            <Route path='/superadmin/studentData' element={<ProtectedRoute path="/superadmin/studentData" component={StudentData} />} />

            <Route path='/admin/editProfile' element={<ProtectedRoute path="/admin/editProfile" component={EditProfile} />} />
            
            <Route path="/superadmin" element={<ProtectedRoute path="/superadmin" component={SuperAdminForm} />} />

            <Route path="/superadmin/placementStats" element={<ProtectedRoute path="/superadmin/placementStats" component={PlacementStats} />} />
           
            //not mentioned paths re routed to 
            <Route path="*" element={<Navigate to="/" />} />
            
           
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
