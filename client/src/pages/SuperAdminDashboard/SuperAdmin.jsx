import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Edit, School, ViewList, Download, Description } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Grid, Button, Paper, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import { useState, useEffect } from "react";
import { decodeUserRole } from "../../utils/AdminFunctions";
import { handleExportFullData } from "../../utils/ExportAllData";

const API_URL =
    import.meta.env.VITE_ENV === "production"
        ? import.meta.env.VITE_PROD_BASE_URL
        : import.meta.env.VITE_DEV_BASE_URL;

const CardButton = styled(Button)({
    py: 2,
    width: "100%",
    height: "100%",
    flexDirection: "column",
    transition: "transform 0.2s",
    "&:hover": {
        transform: "scale(1.05)",
    },
});

const CardContainer = styled(Paper)({
    minHeight: "200px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
});

const SuperAdminForm = () => {
    const [role, setRole] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();
    const navigateToTrainingNames = () => navigate("/superadmin/trainingNames");
    const navigateToEditProfile = () => navigate("/admin/editProfile");
    const navigateToStudentData = () => navigate("/superadmin/studentData");
    const navigateToLogs = () => navigate("/superadmin/logs");
    useEffect(() => {
        const token = localStorage.getItem('authtoken');
        const decodedRole = decodeUserRole(token)
        setRole(decodedRole)
    }, [])

    return (
        <div
            style={{ padding: "0 40px", marginTop: "40px", marginBottom: "100px" }}
        >
            <Grid container columnSpacing={20} rowSpacing={4} jhstifyContent="center">
                {role === "superadmin" &&
                    <Grid item xs={12} sm={6} md={4}>
                        <CardContainer>
                            <CardButton
                                color="primary"
                                variant="contained"
                                onClick={navigateToTrainingNames}
                            >
                                <Edit fontSize="large" />
                                <Typography variant="h6" sx={{ mt: 2 }}>
                                    Change Training Names
                                </Typography>
                            </CardButton>
                        </CardContainer>
                    </Grid>
                }

                <Grid item xs={12} sm={6} md={4}>
                    <CardContainer>
                        <CardButton variant="contained" onClick={navigateToEditProfile}>
                            <School fontSize="large" />
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Change Student Data
                            </Typography>
                        </CardButton>
                    </CardContainer>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <CardContainer>
                        <CardButton variant="contained" onClick={navigateToStudentData}>
                            <ViewList fontSize="large" />
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                View Student Data
                            </Typography>
                        </CardButton>
                    </CardContainer>
                </Grid>
                {role === "superadmin" &&
                    <>
                        <Grid item xs={12} sm={6} md={4}>
                            <CardContainer>
                                <CardButton variant="contained" onClick={() => handleExportFullData(setLoading)}>
                                    {loading ? <CircularProgress color="inherit" /> : <Download fontSize="large" />}

                                    <Typography variant="h6" sx={{ mt: 2 }}>
                                        Download All Data As Excel
                                    </Typography>
                                </CardButton>
                            </CardContainer>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CardContainer>
                                <CardButton variant="contained" onClick={navigateToLogs}>
                                    <Description fontSize="large" />

                                    <Typography variant="h6" sx={{ mt: 2 }}>
                                        View Logs
                                    </Typography>
                                </CardButton>
                            </CardContainer>
                        </Grid>
                    </>
                }
            </Grid>
            <ToastContainer />
        </div>
    );
};

export default SuperAdminForm;
