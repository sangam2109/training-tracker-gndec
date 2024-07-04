const express = require('express');
const router = express.Router();
const SignUp = require('../models/UserInfo').SignUp;

router.get('/tr101/:id', async (req, res) => {
    try {
        const id = req.params.id;
         
        // Assuming SignUp model has a method to fetch certificates, adjust as per your actual model
        const user = await SignUp.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found or certificate not available' });
        }

        const base64Certificate = user.tr101.certificate.replace(/^.+,/, ''); // Adjust this based on your schema

        // Convert base64 to buffer
        const certificateBuffer = Buffer.from(base64Certificate, 'base64');
        const fileName = `${user.userInfo.Name}_${user.userInfo.urn}_tr101.pdf`.replace(/[^a-zA-Z0-9-_\.]/g, '_');
       
        // Set response headers for file download
        res.set({
            'Content-Type': 'application/pdf', // Adjust the content type as per your file type
            'Content-Disposition': 'inline; certificate.pdf', // Adjust filename as per your requirement
        });

        res.send(certificateBuffer);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error occurred' });
    }
});
router.get('/tr102/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Assuming SignUp model has a method to fetch certificates, adjust as per your actual model
        const user = await SignUp.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found or certificate not available' });
        }

        const base64Certificate = user.tr102.certificate.replace(/^.+,/, ''); // Adjust this based on your schema

        // Convert base64 to buffer
        const certificateBuffer = Buffer.from(base64Certificate, 'base64');
        const fileName = `${user.userInfo.Name}_${user.userInfo.urn}_tr101.pdf`.replace(/[^a-zA-Z0-9-_\.]/g, '_');
       
        // Set response headers for file download
        res.set({
            'Content-Type': 'application/pdf', // Adjust the content type as per your file type
            'Content-Disposition': 'inline; certificate.pdf', // Adjust filename as per your requirement
        });

        res.send(certificateBuffer);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error occurred' });
    }
});
router.get('/tr103/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Assuming SignUp model has a method to fetch certificates, adjust as per your actual model
        const user = await SignUp.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found or certificate not available' });
        }

        const base64Certificate = user.tr103.certificate.replace(/^.+,/, ''); // Adjust this based on your schema

        // Convert base64 to buffer
        const certificateBuffer = Buffer.from(base64Certificate, 'base64');
        const fileName = `${user.userInfo.Name}_${user.userInfo.urn}_tr101.pdf`.replace(/[^a-zA-Z0-9-_\.]/g, '_');
       
        // Set response headers for file download
        res.set({
            'Content-Type': 'application/pdf', // Adjust the content type as per your file type
            'Content-Disposition': 'inline; certificate.pdf', // Adjust filename as per your requirement
        });

        res.send(certificateBuffer);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error occurred' });
    }
});
router.get('/tr104/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Assuming SignUp model has a method to fetch certificates, adjust as per your actual model
        const user = await SignUp.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found or certificate not available' });
        }

        const base64Certificate = user.tr101.certificate.replace(/^.+,/, ''); // Adjust this based on your schema

        // Convert base64 to buffer
        const certificateBuffer = Buffer.from(base64Certificate, 'base64');
        const fileName = `${user.userInfo.Name}_${user.userInfo.urn}_tr101.pdf`.replace(/[^a-zA-Z0-9-_\.]/g, '_');
       
        // Set response headers for file download
        res.set({
            'Content-Type': 'application/pdf', // Adjust the content type as per your file type
            'Content-Disposition': 'inline; certificate.pdf', // Adjust filename as per your requirement
        });

        res.send(certificateBuffer);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error occurred' });
    }
});
router.get('/appointmentLetter/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Assuming SignUp model has a method to fetch certificates, adjust as per your actual model
        const user = await SignUp.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found or certificate not available' });
        }

        const base64Certificate = user.placementData.appointmentLetter.replace(/^.+,/, ''); // Adjust this based on your schema

        // Convert base64 to buffer
        const certificateBuffer = Buffer.from(base64Certificate, 'base64');
        const fileName = `${user.userInfo.Name}_${user.userInfo.urn}_tr101.pdf`.replace(/[^a-zA-Z0-9-_\.]/g, '_');
       
        // Set response headers for file download
        res.set({
            'Content-Type': 'application/pdf', // Adjust the content type as per your file type
            'Content-Disposition': 'inline; certificate.pdf', // Adjust filename as per your requirement
        });

        res.send(certificateBuffer);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error occurred' });
    }
});
router.get('/gateCertificate/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Assuming SignUp model has a method to fetch certificates, adjust as per your actual model
        const user = await SignUp.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found or certificate not available' });
        }

        const base64Certificate = user.placementData.gateCertificate.replace(/^.+,/, ''); // Adjust this based on your schema

        // Convert base64 to buffer
        const certificateBuffer = Buffer.from(base64Certificate, 'base64');
        const fileName = `${user.userInfo.Name}_${user.userInfo.urn}_tr101.pdf`.replace(/[^a-zA-Z0-9-_\.]/g, '_');
       
        // Set response headers for file download
        res.set({
            'Content-Type': 'application/pdf', // Adjust the content type as per your file type
            'Content-Disposition': 'inline; certificate.pdf', // Adjust filename as per your requirement
        });

        res.send(certificateBuffer);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error occurred' });
    }
});
module.exports = router;