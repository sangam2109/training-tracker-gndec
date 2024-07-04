import React, { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';
import { Box, Button, Grid, FormControl, MenuItem, TextField, LinearProgress, Typography } from '@mui/material';
import BarGraph from '../../Components/Charts/BarGraph';
import LineGraph from '../../Components/Charts/genderGraph';
import CompanyGraph from '../../Components/Charts/companyGraph';
import ExportHighestPackageData from '../../Components/Charts/ExportHighestPackageData';

const PlacementStats = () => {
    const [updatedata, setUpdateddata] = useState(null);
    const [selectedYears, setSelectedYears] = useState(5); // Default to last 5 years
    const [loading, setLoading] = useState(false); // Loading state
    const chartRef1 = useRef(null);
    const chartRef2 = useRef(null);
    const chartRef3 = useRef(null);
    const API_URL =
        import.meta.env.VITE_ENV === "production"
            ? import.meta.env.VITE_PROD_BASE_URL
            : import.meta.env.VITE_DEV_BASE_URL;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Start loading
            try {
                const token = localStorage.getItem("authtoken");
                const response = await axios.get(`${API_URL}users/getUsersByPreviousBatches`, {
                    headers: {
                        "auth-token": token,
                    },
                    params: {
                        years: selectedYears,
                        trainingType: 'placementData'
                    }
                });
                setUpdateddata(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchData();
    }, [selectedYears]);

    const handleDownloadPDF = () => {
        if (chartRef1.current && chartRef2.current && chartRef3.current) {
            const doc = new jsPDF({
                unit: 'px',
                format: 'letter',
                userUnit: 300
            });

            // Capture canvas images
            const canvas1 = chartRef1.current.canvas;
            const canvas2 = chartRef2.current.canvas;
            const canvas3 = chartRef3.current.canvas;

            // Add canvas images to PDF
            doc.text('Batch-wise Placed Student Percentages', 130, 40);
            doc.addImage(canvas1.toDataURL('image/png'), 'PNG', 75, 80, 300, 150);
            doc.addImage(canvas2.toDataURL('image/png'), 'PNG', 75, 260, 300, 150);
            doc.addImage(canvas3.toDataURL('image/png'), 'PNG', 75, 430, 300, 150);

            // Save PDF
            doc.save('placement_graph.pdf');
        }
    };

    const handleYearsChange = (event) => {
        setSelectedYears(event.target.value);
    };

    return (
        <div style={{ marginBottom: "100px" }}>
        { loading && (
            <LinearProgress/>
        )}
            <Box
                sx={{
                    marginTop: '2rem',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >

                <FormControl style={{ width: 200 }}>
                    <TextField
                        value={selectedYears}
                        select
                        onChange={handleYearsChange}
                        label="Number of Years"
                    >
                        <MenuItem value={5}>Last 5 years</MenuItem>
                        <MenuItem value={10}>Last 10 years</MenuItem>
                        <MenuItem value={15}>Last 15 years</MenuItem>
                        <MenuItem value={25}>Last 25 years</MenuItem>
                    </TextField>
                </FormControl>
            </Box>

            {loading ? (
                <Box sx={{ width: '100%', display:'flex',height:'100px',justifyContent:'center',alignItems:'center' }}>
                    <Typography>Fetching Data ....</Typography>
                </Box>
            ) : (
                <Grid
                    display={'flex'}
                    justifyContent={'center'}
                    container
                    spacing={2}
                    marginTop={2}
                    gap={4}
                >
                    <Box
                        sx={{
                            width: '600px',
                            height: '300px',
                            display: 'flex',
                            justifyContent: 'center',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                        }}
                    >
                        <BarGraph data={updatedata} ref={chartRef1} years={selectedYears + 4} />
                    </Box>
                    <Box
                        sx={{
                            width: '600px',
                            height: '300px',
                            display: 'flex',
                            justifyContent: 'center',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                        }}
                    >
                        <LineGraph data={updatedata} ref={chartRef2} years={selectedYears + 4} />
                    </Box>
                    <Box
                        sx={{
                            width: '600px',
                            height: '300px',
                            display: 'flex',
                            justifyContent: 'center',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                        }}
                    >
                        <CompanyGraph data={updatedata} ref={chartRef3} years={selectedYears + 4} />
                    </Box>
                </Grid>
            )}
            <Box
                sx={{
                    marginTop: '2rem',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px'
                }}
            >
                <Button onClick={handleDownloadPDF} variant="contained" color="primary">
                    Download Statistics (PDF)
                </Button>
                <ExportHighestPackageData data={updatedata} />
            </Box>
        </div>
    );
};

export default PlacementStats;
