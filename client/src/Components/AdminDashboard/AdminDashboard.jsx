import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Card, Modal, Box, Typography, Grid, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { base64toBlob, openBase64NewTab } from '../../CommonComponent/base64topdf';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';

const AdminForm = () => {
    const [users, setUsers] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedTraining, setSelectedTraining] = useState('');
    const [editStatus, setEditStatus] = useState({});
    const Location=useLocation()
    const urn=Location.state && Location.state.urn
    const admintype= urn && urn.length >= 3 ? urn.slice(-3) : urn;
    console.log(admintype);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('authtoken');
                const response = await axios.get('http://localhost:8000/api/users/getallusers/', {
                    headers: {
                        "auth-token": token // Include the authentication token in the request headers
                    }
                });
                const filteredUsers = response.data.data
                    .filter(user => user.role === 'user')
                    .filter(user => user.userInfo.Name !== undefined)
                    .sort((a, b) => a.urn - b.urn);

                setUsers(filteredUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        let filteredData = [...users];

        if (selectedBatch) {
            filteredData = filteredData.filter(user => user.userInfo && user.userInfo.batch === selectedBatch);
        }

        if (selectedBranch) {
            filteredData = filteredData.filter(user => user.userInfo && user.userInfo.branch === selectedBranch);
        }

        if (selectedTraining) {
            filteredData = filteredData.filter(user => user[selectedTraining]);
        }

        return filteredData;
    }, [users, selectedBatch, selectedBranch, selectedTraining]);

    const handleViewCertificate = (row) => {
        if (selectedTraining === 'placementData') {
            if (row.original.placementData && row.original.placementData.appointmentLetter) {
                openBase64NewTab(row.original.placementData.appointmentLetter);
            } else {
                console.error("Appointment Letter not found for this user in placement data.");
            }
        } else if (selectedTraining && row.original[selectedTraining] && row.original[selectedTraining].certificate) {
            openBase64NewTab(row.original[selectedTraining].certificate);
        } else {
            console.error("Certificate not found for this user or training data is missing.");
        }
    };

    const columns = useMemo(() => {
        let customColumns = [
            { accessorKey: "urn", header: "URN" },
            { accessorKey: "userInfo.Name", header: "Name" },
            { accessorKey: "userInfo.crn", header: "CRN" }
        ];

        if (selectedTraining === 'placementData') {
            customColumns.push(
                {
                    accessorKey: `${selectedTraining}.certificate`, header: "Certificate", Cell: ({ row }) => (
                        <PictureAsPdfIcon onClick={() => handleViewCertificate(row)} style={{ cursor: 'pointer' }} />
                    )
                },
                { accessorKey: "placementData.package", header: "Package" },
                { accessorKey: "placementData.appointmentDate", header: "Appointment Date" },
                { accessorKey: "placementData.company", header: "Company" }
            );
            customColumns.push({
                accessorKey: `${selectedTraining}.lock`,
                header: "Verified",
                Cell: ({ row }) => (row.original[selectedTraining].lock ? "Yes" : "No"),
            });
        } else if (selectedTraining && selectedTraining !== '') {
            customColumns.push(
                {
                    accessorKey: `${selectedTraining}.certificate`, header: "Certificate", Cell: ({ row }) => (
                        <PictureAsPdfIcon onClick={() => handleViewCertificate(row)} style={{ cursor: 'pointer' }} />
                    )
                },
                { accessorKey: `${selectedTraining}.technology`, header: "Technology" },
                { accessorKey: `${selectedTraining}.projectName`, header: "Project Name" },
                { accessorKey: `${selectedTraining}.type`, header: "Type" }
            );
            customColumns.push({
                accessorKey: `${selectedTraining}.lock`,
                header: "Verified",
                Cell: ({ row }) => (row.original[selectedTraining].lock ? "Yes" : "No"),
            });
        }

        if (selectedTraining) {
            customColumns.push({
                accessorKey: "edit",
                header: "Mark Verification",
                Cell: ({ row }) => (
                    <VerificationIcon
                        lockStatus={row.original[selectedTraining].lock}
                        handlelock={handlelock}
                        row={row}
                    />
                ),
            });
        }

        return customColumns;
    }, [selectedTraining, editStatus]);


    const VerificationIcon = ({ lockStatus, handlelock, row }) => {
        const handleClick = () => {
            handlelock(row);
        };

        return lockStatus ? (
            <CheckCircleIcon style={{ color: 'green', cursor: 'pointer' }} onClick={handleClick} />
        ) : (
            <QuestionMarkIcon style={{ color: 'red', cursor: 'pointer' }} onClick={handleClick} />
        );
    }

    const handlelock = (row) => {
        if (selectedTraining === 'placementData') {
            if (row.original.placementData && row.original.placementData.lock !== undefined) {
                ChangeLock(row.original.urn, row.original.placementData.lock, true); // Specify isPlacement as true
            } else {
                console.error("Verification data not found.");
            }
        } else if (selectedTraining && row.original[selectedTraining] && row.original[selectedTraining].lock !== undefined) {
            ChangeLock(row.original.urn, row.original[selectedTraining].lock, false); // Specify isPlacement as false
        } else {
            console.error("Verification data not found.");
        }
    };

    const ChangeLock = async (urn, lockStatus, isPlacement) => {
        try {
            const token = localStorage.getItem('authtoken');
            let url = '';
            let data = {};

            // Determine the endpoint URL and data based on whether it's for training or placement data
            if (isPlacement) {
               
                url = 'http://localhost:8000/placement/updatelock';
                data = {
                    urn: urn,
                    lock: !lockStatus // Toggle the lock status
                };
             
            } else {
                // Use the appropriate training number in the URL
                const trainingNumber = selectedTraining.substring(2);
                url = `http://localhost:8000/tr${trainingNumber}/updatelock`;
                data = {
                    urn: urn,
                    lock: !lockStatus // Toggle the lock status
                };
            }

            // Send a POST request to the backend API endpoint
            const response = await axios.post(url, data);

            if (response.data.success) {
                toast.success('Verification Status Change successfully!');
                const updatedUsers = users.map(user => {
                    if (user.urn === urn) {
                        if (isPlacement) {
                            return {
                                ...user,
                                placementData: {
                                    ...user.placementData,
                                    lock: !lockStatus
                                }
                            };
                        } else {
                            return {
                                ...user,
                                [selectedTraining]: {
                                    ...user[selectedTraining],
                                    lock: !lockStatus
                                }
                            };
                        }
                    } else {
                        return user;
                    }
                });
                setUsers(updatedUsers);
            } else {
                toast.error('Failed to update verified status.');
                console.error('Failed to update verified status.');
            }
        } catch (error) {
            toast.error('Error updating verification status:');
            console.error('Error updating verification status:', error);
        }
    };


    const table = useMaterialReactTable({
        data: filteredUsers,
        columns
    });

    const [open, setOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const handleModalOpen = (content) => {
        setModalContent(content);
        setOpen(true);
    };

    const handleModalClose = () => {
        setOpen(false);
    };

    const handleBatchChange = (event) => {
        setSelectedBatch(event.target.value);
    };

    const handleBranchChange = (event) => {
        setSelectedBranch(event.target.value);
    };

    const handleTrainingChange = (event) => {
        setSelectedTraining(event.target.value);
    };

    const getTrainingOptions = () => {
        const options = [
            { value: "", label: "All" }, // Default option
             // Always include Placement Data option
        ];
    
        // Check the admintype and add training options accordingly
        if (admintype === "101") {
            options.push({ value: "tr101", label: "Training 101" });
        } else if (admintype === "102") {
            options.push(
                { value: "tr101", label: "Training 101" },
                { value: "tr102", label: "Training 102" }
            );
        } else if (admintype === "103") {
            options.push(
                { value: "tr101", label: "Training 101" },
                { value: "tr102", label: "Training 102" },
                { value: "tr103", label: "Training 103" }
            );
        } else if (admintype === "104") {
            options.push(
                { value: "tr101", label: "Training 101" },
                { value: "tr102", label: "Training 102" },
                { value: "tr103", label: "Training 103" },
                { value: "tr104", label: "Training 104" },
                { value: "placementData", label: "Placement Data" }
            );
        }
    
        return options;
    };

    return (
        <div style={{ marginTop: '100px', padding: '0 20px' }}>
            <Grid container spacing={2} justifyContent="space-around">
                <Grid item style={{ marginBottom: 20 }}>
                    <FormControl style={{ width: 200 }}>
                        <InputLabel>Batch</InputLabel>
                        <Select value={selectedBatch} onChange={handleBatchChange}>
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="2020-2024">2020-2024</MenuItem>
                            <MenuItem value="2021-2025">2021-2025</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item style={{ marginBottom: 20 }}>
                    <FormControl style={{ width: 200 }}>
                        <InputLabel>Branch</InputLabel>
                        <Select value={selectedBranch} onChange={handleBranchChange}>
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="CSE">Computer Science & Engineering</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item style={{ marginBottom: 20 }}>
                <FormControl style={{ width: 200 }}>
                    <InputLabel>Training</InputLabel>
                    <Select value={selectedTraining} onChange={handleTrainingChange}>
                        {getTrainingOptions().map((option) => (
                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                </Grid>
            </Grid>
            <Card variant="outlined" style={{ marginBottom: '50px' }}>
                <MaterialReactTable table={table} />
            </Card>

            <Modal open={open} onClose={handleModalClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    {modalContent && (
                        <>
                            <Typography variant="h6" gutterBottom>
                                {Object.keys(modalContent).map((key) => (
                                    <div key={key}>
                                        <strong>{key}: </strong> {modalContent[key]}
                                    </div>
                                ))}
                            </Typography>
                        </>
                    )}
                </Box>
            </Modal>
            <ToastContainer />
        </div>
    );
};

export default AdminForm;