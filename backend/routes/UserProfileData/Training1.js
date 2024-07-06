const express = require('express');
const Tr101 = require('../../models/UserInfo').Tr101;
const SignUpdata = require('../../models/UserInfo').SignUp;
const router = express.Router();
const fetchuser = require('../../middleware/fetchUser');
const isAdmin = require('../../middleware/isAdmin');
const logEntry=require('../../models/logs')
const getUserCrn=require('../../utils/getAdminDetails')
// Route to create a new user profile
router.post('/', fetchuser, async (req, res) => {
    try {
        const { organization, technology, projectName, type, certificate, organizationType } = req.body.formData;
        const crn = req.body.crn
        const userInfo = await SignUpdata.findOne({ crn: crn });

        if (!userInfo) {
            return res.status(404).json({ message: 'UserInfo not found' });
        }
        if (userInfo.tr101.lock) {
            return res.status(404).json({ message: 'You are already locked not play with me buddy' });
        }

        // Create a new user profile object
        const TR101 = new Tr101({
            organization,
            technology,
            projectName,
            type,
            certificate,
            organizationType
        });

        userInfo.tr101 = TR101;

        const savedUserInfo = await userInfo.save();

        // Respond with the saved userInfo
        res.status(201).json({ success: true, data: savedUserInfo });;
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.post('/updatelock', fetchuser, isAdmin, async (req, res) => {
    try {
        const { crn, lock } = req.body;
        const trainingField = "tr101.lock";
        userData = await SignUpdata.findOneAndUpdate(
            { crn: crn },
            { [trainingField]: lock },
            { new: true }
        );

        if (!userData) {
            return res.status(404).json({ success: false, message: 'User data not found' });
        }
        const token = req.header('auth-token')
        const adminCrn=getUserCrn(token)
        const newLogEntry = new logEntry({
            user: adminCrn,
            logMessage: `Verified Status for ${crn} is updated to ${lock} in tr101`
        });
        newLogEntry.save()
            
        // Respond with the updated user data
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
router.get('/:crn', fetchuser, async (req, res) => {
    try {
        const crn = req.params.crn;
        const userInfo = await SignUpdata.findOne({ crn: crn }).populate('tr101');

        if (!userInfo) {
            return res.status(404).json({ message: 'UserInfo not found' });
        }

        // Respond with the user information
        res.status(200).json({ success: true, data: userInfo.tr101 });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.post('/verifyall', fetchuser, isAdmin, async (req, res) => {
    try {
        // Get all users with the role "user"
        const {batch}=req.body
        
        const usersToUpdate = await SignUpdata.find({ role: 'user', 'userInfo.batch': batch });
        
        if (usersToUpdate.length === 0) {
            return res.status(404).json({ message: 'No users found with the specified batch and role' });
        }

        // Update the lock status for all users
        const updatedUsers = await Promise.all(usersToUpdate.map(async (user) => {
            try {
                if (user.tr101) {
                    user.tr101.lock = true; // Set lock status to true
                    await user.save();
                } 
                return user;
            } catch (err) {
                console.error(`Error updating user with CRN ${user.crn}: ${err.message}`);
                throw err; // Propagate error to stop execution
            }
        }));
        const token = req.header('auth-token')
        const adminCrn = getUserCrn(token)
        const newLogEntry = new logEntry({
            user: adminCrn,
            logMessage: `Verified Status for all Students of ${batch} is updated to true`
        });
        newLogEntry.save()
        // Respond with the updated user data
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.post('/unverifyall', fetchuser, isAdmin, async (req, res) => {
    try {
        // Get all users with the role "user"
        const { batch } = req.body
        
        const usersToUpdate = await SignUpdata.find({ role: 'user', 'userInfo.batch': batch });
        
        if (usersToUpdate.length === 0) {
            return res.status(404).json({ message: 'No users found with the specified batch and role' });
        }

        // Update the lock status for all users
        const updatedUsers = await Promise.all(usersToUpdate.map(async (user) => {
            try {
                if (user.tr101) {
                    user.tr101.lock = false; // Set lock status to true
                    await user.save();
                } 
                return user;
            } catch (err) {
                console.error(`Error updating user with CRN ${user.crn}: ${err.message}`);
                throw err; // Propagate error to stop execution
            }
        }));
        const token = req.header('auth-token')
        const adminCrn = getUserCrn(token)
        const newLogEntry = new logEntry({
            user: adminCrn,
            logMessage: `Verified Status for all Students of ${batch} is updated to false`
        });
        newLogEntry.save()

        // Respond with the updated user data
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
