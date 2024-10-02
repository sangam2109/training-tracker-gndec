import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom'; 
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { Alert } from '@mui/material';
const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : import.meta.env.VITE_DEV_BASE_URL


function Verify() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false);
  const location = useLocation();
  const email = location.state && location.state.email;
  
  if (email) {
    credentials.email = email
  }
  
  const handleGetOTP = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}validate/sendotp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.email }),
      });

      const json = await response.json();

      if (json.success) {
        toast.success('OTP sent successfully');
        setShowOTPField(true); // Show OTP field after successful OTP request
      } else {
        toast.error( json.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}validate/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: credentials.otp }),
      });

      const json = await response.json();

      if (json.success) {
        toast('Verified Successfuly');
        setLoading(false);

        setTimeout(() => {
          // Adjust the routing logic as per your requirements
          navigate('/login');
        }, 1000);
      } else {
        toast('🚫 ' + json.message);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast('🚫 An error occurred');
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const redirectToMail = () => {
    window.open('https://mail.gndec.ac.in/', '_blank');
  };

  const theme = createTheme();

  return (
    <Container component="main" maxWidth="xs" sx={{marginTop:2, marginBottom:10}}>
      <CssBaseline />
      <ToastContainer />
      {showOTPField && 
        <Alert severity="info">
          It takes 2-3 minutes to receive OTP on GNDEC mail. Please be patient .
        </Alert>
      }
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Verify Your Mail
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={credentials.email}
            autoComplete="email"
            onChange={onChange}
            autoFocus
            InputProps={{
              sx: { padding: '8px' },
            }}
          />
          {showOTPField && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="otp"
              label="OTP"
              value={credentials.otp}
              type="otp"
              onChange={onChange}
              InputProps={{
                sx: { padding: '8px' },
              }}
            />
          )}
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            onClick={showOTPField ? handleSubmit : handleGetOTP}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="primary" /> : showOTPField ? 'Verify' : 'Get OTP'}
          </Button>
          <Button
            onClick={redirectToMail}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {'Go to Mail.Gndec.ac.in'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Verify;
