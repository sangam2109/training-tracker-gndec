import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MenuItem from "@mui/material/MenuItem";
import { CircularProgress, Typography, Alert, AlertTitle } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from '@mui/icons-material/Delete';
import { validateField, errorMessages } from "../../utils/ErrorFunctions";
import { convertBatchToDate } from "../../utils/DateConvertToFrontend";
// API_URL should point to your backend API endpoint
const API_URL =
  import.meta.env.VITE_ENV === "production"
    ? import.meta.env.VITE_PROD_BASE_URL
    : import.meta.env.VITE_DEV_BASE_URL;

const EditProfile = () => {
  // State variables
  const [showModal, setShowModal] = useState(false); // Controls modal visibility
  const [formData, setFormData] = useState({}); // Stores original fetched data
  const [userInfo, setuserInfo] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Indicates loading state
  const [fetchError, setFetchError] = useState(false); // Indicates if there's an error fetching data
  const [isEditing, setIsEditing] = useState(false);
  const [crnError, setCrnError] = useState(false); // Indicates if there's an error with the CRN input
  const [crn, setCrn] = useState(""); // Stores the entered CRN
  const [isChanged, setIsChanged] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [admissionYear, setAdmissionYear] = useState(null);

  const [passwordState, setPasswordState] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleCheck = async (value) => {
    if (!/^\d{7}$|^Tr\d{3}$/.test(crn)) {
      toast.error("Invalid CRN ");
      setCrnError(true); // Set CRN error if it's not 7 digits
      return;
    }
    await Data();
    if (value === "password") {
      setShowModal2(true);
    }
    if (value === "deleteUser") {
      setShowModal3(true);
    }

  };
  // Function to fetch data for a given CRN from the backend
  const fetchData = async () => {
    if (/^Tr\d{3}$/.test(crn)) {
      toast.error("Admin Can Only Change Own Password");
      setCrnError(true); // Set CRN error if it's not 7 digits
      return;
    } else if (!/^\d{7}$/.test(crn)) {
      toast.error("Invalid CRN ");
      setCrnError(true); // Set CRN error if it's not 7 digits
      return;
    }

    setLoading(true); // Set loading state to true
    setFetchError(false); // Reset fetch error state
    await Data();
    setShowModal(true);
  };
  const Data = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      // Make GET request to fetch data for the given CRN
      const response = await axios.get(`${API_URL}users/getuser/${crn}`, {
        headers: { "auth-token": token },
      });

      const data = response.data.data;
      const userInfoData = response.data.data.userInfo
      if (data) {
        const datePickerBatch = convertBatchToDate(userInfoData.batch);
        setFormData({ ...data });
        setuserInfo({ ...userInfoData, batch: datePickerBatch });

        setAdmissionYear(datePickerBatch);
        setFetchError(false); 
        setLoading(false);
      } else {
        setFetchError(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchError(true);
      setLoading(false);
      // Set fetch error state in case of error
    } finally {
      setLoading(false); // Set loading state to false after data is fetched
    }
  };
  const hanldeChangePassword = async () => {
    try {
      console.log(passwordState)
      const passwordError = validateField('password', passwordState.password
      );
      const confirmPasswordError = validateField('confirmPassword', passwordState.confirmPassword, passwordState);

      if (passwordError || confirmPasswordError) {
        // Check if either password or confirm password has an error
        const errorMessage = passwordError || confirmPasswordError;
        toast.error(errorMessage);
        setLoading(false);
        return;
      }
      setLoading(true);
      setFetchError(false);
      setIsEditing(false);
      setIsChanged(false);
      const token = localStorage.getItem("authtoken");
      // Make PUT request to update data with editedData
      const response = await fetch(`${API_URL}password/updatepassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body: JSON.stringify({
          crn: crn,
          password: passwordState.password,
        }),
      });

      if (response.ok) {
        setLoading(false);
        setShowModal2(false);
        toast.success("Succesfully Changed Password");
        setFormData({});
        setErrors({
          password: "",
          confirmPassword: "",
        });
        setPasswordState({
          password: "",
          confirmPassword: "",
        });
      } else {
        toast.error(json.message);
        setLoading(false);
        setShowModal2(false);
      }

      // Close the modal after data is submitted successfully
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to Change Password");
      setLoading(false); // Set loading state to false in case of error
    }
  };

  // Function to handle edit button click

  // Function to handle submit button click
  const handleSubmit = async () => {
    try {
      // Validate form data
      console.log(formData)
      const formDataErrors = Object.keys(formData).reduce((acc, key) => {
        const error = validateField(key, formData[key]);
        return error ? { ...acc, [key]: error } : acc;
      }, {});
    console.log(userInfo)
      // Validate userInfo
      const userInfoErrors = Object.keys(userInfo).reduce((acc, key) => {
        const error = validateField(key, userInfo[key]);
        return error ? { ...acc, [key]: error } : acc;
      }, {});
      // Combine both sets of errors
      const allErrors = { ...formDataErrors, ...userInfoErrors };
      // console.log(allErrors)
      // Check if there are any validation errors
      if (Object.keys(allErrors).length > 0) {
        let showError = true; // Flag to track if an error has been shown
        Object.values(allErrors).forEach(errorMessage => {
          if (showError) {
            toast.error(errorMessage); // Display the first encountered error message via toast notification
            showError = false; // Set flag to false to prevent displaying more than one error
          }
        });
        setErrors(allErrors); // Set errors state with collected errors
        setLoading(false);
        return;
      }
      setLoading(true);
      setFetchError(false);
      setIsEditing(false);
      setIsChanged(false);
      const updatedFormData = {
        ...formData,
        userInfo: {
          ...formData.userInfo, // Preserve existing userInfo properties
          ...userInfo, // Update userInfo with new values from state
        },
      };


      const token = localStorage.getItem("authtoken");
      // Make PUT request to update data with editedData
      const response = await axios.put(
        `${API_URL}users/updateUser/${crn}`,
        { updatedFormData },
        {
          headers: { "auth-token": token },
        },
      );

      if (response.data.success) {
        setLoading(false);
        setShowModal(false);
        toast.success("Succesfully edited data");
      } else {
        toast.error(json.message);
        setLoading(false);
        setShowModal(false);
      }

      // Close the modal after data is submitted successfully
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to edit data");
      setLoading(false); // Set loading state to false in case of error
    }
  };
  const handleEdit = () => {
    // Enable editing mode
    setIsEditing((prevEditing) => !prevEditing);

    // You can implement this functionality based on your requirements
  };
  const handleDeleteStudent = async () => {
    try {
      setLoading(true);
      setFetchError(false);
      setIsChanged(false);
      const token = localStorage.getItem("authtoken");

      const response = await axios.delete(`${API_URL}auth/deleteUser`, {
        headers: {
          "auth-token": token
        },
        data: {
          crn: crn // Pass the crn value as part of the request body
        }
      });

      if (response.data.success) {
        setLoading(false);
        setShowModal3(false);
        setShowModal(false);
        toast.success("Successfully Deleted User");
      } else {
        toast.error(response.data.message); // Use response.data.message to show the error message from the server
        setLoading(false);
        setShowModal3(false);
      }
    } catch (error) {
      console.error("Error deleting User:", error);
      toast.error("Failed to Delete User");
      setLoading(false); // Set loading state to false in case of error
    }
  };


  // Function to handle form field changes
  // Function to handle form field changes
  const handleChangeformData = (e) => {
    const { name, value } = e.target;
    setIsChanged(true);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value, formData),
    }));
  };
  const handleChangePasswordData = (e) => {
    const { name, value } = e.target;
    setIsChanged(true);
    setPasswordState((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value, passwordState),
    }));
  };
  const handleBatchChange = (newDate) => {
    // (newDate);
    setIsChanged(true);
    if (newDate) {
      const year = newDate.$y;

      setuserInfo({ ...userInfo, batch: `${year}-${year + 4}` });
    } else {
      // If newDate is null or undefined, clear the batch value
      setuserInfo({ ...userInfo, batch: '' });
    }
  };
  const handleChangeuserInfo = (e) => {
    const { name, value } = e.target;
    setIsChanged(true);
    setuserInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  return (
    <Container style={{ marginTop: "100px" }}>
      <Grid container justifyContent="center">
        <Grid
          item
          xs={12}
          md={4}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexDirection: "column",
          }}
        >
          {/* Input field to enter CRN */}
          <TextField
            id="crnInput"
            label="CRN"
            variant="outlined"
            sx={{ mb: 2 }}
            fullWidth
            error={!crnError}
            value={crn}
            onChange={(e) => {
              if (validateField("crn", e.target.value)) {
                setCrnError(false);
              } else {
                setCrnError(true);
              }
              setCrn(e.target.value);
            }}
          />
          {/* Button to trigger fetching data */}
          <Button variant="contained" onClick={fetchData} disabled={loading}>
            {loading ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              <Typography>Change User Info</Typography>
            )}
          </Button>
          <Button
            variant="contained"
            onClick={() => handleCheck("password")}
            disabled={loading}
          >
            <Typography>Change Password</Typography>
          </Button>

        </Grid>
      </Grid>

      {/* Modal to display fetched data and edit form */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "700px",
            p: 4,
            bgcolor: "background.paper",
            borderRadius: 2,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {/* Loading indicator while data is being fetched */}
          {/* {loading && <LinearProgress />} */}
          {/* Check if there's an error fetching data */}
          {fetchError ? (
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <p>No data found for the provided CRN.</p>

              <Button
                variant="contained"
                onClick={() => setShowModal(false)}
                sx={{ mr: 2, mb: 2 }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  position: "relative",
                  height: "50px",
                  bgcolor: "background.paper",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Button
                    disabled={loading}
                    variant="contained"
                    onClick={handleEdit}
                    sx={{ mr: 2, mb: 2 }}
                  >
                    Edit
                  </Button>

                  <Button
                    disabled={loading}
                    variant="text"
                    onClick={() => {
                      setShowModal(false);
                      setIsChanged(false);
                      setIsEditing(false);
                    }}
                    sx={{ mr: 4, mb: 2 }}
                  >
                    Cancel
                  </Button>
                </div>
                <div style={{ display: "flex" }}>
                  <IconButton
                    variant="contained"
                    color="primary"
                    onClick={() => setShowModal3(true)}
                    disabled={loading}
                    sx={{ mr: 2, mb: 2 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Button
                    disabled={loading || !isChanged}
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{ mb: 2 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>
              </Box>
              <Box sx={{ marginTop: "10px" }}>
                <hr />
                <TextField
                  label="Email"
                  variant="outlined"
                  sx={{ mb: 2, marginTop: "20px" }}
                  fullWidth
                  placeholder="NameCrn@gndec.ac.in"
                  name="email"
                  value={formData.email}
                  onChange={handleChangeformData}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="College Roll Number"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  fullWidth
                  placeholder="1234567"
                  name="crn"
                  value={formData.crn}
                  onChange={handleChangeformData}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  select
                  label="Verification Status"
                  variant="outlined"
                  fullWidth
                  name="isVerified"
                  value={formData.isVerified}
                  onChange={handleChangeformData}
                  sx={{
                    mb: 2,
                    "& .MuiSelect-select": { textAlign: "left" }, // Aligns the selected value to the left
                  }}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value={true}>true</MenuItem>
                  <MenuItem value={false}>false</MenuItem>

                </TextField>
                <TextField
                  label="University Roll Number"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  fullWidth
                  placeholder="1234567"
                  name="urn"
                  value={userInfo?.urn || null}
                  onChange={handleChangeuserInfo}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Name"
                  name="Name"
                  value={userInfo?.Name}
                  onChange={handleChangeuserInfo}
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Mother's Name"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  fullWidth
                  placeholder="Mother’s Name"
                  name="mother"
                  value={userInfo?.mother}
                  onChange={handleChangeuserInfo}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Father's Name"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  fullWidth
                  placeholder="Father’s Name"
                  name="father"
                  value={userInfo?.father}
                  onChange={handleChangeuserInfo}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Personal Mail"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  fullWidth
                  placeholder="example@gndec.ac.in"
                  name="personalMail"
                  value={userInfo?.personalMail}
                  onChange={handleChangeuserInfo}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Contact"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  fullWidth
                  placeholder="9876543210"
                  name="contact"
                  value={userInfo?.contact}
                  onChange={handleChangeuserInfo}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  select
                  label="Section"
                  variant="outlined"
                  fullWidth
                  name="section"
                  value={userInfo?.section}
                  onChange={handleChangeuserInfo}
                  sx={{
                    mb: 2,
                    "& .MuiSelect-select": { textAlign: "left" }, // Aligns the selected value to the left
                  }}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="A1">A1</MenuItem>
                  <MenuItem value="A2">A2</MenuItem>
                  <MenuItem value="B1">B1</MenuItem>
                  <MenuItem value="B2">B2</MenuItem>
                  <MenuItem value="C1">C1</MenuItem>
                  <MenuItem value="C2">C2</MenuItem>
                  <MenuItem value="D1">D1</MenuItem>
                  <MenuItem value="D2">D2</MenuItem>
                </TextField>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Batch Start Year"

                    views={['year']}
                    renderInput={(params) => <TextField {...params} helperText="Enter starting year only" />}
                    onChange={handleBatchChange}
                    value={admissionYear}
                    sx={{ mb: 2 }}
                    disabled={!isEditing}
                  />
                </LocalizationProvider>
                <TextField
                  select
                  label="Branch"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  fullWidth
                  name="branch"
                  value={userInfo?.branch}
                  onChange={handleChangeuserInfo}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="CSE">
                    Computer Science & Engineering
                  </MenuItem>
                </TextField>
                <TextField
                  label="Mentor's Name"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  fullWidth
                  required
                  name="mentor"
                  placeholder="Your Mentor Name"
                  value={userInfo?.mentor}
                  onChange={handleChangeuserInfo}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  select
                  label="Gender"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  fullWidth
                  required
                  name="gender"
                  value={userInfo?.gender}
                  onChange={handleChangeuserInfo}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Admission Type"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  fullWidth
                  name="admissionType"
                  value={userInfo?.admissionType}
                  onChange={handleChangeuserInfo}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="Non LEET">Non LEET</MenuItem>
                  <MenuItem value="LEET">LEET</MenuItem>
                </TextField>
              </Box>
            </>
          )}
        </Box>
      </Modal>
      <Modal
        open={showModal2}
        onClose={() => setShowModal2(false)}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "700px",
            p: 4,
            bgcolor: "background.paper",
            borderRadius: 2,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {/* Loading indicator while data is being fetched */}
          {/* {loading && <LinearProgress />} */}
          {/* Check if there's an error fetching data */}
          {fetchError ? (
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <p>No data found for the provided CRN.</p>

              <Button
                variant="contained"
                onClick={() => setShowModal2(false)}
                sx={{ mr: 2, mb: 2 }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  position: "relative",
                  height: "50px",
                  bgcolor: "background.paper",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Button
                    disabled={loading}
                    variant="contained"
                    onClick={handleEdit}
                    sx={{ mr: 2, mb: 2 }}
                  >
                    Edit
                  </Button>
                  <Button
                    disabled={loading}
                    variant="text"
                    onClick={() => {
                      setShowModal2(false);
                      setIsChanged(false);
                      setIsEditing(false);
                    }}
                    sx={{ mr: 4, mb: 2 }}
                  >
                    Cancel
                  </Button>
                </div>
                <Button
                  disabled={loading || !isChanged}
                  variant="contained"
                  onClick={hanldeChangePassword}
                  sx={{ mb: 2 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Box>
              <Box sx={{ marginTop: "10px" }}>
                <hr />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Set New Password"
                  value={passwordState.password}
                  type={showPassword ? "text" : "password"} // Show password text if showPassword is true
                  onChange={handleChangePasswordData}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                  helperText={errors.password}
                  error={Boolean(errors.password)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((prev) => !prev)}
                          onMouseDown={(e) => e.preventDefault()}
                          disabled={!isEditing}
                        >
                          {showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  value={passwordState.confirmPassword}
                  type="password"
                  onChange={handleChangePasswordData}
                  InputLabelProps={{ shrink: true }}
                  disabled={!isEditing}
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword}
                />
              </Box>
            </>
          )}
        </Box>
      </Modal>
      <Modal
        open={showModal3}
        onClose={() => setShowModal3(false)}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Box
          sx={{
            width: "700px",
            p: 4,
            bgcolor: "background.paper",
            borderRadius: 2,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {fetchError ? (
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <p>No data found for the provided CRN.</p>

              <Button
                variant="contained"
                onClick={() => setShowModal3(false)}
                sx={{ mr: 2, mb: 2 }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <>
              <Alert
                severity='warning'
              >
                Are you Sure you want to delete this Student data
              </Alert>
              <hr />
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, paddingBlock: 6 }}>
                <Button
                  variant="contained"
                  onClick={() => setShowModal3(false)}
                  sx={{ mr: 2, mb: 2 }}
                >
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleDeleteStudent}
                  sx={{ mr: 2, mb: 2 }}>
                  {loading ? <CircularProgress size={24} color='inherit' /> : 'Submit'}
                </Button>
              </div>
            </>
          )
          }

        </Box>

      </Modal>
      <ToastContainer />
    </Container>
  );
};

export default EditProfile;
