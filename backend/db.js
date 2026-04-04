const mongoose = require("mongoose");
const adminControl = require("./models/adminControl");
const { SignUp } = require("./models/UserInfo");
require("dotenv").config();
const { initializeMentors } = require("./utils/IntilializeMentors");

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

const db = async () => {
    try {
        await mongoose.connect(URI);
        console.log("connected mongodb successfully");

        const adminControlsCount = await adminControl.countDocuments({});
        if (adminControlsCount === 0) {
            await initializeAdminControls();
        }

        const usersCount = await SignUp.countDocuments({});
        if (usersCount === 0) {
            await initializeUsers();
        }
        await initializeMentors();
    } catch (error) {
        console.log("Some error occured", error);
    }
};
async function initializeAdminControls() {
    try {
        const adminControls = new adminControl({
            Training_No: 4,
            Training1_name: "Training 101",
            Training2_name: "Training 102",
            Training3_name: "Training 103",
            Training4_name: "Training 104",
            Placement_name: "Placement Data",
        });
        await adminControls.save();
        console.log("Initialized admincontrols collection with a document");
    } catch (error) {
        console.error("Error initializing admincontrols collection:", error);
    }
}
async function initializeUsers() {
    try {
        const user1 = new SignUp({
            crn: "Tr000",
            email: "superadmin@gmail.com",
            password: "$2b$10$Ic1aWmmauO7H.sJqZhD1cO8rSiMOe9tPisZRxsH9IHiwIyTSjogZC",
            role: "superadmin",
            isVerified: true,
            userInfo: {
                urn: 1111111,
                branch: "Computer Science & Enginnering",
            },
            tr101: { technology: [], lock: false },
            tr102: { technology: [], lock: false },
            tr103: { technology: [], lock: false },
            tr104: { technology: [], lock: false },
            placementData: { lock: false },
        });
        await user1.save();
        const user2 = new SignUp({
            crn: "Tr101",
            email: "training101@gmail.com",
            password: "$2b$10$aMjiZo7e3QLqF8RZtlXmGeBjOdLuRKeTMhk/4b/9N7Hc5iw/itUkK",
            role: "admin",
            isVerified: true,
            userInfo: {
                urn: 1111112,
                branch: "Computer Science & Enginnering",
            },
            tr101: { technology: [], lock: false },
            tr102: { technology: [], lock: false },
            tr103: { technology: [], lock: false },
            tr104: { technology: [], lock: false },
            placementData: { lock: false },
        });
        await user2.save();
        const user3 = new SignUp({
            crn: "Tr102",
            email: "training102@gmail.com",
            password: "$2b$10$NWG7K2Mj7STpFFigLGZcF.XV2szRiZd7bM7t09ASUTkJzqQI65KRy",
            role: "admin",
            isVerified: true,
            userInfo: {
                urn: 1111113,
                branch: "Computer Science & Enginnering",
            },
            tr101: { technology: [], lock: false },
            tr102: { technology: [], lock: false },
            tr103: { technology: [], lock: false },
            tr104: { technology: [], lock: false },
            placementData: { lock: false },
        });
        await user3.save();
        const user4 = new SignUp({
            crn: "Tr103",
            email: "training103@gmail.com",
            password: "$2b$10$6IkHglNOJYUjumeMiA9A1Op3AokqYgoQesdDaki0UUkRtDFGfY2Ta",
            role: "admin",
            isVerified: true,
            userInfo: {
                urn: 1111114,
                branch: "Computer Science & Engineering",
            },
            tr101: { technology: [], lock: false },
            tr102: { technology: [], lock: false },
            tr103: { technology: [], lock: false },
            tr104: { technology: [], lock: false },
            placementData: { lock: false },
        });
        await user4.save();
        const user5 = new SignUp({
            crn: "Tr104",
            email: "training104@gmail.com",
            password: "$2b$10$zZH2klzWP1SJm0e4BCGEIOxymEO4.oCxbuc00mHp/bL/qxR8CdDqS",
            role: "admin",
            isVerified: true,
            userInfo: {
                urn: 1111115,
                branch: "Computer Science & Engineering",
            },
            tr101: { technology: [], lock: false },
            tr102: { technology: [], lock: false },
            tr103: { technology: [], lock: false },
            tr104: { technology: [], lock: false },
            placementData: { lock: false },
        });
        await user5.save();

        console.log("Initialized users collection with a document");
    } catch (error) {
        console.error("Error initializing users collection:", error);
        throw error;
    }
}

module.exports = { db };
