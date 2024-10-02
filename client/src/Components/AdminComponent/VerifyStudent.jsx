import React, { useState } from 'react';
import { Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";

const API_URL =
    import.meta.env.VITE_ENV === "production"
        ? import.meta.env.VITE_PROD_BASE_URL
        : import.meta.env.VITE_DEV_BASE_URL;

const VerifyStudent = ({ crn, token }) => {
    const [loading, setLoading] = useState(false);

    const handleVerification = async () => {
        try {
            setLoading(true);

            // Check if CRN is valid (7 digits)
            if (!/^\d{7}$/.test(crn)) {
                toast.error("Invalid CRN ");
                setLoading(false);
                return;
            }

            // Make PUT request to update verification status for the given CRN
            const response = await axios.put(
                `${API_URL}users/updateVerification/${crn}`,
                {},
                { headers: { "auth-token": token } }
            );

            if (response.data.success) {
                let message = response.data.message
                if (message =="User is already verified"){
                    toast.info(message)
                }else{
                    toast.success(message);
                }
                
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error in Verification:", error);
            toast.error("Error occurred during verification.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button onClick={handleVerification} variant="contained">
                {loading ? <CircularProgress size={24} /> : <Typography>Verify Student</Typography>}
            </Button>
        
        </>
    );
};

export default VerifyStudent;
