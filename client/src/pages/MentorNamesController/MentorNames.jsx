// src/components/MentorNames.js
import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Button,
    TextField,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { getMentorsWithId } from "../../utils/MentorData"; // Import your getMentors function
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const API_URL =
    import.meta.env.VITE_ENV === "production"
        ? import.meta.env.VITE_PROD_BASE_URL
        : import.meta.env.VITE_DEV_BASE_URL;

const MentorNames = () => {
    const [mentors, setMentors] = useState([]); // Changed to an array
    const [loading, setLoading] = useState(false);
    const [newMentor, setNewMentor] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingName, setEditingName] = useState("");

    useEffect(() => {
        const fetchMentors = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("authtoken");
                const mentorData = await getMentorsWithId(token);
                setMentors(mentorData); // Ensure mentorData is correctly set
            } catch (error) {
                console.error("Error fetching mentors:", error);
                toast.error("Error fetching mentors");
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, []);

    const handleAddMentor = async () => {
        setLoading(true);
        try {
            const upperCaseMentor = newMentor.toUpperCase();
            const token = localStorage.getItem("authtoken");
            const response = await axios.post(
                `${API_URL}mentors/addmentor`,
                { name: upperCaseMentor },
                {
                    headers: {
                        "auth-token": token,
                    },
                },
            );

            if (response.data.success) {
                toast.success("Mentor added successfully");
                // Push the new mentor to the list with the correct structure
                setMentors([
                    ...mentors,
                    { name: upperCaseMentor, _id: response.data.data._id },
                ]);
                setNewMentor("");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error adding mentor:", error);
            toast.error("Error adding mentor");
        } finally {
            setLoading(false);
        }
    };

    const handleEditMentor = (index) => {
        setEditingIndex(index);
        setEditingName(mentors[index].name); // Set the current mentor name for editing
    };

    const handleUpdateMentor = async () => {
        setLoading(true);
        try {
            const editedUpperCaseName = editingName.toUpperCase();
            const token = localStorage.getItem("authtoken");
            const response = await axios.put(
                `${API_URL}mentors/editmentor/${mentors[editingIndex]._id}`,
                { name: editedUpperCaseName },
                {
                    headers: {
                        "auth-token": token,
                    },
                },
            );

            if (response.data.success) {
                toast.success("Mentor updated successfully");
                const updatedMentors = [...mentors];
                updatedMentors[editingIndex] = {
                    name: editedUpperCaseName,
                    _id: mentors[editingIndex]._id,
                }; // Maintain the original ID
                setMentors(updatedMentors);
                setNewMentor("");
                setEditingIndex(null);
                setEditingName("");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating mentor:", error);
            toast.error("Error updating mentor");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMentor = async (index) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authtoken");
            const mentorId = mentors[index]._id;
            console.log(mentors[index]);
            const response = await axios.delete(
                `${API_URL}mentors/deletementor/${mentorId}`,
                {
                    headers: {
                        "auth-token": token,
                    },
                },
            );

            if (response.data.success) {
                toast.success("Mentor deleted successfully");
                const updatedMentors = mentors.filter((_, i) => i !== index);
                setMentors(updatedMentors);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error deleting mentor:", error);
            toast.error("Error deleting mentor");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container
            sx={{
                marginX: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 5,
                marginBottom: "100px",
            }}
        >
            <Typography variant="h5" gutterBottom>
                Mentor Names
            </Typography>
            <TextField
                fullWidth
                label={"Mentor Name"}
                value={editingIndex !== null ? editingName : newMentor} // Update value based on editing mode
                onChange={(e) =>
                    editingIndex !== null
                        ? setEditingName(e.target.value)
                        : setNewMentor(e.target.value)
                } // Set name based on editing
                variant="outlined"
                margin="normal"
            />
            {editingIndex !== null ? (
                <Button
                    variant="contained"
                    onClick={handleUpdateMentor}
                    sx={{ marginTop: 2 }}
                >
                    Update Mentor
                </Button>
            ) : (
                <Button
                    variant="contained"
                    onClick={handleAddMentor}
                    sx={{ marginTop: 2 }}
                >
                    Add Mentor
                </Button>
            )}
            <List
                sx={{
                    width: "100%",
                    height: "500px",
                    overflowY: "scroll",
                    bgcolor: "background.paper",
                    borderRadius: "8px",
                    boxShadow: 2,
                    mt: 2,
                    /* Scrollbar styles */
                    "&::-webkit-scrollbar": {
                        width: "8px", // width of the scrollbar
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: "#f1f1f1", // background of the track
                        borderRadius: "20px", // rounded track
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#888", // color of the scrollbar thumb
                        borderRadius: "20px", // rounded thumb
                        border: "2px solid transparent", // adds some padding between thumb and track
                        backgroundClip: "content-box", // ensures padding shows
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: "#555", // color when hovering over the scrollbar
                    },
                    /* For Firefox */
                    "scrollbar-width": "thin",
                    "scrollbar-color": "#900000 #f1f1f1",
                }}
            >
                {mentors.map((mentor, index) => (
                    <ListItem
                        key={mentor._id}
                        sx={{
                            padding: "16px",
                            borderBottom: "1px solid #e0e0e0",
                            "&:last-child": {
                                borderBottom: "none",
                            },
                            "&:hover": {
                                backgroundColor: "#f5f5f5",
                            },
                        }}
                    >
                        <ListItemText
                            primary={mentor.name}
                            sx={{
                                fontWeight: "bold",
                                color: "#333",
                            }}
                        />
                        <div>
                            <IconButton
                                edge="end"
                                onClick={() => handleEditMentor(index)}
                                sx={{
                                    color: "#1976d2", // Change color on hover
                                    "&:hover": {
                                        color: "#115293",
                                    },
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                edge="end"
                                onClick={() => handleDeleteMentor(index)}
                                sx={{
                                    color: "#d32f2f", // Change color on hover
                                    "&:hover": {
                                        color: "#a52525",
                                    },
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </ListItem>
                ))}
            </List>
            <ToastContainer />
        </Container>
    );
};

export default MentorNames;
