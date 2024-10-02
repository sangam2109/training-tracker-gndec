
import { ToastContainer, toast } from 'react-toastify';

export function handleFormErrors(formData, isHighstudy) {

  const formErrors = {};
  if (formData.isPlaced) {
    if (!formData.company.trim()) {
      formErrors.company = 'Company name cannot be blank';
      toast.error(formErrors.company);
      return;
    } else if (!formData.designation) {
      formErrors.designation = 'Designation cannot be blank';
      toast.error(formErrors.designation);
      return;
    } else if (!formData.appointmentNo) {
      formErrors.appointmentNo = 'Appointment No is required ';
      toast.error(formErrors.appointmentNo);
      return;
    } else if (!formData.appointmentDate) {
      formErrors.appointmentDate = 'Appointment Date cannot be blank';
      toast.error(formErrors.appointmentDate);
      return;
    } else if (!formData.appointmentLetter) {
      formErrors.appointmentLetter = 'Appointment Letter cannot be blank';
      toast.error(formErrors.appointmentLetter);
      return;
    } else if (!formData.package) {
      formErrors.package = 'Package cannot be blank';
      toast.error(formErrors.package);
      return;
    }
  } else if (formData.isPlaced === null) {
    formErrors.isPlaced = 'Placed or Not field cannot be blank';
    toast.error(formErrors.isPlaced);
    return;
  } else if (formData.highStudy === null) {
    formErrors.highStudy = 'High Study field cannot be blank';
    toast.error(formErrors.highStudy);
    return;
  } else if (isHighstudy && !formData.highStudyplace) {
    formErrors.highStudyplace = "Place of High Study Cannot be blank";
    toast.error(formErrors.highStudyplace);
    return;
  } else if (formData.gateStatus === null) {

    formErrors.gateStatus = "Gate Status Field Cannot Be Blank";
    toast.error(formErrors.gateStatus);
    return;
  }
  else if (formData.gateStatus && !formData.gateCertificate) {
    formErrors.gateCertificate = "Please upload Gate Admit Card/ ScoreCard";
    toast.error(formErrors.gateCertificate);
    return;
  }
  return formErrors;
}

export function handleFileErrors(appointmentFiledata,optionalCertificate) {
  const fileErrors = {};

  if (!isEmptyObject(appointmentFiledata) && !optionalCertificate) {
    const sizestring = appointmentFiledata.size
    const sizeValue = parseInt(sizestring.replace(/\D/g, ''), 10);
    if (appointmentFiledata.type !== "application/pdf") {
      fileErrors.appointmentLetter = "Document must be in PDF format";
      toast.error(fileErrors.appointmentLetter);
      return;
    } else if (sizeValue > 500) {
      fileErrors.appointmentLetter = "Document size exceeds 500 KB";
      toast.error(fileErrors.appointmentLetter);
      return;
    }
  }


  return fileErrors;
}

function isEmptyObject(obj) {
  return typeof obj === 'object' && Object.keys(obj).length === 0 && obj.constructor === Object;
}


//Change Student Data Errors

// validationUtils.js

// Define error messages for each field
export const errorMessages = {
  password: "Password must be at least 8 characters long",
  confirmPassword: "Passwords do not match",
  email: "Invalid email format",
  crn: "Invalid CRN",
  isVerified: "Invalid verification status",
  urn: "Invalid university roll number",
  Name: "Name is required",
  mother: "Mother's name is required",
  father: "Father's name is required",
  personalMail: "Invalid personal email format",
  contact: "Invalid contact number",
  section: "Invalid section",
  branch: "Invalid branch",
  mentor: "Mentor's name is required",
  gender: "Invalid gender",
  admissionType: "Invalid admission type",
};

// Function to validate field
export const validateField = (fieldName, value, formData) => {
  switch (fieldName) {
    case "password":
      return value.length >= 8 ? "" : errorMessages.password;
    case "confirmPassword":
      return value === formData?.password ? "" : errorMessages.confirmPassword;
    case "email":
      return value.endsWith('@gndec.ac.in')
        ? ""
        : errorMessages.email;
    case "crn":
      return /^\d{7}$|^Tr\d{3}$/.test(value) ? "" : errorMessages.crn;
    case "isVerified":
      return typeof value === "boolean" ? "" : errorMessages.isVerified;
    case "urn":
      return /^\d{7}$/.test(value) ? "" : errorMessages.urn;
    case "Name":
      return value.trim() !== "" ? "" : errorMessages.Name;
    case "mother":
      return value.trim() !== "" ? "" : errorMessages.mother;
    case "father":
      return value.trim() !== "" ? "" : errorMessages.father;
    case "personalMail":
      return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)
        ? ""
        : errorMessages.personalMail;
    case "contact":
      return /^\d{10}$/.test(value) ? "" : errorMessages.contact;
    case "section":
      return ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2"].includes(value)
        ? ""
        : errorMessages.section;
    case "branch":
      return value === "CSE" ? "" : errorMessages.branch;
    case "mentor":
      return value.trim() !== "" ? "" : errorMessages.mentor;
    case "gender":
      return ["Male", "Female"].includes(value) ? "" : errorMessages.gender;
    case "admissionType":
      return ["Non LEET", "LEET"].includes(value)
        ? ""
        : errorMessages.admissionType;
    default:
      return "";
  }
};
