
import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem'; // Import MenuItem for dropdown options
// import CustomizedTimeline from './Home/Timeline';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { jwtDecode } from "jwt-decode";
import { Alert, AlertTitle, Grid, LinearProgress, CircularProgress, Autocomplete } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { convertBatchToDate } from '../utils/DateConvertToFrontend';
import Modal from '@mui/material/Modal';
import { decodeAuthToken } from '../utils/AdminFunctions';
import { validateField, errorMessages } from '../utils/ErrorFunctions';
import { getMentors } from '../utils/MentorData';
const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : import.meta.env.VITE_DEV_BASE_URL


export default function Form() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({
    Name: '',
    contact: '',
    urn: '',
    branch: '',
    section: '',
    mentor: '',
    batch: '',
    gender: '',
    admissionType: '',
    mother: '',
    father: '',
    personalMail: ''

  });

  const token = localStorage.getItem("authtoken");
  const crn = decodeAuthToken(token);
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [admissionYear, setAdmissionYear] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [MENTORS,setMentors]=useState([])
  useEffect(() => {
    // Fetch data from the database when the component mounts or the page is refreshed
    const fetchData = async () => {

      try {
        setLoading(true)
        const token = localStorage.getItem('authtoken');
        const url = `${API_URL}userprofiles/${crn}`;
        const response = await axios.get(url, {
          headers: {
            "auth-token": token
          }
        });
        const userData = response.data.data;
   
        // Check if all fields are filled in the fetched data
        if (
          userData.Name &&
          userData.contact &&
          userData.urn &&
          userData.branch &&
          userData.section &&
          userData.mentor &&
          userData.batch &&
          userData.gender &&
          userData.personalMail &&
          userData.mother &&
          userData.father

        ) {
          const datePickerBatch = convertBatchToDate(userData.batch);
          setAdmissionYear(datePickerBatch);
         
          setFormData({ ...userData, batch: datePickerBatch });
          setIsSubmitting(true)

        } else {
          console.error('Error: Fetched data is incomplete.');
          setIsSubmitting(false)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsSubmitting(false)
        setLoading(false)
      } finally {
        setLoading(false)

      }
    };
    const fetchMentors = async () => {
      const token = localStorage.getItem('authtoken');
      const mentorList = await getMentors(token); 
      setMentors(mentorList);
    };

    fetchData();
    fetchMentors();
  }, []);

  // const [endDate, setEndDate] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Automatically format batch input

    let errorMsg = validateField(name, value);
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: errorMsg });

    // Dynamic regex and validation check messages

  };

  const handleSubmit = async (e) => {
    setLoading(true)
    setShowConfirmation(false)
    e.preventDefault();
    try {
      // Form validation
      const formErrors = {};
      Object.keys(formData).forEach((key) => {
        const error = validateField(key, formData[key]);
        if (error) {
          formErrors[key] = error;
          toast.error(error);
        }
      });
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        setLoading(false);
        return;
      }
      const token = localStorage.getItem('authtoken');
      const response = await axios.post(`${API_URL}userprofiles`, { formData, crn: crn },
        {
          headers: {
            "auth-token": token
          }
        });      
      if (response.data.success) {
        toast.success('Form submitted successfully!');
        setIsSubmitting(true);
        setLoading(false)
      } else {
        toast.error('Failed to submit form. Please try again later.');
        setIsSubmitting(false);
        setLoading(false)
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('An error occurred while submitting the form.');
      setIsSubmitting(false);
      setLoading(false)
    }
  };
  const setSection = (value) => {
    setFormData({ ...formData, section: value });
  };
  const setMentor = (value) => {
    setFormData({ ...formData, mentor: value });
  };


  const handleBatchChange = (newDate) => {
    if (newDate) {
      const year = newDate.$y;

      setFormData({ ...formData, batch: `${year}-${year + 4}` });
    } else {
      // If newDate is null or undefined, clear the batch value
      setFormData({ ...formData, batch: '' });
    }
  };

  return (
    <>
      {loading && <LinearProgress />}
      <Container sx={{ paddingTop: 5 }} style={{ marginBottom: "100px" }}>
        <ToastContainer />
        <Container style={{ paddingBottom: 30 }}>
          {isSubmitting ? (
            <Alert severity="info" >
              <AlertTitle>This information is read only !</AlertTitle>
              You have already submitted the form. Contact the training coordinator for any changes.
            </Alert>
          ) : (
            <>
                <Alert severity="info" sx={{ mb: 2 }}>
                  If your batch is 2021-2025 fill Batch Start Year as 2021. ( Even if you are LEET student as well)
                </Alert>
              <Button
                style={{ float: 'right' }}
                type='submit'
                color="primary"
                variant="contained"
                endIcon={<KeyboardArrowRightIcon />}
                disabled={isSubmitting}
                onClick={() => setShowConfirmation(true)}
              >
                Submit
              </Button>
            </>
          )}
        </Container>
        <Container sx={{ margin: 0, padding: 0 }}>
          <Grid container spacing={isSmallScreen ? 2 : 4}>
            <Grid item xs={12} md={6} sx={{ textAlign: isSmallScreen ? 'left' : 'right' }}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                required
                name="Name"
                placeholder='Your Name'
                value={formData.Name}
                onChange={handleChange}
                error={!!errors.Name}
                helperText={errors.Name}
                sx={{ mb: 2 }}
                disabled={isSubmitting}
              />
              <TextField
                label="Mother's Name"
                variant="outlined"
                fullWidth
                required
                placeholder='Mother’s Name'
                name="mother"
                value={formData.mother}
                onChange={handleChange}
                error={!!errors.mother}
                helperText={errors.mother}
                sx={{ mb: 2 }}
                disabled={isSubmitting}
              />
              <TextField
                label="Father's Name"
                variant="outlined"
                fullWidth
                placeholder='Father’s Name'
                required
                name="father"
                value={formData.father}
                onChange={handleChange}
                error={!!errors.father}
                helperText={errors.father}
                sx={{ mb: 2 }}
                disabled={isSubmitting}
              />
              <TextField
                label="Personal Mail"
                variant="outlined"
                fullWidth
                required
                placeholder='example@gmail.com'
                name="personalMail"
                value={formData.personalMail}
                onChange={handleChange}
                error={!!errors.personalMail}
                helperText={errors.personalMail}
                sx={{ mb: 2 }}
                disabled={isSubmitting}
              />
              <TextField
                label="Contact"
                variant="outlined"
                fullWidth
                required
                placeholder='9876543210'
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                error={!!errors.contact}
                helperText={errors.contact}
                sx={{ mb: 2 }}
                disabled={isSubmitting}
              />

              <TextField
                select
                label="Section"
                variant="outlined"
                fullWidth
                required
                name="section"
                value={formData.section}
                onChange={(e) => setSection(e.target.value)}
                disabled={isSubmitting}
                sx={{
                  mb: 2,
                  '& .MuiSelect-select': { textAlign: 'left' } // Aligns the selected value to the left
                }}
              >
                <MenuItem value="A1" >A1</MenuItem>
                <MenuItem value="A2">A2</MenuItem>
                <MenuItem value="B1">B1</MenuItem>
                <MenuItem value="B2">B2</MenuItem>
                <MenuItem value="C1">C1</MenuItem>
                <MenuItem value="C2">C2</MenuItem>
                <MenuItem value="D1">D1</MenuItem>
                <MenuItem value="D2">D2</MenuItem>
              </TextField>


            </Grid>
            <Grid item xs={12} md={6} >
              <TextField
                label="University Roll Number"
                variant="outlined"
                fullWidth
                required
                placeholder='1234567'
                name="urn"
                value={formData.urn}
                onChange={handleChange}
                error={!!errors.urn}
                helperText={errors.urn}
                sx={{ mb: 2 }}
                disabled={isSubmitting}
              />
              <TextField
                select
                label="Branch"
                variant="outlined"
                fullWidth
                required
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                error={!!errors.branch}
                helperText={errors.branch}
                sx={{ mb: 2 }}
                disabled={isSubmitting}
              >
                <MenuItem value="CSE">Computer Science & Engineering</MenuItem>
              </TextField>
             
              <Autocomplete
                options={MENTORS}
                getOptionLabel={(option) => option || ''} // Handle null or undefined options
                value={formData.mentor || null} // Ensure the value supports null
                onChange={(event, newValue) => setMentor(newValue || '')} // Handle null or empty selections
                disabled={isSubmitting}
                isOptionEqualToValue={(option, value) => option === value || value === ''} // Ensure correct comparison with null
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Mentor's Name"
                    variant="outlined"
                    fullWidth
                    required
                    error={!!errors.mentor}
                    helperText={errors.mentor}
                    disabled={isSubmitting}
                  />
                )}
                sx={{ mb: 2 }}
              />

              <TextField
                select
                label="Gender"
                variant="outlined"
                fullWidth
                required
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                error={!!errors.gender}
                helperText={errors.gender}
                sx={{ mb: 2 }}
                disabled={isSubmitting}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
              <TextField
                select
                label="Admission Type"
                variant="outlined"
                fullWidth
                required
                name="admissionType"
                value={formData.admissionType}
                onChange={handleChange}
                error={!!errors.admissionType}
                helperText={errors.admissionType}
                sx={{ mb: 2 }}
                disabled={isSubmitting}
              >
                <MenuItem value="Non LEET">Non LEET</MenuItem>
                <MenuItem value="LEET">LEET</MenuItem>
              </TextField>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Batch Start Year"
                  views={['year']}
                  renderInput={(params) => <TextField {...params} helperText="Enter starting year only" />}
                  onChange={handleBatchChange}
                  value={admissionYear}
                  sx={{ mb: 2 }}
                  disabled={isSubmitting}
                />
                
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Container>
      </Container>
      <Modal open={showConfirmation} onClose={() => setShowConfirmation(false)}>
        <div style={{
          position: 'absolute',
          width: 400,
          backgroundColor: 'white',
          borderRadius: 10,
          boxShadow: 24,
          padding: 16,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          <Typography variant="h6" gutterBottom style={{ marginBottom: 16 }}>
            Are you sure ?
          </Typography>
          <Alert
            severity='warning'
          >
            Once you submit the form, you won't be able to edit it.
          </Alert>
          <hr />
          <div style={{ display: 'flex', justifyContent: 'end', gap: 16, paddingBlock: 6 }}>
            <Button variant="text" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              {loading ? <CircularProgress size={24} color='inherit' /> : 'Submit'}
            </Button>
          </div>
        </div>
      </Modal>

    </>
  )
}
