const express = require("express");
const adminControl = require("../../models/adminControl");
const router = express.Router();
const fetchuser = require("../../middleware/fetchUser");
const isAdmin = require("../../middleware/isAdmin");
const { SignUp } = require("../../models/UserInfo");
const logEntry = require('../../models/logs')
const getUserCrn = require('../../utils/getAdminDetails')

router.post("/trainingNames", fetchuser, isAdmin, async (req, res) => {
    try {
        const {
            Training_No,
            Training1_name,
            Training2_name,
            Training3_name,
            Training4_name,
            Placement_name,
        } = req.body;

        // Assuming you have a unique identifier to find the document, for example, its ID
        const filter = {}; // No filter needed to update the first document

        const update = {
            Training_No,
            Training1_name,
            Training2_name,
            Training3_name,
            Training4_name,
            Placement_name,
        };

        const options = { new: true }; // To return the updated document

        const updatedDocument = await adminControl.findOneAndUpdate(
            filter,
            update,
            options,
        );

        if (!updatedDocument) {
            return res.status(404).json({ success: false, message: "Document not found or not updated" });
        }
        const token = req.header('auth-token')
        const adminCrn = getUserCrn(token)
        const newLogEntry = new logEntry({
            user: adminCrn,
            logMessage: `Changed Training number or names`
        });
        newLogEntry.save()

        res.status(200).json({ success: true, data: updatedDocument });
    } catch (error) {
        console.error("Error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
});


router.get("/trainingNames", async (req, res) => {
    try {
        const Training_names = await adminControl.find({});

        if (!Training_names) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, data: Training_names });
    } catch (error) {
        console.error("Error:", error);
        res
            .status(500)
            .json({ success: false, message: "Internal server error occurred" });
    }
});

router.get("/getBatches", fetchuser, isAdmin, async (req, res) => {
    try {
        // Fetch all users
        const users = await SignUp.find({ role: "user" }).select(
            "userInfo.batch -_id",
        );
        // Extract unique batches
        const batches = [...new Set(users.map((user) => user.userInfo.batch))];

        // Return the list of unique batches
        return res.status(200).json({ success: true, data: batches });
    } catch (error) {
        console.error("Error:", error);
        res
            .status(500)
            .json({ success: false, message: "Internal server error occurred" });
    }
});

module.exports = router;
