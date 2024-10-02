const express = require('express');
const router = express.Router();
const SignUp = require('../models/UserInfo').SignUp;
const fetchuser = require('../middleware/fetchUser');
const isAdmin = require('../middleware/isAdmin');
const logEntry = require('../models/logs')
const getUserCrn = require('../utils/getAdminDetails')
const isSuperAdmin = require('../middleware/isSuperAdmin');

router.get('/getuser/:crn', fetchuser, async (req, res) => {
  try {
    const crn = req.params.crn;
    const user = await SignUp.findOne({ crn: crn })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, data: user });

  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error occurred' });
  }
});
router.get('/getallusers', fetchuser, isSuperAdmin, async (req, res) => {
  try {
    // Fetch all users
    const users = await SignUp.find({ role: 'user' }).select('-password -tr101.certificate -tr102.certificate -tr103.certificate -tr104.certificate -placementData.appointmentLetter -placementData.gateCertificate');
  
    // Return the list of users
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error occurred' });
  }
});
router.put('/updateUser/:crn', fetchuser, isAdmin, async (req, res) => {
  const { crn } = req.params; // Get CRN from request parameters
  const updatedFormData = req.body.updatedFormData; // Get updated user data from request body
  try {
   
    const updatedUser = await SignUp.findOneAndUpdate(
      { crn: crn }, // Filter condition: find user by CRN
      {
        $set: {
          email: updatedFormData.email,
          crn: updatedFormData.crn,
          'userInfo.mother': updatedFormData.userInfo.mother,
          'userInfo.Name': updatedFormData.userInfo.Name,
          'userInfo.contact': updatedFormData.userInfo.contact,
          'userInfo.urn': updatedFormData.userInfo.urn,
          'userInfo.branch': updatedFormData.userInfo.branch,
          'userInfo.batch': updatedFormData.userInfo.batch,
          'userInfo.gender': updatedFormData.userInfo.gender,
          'userInfo.admissionType': updatedFormData.userInfo.admissionType,
          'userInfo.mentor': updatedFormData.userInfo.mentor,
          'userInfo.father': updatedFormData.userInfo.father,
          'userInfo.personalMail': updatedFormData.userInfo.personalMail,
          'userInfo.section': updatedFormData.userInfo.section,
        }
      },
      { new: true } // Return updated user data
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // (updatedUser)
    // User updated successfully
    const token = req.header('auth-token')
    const adminCrn = getUserCrn(token)
    const newLogEntry = new logEntry({
      user: adminCrn,
      logMessage: `Update userDetails of ${crn}`
    });
    newLogEntry.save()
    return res.status(200).json({ success: true, data: updatedUser, message: "Data Updated Successfully" });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Internal server error occurred' });
  }
});

router.put('/updateVerification/:crn', fetchuser, isAdmin, async (req, res) => {
  const { crn } = req.params;
  try {
    // Find the user by CRN
    const user = await SignUp.findOne({ crn: crn });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ success: false, message: 'User for this CRN does not exist' });
    }

    // Check if the user is already verified
    
    if (user.isVerified) {
      return res.status(200).json({ success: true, message: 'User is already verified' });
    }

    // If not verified, update the verification status
    const updatedUser = await SignUp.findOneAndUpdate(
      { crn: crn }, // Filter condition: find user by CRN
      { $set: { isVerified: true } }, // Set the isVerified field to true
      { new: true } // Return the updated user data
    );

    return res.status(200).json({ success: true, message: "Student Verified Successfully" });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Internal server error occurred' });
  }
});


router.get('/getUsersByBatch', fetchuser, isAdmin, async (req, res) => {
  try {
    const { batch, trainingType } = req.query;
    if (!batch || !trainingType) {
      return res.status(400).json({ success: false, message: 'Batch and training type are required' });
    }

    const allowedTrainingTypes = ['tr101', 'tr102', 'tr103', 'tr104', 'placementData','all'];
    if (!allowedTrainingTypes.includes(trainingType)) {
      return res.status(400).json({ success: false, message: 'Invalid training type' });
    }
    // Fetch users with the specified batch and role 'user'
    let users;
    if(trainingType==='all'){
      users = await SignUp.find({
        'userInfo.batch': batch,
        role: 'user'
      }).select(`crn email tr101.certificate tr102.certificate tr103.certificate tr104.certificate placementData userInfo`);
    }else{
      users = await SignUp.find({
        'userInfo.batch': batch,
        role: 'user'
      }).select(`crn email ${trainingType} userInfo`);
    }
   

    // Return the list of users with the specified training type and user data
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error occurred' });
  }
});
router.get('/getUsersByPreviousBatches', fetchuser, isAdmin, async (req, res) => {
  try {
    const { years, trainingType } = req.query; // Add trainingType to destructuring

    const currentYear = new Date().getFullYear();

    if (!years || !trainingType) { // Check for trainingType
      return res.status(400).json({ success: false, message: 'Years and training type are required' });
    }

    const yearInt = parseInt(years);
    if (isNaN(yearInt) || yearInt <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid years value' });
    }

    const batches = [];
    for (let i = 0; i < yearInt; i++) {
      const startYear = currentYear - i;
      const endYear = startYear + 4;
      batches.push(`${startYear}-${endYear}`);
    }

    const users = await SignUp.find({
      'userInfo.batch': { $in: batches },
      role: 'user'
    }).select(`crn email ${trainingType} userInfo`);

    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error occurred' });
  }
});

module.exports = router;