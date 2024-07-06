import React from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import SuperAdmin from "../pages/SuperAdminDashboard/SuperAdmin";
import Home from "../pages/Home";
import PlacementStats from "../pages/Placement Graphs/PlacementStats";
import TrainingNames from "../pages/TrainingNamesController/TrainingNames";
import EditProfile from "../pages/EditProfile/EditProfile";
import StudentData from "../pages/StudentData/StudentData";
import Dashboard from '../pages/DashBoard'
import Placement from "../pages/PlacementInput"
import Training from "../pages/Training"
import Signup from "../pages/Authentication/Signup";
import Login from "../pages/Authentication/Login";
import Verify from "../pages/Authentication/Verify";
import ForgotPassword from "../pages/Authentication/Forgotpassword"
import Logs from "../pages/Logs/Logs";

const ProtectedRoute = ({ component: Component, path, ...rest }) => {
    const authToken = localStorage.getItem("authtoken");

    if (!authToken) {
        if(path==="/signup"){
            return <Signup/>
        }
        else if (path === "/login") {
            return <Login />
        }
        else if (path === "/verify") {
            return <Verify />
        } 
        else if (path === "/forgotpassword") {
            return <ForgotPassword />
        }
        else{
            return <Navigate to="/login" replace />;
        }
       
    } else {
        try {
            const decodedToken = jwtDecode(authToken);
            const userRole = decodedToken.user.role;

            if (userRole === "superadmin") {
                if (path === "/superadmin/trainingNames") {
                    return <TrainingNames />;
                }
                if (path === "/superadmin/logs") {
                    return <Logs />;
                }
            }

            if (userRole === 'superadmin' || userRole === 'admin') {
                if(path==='/superadmin'){
                    return <SuperAdmin />;
                }
                else if (path === '/admin/editProfile') {
                    return <EditProfile />
                }
                else if (path === '/superadmin/studentData'){
                    return <StudentData />
                }
                else if (path === "/superadmin/placementStats") {
                    return <PlacementStats />;
                } 
                else {
                    return <Navigate to="/superadmin" replace />;
                }
            }
            // Check if the user is authenticated and has the required role
            if (userRole === "user") {
               if(path==='/dashboard'){
                   return <Dashboard/>
               }
               else if(path==='/placement'){
                   return <Placement/>;
               }
               else if(path==='/tr'){
                   return <Training/>;
               }
               else if (path === '/home') {
                   return <Home />;
               }
               else{
                   return <Navigate to="/home" replace/>;
               }
            }
            
             
        } catch (error) {
            // If there's an error decoding the token, redirect to login
            console.error("Error decoding token:", error);
            return <Navigate to="/login" replace />;
        }
    }
};

export default ProtectedRoute;
