import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : import.meta.env.VITE_DEV_BASE_URL

function ForgotPassword() {
  const [credentials, setCredentials] = useState({ email: '', otp: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);

  const handleGetOtp = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}password/forgotpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.email }),
      });
      const json = await response.json();
     
      if (json.success) {
        toast('OTP sent successfully');
        setLoading(false);
        setShowOtpField(true); // Show OTP field after successful OTP generation
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

  const handleResetPassword = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}password/resetpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          otp: credentials.otp,
          newPassword: credentials.newPassword,
        }),
      });

      const json = await response.json();

      if (json.success) {
        toast.success('Password reset successful');
        setLoading(false);
        // Optionally, redirect the user to the ForgotPassword page or another route
      } else {
        toast.error(json.message);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const theme = createTheme();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <ToastContainer />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 5
        }}
      >

        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            placeholder='nameCrn@gndec.ac.in'
            value={credentials.email}
            autoComplete="email"
            onChange={onChange}
            autoFocus

          />
          {showOtpField && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="otp"
              label="OTP"
              value={credentials.otp}
              onChange={onChange}
              InputProps={{
                sx: { padding: '8px' },
              }}
            />
          )}
          {showOtpField && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              value={credentials.newPassword}
              type={showPassword ? 'text' : 'password'} // Show password text if showPassword is true
              onChange={onChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((prev) => !prev)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
            onClick={showOtpField ? handleResetPassword : handleGetOtp}
          >
            {loading ? 'Processing...' : showOtpField ? 'Reset Password' : 'Get OTP'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/ForgotPassword" variant="body2" style={{ color: '#0015ff' }}>
                Remembered your password? Log in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default ForgotPassword;
