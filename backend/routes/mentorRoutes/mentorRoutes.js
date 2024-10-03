const express = require('express');
const router = express.Router();
const Mentor = require('../../models/mentors'); // Assuming you have mentor model here
const fetchuser = require("../../middleware/fetchUser"); // Middleware to authenticate the user
const isSuperAdmin = require("../../middleware/isSuperAdmin"); // Middleware to check if user is superadmin

// 1. Get all mentors
router.get('/getallmentors',  fetchuser, async (req, res) => {
    try {
        const allMentors = await Mentor.find({});
        if (!allMentors || allMentors.length === 0) {
            return res.status(404).json({ success: false, message: 'No mentors found' });
        }
        return res.status(200).json({ success: true, mentors: allMentors });
    } catch (error) {
        console.error('Error fetching mentors:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// 2. Add a mentor (SuperAdmin only)
router.post('/addmentor', fetchuser, isSuperAdmin, async (req, res) => {
    try {
        const { name } = req.body;

        // Check if mentor name already exists
        const existingMentor = await Mentor.findOne({ name });
        if (existingMentor) {
            return res.status(400).json({ success: false, message: 'Mentor already exists' });
        }

        // Create and save the new mentor
        const newMentor = new Mentor({ name });
        await newMentor.save();

        return res.status(201).json({ success: true, message: 'Mentor added successfully', data: newMentor });
    } catch (error) {
        console.error('Error adding mentor:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// 3. Edit a mentor (SuperAdmin only)
router.put('/editmentor/:id', fetchuser, isSuperAdmin, async (req, res) => {
    try {
        const { id } = req.params; // Mentor ID from the route parameter
        const { name } = req.body; // New name for the mentor

        // Update the mentor's name
        const updatedMentor = await Mentor.findByIdAndUpdate(id, { name }, { new: true });

        if (!updatedMentor) {
            return res.status(404).json({ success: false, message: 'Mentor not found' });
        }

        return res.status(200).json({ success: true, message: 'Mentor updated successfully', data: updatedMentor });
    } catch (error) {
        console.error('Error editing mentor:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// 4. Delete a mentor (SuperAdmin only)
router.delete('/deletementor/:id', fetchuser, isSuperAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the mentor
        const deletedMentor = await Mentor.findByIdAndDelete(id);

        if (!deletedMentor) {
            return res.status(404).json({ success: false, message: 'Mentor not found' });
        }

        return res.status(200).json({ success: true, message: 'Mentor deleted successfully' });
    } catch (error) {
        console.error('Error deleting mentor:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
