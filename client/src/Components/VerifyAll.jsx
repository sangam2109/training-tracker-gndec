import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL =
    import.meta.env.VITE_ENV === "production"
        ? import.meta.env.VITE_PROD_BASE_URL
        : import.meta.env.VITE_DEV_BASE_URL;

const VerifyAllComponent = ({ selectedTraining, refresh, onRefresh,batch }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleVerifyAll = async () => {
        setOpen(true);
    };
    const handleConfirmVerifyAll = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authtoken");
            let url = "";

            if (selectedTraining === "placementData") {
                url = `${API_URL}placement/verifyall`;
            } else if (selectedTraining) {
                // Use the appropriate training number in the URL
                const trainingNumber = selectedTraining.substring(2);
                url = `${API_URL}tr${trainingNumber}/verifyall`;
            } else {
                console.error("Selected training is not valid.");
                setLoading(false);
                return;
            }

            // Send a POST request to the backend API endpoint
            const response = await axios.post(
                url,
                { batch: batch },
                {
                    headers: {
                        "auth-token": token,
                    },
                },
            );

            if (response.data.success) {
                toast.success("All users verified successfully!");
                onRefresh(); // Trigger refresh in the parent component
                setLoading(false);
            } else {
                toast.error("Failed to verify all users.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error verifying all users:", error);
            toast.error("Error verifying all users.");
            setLoading(false);
        } finally {
            setOpen(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button onClick={handleVerifyAll} variant="contained" color="primary">
                Verify All
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to verify all users?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmVerifyAll} color="primary">
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Yes"}
                    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default VerifyAllComponent;
