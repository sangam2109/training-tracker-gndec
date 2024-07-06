import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,CircularProgress } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : import.meta.env.VITE_DEV_BASE_URL;

const UnVerifyAllComponent = ({ selectedTraining , onRefresh, refresh,batch}) => {
    const [open, setOpen] = useState(false);
        const [loading,setLoading]=useState(false);
    

    const handleUnVerifyAll = async () => {
        setOpen(true);
    };

    const handleConfirmUnVerifyAll = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('authtoken');
            let url = '';

            if (selectedTraining === 'placementData') {
                url = `${API_URL}placement/unverifyall`;
            } else if (selectedTraining) {
                // Use the appropriate training number in the URL
                const trainingNumber = selectedTraining.substring(2);
                url = `${API_URL}tr${trainingNumber}/unverifyall`;
            } else {
                console.error('Selected training is not valid.');
                setLoading(false)
                return;
            }

            // Send a POST request to the backend API endpoint
            const response = await axios.post(url, {batch:batch}, {
                headers: {
                    'auth-token': token
                }
            });

            if (response.data.success) {
                toast.success('All users unverified successfully!');
                onRefresh();
                setLoading(false)
            } else {
                toast.error('Failed to unverify all users.');
                setLoading(false)
            }
        } catch (error) {
            console.error('Error unVerifying all users:', error);
            toast.error('Error unVerifying all users.');
            setLoading(false)
        } finally {
            setOpen(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button onClick={handleUnVerifyAll} variant="contained" color="primary">
                UnVerify All
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to UnVerify all users?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmUnVerifyAll} color="primary">
                        {loading ? <CircularProgress size={24} color='inherit' /> : 'Yes'}
                    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UnVerifyAllComponent;
