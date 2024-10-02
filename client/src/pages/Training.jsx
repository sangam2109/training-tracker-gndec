import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import FileBase from 'react-file-base64';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import { useLocation } from 'react-router-dom';
import { base64toBlob, openBase64NewTab } from '../utils/base64topdf';
import { technologyStack } from '../utils/technology';
import { decodeAuthToken } from '../utils/AdminFunctions';
import Autocomplete from '@mui/material/Autocomplete';
import { LinearProgress, CircularProgress } from '@mui/material';
import { handleFileErrors } from '../utils/ErrorFunctions';

const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : import.meta.env.VITE_DEV_BASE_URL


export default function Form() {
  const [formData, setFormData] = useState({
    organization: '',
    technology: [],
    projectName: '',
    type: '',
    certificate: null,
    organizationType: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [isLock, setIsLock] = useState(false);
  const [certificate, setCertificate] = useState(null);
  let location = useLocation();
  const [loading, setLoading] = useState(true)
  const [filedata, selectedFiledata] = useState({})
  const number = location.state && location.state.number
  const [optionalCertificate, setOptionCertificate] = useState(false)

  useEffect(() => {
 
    const fetchData = async () => {
      try {
        if (number === "101") {
          setOptionCertificate(true)
        }
        setLoading(true)
        const token = localStorage.getItem("authtoken");
        const crn = decodeAuthToken(token);
        const response = await axios.get(`${API_URL}tr${number}/${crn}`, {
          headers: {
            "auth-token": token
          }
        });
        const userData = response.data.data;

        if (
          userData.organization &&
          userData.technology &&
          userData.projectName &&
          userData.type &&
          userData.organizationType 
        ) {
          setFormData(userData);
          if(certificate){
            setCertificate(userData.certificate)
          }
          setIsEditing(false);
          if (userData.lock) {
            setIsLock(true)
          } else {
            setIsLock(false)
          }
        } else {
          console.error('Error: Fetched data is incomplete.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false)
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, []);



  const handleChange = (e) => {
    const { name, value } = e.target;


    if (name === 'organizationType' && value === 'gndec') {
      setFormData({
        ...formData,
        [name]: value,
        organization: 'Guru Nanak Dev Engineering College , Ludhiana'
      });

      if (number === "101") {
        setOptionCertificate(true)
      }
    } else if (name === 'organizationType' && value !== 'gndec') {
      setOptionCertificate(false)
      setFormData({ ...formData, [name]: value });
    }
    else {

      setFormData({ ...formData, [name]: value });
    }

    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      const formErrors = {};
      if (formData.organization.length === 0) {
        formErrors.organization = 'Organization cannot be blank';
        toast.error(formErrors.organization)
        setLoading(false)
        return;
      }
      if (formData.technology.length === 0) {
        formErrors.technology = 'Technology cannot be blank';
        toast.error(formErrors.technology)
        setLoading(false)
        return;
      }
      if (!formData.projectName.trim()) {
        formErrors.projectName = 'Project Title cannot be blank';
        toast.error(formErrors.projectName)
        setLoading(false)
        return;
      }
      if (!formData.type.trim()) {
        formErrors.type = 'Training type cannot be blank';
        toast.error(formErrors.type)
        setLoading(false)
        return;

      }
      if (optionalCertificate === false && !formData.certificate) {
        formErrors.certificate = 'Certificate is blank ';
        toast.error(formErrors.certificate)
        setLoading(false)
        return;
      }
      if (!formData.organizationType.trim()) {
        formErrors.organizationType = 'Organization-Type cannot be blank';
        toast.error("Organization-Type cannot be blank")
        setLoading(false)
        return;
      }


      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        setLoading(false)

        return;
      }
      const fileErrors = handleFileErrors(filedata, optionalCertificate);
      if (Object.keys(fileErrors).length > 0) {
        // Display file-related errors
        setErrors({ ...errors, ...fileErrors });
        setLoading(false)
        return;
      }
      const token = localStorage.getItem("authtoken");
      const crn = decodeAuthToken(token);
      const url = `${API_URL}tr${number}`
      const response = await axios.post(url, { formData, crn: crn }, {
        headers: {
          "auth-token": token
        }
      });

      if (response.data.success) {
        toast.success('Form submitted successfully!');
        setIsSubmitting(false);
        setIsEditing(false);
        setLoading(false)
        selectedFiledata({})
      } else {
        toast.error('Failed to submit form. Please try again later.');
        setIsSubmitting(false);
        setLoading(false)
        selectedFiledata({})
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('An error occurred while submitting the form.');
      setIsSubmitting(false);
      setLoading(false)
      selectedFiledata({})
    }
  };
  const noCertificateAvailable = () => {
    toast.warning("No certificate Available")
  }

  const handleViewCertificate = () => {
    if (certificate) {
      openBase64NewTab(certificate);
    }
    else {
      openBase64NewTab(formData.certificate);
    }
  };
  const handleEdit = () => {
    setIsEditing((prevEditing) => !prevEditing);
  };

  const handleFileChange = (files) => {
    selectedFiledata(files)
    setFormData({ ...formData, certificate: files.base64 });
    setCertificate(files.base64);

  }

  return (
    <>
      {loading && <LinearProgress />}
      <Container style={{ marginBottom: "100px" }} >
        <Container style={{ paddingInline: 0, paddingBottom: 50, paddingTop: 10 }}>
          {!isLock && (
            <Button
              disabled={loading || (!formData.organization || !formData.organizationType || !formData.projectName || !formData.technology)}
              onClick={handleEdit}
              color="primary"
              variant="contained"
              style={{
                position: 'relative',
                float: 'left',
              }}
            >

              <EditIcon />
            </Button>
          )}
          {isEditing && !isLock && (
            <Button
              type="submit"
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              endIcon={<KeyboardArrowRightIcon />}
              disabled={isSubmitting || loading}
              style={{
                position: 'relative',
                float: 'right',
              }}
            >
              {loading ? <CircularProgress size={24} color='inherit' /> : 'Submit'}
            </Button>
          )}
          {!isEditing && certificate && (
            <Button onClick={optionalCertificate ? noCertificateAvailable : handleViewCertificate} variant="outlined" color="primary" style={{
              position: 'relative',
              float: 'right',
            }}>
              {optionalCertificate ? "No certificate" : "View Certificate"}
            </Button>
          )}
        </Container>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Training Type"
              variant="outlined"
              fullWidth
              required
              name="type"
              value={formData.type}
              onChange={handleChange}
              error={!!errors.type}
              helperText={errors.type}
              sx={{ mb: 2 }}
              disabled={!isEditing || isSubmitting}
            >
              <MenuItem value="Training">Training / Internship Without Stipend</MenuItem>
              <MenuItem value="InternshipWithStipend">Internship With Stipend</MenuItem>
              <MenuItem value="PaidTraining">Paid Training</MenuItem>
            </TextField>
            <TextField
              select
              label="Organization Type"
              variant="outlined"
              fullWidth
              required
              name="organizationType"
              value={formData.organizationType}
              onChange={handleChange}
              error={!!errors.organizationType}
              helperText={errors.organizationType}
              sx={{ mb: 2 }}
              disabled={!isEditing || isSubmitting}
            >
              <MenuItem value="industry">Industrial</MenuItem>
              <MenuItem value="gndec">Institutional ( Guru Nanak Dev Engineering College , Ludhiana) </MenuItem>
              <MenuItem value="other">Other Institutional</MenuItem>
            </TextField>


          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Organization Name"
              variant="outlined"
              fullWidth
              required
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              error={!!errors.organization}
              helperText={errors.organization}
              style={{ marginBottom: '1rem' }}
              disabled={!isEditing || isSubmitting}
            />
            <TextField
              label="Project Title"
              variant="outlined"
              fullWidth
              required
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              error={!!errors.projectName}
              helperText={errors.projectName}
              style={{ marginBottom: '1rem' }}
              disabled={!isEditing || isSubmitting}
            />


          </Grid>

        </Grid>
        <Typography variant="h6" gutterBottom textAlign={'left'} disabled={!isEditing || isSubmitting}>
          Technology used
        </Typography>
        <Autocomplete
          multiple
          options={technologyStack}
          value={formData.technology}
          onChange={(event, newValue) => {
            setFormData({ ...formData, technology: newValue });
          }}
          disabled={!isEditing || isSubmitting}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={option}
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Technology"
              placeholder="Type or select Technology Used"
              fullWidth
              disabled={!isEditing || isSubmitting}
            />
          )}
        />

        {isEditing && !optionalCertificate && (
          <>
            <Typography variant="h6" gutterBottom textAlign="left" marginTop={2}>
              Upload Certificate <br />
              <Typography style={{ fontSize: '14px' }}>(in PDF format only / size less than 500Kb)</Typography>
            </Typography>

            <FileBase
              type="file"
              multiple={false}
              onDone={handleFileChange}
              disabled={!isEditing || isSubmitting}
              accept=".pdf"
            />
          </>
        )}
        <ToastContainer />
      </Container>
    </>
  );
}
