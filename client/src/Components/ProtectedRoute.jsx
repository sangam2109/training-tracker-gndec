import React from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import SuperAdmin from "../pages/SuperAdminDashboard/SuperAdmin";
import Admin from "../pages/AdminDashboard/AdminDashboard";
import Home from "../pages/Home";
import PlacementStats from "../pages/Placement Graphs/PlacementStats";
import TrainingNames from "../pages/TrainingNamesController/TrainingNames";
import EditProfile from "../pages/EditProfile/EditProfile";
import StudentData from "../pages/StudentData/StudentData";

const ProtectedRoute = ({ component: Component, path, ...rest }) => {
    const authToken = localStorage.getItem("authtoken");

    if (!authToken) {
        return <Navigate to="/login" replace />;
    } else {
        try {
            const decodedToken = jwtDecode(authToken);
            const userRole = decodedToken.user.role;

            if (path === "/" && userRole) {
                return <Navigate to="/" replace />;
            }

            if (path === "/login" && userRole) {
                return <Navigate to="/home" replace />;
            }
            if (userRole === 'superadmin' || userRole === 'admin') {
                if(path==='/superadmin'){
                    return <SuperAdmin />;
                }
                if (path === '/admin/editProfile') {
                    return <EditProfile />
                }
                if (path === '/superadmin/studentData'){
                    return <StudentData />
                }
                if (path === "/superadmin/placementStats") {
                    return <PlacementStats />;
                } 
            }
            // Check if the user is authenticated and has the required role
            if (userRole === "superadmin") {
               if (path === "/superadmin/trainingNames") {
                    return <TrainingNames />;
                } 
            
                // Redirect superadmin to home if trying to access admin or superadmin route
           else {
                    return <SuperAdmin />;
                }
            
            } else {
                // Redirect to home or another appropriate route if the user doesn't have the required role
                if (
                    path === "/admin" ||
                    path === "/superadmin" ||
                    path === "/superadmin/placementStats" ||
                    path === "/superadmin/trainingNames" ||
                    path === "/admin/editProfile"
                ) {
                    return <Home />;
                }
                return <Component {...rest} />;
            }
        } catch (error) {
            // If there's an error decoding the token, redirect to login
            console.error("Error decoding token:", error);
            return <Navigate to="/login" replace />;
        }
    }
};

export default ProtectedRoute;
