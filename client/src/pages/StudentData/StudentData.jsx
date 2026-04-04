import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Modal,
  Box,
  Typography,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  LinearProgress,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExportExcelComponent from "../../Components/ExportExcelData";
import ExportCsvComponent from "../../Components/ExportCsvData";
const API_URL =
  import.meta.env.VITE_ENV === "production"
    ? import.meta.env.VITE_PROD_BASE_URL
    : import.meta.env.VITE_DEV_BASE_URL;
import VerifyAllComponent from "../../Components/VerifyAll";
import UnVerifyAllComponent from "../../Components/UnVerifyAll";
import { useNavigate } from "react-router-dom";
import {
  fetchTrainingNames,
  initialTrainingNames,
} from "../../utils/TrainingNamesApi";
import {
  fetchUsers,
  changeLock,
  viewCertificate,
  getTrainingOptions,
  fetchBatches,
} from "../../utils/AdminFunctions";
import { TextField } from "@mui/material";
import PlacementModal from "../../Components/PlacementModal";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import { decodeUserRole, decodeAuthToken } from "../../utils/AdminFunctions";

const SuperAdminForm = () => {
  const [users, setUsers] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedTraining, setSelectedTraining] = useState("");
  const [admintype, Setadmintype] = useState(null);
  const [editStatus, setEditStatus] = useState({});
  const [refresh, setRefresh] = useState(false); // Refresh state
  const [loading, setLoading] = useState(true); // Loading state
  const [trainingNames, setTrainingNames] = useState(initialTrainingNames);
  const [allBatches, setallBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [verificationStatus, setVerificationStatus] = useState({});
  const [selectedRowData, setSelectedRowData] = useState(null);
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("authtoken");
    const role = decodeUserRole(token);
    setRole(role);
    const fetchData = async () => {
      try {
        const batches = await fetchBatches();
        setallBatches(batches.batches);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
    const crn = decodeAuthToken(token);
    const admin = crn && crn.length >= 3 ? crn.slice(-1) : crn;

    Setadmintype(admin);
  }, [refresh]);

  useEffect(() => {
    fetchUserDetails();
  }, [selectedBatch, selectedTraining, selectedBranch, refresh]);

  const fetchUserDetails = async () => {
    if (selectedBatch && selectedTraining && selectedBranch) {
      try {
        setLoading(true);


        const usersData = await fetchUsers(selectedBatch, selectedTraining);
        if (usersData) {

          setUsers(usersData);
        } else {

          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUsers([]); // Reset users state or handle as needed
      } finally {

        setLoading(false);

      }
    } else {
      setUsers([]);
      console.warn("Batch, training, or branch selection is missing.");
    }
  };

  const navigateToStats = (data) => {
    return navigate("/superadmin/placementStats", { state: { data } });
  };
  const handleViewCertificate = (row,training,certificateType) => {
    if(selectedTraining==="all"){
      viewCertificate(row, training, certificateType);
    }else{
      viewCertificate(row, selectedTraining);
    }
   
  };

  const columns = useMemo(() => {
    let customColumns = [
      { accessorKey: "crn", header: "CRN" },
      { accessorKey: "userInfo.Name", header: "Name" },
      { accessorKey: "userInfo.urn", header: "URN" },
      { accessorKey: "userInfo.mentor", header: "Mentor" },
      { accessorKey: "userInfo.section", header: "Section" },
      { accessorKey: "userInfo.contact", header: "Contact" },
    ];

    if (selectedTraining) {
      if (selectedTraining === "placementData" ) {
        customColumns.push(
          {
            accessorKey: `${selectedTraining}.isPlaced`,
            header: "Placement Status",
            Cell: ({ row }) =>
              row.original[selectedTraining]?.isPlaced ? "Yes" : "No",
          },
          {
            accessorKey: `${selectedTraining}.highStudy`,
            header: "Higher Study",
            Cell: ({ row }) =>
              row.original[selectedTraining]?.highStudy ? "Yes" : "No",
          },
          {
            accessorKey: `${selectedTraining}.gateStatus`,
            header: "Gate Status",
            Cell: ({ row }) => (row.original[selectedTraining]?.gateStatus ? "Yes" : "No"),
          },
          {
            accessorKey: `${selectedTraining}.package`,
            header: "Package",

          },
          {
            accessorKey: "viewMore",
            header: "View More",
            Cell: ({ row }) => (
              <ExpandCircleDownIcon
                onClick={() => {
                  setSelectedRowData(row.original);
                  setShowModal(true);
                }}
                style={{ cursor: "pointer" }}
              />
            ),
          },
        );
      }
      if (selectedTraining !== "placementData" && selectedTraining!=="all") {
        customColumns.push(
          {
            accessorKey: `${selectedTraining}.technology`,
            header: "Technology",
            Cell: ({ row }) => row.original[selectedTraining]?.technology?.join(" , "),
          },
          {
            accessorKey: `${selectedTraining}.organization`,
            header: "Organization",
          },
          {
            accessorKey: `${selectedTraining}.projectName`,
            header: "Project Name",
          },
          {
            accessorKey: `${selectedTraining}.type`,
            header: "Type",
          },
          {
            accessorKey: `${selectedTraining}.certificate`,
            header: "Certificate",
            Cell: ({ row }) => (
              // console.log(row.original.tr101.certificate) ,
              <PictureAsPdfIcon
                color={row.original[selectedTraining]?.certificate ? "primary":'disabled'}
                onClick={() => handleViewCertificate(row)}
                style={{ cursor: "pointer" }}
              />
            ),
          },
        );
      }
      if(selectedTraining==="all"){
        customColumns.push(
          {
   
            accessorKey: "tr101.certificate",
            header: "Tr101 Certificate",
            Cell: ({ row }) => (
              
              <PictureAsPdfIcon
                color={row.original.tr101?.certificate ? "primary" : 'disabled'}
                onClick={() => handleViewCertificate(row,"tr101")}
                style={{ cursor: "pointer" }}
              />
            ),
          },
          {
            accessorKey: "tr102.certificate",
            header: "Tr102 Certificate",
            Cell: ({ row }) => (
              <PictureAsPdfIcon
                color={row.original.tr102?.certificate ? "primary" : 'disabled'}
                onClick={() => handleViewCertificate(row,"tr102")}
                style={{ cursor: "pointer" }}
              />
            ),
          },
          {
            accessorKey: "tr103.certificate",
            header: "Tr103 Certificate",
            Cell: ({ row }) => (
              <PictureAsPdfIcon
                color={row.original.tr103?.certificate ? "primary" : 'disabled'}
                onClick={() => handleViewCertificate(row,"tr103")}
                style={{ cursor: "pointer" }}
              />
            ),
          },
          {
            accessorKey: "tr104.certificate",
            header: "Tr104 Certificate",
            Cell: ({ row }) => (
              <PictureAsPdfIcon
                color={row.original.tr104?.certificate ? "primary" : "disabled"}
                onClick={() => handleViewCertificate(row,"tr104")}
                style={{ cursor: "pointer" }}
                         />
            ),
          },
          {
            accessorKey: `${selectedTraining}.isPlaced`,
            header: "Placement Status",
            Cell: ({ row }) => (row.original[selectedTraining]?.isPlaced ? "Yes" : "No"),
          },
          {
            accessorKey: `${selectedTraining}.highStudy`,
            header: "Higher Study",
            Cell: ({ row }) => (row.original[selectedTraining]?.highStudy ? "Yes" : "No"),
          },
          {
            accessorKey: `${selectedTraining}.gateStatus`,
            header: "Gate Status",
            Cell: ({ row }) => (row.original[selectedTraining]?.gateStatus ? "Yes" : "No"),
          },
          {
            accessorKey: `${selectedTraining}.package`,
            header: "Package",

          }, 
          {
            accessorKey: "placementData.appointmentLetter",
            header: "Appointment Letter",
            Cell: ({ row }) => (
              <PictureAsPdfIcon
                color={row.original.placementData?.appointmentLetter ? "primary" : "disabled"}
                onClick={() => handleViewCertificate(row, "placementData","appointmentLetter")}
                style={{ cursor: "pointer" }}
              />
            ),
          },
          {
            accessorKey: "placementData.gateCertificate",
            header: "Gate Admit Card/Score Card",
            Cell: ({ row }) => (
              <PictureAsPdfIcon
                color={row.original.placementData?.gateCertificate ? "primary" : "disabled"}
                onClick={() => handleViewCertificate(row, "placementData","gateCertificate")}
                style={{ cursor: "pointer" }}
              />
            ),
          },
          
        );
      }
      // Add the "Verified" and "Mark Verification" columns at the end
      if (selectedTraining !== "all" && selectedTraining !=="placementData"){

      customColumns.push(
        {
          accessorKey: `${selectedTraining}.lock`,
          header: "Verified",
          Cell: ({ row }) =>
            row.original[selectedTraining]?.lock ? "Yes" : "No",
        },
        {
          accessorKey: "edit",
          header: "Mark Verification",
          Cell: ({ row }) => (
            <VerificationIcon
              lockStatus={row.original[selectedTraining]?.lock}
              handleLock={handleLock}
              row={row}
            />
          ),
        },
      );
          }
    }

    return customColumns;
  }, [selectedTraining, users, editStatus, verificationStatus, refresh]);

  const VerificationIcon = ({ lockStatus, handleLock, row }) => {
    const [loading, setLoading] = useState(false);
    const crn = row.original.crn;
    const currentStatus =
      verificationStatus[crn] !== undefined
        ? verificationStatus[crn]
        : lockStatus;

    const handleClick = async () => {
      setLoading(true);
      await handleLock(row);
      setLoading(false);
    };

    if (loading) {
      return <CircularProgress size={24} />;
    }
    return currentStatus ? (
      <CheckCircleIcon
        style={{ color: "green", cursor: "pointer" }}
        onClick={handleClick}
      />
    ) : (
      <QuestionMarkIcon
        style={{ color: "red", cursor: "pointer" }}
        onClick={handleClick}
      />
    );
  };

  const handleLock = async (row) => {
    try {
      const crn = row.original.crn;
      const currentStatus =
        verificationStatus[crn] !== undefined
          ? verificationStatus[crn]
          : row.original[selectedTraining].lock;
      const newStatus = !currentStatus;
      let successMessage = await changeLock(
        crn,
        currentStatus,
        selectedTraining === "placementData",
        selectedTraining,
      );
      if (successMessage) {
        setVerificationStatus((prevStatus) => ({
          ...prevStatus,
          [crn]: newStatus,
        }));
        toast.success("User Data Verification Changed");
        return true;
      } else {
        toast.error("Error in Status Changing");
        return false;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const table = useMaterialReactTable({
    data: users,
    columns,
    localization: {
      noRecordsToDisplay: 'Please Select Branch , Batch and Training type to view data.'
    },


  });

  // Function to handle refreshing data after verification status change
  const handleRefresh = () => {
    console.log("handle refresh called");
    setRefresh((prevRefresh) => !prevRefresh);
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
  };
  const getAdminTrainingOptions = () => {
    return getTrainingOptions(admintype, trainingNames);
  };
  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
  };

  const handleTrainingChange = (event) => {
    setSelectedTraining(event.target.value);
  };

  return (
    <div>
      {loading && <LinearProgress />}
      <Grid
        container
        spacing={2}
        justifyContent="space-around"
        sx={{ padding: "0 40px", marginTop: "40px" }}
      >
        <Grid item style={{ marginBottom: 20 }}>
          <FormControl style={{ width: 200 }}>
            <TextField
              select
              value={selectedBatch}
              label={"Batch"}
              variant="outlined"
              fullWidth
              required
              name="Select Batch"
              onChange={handleBatchChange}
            >
              <MenuItem value="" sx={{ maxHeight: "200px" }}>
                None
              </MenuItem>
              {allBatches.map((data, index) => (
                <MenuItem key={index} value={data}>
                  {data}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item style={{ marginBottom: 20 }}>
          <FormControl style={{ width: 200 }}>
            <TextField
              required
              select
              name={"Select Branch"}
              label={"Branch"}
              value={selectedBranch}
              onChange={handleBranchChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="CSE">Computer Science & Engineering</MenuItem>
            </TextField>
          </FormControl>
        </Grid>
        {role === "superadmin" && (
          <Grid item style={{ marginBottom: 20 }}>
            <FormControl style={{ width: 200 }}>
              <TextField
                required
                value={selectedTraining}
                select
                label={"Training"}
                onChange={handleTrainingChange}
              >
                <MenuItem value="">None</MenuItem>
                {Array.from(
                  { length: trainingNames[0]["Training_No"] },
                  (_, index) => {
                    const trainingNumber = index + 1;
                    const trainingName =
                      trainingNames[0][`Training${trainingNumber}_name`];
                    return (
                      <MenuItem
                        key={`tr${trainingNumber}`}
                        value={`tr10${trainingNumber}`}
                      >
                        {trainingName}
                      </MenuItem>
                    );
                  },
                )}
                <MenuItem value="placementData">
                  {trainingNames[0]["Placement_name"]}
                </MenuItem>
                <MenuItem value="all">All</MenuItem>
              </TextField>
            </FormControl>
          </Grid>
        )}
        {role === "admin" && (
          <Grid item style={{ marginBottom: 20 }}>
            <FormControl style={{ width: 200 }}>
              <TextField
                select
                label={"Select Training"}
                value={selectedTraining}
                onChange={handleTrainingChange}
              >
                {getAdminTrainingOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
        )}
      </Grid>

      {loading ? ( // Render loader if loading is true
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "40px",
              marginBottom: "100px",
              width: "98vw",
              height: "100vh",
            }}
          >
            <Box
              sx={{
                width: "90vw",
                height: "50vh",
                border: 1,
                borderColor: "lightgray",
                borderRadius: 1,
                backgroundColor: "white",
              }}
            >
              <Skeleton
                animation={"wave"}
                sx={{
                  width: "300px",
                  height: "60px",
                  marginLeft: 2,
                  marginBlock: 1,
                }}
              />
              <hr />

              <Box
                sx={{
                  paddingInline: 2,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Skeleton
                  animation={"wave"}
                  sx={{
                    width: "20vw",
                    height: "40px",
                  }}
                />
                <Skeleton
                  animation={"wave"}
                  sx={{
                    width: "20vw",
                    height: "40px",
                  }}
                />
                <Skeleton
                  animation={"wave"}
                  sx={{
                    width: "20vw",
                    height: "40px",
                  }}
                />
                <Skeleton
                  animation={"wave"}
                  sx={{
                    width: "20vw",
                    height: "40px",
                  }}
                />
              </Box>
            </Box>
          </div>
        </>
      ) : (
        <div
          style={{
            padding: "0 40px",
            marginBottom: "100px",
          }}
        >
          <Card variant="outlined" style={{ marginBottom: "50px" }}>
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "row", gap: "10px" }}
              >
                <ExportCsvComponent
                  data={users}
                  columns={columns}
                  selectedTraining={selectedTraining}
                />
                <ExportExcelComponent
                  data={users}
                  columns={columns}
                  selectedTraining={selectedTraining}
                />
                <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
                  {selectedTraining == "placementData" && (
                    <Button
                      onClick={() => navigateToStats(users)}
                      variant="contained"
                      color="primary"
                    >
                      View Placement Stats
                    </Button>
                  )}
                </div>
              </div>

              {selectedTraining && (
                <div
                  style={{
                    marginTop: "10px",
                    marginRight: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <VerifyAllComponent
                    selectedTraining={selectedTraining}
                    refresh={refresh}
                    onRefresh={handleRefresh}
                    batch={selectedBatch}
                  />
                  <UnVerifyAllComponent
                    selectedTraining={selectedTraining}
                    refresh={refresh}
                    onRefresh={handleRefresh}
                      batch={selectedBatch}
                  />
                </div>
              )}
            </div>
            <MaterialReactTable table={table} />
          </Card>

          {showModal && (
            <PlacementModal
              showModal={showModal}
              onClose={() => setShowModal(false)}
              placementData={selectedRowData}
            />
          )}

          <ToastContainer />
        </div>
      )}
    </div>
  );
};

export default SuperAdminForm;
