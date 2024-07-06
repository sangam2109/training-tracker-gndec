const express = require('express');
const router = express.Router();
const Logs=require('../../models/logs')
const fetchuser = require("../../middleware/fetchUser");
const isSuperAdmin = require("../../middleware/isSuperAdmin");

router.get('/getalllogs', fetchuser,isSuperAdmin, async (req, res) => {
    try {

        const allLogs = await Logs.find({ })
        if (!allLogs) {
            return res.status(404).json({ success: false, message: 'Logs not found' });
        }
        return res.status(200).json({ success: true, data: allLogs });

    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error occurred' });
    }
});

module.exports = router;